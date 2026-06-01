<template lang="pug">
NForm(label-placement='top', :model='formData', :rules='rules', ref='formRef')
  NFormItem(
    :label='t("bucket.form.displayName")',
    path='name',
    :show-feedback='true',
    :feedback='t("bucket.form.displayNameFeedback")'
  )
    NInput(v-model:value='formData.name', :placeholder='t("bucket.form.displayNamePlaceholder")', clearable)

  NFormItem(
    :label='t("bucket.form.bucketName")',
    path='bucketName',
    :show-feedback='true',
    :feedback='t("bucket.form.bucketNameFeedback")'
  )
    NInput(v-model:value='formData.bucketName', :placeholder='t("bucket.form.bucketNamePlaceholder")', clearable)

  NFormItem(
    :label='t("bucket.form.endpointUrl")',
    path='endpoint',
    :show-feedback='true',
    :feedback='t("bucket.form.endpointUrlFeedback")'
  )
    NInput(v-model:value='formData.endpoint', :placeholder='t("bucket.form.endpointUrlPlaceholder")', clearable)

  NFormItem(
    :label='t("bucket.form.region")',
    path='region',
    :show-feedback='true',
    :feedback='t("bucket.form.regionPlaceholder")'
  )
    NInput(v-model:value='formData.region', :placeholder='t("bucket.form.regionPlaceholder")', clearable)

  NFormItem(
    :label='t("bucket.form.accessKeyId")',
    path='accessKeyId',
    :show-feedback='true',
    :feedback='""'
  )
    NInput(v-model:value='formData.accessKeyId', :placeholder='t("bucket.form.accessKeyIdPlaceholderNew")', clearable)

  NFormItem(
    :label='t("bucket.form.secretAccessKey")',
    path='secretAccessKey',
    :show-feedback='true',
    :feedback='""'
  )
    NInput(
      v-model:value='formData.secretAccessKey',
      type='password',
      show-password-on='click',
      :placeholder='t("bucket.form.secretAccessKeyPlaceholderNew")',
      clearable
    )

  NFormItem(
    :label='t("bucket.form.cdnBaseUrl")',
    path='cdnBaseUrl',
    :show-feedback='true',
    :feedback='t("bucket.form.cdnBaseUrlFeedback")'
  )
    NInput(v-model:value='formData.cdnBaseUrl', :placeholder='t("bucket.form.cdnBaseUrlPlaceholder")', clearable)

  NFormItem(
    :label='t("bucket.form.edgeThumbnailUrl")',
    path='edgeThumbnailUrl',
    :show-feedback='true',
    :feedback='t("bucket.form.edgeThumbnailUrlFeedback")'
  )
    NInput(v-model:value='formData.edgeThumbnailUrl', :placeholder='t("bucket.form.edgeThumbnailUrlPlaceholder")', clearable)

  NFormItem(
    :label='t("bucket.form.uploadMethod")',
    path='uploadMethod',
    :show-feedback='true',
    :feedback='t("bucket.form.uploadMethodPlaceholder")'
  )
    NSelect(
      v-model:value='formData.uploadMethod',
      :options='[
        { label: t("bucket.form.uploadMethodPresigned"), value: "presigned" },
        { label: t("bucket.form.uploadMethodProxy"), value: "proxy" }
      ]',
      :placeholder='t("bucket.form.uploadMethodPlaceholder")'
    )

  NFormItem(
    :label='t("bucket.form.forcePathStyle")',
    path='forcePathStyle',
    :show-feedback='true',
    :feedback='""'
  )
    NSwitch(v-model:value='formData.forcePathStyle')

  .flex.gap-2.mt-4
    NButton(type='primary', :loading='saving', @click='handleSubmit') {{ t('common.save') }}
    NButton(@click='$emit("close")') {{ t('common.cancel') }}
</template>

<script setup lang="ts">
import { useMessage, type FormInst } from 'naive-ui'

const emit = defineEmits<{
  close: []
  save: []
}>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)

const formData = reactive({
  name: '',
  bucketName: '',
  endpoint: '',
  region: 'auto',
  accessKeyId: '',
  secretAccessKey: '',
  cdnBaseUrl: '',
  edgeThumbnailUrl: '',
  uploadMethod: 'presigned' as 'presigned' | 'proxy',
  forcePathStyle: true,
})

const rules = {
  name: [
    { required: true, message: () => t('bucket.form.pleaseEnterName'), trigger: 'blur' },
  ],
  bucketName: [
    { required: true, message: () => t('bucket.form.pleaseEnterBucketName'), trigger: 'blur' },
  ],
  endpoint: [
    { required: true, message: () => t('bucket.form.pleaseEnterEndpoint'), trigger: 'blur' },
    {
      validator: (_: any, value: string) => {
        if (!value) return true
        try {
          new URL(value)
          return true
        } catch {
          return false
        }
      },
      message: () => t('bucket.form.pleaseEnterValidUrl'),
      trigger: 'blur',
    },
  ],
  region: [{ required: true, message: () => t('bucket.form.pleaseEnterRegion'), trigger: 'blur' }],
  accessKeyId: [{ required: true, message: () => t('bucket.form.pleaseEnterAccessKey'), trigger: 'blur' }],
  secretAccessKey: [{ required: true, message: () => t('bucket.form.pleaseEnterSecretKey'), trigger: 'blur' }],
  uploadMethod: [{ required: true, message: () => t('bucket.form.pleaseSelectUploadMethod'), trigger: 'change' }],
}

const saving = ref(false)
const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (e) {
    return
  }
  saving.value = true
  try {
    await $fetch('/api/admin/buckets', { method: 'POST', body: { ...formData } })
    message.success(t('bucket.bucketCreated'))
    emit('save')
  } catch (e: any) {
    message.error(t('common.operationFailed') + ': ' + (e?.data?.message || e?.message || ''))
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="sass"></style>
