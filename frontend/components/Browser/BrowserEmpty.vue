<template lang="pug">
NCard.browser-empty-card(border='2px! dashed!')
  NResult(:title='t("browser.noObject")', :description='t("browser.noObjectTip")', my-6)
    template(#icon)
      .text-24 😭
    .text-center
      .flex.justify-center.gap-2
        NButton(type='primary', @click='$emit("upload")') {{ t('browser.uploadFiles') }}
        NButton(type='primary', secondary, @click='$emit("create-folder")') {{ t('browser.createFolder') }}
        NButton(secondary, @click='$emit("reload")')
          template(#icon): IconRefresh
</template>

<script setup lang="ts">
import { IconRefresh } from '@tabler/icons-vue'
</script>

<style scoped lang="scss"></style>
