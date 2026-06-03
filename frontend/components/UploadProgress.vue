<template lang="pug">
div.upload-progress(v-if='bucket.currentBatchTotal > 0')
  NProgress(:percentage='bucket.currentBatchPercentage', type='line', :status)
    | {{ bucket.currentBatchFinished }} / {{ bucket.currentBatchTotal }} ({{ bucket.currentBatchPercentage }}%)
  
  .upload-detail-list(v-if='Object.keys(bucket.uploadProgressMap).length > 0')
    .upload-detail-item(v-for='(progress, key) in bucket.uploadProgressMap', :key='key')
      .file-name {{ getFileName(key) }}
      .file-progress
        NProgress(:percentage='progress.percentage', type='line', :status='getFileStatus(progress.percentage)', :show-indicator='false', :height='8')
      .file-size {{ formatSize(progress.loaded) }} / {{ formatSize(progress.total) }}

  .upload-failed-list(v-if='bucket.uploadFailedList.length > 0')
    .failed-title 上传失败:
    .failed-item(v-for='item in bucket.uploadFailedList', :key='item.key')
      | {{ getFileName(item.key) }} - {{ item.error.message || 'Unknown error' }}
</template>

<script setup lang="ts">
const bucket = useBucketStore()

const status = computed<'info' | 'success' | 'error'>(() => {
  if (bucket.isUploading) {
    return 'info'
  } else if (bucket.currentBatchFinished === bucket.currentBatchTotal && bucket.currentBatchTotal > 0) {
    return 'success'
  } else {
    return 'default'
  }
})

const getFileStatus = (percentage: number) => {
  if (percentage >= 100) return 'success'
  return 'info'
}

const getFileName = (key: string) => {
  const parts = key.split('/')
  return parts[parts.length - 1] || key
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped lang="sass">
.upload-progress
  padding: 12px 0

.upload-detail-list
  margin-top: 12px

.upload-detail-item
  display: flex
  align-items: center
  gap: 12px
  padding: 6px 0

.file-name
  flex: 0 0 200px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  font-size: 13px

.file-progress
  flex: 1

.file-size
  flex: 0 0 120px
  text-align: right
  font-size: 12px
  color: #999

.upload-failed-list
  margin-top: 12px
  padding: 8px
  background: #fef0f0
  border-radius: 4px

.failed-title
  color: #ff4d4f
  font-weight: 500
  margin-bottom: 8px

.failed-item
  font-size: 12px
  color: #666
  padding: 4px 0
</style>
