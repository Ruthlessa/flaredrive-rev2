<template lang="pug">
NGrid(x-gap='16', y-gap='16', cols='1 m:2 l:3', responsive='screen')
  NGi: NCard(:title='t("admin.dashboard")', :segmented='{ content: "soft" }')
    NP {{ t('admin.dashboardDesc') }}

  NGi(v-for='item in cards', :key='item.to')
    NCard(:title='t(item.title)', hoverable, :segmented='{ content: "soft" }', @click='$router.push(item.to)', cursor-pointer)
      template(#header-extra): NIcon(:component='item.icon', size='20', :depth='3')
      NP {{ t(item.desc) }}

  NGi(span='1 m:2 l:3')
    NCard(:title='t("admin.about")', :segmented='{ content: "soft" }')
      .flex.gap-3.items-center
        NP {{ t('admin.poweredByFlaredrive') }} ·
        NA(href='https://github.com/project-epb/flaredrive-rev/blob/main/LICENSE', target='_blank', rel='noopener noreferrer') {{ t('admin.mitLicense') }} ·
        NA(href='https://creativecommons.org/licenses/by-sa/4.0/', target='_blank', rel='noopener noreferrer') {{ t('admin.ccBySa') }}
      .flex.gap-2.items-center.mt-2
        NText(depth='3') {{ t('admin.createdBy') }}:
        NA(href='https://github.com/dragon-fish', target='_blank', rel='noopener noreferrer') Dragon Fish
        NA(href='https://github.com/xjxlx', target='_blank', rel='noopener noreferrer') xjxlx
      NDivider
      NP(depth='3', text-2)
        | {{ t('admin.logoCredit') }} ·
        |
        NA(href='https://github.com/ju5td0m7eastside', target='_blank', rel='noopener noreferrer') ju5td0m7eastside
</template>

<script setup lang="ts">
import { IconBucket, IconSettings, IconUsers } from '@tabler/icons-vue'

definePageMeta({
  title: 'nav.adminDashboard',
  layout: 'admin',
  requiresAuth: true,
})

const auth = useAuthStore()
if ((auth.user?.authorizationLevel || 0) < 3) {
  throw createError({
    statusCode: 403,
    statusMessage: t('common.forbidden'),
  })
}

const cards = [
  {
    title: 'nav.siteSettings',
    desc: 'admin.settings.title',
    icon: IconSettings,
    to: '/admin/settings',
  },
  {
    title: 'nav.userManagement',
    desc: 'admin.users.desc',
    icon: IconUsers,
    to: '/admin/users',
  },
  {
    title: 'nav.bucketManagement',
    desc: 'admin.buckets.desc',
    icon: IconBucket,
    to: '/admin/buckets',
  },
]
</script>

<style scoped lang="sass"></style>
