<script lang="ts" setup>
import { ref, computed } from 'vue'
import LogoBar from './components/LogoBar.vue'
import MenuBar from './components/MenuBar/MenuBar.vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { isMobile } from '../utils/isMobile.js'
import AppMain from './components/AppMain.vue'
import HeaderBar from './components/HeaderBar/HeaderBar.vue'
import TabBar from './components/TabBar.vue'

const collapsed = ref<boolean>(false)
const autoWidth = computed(() => {
  if (collapsed.value && isMobile()) {
    return '0px'
  } else if (collapsed.value) {
    return '64px'
  } else {
    return '200px'
  }
})
// console.log(isMobile())
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside :style="'width:' + autoWidth">
        <LogoBar :collapsed="collapsed" />
        <MenuBar :collapsed="collapsed" />
      </el-aside>
      <el-container>
        <el-header>
          <el-row :gutter="20" class="header-container">
            <!-- 侧边栏展开折叠按钮 -->
            <el-col :span="1" class="header-button">
              <el-icon
                style="font-size: 26px; margin-right: 15px"
                @click="
                  () => {
                    collapsed = !collapsed
                  }
                "
              >
                <component :is="collapsed ? Expand : Fold" />
              </el-icon>
            </el-col>
            <el-col :span="23">
              <HeaderBar />
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <!-- 标签页 -->
          <!-- <TabBar /> -->
          <!-- 路由出口 -->
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss">
.common-layout {
  display: flex;
  height: 100vh;
  .el-header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    background-color: rgb(255, 255, 255);
    color: var(--el-text-color-primary);
    text-align: center;
    // border-bottom: 1px solid $menuBg;
    // line-height: 60px;
  }
  .el-aside {
    background-color: $menuBg;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 200px;
    width: 200px;
    height: 100%;
    overflow: hidden;
  }
  .el-main {
    background-color: rgb(241, 241, 241);
    padding: 10px;
    // color: var(--el-text-color-primary);
    // text-align: center;
    // line-height: 160px;
  }
  .header-container {
    width: 100%;
    display: flex;
    align-items: center;
    .header-button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  // menu 菜单增加动画
  .el-aside {
    transition: width 0.3s;
    -webkit-transition: width 0.3s;
    -moz-transition: width 0.3s;
    -webkit-transition: width 0.3s;
    -o-transition: width 0.3s;
  }
}
</style>
