<script lang="ts" setup>
import {} from 'vue'
import { useRouter } from 'vue-router'
defineProps(['userMenu'])

// 路由跳转
const router = useRouter()
const toPath = (params: string) => {
  router.push({ path: params })
}
</script>
<template>
  <template v-for="menu in userMenu" :key="menu._id">
    <!-- 父菜单 -->
    <el-sub-menu
      v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1"
      :index="menu.path"
      :key="menu._id"
    >
      <template #title>
        <el-icon>
          <!-- 动态组件显示图标 -->
          <component :is="menu.icon" />
        </el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
      <!-- 继续调用生成子菜单 -->
      <MenuItem :userMenu="menu.children" />
    </el-sub-menu>
    <!-- 子菜单 -->
    <el-menu-item v-else-if="menu.menuType == 1" @click="toPath(menu.path)" :index="menu.path">
      <el-icon>
        <component :is="menu?.icon" />
      </el-icon>
      <span>{{ menu.menuName }}</span>
    </el-menu-item>
  </template>
</template>
<style lang="scss" scoped></style>
