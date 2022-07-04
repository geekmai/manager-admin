<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { useRouter } from 'vue-router'
import { loginStore } from '@/store/login.Store'
// import { login } from '@/api/userApi'
// 表单数据
const loginForm = reactive({
  userName: 'admin',
  userPwd: 'admin'
})
// 表单校验规则
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名！', trigger: 'blur' },
    { min: 5, max: 50, message: '用户名长度至少为 5 位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码！', trigger: 'blur' },
    { min: 5, max: 50, message: '密码长度至少为 5 位', trigger: 'blur' }
  ]
})

// 登录表单提交
const router = useRouter()
const loginStoreI = loginStore()
const onSubmit = async () => {
  try {
    const userData = await loginStoreI.userLogin(loginForm)
    // console.log(userData)
    if (userData.code == 200) {
      ElMessage({
        message: '登陆成功！',
        type: 'success',
        center: true
      })
      router.push({ path: '/index' })
    }
    // console.log(userData)
  } catch (error) {
    console.log(error)
    ElMessage({
      message: '用户名或密码错误！',
      type: 'error',
      center: true
    })
  }
}

// 跳转注册
const goRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <!-- 背景 vedio -->
    <video poster="@/assets/login/1.jpg" loop autoplay muted>
      <source src="@/assets/login/Particles.mp4" />
    </video>
    <div class="login-form">
      <!-- 标题 -->
      <header>
        <img src="@/assets/logo.png" alt="" />
        <h1>Vue3-admin</h1>
      </header>
      <el-form :model="loginForm" :rules="loginRules">
        <el-form-item prop="username" class="login-username">
          <el-input placeholder="username" v-model="loginForm.userName" type="text" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="password"
            v-model="loginForm.userPwd"
            type="password"
            show-password
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%; border: none" @click="onSubmit">登录</el-button>
        </el-form-item>
        <el-link @click="goRegister">新用户注册</el-link>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
// 隐藏滚动条
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
.login-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  video {
    position: absolute;
    /* Vertical and Horizontal center*/
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
    z-index: -1;
  }
  .login-form {
    width: 400px;
    height: 280px;
    padding: 4vh;
    margin: 20px;
    background: url('@/assets/login/login_form.png');
    background-size: 100% 100%;
    border-radius: 10px;
    box-shadow: 0 2px 8px 0 rgba(7, 17, 27, 0.06);
    opacity: '0.2';

    header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      img {
        display: inline-block;
        width: 40px;
      }

      h1 {
        margin-bottom: 0;
        font-size: 24px;
        color: #fff;
        text-align: center;
      }
    }
    // .login-username{

    // }
    .el-input__wrapper {
      display: inline-block;
      height: 47px;
      width: 85%;
      background-color: transparent !important;
      box-shadow: none;

      input {
        height: 47px;
        background: transparent;
        border: 0px;
        border-radius: 0px;
        padding: 12px 5px 12px 30px;
        color: $lightGray;
        caret-color: $loginCursorColor;
        -webkit-appearance: none;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $loginBg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
      .el-input__prefix {
        position: absolute;
        margin-right: 5px;
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .el-input__suffix {
    position: absolute;
    right: 10px;
    top: 0px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
