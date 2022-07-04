<script lang="ts" setup>
import {} from 'vue'
import BreadCrumb from './BreadCrumb.vue'
import UserBar from './UserBar.vue'
</script>

<template>
  <div>
    <el-row :gutter="24" :offset="0" class="headerbar-container">
      <el-col :span="20">
        <!-- 面包屑 -->
        <BreadCrumb />
      </el-col>
      <el-col :span="4">
        <!-- 用户信息 -->
        <UserBar />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
.headerbar-container {
  display: flex;
  align-items: center;
}
</style>
