<template lang="pug">
.flex.flex-col.gap-4
  NCard(:title='t("admin.users.title")', :segmented='{ content: "soft" }', hoverable)
    template(#header-extra)
      NButton(type='primary', @click='showCreateModal = true')
        template(#icon): NIcon: IconUserPlus
        | {{ t('admin.users.newUser') }}
    NP {{ t('admin.users.desc') }}

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

  NModal(v-model:show='showCreateModal', preset='card', :title='t("admin.users.createTitle")', style='max-width: 600px')
    NFormItem(
      :label='t("admin.users.email")',
      :show-feedback='!createError.email || !!createForm.email',
      :feedback='createError.email || t("auth.emailPlaceholder")',
      :validation-status='createError.email ? "error" : undefined'
    )
      NInput(v-model:value='createForm.email', :placeholder='t("auth.emailPlaceholder")', autofocus)
    NFormItem(
      :label='t("admin.users.password")',
      :show-feedback='!createError.password || !!createForm.password',
      :feedback='createError.password || t("auth.passwordPlaceholder")',
      :validation-status='createError.password ? "error" : undefined'
    )
      NInput(v-model:value='createForm.password', type='password', show-password-on='click', :placeholder='t("auth.passwordPlaceholder")')
    NFormItem(
      :label='t("admin.users.authLevel")',
      :show-feedback='!createError.authorizationLevel',
      :feedback='createError.authorizationLevel || " "',
      :validation-status='createError.authorizationLevel ? "error" : undefined'
    )
      NSelect(
        v-model:value='createForm.authorizationLevel',
        :options='[
          { label: t("admin.users.general"), value: 1 },
          { label: t("admin.users.advanced"), value: 2 },
          { label: t("admin.users.systemOperator"), value: 3 }
        ]'
      )

    template(#footer)
      .flex.justify-end.gap-2
        NButton(@click='showCreateModal = false') {{ t('admin.users.cancel') }}
        NButton(type='primary', :loading='isCreating', @click='handleCreate') {{ t('admin.users.create') }}
</template>

<script setup lang="ts">
import { NButton, NIcon, useMessage } from 'naive-ui'
import type { DataTableColumns, DataTableRowData } from 'naive-ui'
import { IconTrash, IconUserPlus } from '@tabler/icons-vue'

definePageMeta({
  title: 'admin.users.title',
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

interface AdminUserItem {
  id: number
  email: string
  authorizationLevel: number
  createdAt?: string
}

const { data: list, pending, refresh, error } = await useAsyncData('admin-users-list', () =>
  $fetch<AdminUserItem[]>('/api/admin/users', { method: 'GET' }).then((res) => res || [])
)

if (error.value) {
  message.error(t('admin.users.loadFailed'))
}

const showCreateModal = ref(false)
const isCreating = ref(false)
const createForm = ref({
  email: '',
  password: '',
  authorizationLevel: 1 as 1 | 2 | 3,
})
const createError = ref<{ email: string; password: string; authorizationLevel: string }>({
  email: '',
  password: '',
  authorizationLevel: '',
})

const resetCreateForm = () => {
  createForm.value = { email: '', password: '', authorizationLevel: 1 }
  createError.value = { email: '', password: '', authorizationLevel: '' }
}
watch(showCreateModal, (open) => {
  if (open) resetCreateForm()
})

const handleCreate = async () => {
  const err = { email: '', password: '', authorizationLevel: '' }
  if (!createForm.value.email) err.email = t('admin.users.pleaseEnterEmail')
  else if (!/^[\w-.]+@[\w-]+(\.[\w-]+)+$/.test(createForm.value.email)) err.email = t('auth.invalidEmail')

  if (!createForm.value.password || createForm.value.password.length < 8) {
    err.password = t('admin.users.pleaseEnterPassword')
  }

  if (![1, 2, 3].includes(createForm.value.authorizationLevel)) {
    err.authorizationLevel = t('admin.users.pleaseSelectAuthLevel')
  }
  createError.value = err
  if (err.email || err.password || err.authorizationLevel) return

  isCreating.value = true
  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: {
        email: createForm.value.email,
        password: createForm.value.password,
        authorizationLevel: createForm.value.authorizationLevel,
      },
    })
    message.success(t('admin.users.created'))
    showCreateModal.value = false
    await refresh()
  } catch (e: any) {
    message.error(t('admin.users.createFailed'))
  } finally {
    isCreating.value = false
  }
}

const columns = computed<DataTableColumns<DataTableRowData>>(() => [
  {
    title: 'ID',
    key: 'id',
    width: 50,
  },
  {
    title: t('admin.users.email'),
    key: 'email',
  },
  {
    title: t('admin.users.authLevel'),
    key: 'authorizationLevel',
    render(row) {
      if (row.authorizationLevel === 1) return t('admin.users.general')
      if (row.authorizationLevel === 2) return t('admin.users.advanced')
      if (row.authorizationLevel === 3) return t('admin.users.systemOperator')
      return String(row.authorizationLevel)
    },
  },
  {
    title: t('common.actions'),
    key: 'actions',
    width: 100,
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
  const dlg = window.confirm(t('admin.users.deleteUser', { email: row.email }))
  if (!dlg) return
  try {
    await $fetch(`/api/admin/users/${row.id}`, { method: 'DELETE' })
    message.success(t('admin.users.deleted'))
    await refresh()
  } catch (e: any) {
    message.error(t('admin.users.deleteFailed'))
  }
}
</script>

<style scoped lang="sass"></style>
