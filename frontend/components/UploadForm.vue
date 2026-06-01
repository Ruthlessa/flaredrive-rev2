<template lang="pug">
NDrawer(v-model:show='show', placement='right', :width='windowWidth < 768 ? "100%" : 480')
  NDrawerContent(closable)
    template(#header) {{ t('common.upload') }}
    NSpin(:show='uploading')
      NUpload(
        v-model:file-list='fileList',
        multiple,
        :show-file-list='true',
        :default-upload='false',
        :max='Math.max(1, concurrency)',
        @change='handleChange',
        @before-upload='handleBeforeUpload',
        @remove='handleRemove'
      )
        NUploadDragger
          div
            NText(style='font-size: 16px') {{ t('upload.clickOrDrag') }}
            NText(depth='3', block, text-2, mt-1) {{ t('common.upload') }}
        NInput.mt-3(
          v-model:value='prefix',
          :placeholder='t("upload.prefix")',
          :value='currentPrefix',
          readonly
        )

      .flex.gap-2.mt-4
        NButton(type='primary', :loading='uploading', :disabled='!canStart', @click='startUpload') {{ t('common.upload') }}
        NButton(@click='$emit("update:show", false)') {{ t('common.cancel') }}
</template>

<script setup lang="ts">
import { useMessage, type UploadFileInfo } from 'naive-ui'

const props = defineProps<{
  prefix?: string
  bucket?: string
  bucketInfo?: any
}>()

const show = defineModel('show', { type: Boolean, default: false })
const emit = defineEmits<{
  uploaded: []
}>()

const message = useMessage()
const { width: windowWidth } = useWindowSize()
const fileList = ref<UploadFileInfo[]>([])
const uploading = ref(false)
const concurrency = ref(1)
const currentPrefix = computed(() => props.prefix || '')

const canStart = computed(() => fileList.value.length > 0 && !uploading.value)

const handleChange = ({ fileList: newList }: { fileList: UploadFileInfo[] }) => {
  fileList.value = newList
}
const handleBeforeUpload = ({ file }: { file: UploadFileInfo }) => {
  return true
}
const handleRemove = ({ file }: { file: UploadFileInfo }) => {
  fileList.value = fileList.value.filter((f) => f.id !== file.id)
}

const startUpload = async () => {
  if (fileList.value.length === 0) return
  uploading.value = true
  let successCount = 0
  for (const file of fileList.value) {
    try {
      const formData = new FormData()
      const blob: any = (file.file as any) || (file as any)
      if (!blob) continue
      formData.append('file', blob, file.name)
      await $fetch('/api/upload', {
        method: 'POST',
        body: formData,
        query: { prefix: currentPrefix.value, bucket: props.bucket },
      })
      successCount++
    } catch (e: any) {
      message.error(t('upload.uploadFailed') + ': ' + file.name)
    }
  }
  uploading.value = false
  message.success(t('browser.uploadFinished', { count: successCount }))
  fileList.value = []
  emit('uploaded')
  show.value = false
}
</script>

<style scoped lang="sass"></style>
