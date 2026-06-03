# 上传进度增强功能计划

## 现状分析

当前上传进度实现位于：
- `frontend/components/UploadProgress.vue` - 只显示整体批次百分比 (`currentBatchFinished / currentBatchTotal (percentage%)`)
- `frontend/stores/bucket.ts` - 已有的进度状态：
  - `uploadProgressMap` - 存储每个文件的详细进度 (`{loaded, total, percentage}`)
  - `currentBatchTotal`, `currentBatchFinished`, `currentBatchPercentage` - 批次进度
  - `pendinUploadList` - 待上传文件列表
  - `uploadFailedList` - 上传失败列表

问题：当前只显示简单的批次进度，没有显示单个文件的详细上传信息。

## 改进方案

### 1. 增强 UploadProgress.vue 组件

**文件**: `frontend/components/UploadProgress.vue`

改进内容：
- 显示当前上传中的文件名（如果正在上传）
- 显示每个文件的上传进度条
- 显示已上传/总文件数
- 支持显示上传错误信息

### 2. 暴露必要的状态到组件

**文件**: `frontend/stores/bucket.ts`

需要暴露的状态：
- `uploadProgressMap` - 已有，但需要确保可访问
- `pendinUploadList` - 待上传文件列表
- `uploadFailedList` - 上传失败列表
- `isUploading` - 是否有正在进行的任务

### 3. 添加辅助函数

**文件**: `frontend/stores/bucket.ts`

添加函数：
- `getUploadProgress(key)` - 获取指定文件的进度
- `clearUploadFailedList()` - 清除上传失败列表

## 实施步骤

1. 修改 `frontend/components/UploadProgress.vue`，增强进度显示：
   - 遍历 `uploadProgressMap` 显示每个文件的进度
   - 显示当前正在上传的文件名
   - 添加错误状态显示

2. 在 `frontend/stores/bucket.ts` 中添加辅助函数：
   - `getUploadProgress(key)`
   - `clearUploadFailedList()`

3. 确保 store 正确暴露所需状态

## 验证步骤

1. 进入上传页面
2. 上传多个文件
3. 确认每个文件都有独立的进度条
4. 确认整体进度正确
