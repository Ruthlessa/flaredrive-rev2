<template lang="pug">
.fallback-page.flex.flex-col.items-center.justify-center.text-center(min-h='80vh', p-6)
  .text-9xl 🐟
  h1.text-3xl.font-bold.mt-4 {{ t('fallback.title') }}
  NP(depth='3', mt-2) {{ t('fallback.desc') }}
  NP(depth='3', text-2) {{ t('fallback.funText') }}
  .flex.gap-2.mt-4
    NButton(type='primary', @click='$router.push("/")') {{ t('fallback.backHome') }}
    NButton(@click='$router.back()', quaternary) {{ t('common.back') }}
</template>

<script setup lang="ts">
definePageMeta({
  title: 'fallback.title',
  layout: 'default',
})
</script>

<style scoped lang="sass"></style>
