<template lang="pug">
.file-preview
  NSkeleton(v-if='!item', height='200px')
  .file-preview-main(v-else)
    .file-preview-file-container
      .preview-file-image(v-if='previewType === "image"', text-center)
        NImage(
          :src='cdnUrl',
          :alt='fileNameParts.name',
          width='300',
          height='300',
          object-fit='contain',
          lazy
        )
      .preview-file-video(v-else-if='previewType === "video"', text-center)
        video(:src='cdnUrl', controls, w-full, h-auto)
      .preview-file-audio(v-else-if='previewType === "audio"', text-center)
        audio(:src='cdnUrl', controls, w-full, h-auto)
      .preview-file-markdown(v-else-if='previewType === "markdown"')
        div(v-if='rawTextContent !== null', min-h='200px', max-h='50vh', overflow-auto)
          MarkdownRender(:value='rawTextContent', tag='div')
        NSpin(v-else, show, size='small')
          NP {{ t('browser.preview.loading') }}
      .preview-file-text(v-else-if='previewType === "text"')
        div(v-if='rawTextContent !== null', min-h='200px', max-h='50vh', overflow-auto)
          Hljs(:code='rawTextContent', :lang='fileNameParts.ext')
        NSpin(v-else, show, size='small')
          NP {{ t('browser.preview.loading') }}
      .preview-file-iframe(v-else-if='previewType === "iframe"', text-center)
        iframe(:src='cdnUrl', w-full, h-50vh, :onerror="`this.replaceWith('${t('browser.preview.errorLoading')}')`")
      .preview-file-unknown(v-else, text-center)
        NIcon(size='40'): IconFileUnknown
        NP {{ t('browser.preview.previewNotSupported') }}

    .preview-actions(mt-4, text-center)
      NButtonGroup
        NButton(size='small', type='primary', @click='emit("download", item)')
          template(#icon): NIcon: IconDownload
          | {{ t('common.download') }}
        NButton(size='small', type='info', secondary, @click='handleCopyURL')
          template(#icon): NIcon: IconCopy
          | {{ t('browser.copyUrl') }}
        <!-- 暂未实现 -->
        <!-- NButton(size='small', @click='emit("toggle-public", item)')
          template(#icon): NIcon: component(:is='isPublic ? IconWorldOff : IconWorld')
          | {{ isPublic ? 'Private' : 'Public' }} -->
        NButton(size='small', type='error', secondary, @click='emit("delete", item)')
          template(#icon): NIcon: IconTrash

    .preview-details(v-if='item', mt-4, flex, flex-col, gap-4)
      NTable
        tr
          th {{ t('browser.preview.name') }}
          td {{ fileNameParts.name }}
        tr
          th {{ t('browser.preview.size') }}
          td {{ FileHelper.formatFileSize(item.size) }}
        tr
          th {{ t('browser.preview.type') }}
          td {{ item.httpMetadata?.contentType || t('common.unknown') }}
        tr
          th {{ t('browser.preview.lastModified') }}
          td {{ DateHelper.formatLocaleString(item.uploaded) || t('common.unknown') }}
        tr
          th {{ t('browser.preview.customMetadata') }}
          td(v-if='!Object.keys(item?.customMetadata || {}).length') {{ t('browser.preview.noMetadata') }}
          NTable(v-else, :bordered='false', size='small')
            tr(v-for='(value, key) in (item.customMetadata || {})')
              th(width='100') {{ decodeURIComponent(key) }}
              td: code {{ decodeURIComponent(value) }}
        tr
          th {{ t('browser.preview.cdnUrl') }}
          td: NA(:href='cdnUrl', target='_blank') {{ cdnUrl }}

      details
        pre {{ item }}
</template>

<script setup lang="ts">
import { FileHelper } from '@/utils/FileHelper'
import { ClipboardHelper } from '@/utils/ClipboardHelper'
import { DateHelper } from '@/utils/DateHelper'
import type { StorageListObject } from '@/models/BucketClient'
import { IconFileUnknown, IconTrash, IconDownload, IconCopy, IconWorld, IconWorldOff } from '@tabler/icons-vue'
import { useMessage } from 'naive-ui'

const Hljs = defineAsyncComponent(() => import('@/components/Hljs.vue'))
const MarkdownRender = defineAsyncComponent(() => import('@/components/Markdown/MarkdownViewer.vue'))

const props = defineProps<{
  item?: StorageListObject | null
}>()
const emit = defineEmits<{
  download: [item: StorageListObject]
  delete: [item: StorageListObject]
  'toggle-public': [item: StorageListObject]
}>()

const bucket = useBucketStore()
const nmessage = useMessage()

const isPublic = computed(() => {
  return !!(props.item?.customMetadata as any)?.isPublic
})

const fileNameParts = computed(() => {
  return FileHelper.getSimpleFileInfoByObject(props.item)
})
const cdnUrl = computed(() => {
  if (!props.item) return ''
  return bucket.getCDNUrl(props.item)
})
const previewType = computed(() => FileHelper.getPreviewType(props.item))

const rawTextContent = ref<string | null>(null)
watch(
  computed(() => props.item),
  (item, prevItem) => {
    if (!item || item?.key === prevItem?.key) {
      return
    }
    rawTextContent.value = null
    const previewType = FileHelper.getPreviewType(item)
    if (['text', 'markdown'].includes(previewType)) {
      fetch(bucket.getCDNUrl(item))
        .then((response) => {
          if (response.ok) {
            return response.text()
          } else {
            throw new Error('Network response was not ok')
          }
        })
        .then((text) => {
          rawTextContent.value = text
        })
        .catch((error) => {
          console.error('Error fetching text:', error)
        })
    }
  },
  { immediate: true }
)

const handleCopyURL = async () => {
  if (!props.item) return
  if (await ClipboardHelper.copyText(bucket.getCDNUrl(props.item))) {
    nmessage.success(t('messages.urlCopied'))
  } else {
    nmessage.error(t('messages.copyFailed'))
  }
}
</script>

<style scoped lang="sass"></style>
