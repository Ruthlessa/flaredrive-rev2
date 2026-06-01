<template lang="pug">
.bucket-list-page
  //- Page header
  .flex.items-center.justify-between.gap-4.flex-wrap.mb-4
    .flex.items-center.gap-4
      h1.text-2xl.font-bold {{ currentBucket?.name || t('common.loading') }}
      NTag(v-if='currentBucket', type='info', size='small') {{ currentBucket.bucketName }}
    .flex.items-center.gap-2
      NButton(@click='$router.push("/")', quaternary, size='small')
        template(#icon): NIcon: IconChevronLeft
        | {{ t('common.back') }}
</template>

<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'

definePageMeta({
  title: 'bucket.title',
  layout: 'default',
  requiresAuth: true,
})

const bucketStore = useBucketStore()
const route = useRoute()
const bucketParam = computed(() => String(route.params.bucket || ''))
await bucketStore.fetchBucketList().catch(() => void 0)
bucketStore.setCurrentBucket(bucketParam.value)
const currentBucket = computed(() => bucketStore.currentBucketInfo)
</script>

<style scoped lang="sass"></style>
