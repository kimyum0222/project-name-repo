<template>
  <view class="main-layout">
    <view class="sidebar">
      <view class="title">会议管理系统</view>
      <div class="user-profile">
        <el-avatar :size="50" icon="UserFilled" />
        <div class="user-info">
          <div class="user-name">{{ userInfo.name }}</div>
          <div class="user-id">工号: {{ userInfo.employeeId }}</div>
        </div>
      </div>
      <el-divider />
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#ffffffa6"
        active-text-color="#ffffff"
        @select="handleMenuSelect"
      >
        <!-- vvv 这是我们新增的、带有图标的菜单项 vvv -->
        <el-menu-item index="my-meetings">
          <el-icon><DataLine /></el-icon>
          <span>我的会议</span>
        </el-menu-item>
        <!-- ^^^ 新增菜单项结束 ^^^ -->
        <el-menu-item index="calendar-view">
          <el-icon><Calendar /></el-icon>
          <span>会议日历</span>
        </el-menu-item>
        <el-menu-item index="meeting-search">
          <el-icon><Search /></el-icon>
          <span>会议查询</span>
        </el-menu-item>
        <el-menu-item index="recurring-template">
          <el-icon><Files /></el-icon>
          <span>周期会议模板</span>
        </el-menu-item>
    
        <el-sub-menu index="standards">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>会议管理标准</span>
          </template>
          <el-menu-item index="role-management">
            <el-icon><User /></el-icon>
            <span>会议角色管理</span>
          </el-menu-item>
          <el-menu-item index="meeting-room">
            <el-icon><OfficeBuilding /></el-icon>
            <span>会议室管理</span>
          </el-menu-item>
          <el-menu-item index="meeting-type">
            <el-icon><CollectionTag /></el-icon>
            <span>会议类型管理</span>
          </el-menu-item>
          <el-menu-item index="service-management">
            <el-icon><Service /></el-icon>
            <span>会议服务管理</span>
          </el-menu-item>
        </el-sub-menu>
    
      </el-menu>
    </view>

    <view class="content">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
// vvv--- 确保 DataLine 图标被引入 ---vvv
import {
  DataLine, // 把新图标加到这里
  Calendar,
  Search,
  Files,
  Setting,
  User,
  OfficeBuilding,
  CollectionTag,
  Service,
} from '@element-plus/icons-vue'

const userInfo = ref({ name: '未登录', employeeId: 'N/A' });
const activeMenu = ref('');

const handleMenuSelect = (index) => {
  const path = `/pages/${index}/index`;
  uni.reLaunch({
    url: path
  });
};

onShow(() => {
	const isLoggedIn = uni.getStorageSync('isLoggedIn');
	if (!isLoggedIn) {
	  uni.reLaunch({
	    url: '/pages/login/index'
	  });
	  return;
	}
	const storedInfo = uni.getStorageSync('userInfo');
	if (storedInfo) {
	  userInfo.value = storedInfo;
	}
  const pages = getCurrentPages();
  if (!pages || pages.length === 0) {
    return; 
  }
  const currentPage = pages[pages.length - 1];
  if (!currentPage) return; 

  const route = currentPage.route;
  const menuIndex = route.split('/')[1];
  
  activeMenu.value = menuIndex;
});
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background-color: #304156;
  color: white;
  overflow-y: auto;
}
.content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}
.title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 20px 0;
}
.el-menu {
  border-right: none;
}
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  transition: background-color 0.3s ease;
}
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #1890ff !important;
}
.user-profile {
  display: flex;
  align-items: center;
  padding: 20px;
  color: white;
}
.user-info {
  margin-left: 15px;
}
.user-name {
  font-size: 16px;
  font-weight: bold;
}
.user-id {
  font-size: 12px;
  color: #ffffffa6;
  margin-top: 5px;
}
:deep(.el-divider--horizontal) {
  margin: 0 0 10px 0;
  border-color: #ffffff30;
}
</style>
