<script lang="ts" setup>
import {} from 'vue'
</script>

<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">万维智能医护虚拟仿真实训系统</div>
      <div class="desc">科技赋能医护</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<style lang="scss">
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow-y: hidden;
  background-color: white;
  padding: 20px;
  .content {
    position: relative;
    bottom: 100px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 35px;
      line-height: 62px;
      color: #409eff;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    background-image: url('@/assets/images/welcome.png');
    background-repeat: no-repeat;
    background-size: cover;
    width: 550px;
    height: 420px;
    margin-left: 100px;
  }
}
</style>
