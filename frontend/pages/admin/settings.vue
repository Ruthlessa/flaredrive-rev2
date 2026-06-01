<template lang="pug">
.flex.flex-col.gap-4
  NCard(:title='t("admin.settings.title")', :segmented='{ content: "soft" }', hoverable)
    template(#header-extra)
      NButton(type='primary', :loading='saving', @click='handleSave') {{ t('admin.settings.save') }}
    NP {{ t('admin.settings.desc') }}
    NSpin(:show='pending')
      .flex.flex-col.gap-4.mt-4
        NFormItem(
          :label='t("admin.settings.siteName")',
          :show-feedback='!errors.siteName || !!form.siteName',
          :feedback='errors.siteName || t("admin.settings.siteNameFeedback")',
          :validation-status='errors.siteName ? "error" : undefined'
        )
          NInput(v-model:value='form.siteName', :placeholder='t("admin.settings.siteNamePlaceholder")')

        NFormItem(
          :label='t("admin.settings.allowRegister")',
          :show-feedback='!!form.allowRegister',
          :feedback='t("admin.settings.allowRegisterFeedback")'
        )
          NSwitch(v-model:value='form.allowRegister')

        NFormItem(
          :label='t("admin.settings.randomUploadDir")',
          :show-feedback='!errors.randomUploadDir || !!form.randomUploadDir',
          :feedback='errors.randomUploadDir || t("admin.settings.randomUploadDirFeedback")',
          :validation-status='errors.randomUploadDir ? "error" : undefined'
        )
          NInput(v-model:value='form.randomUploadDir', :placeholder='t("admin.settings.randomUploadDirPlaceholder")')

        NFormItem(
          :label='t("admin.settings.batchUploadConcurrency")',
          :show-feedback='!errors.batchUploadConcurrency',
          :feedback='errors.batchUploadConcurrency || t("admin.settings.batchUploadConcurrencyFeedback")',
          :validation-status='errors.batchUploadConcurrency ? "error" : undefined'
        )
          NInputNumber(v-model:value='form.batchUploadConcurrency', min=1, max=64, w-full)

        NFormItem(
          :label='t("admin.settings.uploadHistoryLimit")',
          :show-feedback='!errors.uploadHistoryLimit',
          :feedback='errors.uploadHistoryLimit || " "',
          :validation-status='errors.uploadHistoryLimit ? "error" : undefined'
        )
          NInputNumber(v-model:value='form.uploadHistoryLimit', min=0, max=100000, w-full)

        NFormItem(
          :label='t("admin.settings.previewSizeLimitText")',
          :show-feedback='!errors.previewSizeLimitText',
          :feedback='errors.previewSizeLimitText || t("admin.settings.previewSizeLimitTextFeedback")',
          :validation-status='errors.previewSizeLimitText ? "error" : undefined'
        )
          NInputNumber(v-model:value='form.previewSizeLimitText', min=0, max=1073741824, w-full)

      .flex.gap-2.mt-4
        NButton(@click='handleReset', type='warning', secondary) {{ t('admin.settings.reset') }}
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'

definePageMeta({
  title: 'admin.settings.title',
  layout: 'admin',
  requiresAuth: true,
})

const auth = useAuthStore()
if ((auth.user?.authorizationLevel || 0) < 3) {
  throw createError({
    statusCode: 403,
    statusMessage: t('admin.settings.notAdmin'),
  })
}

const message = useMessage()

interface SettingsPayload {
  siteName: string
  allowRegister: boolean
  randomUploadDir: string
  batchUploadConcurrency: number
  uploadHistoryLimit: number
  previewSizeLimitText: number
}

const form = reactive<SettingsPayload>({
  siteName: '',
  allowRegister: true,
  randomUploadDir: '',
  batchUploadConcurrency: 1,
  uploadHistoryLimit: 0,
  previewSizeLimitText: 5242880,
})
const errors = reactive<{ [k in keyof SettingsPayload]: string }>({
  siteName: '',
  allowRegister: '',
  randomUploadDir: '',
  batchUploadConcurrency: '',
  uploadHistoryLimit: '',
  previewSizeLimitText: '',
})

const { data: loaded, pending, refresh, error } = await useAsyncData('admin-settings', () =>
  $fetch<SettingsPayload>('/api/admin/settings', { method: 'GET' })
)

if (error.value) {
  message.error(t('admin.settings.loadFailed'))
}

if (loaded.value) {
  Object.assign(form, loaded.value)
}

const validate = () => {
  let ok = true
  errors.siteName = ''
  errors.randomUploadDir = ''
  errors.batchUploadConcurrency = ''
  errors.uploadHistoryLimit = ''
  errors.previewSizeLimitText = ''

  if (!form.siteName) {
    errors.siteName = t('admin.settings.pleaseEnterSiteName')
    ok = false
  } else if (form.siteName.length > 64) {
    errors.siteName = t('admin.settings.siteNameMax')
    ok = false
  }
  if (form.randomUploadDir && form.randomUploadDir.length > 256) {
    errors.randomUploadDir = t('admin.settings.randomDirMax')
    ok = false
  }
  if (
    !Number.isInteger(form.batchUploadConcurrency) ||
    form.batchUploadConcurrency < 1 ||
    form.batchUploadConcurrency > 64
  ) {
    errors.batchUploadConcurrency = t('admin.settings.concurrencyRange')
    ok = false
  }
  if (
    !Number.isInteger(form.uploadHistoryLimit) ||
    form.uploadHistoryLimit < 0 ||
    form.uploadHistoryLimit > 100000
  ) {
    errors.uploadHistoryLimit = t('admin.settings.historyLimitRange')
    ok = false
  }
  if (
    !Number.isInteger(form.previewSizeLimitText) ||
    form.previewSizeLimitText < 0 ||
    form.previewSizeLimitText > 1073741824
  ) {
    errors.previewSizeLimitText = t('admin.settings.previewLimitRange')
    ok = false
  }
  return ok
}

const saving = ref(false)
const handleSave = async () => {
  if (!validate()) return
  saving.value = true
  try {
    await $fetch('/api/admin/settings', { method: 'PUT', body: form })
    message.success(t('admin.settings.saved'))
  } catch (e: any) {
    message.error(t('admin.settings.saveFailed'))
  } finally {
    saving.value = false
  }
}
const handleReset = async () => {
  try {
    const reset = await $fetch<SettingsPayload>('/api/admin/settings/reset', { method: 'POST' })
    Object.assign(form, reset)
    message.success(t('admin.settings.resetSuccess'))
  } catch (e: any) {
    message.error(t('admin.settings.resetFailed'))
  }
}
</script>

<style scoped lang="sass"></style>
