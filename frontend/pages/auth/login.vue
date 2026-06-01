<template lang="pug">
.flex.flex-col.items-center.justify-center(min-h='80vh', px-4, py-8)
  NCard(
    :title='t("auth.login")',
    style='width: 100%; max-width: 400px',
    hoverable,
    @keyup.enter='onSubmit'
  )
    NFormItem(
      :label='t("auth.email")',
      :show-feedback='!emailError || !!formData.email',
      :feedback='emailError || t("auth.emailPlaceholder")',
      :validation-status='emailError ? "error" : undefined'
    )
      NInput(v-model:value='formData.email', :placeholder='t("auth.emailPlaceholder")', autofocus)
    NFormItem(
      :label='t("auth.password")',
      :show-feedback='!passwordError || !!formData.password',
      :feedback='passwordError || t("auth.passwordPlaceholder")',
      :validation-status='passwordError ? "error" : undefined'
    )
      NInput(v-model:value='formData.password', type='password', show-password-on='click', :placeholder='t("auth.passwordPlaceholder")')

    NButton(type='primary', block, @click='onSubmit', :loading='isSubmitting') {{ t('auth.login') }}
    .text-center.mt-4
      NText(depth='3') {{ t('auth.iHaveAccount') }} ·
      NA(href='/auth/register', text): strong {{ t('auth.register') }}
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { LoginData } from '@/models/Auth'

definePageMeta({
  title: 'auth.login',
  layout: 'default',
})

const auth = useAuthStore()
const message = useMessage()
const router = useRouter()
const route = useRoute()

const formData = ref<LoginData>({
  email: '',
  password: '',
})

const isSubmitting = ref(false)

const emailError = computed(() => {
  if (!formData.value.email) return ''
  if (!/^[\w-.]+@[\w-]+(\.[\w-]+)+$/.test(formData.value.email)) {
    return t('auth.invalidEmail')
  }
  return ''
})
const passwordError = computed(() => {
  if (!formData.value.password) return ''
  if (formData.value.password.length < 8) {
    return t('auth.passwordMinLength')
  }
  return ''
})

const onSubmit = async () => {
  if (!formData.value.email) {
    message.error(t('auth.pleaseEnterEmail'))
    return
  }
  if (!formData.value.password) {
    message.error(t('auth.pleaseEnterPassword'))
    return
  }
  if (emailError.value) {
    message.error(emailError.value)
    return
  }
  if (passwordError.value) {
    message.error(passwordError.value)
    return
  }
  isSubmitting.value = true
  try {
    const ok = await auth.login(formData.value)
    if (ok) {
      message.success(t('auth.loginSuccess'))
      const redirect = (route.query.redirect as string) || '/'
      router.replace(redirect)
    } else {
      message.error(t('auth.loginFailed'))
    }
  } catch (error) {
    message.error(t('auth.loginFailed'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="sass"></style>
