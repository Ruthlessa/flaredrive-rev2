<template lang="pug">
.flex.flex-col.gap-4
  h1.text-2xl.font-bold {{ t('prefs.title') }}
  NP(depth='3') {{ t('prefs.desc') }}

  //- Language
  NCard(:title='t("prefs.language")', :segmented='{ content: "soft" }')
    .flex.items-center.gap-4
      NSelect(
        v-model:value='localePref',
        :options='localeOptions',
        style='width: 240px'
      )
    NP(depth='3', mt-2) {{ t('prefs.languageFeedback') }}

  //- Theme
  NCard(:title='t("prefs.theme")', :segmented='{ content: "soft" }')
    .flex.items-center.gap-4
      NRadioGroup(v-model:value='themePref')
        NRadio(value='auto') {{ t('themes.auto') }}
        NRadio(value='light') {{ t('themes.light') }}
        NRadio(value='dark') {{ t('themes.dark') }}
    NP(depth='3', mt-2) {{ t('prefs.colorModeFeedback') }}

  //- Browser
  NCard(:title='t("prefs.browser")', :segmented='{ content: "soft" }')
    .flex.flex-col.gap-4
      NFormItem(:show-feedback='true', :feedback='t("prefs.defaultLayoutFeedback")')
        template(#label) {{ t('prefs.defaultLayout') }}
        NRadioGroup(v-model:value='browserLayout')
          NRadio(value='list') {{ t('browser.layout.list') }}
          NRadio(value='gallery') {{ t('browser.layout.gallery') }}
          NRadio(value='book') {{ t('browser.layout.book') }}
      NFormItem(:show-feedback='true', :feedback='t("prefs.topStickyRailFeedback")')
        template(#label) {{ t('prefs.topStickyRail') }}
        NSwitch(v-model:value='showTopStickyRail')

  //- Reset
  NCard(:title='t("prefs.reset")', :segmented='{ content: "soft" }')
    NP(depth='3', mb-2) {{ t('prefs.resetPrefsFeedback') }}
    NPopconfirm(
      @positive-click='handleReset',
      :negative-text='t("common.cancel")',
      :positive-text='t("prefs.reset")'
    )
      template(#trigger)
        NButton(type='warning', secondary) {{ t('prefs.resetPrefs') }}
      .max-w-300px {{ t('prefs.resetContent') }}
</template>

<script setup lang="ts">
import { localeOptions } from '@/locales'

definePageMeta({
  title: 'prefs.title',
  layout: 'default',
  requiresAuth: true,
})

const prefs = usePrefsStore()
const { locale, browserLayout, showTopStickyRail, reset } = storeToRefs(prefs)
const theme = useThemeStore()

const localePref = computed<typeof locale.value>({
  get: () => locale.value,
  set: (v) => {
    locale.value = v
  },
})

const themePref = computed({
  get: () => theme.rawTheme,
  set: (v: 'auto' | 'light' | 'dark') => theme.setTheme(v),
})

const handleReset = () => {
  reset.value()
  message.success(t('prefs.resetSuccess'))
}
const message = useMessage()
</script>

<style scoped lang="sass"></style>
