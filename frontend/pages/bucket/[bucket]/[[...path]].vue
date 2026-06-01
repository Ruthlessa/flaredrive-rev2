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

  //- Toolbar
  NCard.toolbar-card.mb-4(v-if='!isMobile || showTopStickyRail')
    .flex.items-center.gap-2.flex-wrap
      //- Layout switcher
      NButtonGroup(size='small')
        NButton(
          v-for='layout in layouts',
          :key='layout.key',
          :type='prefs.browserLayout === layout.key ? "primary" : "default"',
          :title='layout.tooltip',
          :render-icon='() => h(NIcon, null, { default: () => h(layout.icon) })',
          @click='prefs.browserLayout = layout.key'
        )

      //- Search
      NInput.search-input(
        v-model:value='searchQuery',
        :placeholder='t("browser.search", { path: route.path })',
        clearable,
        size='small'
      )
        template(#prefix): NIcon: IconSearch

      //- Path display (or breadcrumb)
      BreadcrumbNav

      //- Spacer
      .flex-1

      //- Action buttons
      NButton(type='primary', @click='showUploadDrawer = true', size='small')
        template(#icon): NIcon: IconUpload
        | {{ t('common.upload') }}
      NButton(@click='showCreateFolderDialog = true', size='small')
        template(#icon): NIcon: IconFolderPlus
        | {{ t('browser.createFolder') }}
      NButton(@click='showUploadHistory = true', size='small', secondary)
        template(#icon): NIcon: IconHistory
        | {{ t('browser.uploadHistory') }}
      NButton(
        :title='t("common.refreshList")',
        :loading='pending',
        @click='refresh()',
        size='small',
        quaternary
      )
        template(#icon): NIcon: IconRefresh

  //- Main content
  NSpin(:show='pending')
    .main-content
      //- List view
      BrowserListView(
        v-if='prefs.browserLayout === "list"',
        :payload='payload',
        :is-loading='pending',
        @navigate='onNavigate',
        @delete='onDelete',
        @download='onDownload',
        @rename='onRename',
        @toggle-public='onTogglePublic'
      )

      //- Gallery view
      BrowserGalleryView(
        v-else-if='prefs.browserLayout === "gallery"',
        :payload='payload',
        :is-loading='pending',
        @navigate='onNavigate',
        @delete='onDelete',
        @download='onDownload',
        @rename='onRename'
      )

      //- Book view
      BrowserBookView(
        v-else,
        :payload='payload',
        :is-loading='pending',
        @navigate='onNavigate'
      )

      //- Empty state
      BrowserEmpty(
        v-if='!pending && payload && !payload.objects.length && !payload.folders.length',
        @upload='showUploadDrawer = true',
        @create-folder='showCreateFolderDialog = true',
        @reload='refresh()'
      )

  //- Upload Drawer
  UploadForm(
    v-model:show='showUploadDrawer',
    :prefix='currentPrefix',
    :bucket='currentBucket?.bucketName || ""',
    :bucket-info='currentBucketInfo',
    @uploaded='handleUploaded'
  )

  //- Upload History Drawer
  BrowserUploadHistory(
    v-model:show='showUploadHistory',
    :list='uploadHistory',
    @navigate='handleHistoryNavigate',
    @delete='onDelete',
    @download='onDownload',
    @rename='onRename'
  )

  //- Create Folder
  NModal(v-model:show='showCreateFolderDialog', preset='card', :title='t("browser.createFolder")', style='max-width: 400px')
    NFormItem
      NInput(v-model:value='newFolderName', :placeholder='t("browser.folderName")', @keyup.enter='handleCreateFolder')
    template(#footer)
      .flex.justify-end.gap-2
        NButton(@click='showCreateFolderDialog = false') {{ t('common.cancel') }}
        NButton(type='primary', :loading='creatingFolder', @click='handleCreateFolder') {{ t('common.create') }}

  //- Rename
  NModal(v-model:show='showRenameDialog', preset='card', :title='t("browser.renameFile")', style='max-width: 400px')
    NFormItem
      NInput(v-model:value='newFileName', :placeholder='t("browser.newName")', @keyup.enter='handleRename')
    template(#footer)
      .flex.justify-end.gap-2
        NButton(@click='showRenameDialog = false') {{ t('common.cancel') }}
        NButton(type='primary', :loading='renaming', @click='handleRename') {{ t('common.save') }}

  //- File Preview Drawer
  NDrawer(v-model:show='showPreviewDrawer', placement='right', :width='windowWidth < 768 ? "100%" : 480')
    NDrawerContent(closable, :title='previewItem?.key || ""')
      BrowserFilePreview(:item='previewItem', @delete='onDeleteFromPreview', @download='onDownload')
</template>

<script setup lang="ts">
import {
  IconBucket,
  IconChevronLeft,
  IconFolderPlus,
  IconHistory,
  IconLayoutList,
  IconLayoutGrid,
  IconBook2,
  IconRefresh,
  IconSearch,
  IconUpload,
} from '@tabler/icons-vue'
import { useMessage } from 'naive-ui'

definePageMeta({
  title: 'bucket.title',
  layout: 'default',
  requiresAuth: true,
})

const route = useRoute()
const router = useRouter()
const message = useMessage()

const bucketStore = useBucketStore()
const prefs = usePrefsStore()

const BrowserEmpty = defineAsyncComponent(() => import('@/components/Browser/BrowserEmpty.vue'))
const BrowserListView = defineAsyncComponent(() => import('@/components/Browser/BrowserListView.vue'))
const BrowserGalleryView = defineAsyncComponent(() => import('@/components/Browser/BrowserGalleryView.vue'))
const BrowserBookView = defineAsyncComponent(() => import('@/components/Browser/BrowserBookView.vue'))
const BrowserFilePreview = defineAsyncComponent(() => import('@/components/Browser/BrowserFilePreview.vue'))
const BrowserUploadHistory = defineAsyncComponent(() => import('@/components/Browser/BrowserUploadHistory.vue'))
const UploadForm = defineAsyncComponent(() => import('@/components/UploadForm.vue'))

const { width: windowWidth } = useWindowSize()
const isMobile = computed(() => windowWidth.value < 768)
const showTopStickyRail = computed(() => prefs.showTopStickyRail)

const layouts = [
  { key: 'list', icon: IconLayoutList, tooltipKey: 'browser.layout.listTooltip' },
  { key: 'gallery', icon: IconLayoutGrid, tooltipKey: 'browser.layout.galleryTooltip' },
  { key: 'book', icon: IconBook2, tooltipKey: 'browser.layout.bookTooltip' },
] as const

const bucketParam = computed(() => String(route.params.bucket || ''))
const currentPrefix = computed(() => {
  const path = route.params.path
  if (Array.isArray(path)) {
    return path.filter(Boolean).join('/') + (path.length ? '/' : '')
  }
  return ''
})

const currentBucket = computed(() => bucketStore.currentBucketInfo)
const currentBucketInfo = computed(() => bucketStore.currentBucketInfo)

// Ensure fresh bucket list
await bucketStore.fetchBucketList().catch(() => void 0)

const uploadHistory = ref<any[]>([])

const searchQuery = ref('')

const {
  data: payload,
  pending,
  refresh,
} = await useAsyncData(
  () => `bucket-list-${bucketParam.value}-${currentPrefix.value}`,
  () =>
    bucketStore.listObjects({
      prefix: currentPrefix.value,
      limit: 1000,
    }),
  { watch: [currentPrefix, bucketParam] }
)

watch(searchQuery, (val) => {
  // Filtering is local for now
})

// Action states
const showUploadDrawer = ref(false)
const showUploadHistory = ref(false)
const showCreateFolderDialog = ref(false)
const newFolderName = ref('')
const creatingFolder = ref(false)
const showRenameDialog = ref(false)
const newFileName = ref('')
const renaming = ref(false)
const renameTarget = ref<any>(null)
const showPreviewDrawer = ref(false)
const previewItem = ref<any>(null)

const layouts_for_tooltip = computed(() => {
  return layouts.map((l) => ({ ...l, tooltip: t(l.tooltipKey) }))
})

const handleCreateFolder = async () => {
  if (!newFolderName.value.trim()) {
    message.error(t('browser.folderNameEmpty'))
    return
  }
  if (/[/\\\0]/.test(newFolderName.value)) {
    message.error(t('browser.folderNameInvalid'))
    return
  }
  creatingFolder.value = true
  try {
    await bucketStore.createFolder(currentPrefix.value + newFolderName.value + '/')
    message.success(t('browser.folderName') + ': ' + newFolderName.value)
    showCreateFolderDialog.value = false
    newFolderName.value = ''
    await refresh()
  } catch (e: any) {
    message.error(t('common.operationFailed') + ': ' + (e?.message || ''))
  } finally {
    creatingFolder.value = false
  }
}

const handleRename = async () => {
  if (!renameTarget.value || !newFileName.value.trim()) return
  renaming.value = true
  try {
    await bucketStore.rename(renameTarget.value.key, currentPrefix.value + newFileName.value)
    message.success(t('browser.fileRenamed'))
    showRenameDialog.value = false
    await refresh()
  } catch (e: any) {
    message.error(t('browser.fileRenameFailed', { error: e?.message || '' }))
  } finally {
    renaming.value = false
  }
}

const handleUploaded = async () => {
  await refresh()
}

const handleHistoryNavigate = (item: any) => {
  showUploadHistory.value = false
  onNavigate(item)
}

const onNavigate = (item: any) => {
  if (item.key === '../') {
    const path = currentPrefix.value.replace(/\/$/, '').split('/')
    path.pop()
    const newPath = path.join('/')
    router.push(`/bucket/${bucketParam.value}/${newPath}${newPath ? '/' : ''}`)
    return
  }
  if (item.key.endsWith('/')) {
    router.push(`/bucket/${bucketParam.value}/${item.key}`)
    return
  }
  previewItem.value = item
  showPreviewDrawer.value = true
}

const onDelete = async (item: any) => {
  if (!confirm(t('browser.deleteConfirm', { name: item.key }))) return
  try {
    await bucketStore.deleteObject(item.key)
    message.success(t('browser.fileDeleted'))
    await refresh()
  } catch (e: any) {
    message.error(t('browser.fileDeleteFailed', { error: e?.message || '' }))
  }
}

const onDeleteFromPreview = async (item: any) => {
  showPreviewDrawer.value = false
  await onDelete(item)
}

const onDownload = (item: any) => {
  message.info(t('browser.downloadStarted'))
  const url = bucketStore.getCDNUrl(item)
  window.open(url, '_blank')
}

const onRename = (item: any) => {
  renameTarget.value = item
  newFileName.value = item.key.replace(currentPrefix.value, '')
  showRenameDialog.value = true
}

const onTogglePublic = async (item: any) => {
  try {
    const isPublic = !!(item.customMetadata as any)?.isPublic
    await bucketStore.togglePublic(item.key, !isPublic)
    message.success(t('browser.publicSuccess', { action: isPublic ? t('browser.makePrivate') : t('browser.makePublic') }))
    await refresh()
  } catch (e: any) {
    message.error(t('browser.publicFailed', { action: t('browser.makePublic'), error: e?.message || '' }))
  }
}
</script>

<style scoped lang="sass">
.bucket-list-page
  display: flex
  flex-direction: column
  gap: 1rem
.toolbar-card
  :deep(.n-card__content)
    padding: 0.5rem 1rem
.search-input
  max-width: 320px
.main-content
  min-height: 200px
</style>
