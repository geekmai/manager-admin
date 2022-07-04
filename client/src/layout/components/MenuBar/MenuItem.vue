<script lang="ts" setup>
import {} from 'vue'
import { useRouter } from 'vue-router'
defineProps(['menus'])

// 路由跳转
const router = useRouter()
const toPath = (item: string) => {
  router.push({ name: item })
}
</script>
<template>
  <template v-for="menu in menus" :key="menu.path">
    <el-sub-menu
      v-if="menu.children && menu.children.length > 1"
      :index="menu.path"
    >
      <template #title>
        <el-icon>
          <!-- 动态组件显示图标 -->
          <component :is="menu.meta.icon" />
        </el-icon>
        <span>{{ menu.meta.title }}</span>
      </template>
      <MenuItem :menus="menu.children" />
    </el-sub-menu>
    <el-menu-item v-else @click="toPath(menu.name)" :index="menu.path">
      <el-icon>
        <component :is="menu.meta?.icon" />
      </el-icon>
      <span>{{ menu.meta.title }}</span>
    </el-menu-item>
  </template>
</template>
<style lang="scss" scoped></style>
