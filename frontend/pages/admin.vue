<template lang="pug">
NLayout(:position='"static"')
  NLayoutHeader(bordered, style='height: 64px')
    GlobalHeader
  NLayoutContent.admin-content
    NConfigProvider(:theme='null')
      NMessageProvider
        NDialogProvider
          NNotificationProvider
            RouterView
</template>

<script setup lang="ts">
</script>

<style scoped lang="sass">
.admin-content
  padding: 1.5rem
  min-height: calc(100vh - 64px - 96px)
</style>
