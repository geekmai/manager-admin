<script lang="ts" setup>
import { computed } from 'vue'
import { ArrowDown, UserFilled } from '@element-plus/icons-vue'
import { loginStore } from '@/store/login.Store'
// import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import router from '@/router'

const loginStoreI = loginStore()
const userInfo = loginStoreI.userInfo
// console.log(userInfo.username)
// const roleName = computed(() => {
//   if (userInfo.role == 'teacher') {
//     return '教师'
//   } else if (userInfo.role == 'student') {
//     return '学生'
//   } else if (userInfo.role == 'admin') {
//     return '管理员'
//   }
// })
// 当有用户信息时，显示用户名，没有用户信息时，显示游客
const userBarName = computed(() => {
  if (userInfo) {
    return userInfo.userName
  } else {
    return '游客'
  }
})
// const router = useRouter()
const handleLogout = () => {
  loginStoreI.loginOut()
  // router.push({ path: '/login' })
  router.push({ path: '/login' })
  ElMessage({
    message: '退出成功！',
    type: 'success',
    center: true
  })
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}
</script>

<template>
  <div class="userInfo">
    <el-dropdown trigger="click">
      <div>
        <el-avatar :icon="UserFilled" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 用户名和角色 -->

    <el-row style="margin-left: 10px">
      <el-col
        ><span>{{ userBarName }}</span></el-col
      >
      <!-- <el-col
        ><span>{{ roleName }}</span></el-col
      > -->
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.userInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
