<script lang="ts" setup>
import { Ref, ref, watch } from 'vue'
import { useRoute, RouteLocationMatched } from 'vue-router'
const route = useRoute()

const breadcrumb: Ref<RouteLocationMatched[]> = ref([])

const getBreadCrumb = () => {
  // 过滤路由信息
  let matched = route.matched.filter((item) => item.meta && item.meta.title && item.children.length !== 1)
  // 给所有的面包屑的最前面加上首页
  const first = matched[0]
  // console.log(first)
  if (first.path !== '/welcome') {
    matched = [{ path: '/welcome', meta: { title: '首页' } } as any].concat(matched)
  }
  breadcrumb.value = matched
}
getBreadCrumb()
// 监控路由，如果路由发生变化，则面包屑数据改变
watch(
  () => route.path,
  () => {
    getBreadCrumb()
  }
)
</script>

<template>
  <div class="">
    <el-breadcrumb>
      <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index" :to="item.path">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped></style>
