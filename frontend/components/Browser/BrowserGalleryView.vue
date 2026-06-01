<template lang="pug">
.browser-gallery-view
  .sort-actions(flex, justify-center, mb-4)
    NButtonGroup
      NButton(
        v-for='item in sortActions',
        :key='item.key',
        :type='item.active ? "primary" : "default"',
        icon-placement='right',
        secondary,
        @click='item.onClick'
      ) 
        template(#icon, v-if='item.icon'): component(:is='item.icon')
        | {{ item.label }}

  .placeholder(v-if='list.length <= 0 && isLoading')
    .grid(gap-3, grid-cols-2, md:grid-cols-3, lg:grid-cols-4)
      NSkeleton(v-for='_ in 20', h-200px, rounded-lg)

  .gallery-grid(v-else, grid, gap-3, grid-cols-2, md:grid-cols-3, lg:grid-cols-4)
    NCard.file-item-card(
      v-for='(item, index) in list',
      :key='item.key',
      @click='onClickItem(item)',
      :content-style='{ padding: 0 }',
      :style='item.key === "/" ? { opacity: "50%", pointerEvents: "none" } : { cursor: "pointer" }',
      overflow-hidden
    )
      template(#cover)
        .image-container(v-if='item.previewType === "image"', h-full)
          img(
            v-if='!item.imageError',
            @click.stop,
            :src='item.thumbnailUrl',
            :alt='item.key',
            loading='lazy',
            @error='handleImageError(item)'
          )
          .error-placeholder(v-else, flex, items-center, justify-center, h-full, w-full, bg='gray-100 dark:gray-800)
            component(:is='IconPhoto', w-16, h-16, opacity-60)
        .folder-icon-wrapper(v-else, flex, items-center, justify-center, py-8, bg='gray-100 dark:gray-800', h-60)
          component(:is='item.icon', w-16, h-16, opacity-60)
      template(#default)
        .p-3
          NEllipsis(text-3, max-w-full, line-clamp-2) {{ item.key === '/' ? '/(root)' : item.key.replace(payload.prefix, '').replace(/\/$/, '') }}
          .flex(items-center, mt-2)
            .file-info.flex-1
              NText(v-if='item.key.endsWith("/")', depth='3', block, text-2) {{ item.key === '/' ? 'root' : item.key === '../' ? 'parent' : 'folder' }}
              NText(v-if='!item.key.endsWith("/")', depth='3', block, text-2) {{ new Date(item.uploaded || 0).toLocaleString() }}
              NText(v-if='!item.key.endsWith("/")', depth='3', block, text-2) {{ FileHelper.formatFileSize(item.size) }}
            .file-actions(v-if='!item.key.endsWith("/")', @click.stop)
              NDropdown(:options='fileActionOptions', @select='(action) => onSelectAction(action, item)')
                NButton(secondary, :render-icon='() => h(IconDots)', circle, size='small')
</template>

<script setup lang="tsx">
import type { StorageListObject, StorageListResult } from '@/models/BucketClient'
import { FileHelper } from '@/utils/FileHelper'
import {
  IconDots,
  IconDownload,
  IconForms,
  IconLink,
  IconPhoto,
  IconSortAscending,
  IconSortDescending,
  IconTrash,
} from '@tabler/icons-vue'
import { useMessage } from 'naive-ui'
import type { Component } from 'vue'
import type { GallerySortBy } from '@/stores/prefs'

const props = defineProps<{
  payload: StorageListResult
  isLoading?: boolean
}>()

const emit = defineEmits<{
  rename: [item: StorageListObject]
  delete: [item: StorageListObject]
  download: [item: StorageListObject]
  navigate: [item: StorageListObject]
}>()

const nmessage = useMessage()

const bucket = useBucketStore()

const prefs = usePrefsStore()
const { gallerySortBy: sortBy, gallerySortOrder: sortOrder } = storeToRefs(prefs)
const changeSort = (key: GallerySortBy) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'ascend' ? 'descend' : 'ascend'
  } else {
    sortBy.value = key
    sortOrder.value = 'ascend'
  }
}
const sortActions = computed(() => {
  return [
    { label: 'Name', key: 'key', onClick: () => changeSort('key') },
    { label: 'Size', key: 'size', onClick: () => changeSort('size') },
    { label: 'Date', key: 'uploaded', onClick: () => changeSort('uploaded') },
  ].map((item) => {
    return {
      ...item,
      active: item.key === sortBy.value,
      icon:
        item.key === sortBy.value ? (sortOrder.value === 'ascend' ? IconSortAscending : IconSortDescending) : undefined,
    }
  })
})

const list = computed<
  (StorageListObject & {
    cdnUrl?: string
    icon?: Component
    previewType?: ReturnType<typeof FileHelper.getPreviewType>
    imageError?: boolean
    hasTriedOriginal?: boolean
  })[]
>(() => {
  if (!props.payload) return [] as any
  return [
    props.payload.prefix === '' ? FileHelper.createNullObject('/') : FileHelper.createNullObject('../'),
    ...props.payload.folders.map(FileHelper.createNullObject),
    ...props.payload.objects.sort((a, b) => {
      if (sortBy.value === 'key') {
        return sortOrder.value === 'ascend' ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key)
      } else if (sortBy.value === 'size') {
        return sortOrder.value === 'ascend' ? a.size - b.size : b.size - a.size
      } else if (sortBy.value === 'uploaded') {
        const aDate = new Date(a.uploaded || 0).getTime()
        const bDate = new Date(b.uploaded || 0).getTime()
        return sortOrder.value === 'ascend' ? aDate - bDate : bDate - aDate
      }
      return 0
    }),
  ].map(
    (
      item: StorageListObject & {
        cdnUrl?: string
        thumbnailUrl?: string
        icon?: Component
        previewType?: ReturnType<typeof FileHelper.getPreviewType>
        imageError?: boolean
        hasTriedOriginal?: boolean
      }
    ) => {
      item.cdnUrl = bucket.getCDNUrl(item)
      item.thumbnailUrl = bucket.getThumbnailUrl(item, 400, 400)
      item.previewType = FileHelper.getPreviewType(item)
      item.icon = FileHelper.getObjectIcon(item)
      item.imageError = false
      item.hasTriedOriginal = false
      return item
    }
  )
})

function handleImageError(item: any) {
  if (!item.hasTriedOriginal) {
    // First failure: try to use original image instead of thumbnail
    item.thumbnailUrl = item.cdnUrl
    item.hasTriedOriginal = true
    console.warn('Thumbnail failed, trying original:', item.thumbnailUrl)
  } else {
    // Second failure: show error placeholder
    item.imageError = true
    console.warn('All image attempts failed:', item.thumbnailUrl)
  }
}

function onClickItem(item: StorageListObject) {
  emit('navigate', item)
}
const fileActionOptions = ref([
  {
    label: 'Copy URL',
    key: 'copy_url',
    icon: () => <IconLink />,
  },
  { label: 'Download', key: 'download', icon: () => <IconDownload /> },
  { label: 'Rename', key: 'rename', icon: () => <IconForms /> },
  { label: () => <NText type="error">Delete</NText>, key: 'delete', icon: () => <IconTrash /> },
])
const onSelectAction = (action: string, item: StorageListObject) => {
  switch (action) {
    case 'copy_url':
      navigator.clipboard
        .writeText(bucket.getCDNUrl(item))
        .then(() => {
          nmessage.success('URL copied to clipboard')
        })
        .catch((err) => {
          nmessage.error('Failed to copy URL')
        })
      break
    case 'download':
      emit('download', item)
      break
    case 'rename':
      emit('rename', item)
      break
    case 'delete':
      emit('delete', item)
      break
  }
}
</script>

<style scoped lang="sass">
:deep(.waterfall-list)
  background-color: transparent

.file-item-card
  :deep(.n-card)
    height: 100%
  
  :deep(.n-card-cover)
    line-height: 0
    overflow: hidden
    height: 240px
    background-color: #f5f5f5

    img
      width: 100%
      height: 100%
      object-fit: cover
      display: block
      transition: transform 0.25s ease-in-out
      
      &:hover
        transform: scale(1.05)

.gallery-grid
  display: grid
</style>
