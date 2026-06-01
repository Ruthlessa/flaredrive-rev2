<template lang="pug">
.flex.flex-col.gap-4
  .flex.items-center.gap-4
    h1.text-2xl.font-bold {{ t('nav.myBuckets') }}
    NTag(v-if='site.siteName', type='success', size='small', round) {{ site.siteName }}
    NTag(v-else, type='success', size='small', round) FlareDrive

  NGrid(x-gap='16', y-gap='16', cols='1 s:2 m:3 l:4', responsive='screen', v-if='availableBuckets.length > 0')
    NGi(v-for='bucket in availableBuckets', :key='bucket.id')
      NCard(
        hoverable,
        cursor-pointer,
        @click='navigateToBucket(bucket.id!)',
        :segmented='{ content: "soft" }'
      )
        template(#header)
          .flex.items-center.gap-2
            NIcon(:component='IconBucket', size='20')
            strong {{ bucket.name }}
        template(#header-extra, v-if='bucket.user?.email')
          NTag(size='small', type='info', round) {{ bucket.user.email }}
        NP(depth='3', text-2) {{ bucket.bucketName }}
        NDivider(my-2)
        .flex.gap-2.flex-wrap
          NTag(size='small', secondary) {{ bucket.region || t('bucket.autoRegion') }}
          NTag(size='small', secondary, v-if='bucket.endpoint') {{ shortEndpoint(bucket.endpoint) }}
          NTag(size='small', secondary, v-if='bucket.uploadMethod === "presigned"') {{ t('bucket.form.uploadMethodPresigned') }}
          NTag(size='small', secondary, v-else) {{ t('bucket.form.uploadMethodProxy') }}

  //- No buckets
  NEmpty(v-else, :description='t("bucket.noBuckets")')
    template(#extra)
      NButton(type='primary', @click='$router.push("/admin/buckets")') {{ t('bucket.createFirstBucket') }}

  //- About / Footer
  NDivider
  NP(depth='3', text-center)
    | {{ t('admin.poweredByFlaredrive') }}
    |
    NA(href='https://github.com/project-epb/flaredrive-rev', target='_blank', rel='noopener noreferrer') FlareDrive
</template>

<script setup lang="ts">
import { IconBucket } from '@tabler/icons-vue'

definePageMeta({
  title: 'nav.myBuckets',
  layout: 'default',
  requiresAuth: true,
})

const site = useSiteStore()
const bucket = useBucketStore()
const router = useRouter()
const auth = useAuthStore()

// Ensure fresh bucket list
await bucket.fetchBucketList().catch(() => void 0)

const availableBuckets = computed(() => {
  if (!auth.user) return bucket.availableBuckets
  if ((auth.user.authorizationLevel || 0) >= 3) {
    return bucket.availableBuckets
  }
  return bucket.availableBuckets.filter((b) => b.userId === auth.user!.id || b.user?.id === auth.user!.id)
})

function shortEndpoint(endpoint?: string) {
  if (!endpoint) return ''
  try {
    const url = new URL(endpoint)
    return url.host
  } catch {
    return endpoint
  }
}

function navigateToBucket(id: string | number) {
  router.push(`/bucket/${id}/`)
}
</script>

<style scoped lang="sass"></style>
