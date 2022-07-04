<script lang="ts" setup>
import {} from 'vue'
defineProps({
  collapsed: {
    type: Boolean
  }
})
</script>

<template>
  <div class="logo-container">
    <img src="@/assets/logo.png" alt="" class="logo-img" />
    <h2 v-show="!collapsed" class="logo-title">Vue3-admin</h2>
  </div>
</template>

<style lang="scss" scoped>
.logo-container {
  display: flex;
  align-items: center;
  padding-left: 14px;
  height: 64px;
  overflow: hidden;
  white-space: nowrap;

  .logo-img {
    height: 32px;
    margin-right: 8px;
  }
  .logo-title {
    font-size: 20px;
    color: white;
    margin-bottom: 0;
  }
}
</style>
