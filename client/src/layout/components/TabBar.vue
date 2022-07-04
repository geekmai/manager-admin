<script lang="ts" setup>
import { computed, onMounted, ref, watch, Ref, watchEffect } from 'vue'
import { mainStore } from '../../store'
import { useRoute, useRouter } from 'vue-router'
import { Itab } from '@/store/type'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

/**
 * 标签页业务逻辑
 * 给标签页组件提供一组响应式数据，使用 v-for 循环生成标签
 * 该响应式数据是一个数组，每当点击标签的时候就把该标签的地址和名称添加到数组中
 * 创建一个 store 用于存储该数组
 */
const mainStoreI = mainStore()
// 标签页数组
const tabsList = computed(() => {
  return mainStoreI.getAddTab
})

// 当前激活的 tab 的索引
const activeKey = ref('')
// 添加 tab
const route = useRoute()
const addTab = () => {
  const { meta, path } = route
  const tab: Itab = {
    path: path,
    title: meta.title as string
  }
  mainStoreI.addTab(tab)
}
// 监控路径变化，改变当前激活的标签
watch(
  // 当路由地址发生改变
  () => route.path,
  () => {
    // 让当前激活页的值等于新的路由地址
    activeKey.value = route.path
    // 将当前路由地址添加到 tab 数组中
    addTab()
  },
  { immediate: true }
)

// 点击标签页跳转
const router = useRouter()
const clickHandle = (event: any) => {
  // 路由跳转
  router.push({ path: event.props.name })
}
// 关闭标签
const removeTab = (targetName: string) => {
  if (tabsList.value.length === 1) {
    // return alert('警告：已经是最后一页！')
    // ElMessage.warning('警告：已经是最后一页！')
    ElMessage({
      message: '警告：已经是最后一页！',
      type: 'warning',
      center: true
    })
    return
    // ElMessage.error('Oops, this is a error message.')
  }
  // 如果删除的是当前页
  if (activeKey.value === targetName) {
    tabsList.value.forEach((tab: Itab, index: number) => {
      if (tab.path === targetName) {
        const nextTab = tabsList.value[index + 1] || tabsList.value[index - 1]
        if (nextTab) {
          activeKey.value = nextTab.path
        }
      }
    })
  }
  // 从 tab 数组中删除当前页面
  mainStoreI.closeCurrentTab(targetName)
}
/**
 * 刷新时缓存数据
 * 原理是在刷新时将标签的数据存储到本地 seeion 当中
 * 组件重新加载时从本地获取数据，然后赋值给标签数据组
 */
// 刷新时缓存数据
const refresh = () => {
  // 刷新时会执行beforeunload 事件，我们监听这个事件，将 tab 数据存储到本地
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('TABS_ROUTES', JSON.stringify(tabsList.value))
  })
  // 从本地读取 tab 数据
  let session = sessionStorage.getItem('TABS_ROUTES')
  // 解构然后添加到 tab 数据中
  if (session) {
    let tabItem = JSON.parse(session)
    if (tabItem.length > 0) {
      mainStoreI.tabList = tabItem
    }
    // tabItem.forEach((tab: Itab) => {
    //   mainStoreI.addTab(tab)
    // })
  }
}
onMounted(() => {
  // 初始化页面生成 tab
  addTab()
  // 刷新时缓存数据
  refresh()
})

// 标签右键显示菜单
// 控制右键菜单是否可见
const contextMenuVisible: Ref<boolean> = ref(false)
// 右键菜单的位置
const left: Ref<string> = ref('')
const top: Ref<string> = ref('')
const openContextMenu = (event: any) => {
  // console.log(event)
  if (event.srcElement.id) {
    let currentContextTabId = event.srcElement.id.split('-')[1]
    mainStoreI.saveCurContextTabId(currentContextTabId)
    contextMenuVisible.value = true
    left.value = event.clientX
    top.value = event.clientY + 10
  }
}
// 关闭所有
const closeAllTabs = () => {
  mainStoreI.closeAllTabs()
  contextMenuVisible.value = false
  router.push('/index')
}
// 关闭其他
const closeOtherTabs = (par: string) => {
  mainStoreI.closeOtherTabs(par)
  contextMenuVisible.value = false
}
// 点击空白区域，右键列表消失
watch(
  () => contextMenuVisible.value,
  () => {
    if (contextMenuVisible.value) {
      window.addEventListener('click', () => {
        contextMenuVisible.value = false
      })
    } else {
      window.removeEventListener('click', () => {
        contextMenuVisible.value = false
      })
    }
  }
)
</script>
<template>
  <el-tabs
    v-model="activeKey"
    type="card"
    @tab-click="clickHandle"
    closable
    @tab-remove="removeTab"
    @contextmenu.prevent.native="openContextMenu($event)"
  >
    <el-tab-pane
      v-for="item in tabsList"
      :key="item.path"
      :label="item.title"
      :name="item.path"
    >
    </el-tab-pane>
  </el-tabs>
  <ul
    v-show="contextMenuVisible"
    :style="{ left: left + 'px', top: top + 'px' }"
    class="contextmenu"
  >
    <li @click="closeAllTabs">关闭所有</li>
    <li @click="closeOtherTabs('left')">关闭左边</li>
    <li @click="closeOtherTabs('right')">关闭右边</li>
    <li @click="closeOtherTabs('other')">关闭其他</li>
  </ul>
</template>

<style lang="scss" scoped>
.contextmenu {
  width: 100px;
  margin: 0;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
  li {
    margin: 0;
    padding: 7px 16px;
    &:hover {
      background: #f2f2f2;
      cursor: pointer;
    }
  }
}
</style>
