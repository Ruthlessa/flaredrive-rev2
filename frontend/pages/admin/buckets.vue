<template lang="pug">
.flex.flex-col.gap-4
  NCard(:title='t("admin.buckets.title")', :segmented='{ content: "soft" }', hoverable)
    template(#header-extra)
      NButton(type='primary', @click='showCreateModal = true')
        template(#icon): NIcon: IconPlus
        | {{ t('admin.buckets.createNew') }}
    NP {{ t('admin.buckets.desc') }}
    NDataTable(
      :columns='columns',
      :data='list',
      :loading='pending',
      :row-key='(row) => row.id',
      :bordered='false',
      :single-line='false',
      flex-height,
      style='margin-top: 16px'
    )
  NModal(v-model:show='showCreateModal', preset='card', :title='t("admin.buckets.createNew")', style='max-width: 600px', @close='resetCreateForm')
    BucketForm(@close='showCreateModal = false', @save='handleCreate')
</template>

<script setup lang="ts">
import { NButton, NIcon, useMessage } from 'naive-ui'
import type { DataTableColumns, DataTableRowData } from 'naive-ui'
import { IconPlus, IconTrash } from '@tabler/icons-vue'

definePageMeta({
  title: 'admin.buckets.title',
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

const message = useMessage()
const BucketForm = defineAsyncComponent(() => import('@/components/BucketForm.vue'))

const { data: list, pending, refresh, error } = await useAsyncData('admin-buckets-list', () =>
  $fetch<any[]>('/api/admin/buckets', { method: 'GET' }).then((res) => res || [])
)

if (error.value) {
  message.error(t('admin.buckets.loadFailed'))
}

const showCreateModal = ref(false)
const resetCreateForm = () => {
  // BucketForm handles its own reset on close
}
const handleCreate = async () => {
  showCreateModal.value = false
  message.success(t('bucket.bucketCreated'))
  await refresh()
}

const columns = computed<DataTableColumns<DataTableRowData>>(() => [
  {
    title: t('admin.buckets.id'),
    key: 'id',
    width: 50,
  },
  {
    title: t('admin.buckets.name'),
    key: 'name',
  },
  {
    title: t('admin.buckets.owner'),
    key: 'owner',
    render(row) {
      return row.user?.email || '-'
    },
  },
  {
    title: t('admin.buckets.bucket'),
    key: 'bucketName',
  },
  {
    title: t('admin.buckets.region'),
    key: 'region',
  },
  {
    title: t('admin.buckets.endpoint'),
    key: 'endpoint',
    ellipsis: true,
  },
  {
    title: t('admin.buckets.upload'),
    key: 'uploadMethod',
    render(row) {
      if (row.uploadMethod === 'presigned') return t('bucket.form.uploadMethodPresigned')
      if (row.uploadMethod === 'proxy') return t('bucket.form.uploadMethodProxy')
      return '-'
    },
  },
  {
    title: t('admin.buckets.pathStyle'),
    key: 'forcePathStyle',
    render(row) {
      return row.forcePathStyle ? '✓' : '—'
    },
  },
  {
    title: t('common.actions'),
    key: 'actions',
    width: 80,
    fixed: 'right',
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'error',
          secondary: true,
          onClick: () => handleDelete(row),
        },
        {
          default: () => t('common.delete'),
          icon: () => h(NIcon, null, { default: () => h(IconTrash) }),
        }
      )
    },
  },
])

const handleDelete = async (row: any) => {
  try {
    await $fetch(`/api/admin/buckets/${row.id}`, { method: 'DELETE' })
    message.success(t('admin.buckets.deleted'))
    await refresh()
  } catch (e: any) {
    message.error(t('admin.buckets.deleteFailed'))
  }
}
</script>

<style scoped lang="sass"></style>
