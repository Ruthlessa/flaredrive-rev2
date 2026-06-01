<template lang="pug">
NLayout.admin-shell(native-scrollbar, has-sider)
  NLayoutSider.admin-sider(
    bordered,
    show-trigger='bar',
    v-model:collapsed='siderCollapsed',
    :native-scrollbar='false',
    :collapsed-width='windowWidth < 768 ? 0 : 64',
    :collapse-mode='windowWidth < 768 ? "transform" : "width"',
    :position='windowWidth < 768 ? "absolute" : "static"',
    @click.stop
  )
    NMenu.mt-2(
      :value='activeKey',
      @update:value='handleMenu',
      :collapsed='siderCollapsed',
      :collapsed-width='64',
      :collapsed-icon-size='22',
      :options='menuOptions'
    )
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { IconUsers, IconBucket, IconDashboard, IconSettings } from '@tabler/icons-vue'
import type { Component } from 'vue'

const route = useRoute()
const router = useRouter()

const { width: windowWidth } = useWindowSize()
const siderCollapsed = useLocalStorage('flaredrive:admin/sider-collapsed', windowWidth.value < 768)

const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = computed<MenuOption[]>(() => [
  {
    label: t('nav.adminDashboard'),
    key: '/admin',
    icon: renderIcon(IconDashboard),
  },
  {
    key: 'divider-1',
    type: 'divider',
  },
  {
    label: t('nav.siteSettings'),
    key: '/admin/settings',
    icon: renderIcon(IconSettings),
  },
  {
    label: t('nav.userManagement'),
    key: '/admin/users',
    icon: renderIcon(IconUsers),
  },
  {
    label: t('nav.bucketManagement'),
    key: '/admin/buckets',
    icon: renderIcon(IconBucket),
  },
])

const activeKey = computed(() => {
  const path = route.path
  if (path.startsWith('/admin/settings')) return '/admin/settings'
  if (path.startsWith('/admin/users')) return '/admin/users'
  if (path.startsWith('/admin/buckets')) return '/admin/buckets'
  if (path === '/admin' || path.startsWith('/admin/')) return '/admin'
  return ''
})

const handleMenu = (key: string) => {
  if (key) router.push(key)
  if (windowWidth.value < 768) {
    siderCollapsed.value = true
  }
}
</script>

<style scoped lang="sass">
.admin-shell
  flex: 1
</style>
