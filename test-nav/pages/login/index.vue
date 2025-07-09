<template>
  <view class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>会议管理系统</span>
        </div>
      </template>
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="loginForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="loginForm.employeeId" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </view>
</template>

<script setup>
import { reactive } from 'vue';

const loginForm = reactive({
  name: '',
  employeeId: ''
});

const handleLogin = () => {
  // 进行简单的非空验证
  if (!loginForm.name || !loginForm.employeeId) {
    uni.showToast({
      title: '姓名和工号不能为空',
      icon: 'none'
    });
    return;
  }

  // 登录成功，设置一个“已登录”的标记
  uni.setStorageSync('isLoggedIn', true);

  // 将用户信息存入本地存储，这样其他页面也能访问
  uni.setStorageSync('userInfo', { 
    name: loginForm.name, 
    employeeId: loginForm.employeeId 
  });

  // 使用 reLaunch 跳转到主页，关闭登录页
  uni.reLaunch({
    url: '/pages/my-meetings/index' // 默认跳转到会议日历页
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/Users/jin/Developer/test-nav/static/denglu1.jpg'); /* 替换为您的图片 URL */
  background-size: cover;
  background-position: center;
}
.login-card {
  width: 400px;
  background-color: rgba(255, 255, 255, 0.9); /* 添加一个半透明的白色背景，使文字更清晰 */
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.card-header {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  padding-bottom: 20px;
}
</style>