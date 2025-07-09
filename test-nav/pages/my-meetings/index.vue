<template>
  <main-layout>
    <div class="my-meetings-container">
      <!-- 顶部图片轮播区 -->
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>公司重要会议照片</span>
          </div>
        </template>
        <el-carousel 
          :interval="4000" 
          type="card" 
          height="220px" 
          indicator-position="outside"
        >
          <el-carousel-item v-for="item in carouselImages" :key="item.id">
            <img :src="item.url" class="carousel-image" :alt="item.title" />
            <h3 class="carousel-title">{{ item.title }}</h3>
          </el-carousel-item>
        </el-carousel>
      </el-card>

      <!-- 下方本周会议区 -->
      <el-card shadow="never" style="margin-top: 20px;">
        <template #header>
          <div class="meetings-header">
            <div class="meetings-title">
              <el-icon :size="20" color="#409eff"><BellFilled /></el-icon>
              <span>本周参会消息</span>
            </div>
            <div class="meetings-controls">
              <el-date-picker
                v-model="selectedDate"
                type="week"
                format="YYYY 第 ww 周"
                placeholder="选择一个周"
                :clearable="false"
              />
              <span class="meetings-count">{{ meetingCountText }}</span>
            </div>
          </div>
        </template>
        <el-table :data="filteredMeetings" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="name" label="会议名称" />
          <el-table-column prop="location" label="地点" />
          <el-table-column prop="time" label="时间" />
        </el-table>
      </el-card>
    </div>
  </main-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { BellFilled } from '@element-plus/icons-vue';

// 图片轮播数据
const carouselImages = ref([
  { id: 1, url: '/static/meeting1.jpg', title: '2025年度战略会议' },
  { id: 2, url: '/static/meeting2.jpg', title: '“启航”产品发布会' },
  { id: 3, url: '/static/meeting4.jpg', title: '第二季度总结表彰大会' },
  { id: 4, url: '/static/meeting3.jpg', title: '优秀团队户外拓展' },
]);

// 动态会议逻辑
const selectedDate = ref(new Date());

// 一个更大的模拟数据源，包含不同日期的会议
const allMeetings = ref([
  { id: 1, name: '工作交流会', location: '619会议室', time: '周一 09:00', date: '2025-06-30' },
  { id: 2, name: '生产调度会', location: '112会议室', time: '周二 14:00', date: '2025-07-01' },
  { id: 3, name: '部门培训会', location: '300阳光房', time: '周三 10:30', date: '2025-07-02' },
  { id: 4, name: '安全生产培训', location: '学术会议室', time: '上周四 15:00', date: '2025-06-26' },
  { id: 5, name: '新项目启动会', location: '第一会议室', time: '下周一 10:00', date: '2025-07-07' },
  { id: 6, name: '供应商洽谈会', location: '第三会议室', time: '下周三 14:30', date: '2025-07-09' },
]);

// 【已修复】计算属性：根据 selectedDate 动态筛选出那一周的会议
const filteredMeetings = computed(() => {
  if (!selectedDate.value) return [];
  
  // 创建一个 selectedDate 的副本，避免在计算过程中修改原始的 ref 值
  const date = new Date(selectedDate.value);
  date.setHours(0, 0, 0, 0); // 将时间设置为0点，避免时区问题

  // 计算当前日期是星期几 (周日=0, 周一=1, ..., 周六=6)
  const dayOfWeek = date.getDay();
  // 计算需要移动多少天才能到本周的周一
  // 如果是周日(0)，则减6天；如果是周一(1)，减0天；周二(2)，减1天...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  // 创建一个新的 Date 对象来表示周一，避免直接修改 date
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  
  // 基于周一计算周日
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  // 格式化为 'YYYY-MM-DD' 字符串以便于比较
  const startOfWeekStr = monday.toISOString().split('T')[0];
  const endOfWeekStr = sunday.toISOString().split('T')[0];

  // 筛选出日期在这一周范围内的所有会议
  return allMeetings.value.filter(meeting => {
    return meeting.date >= startOfWeekStr && meeting.date <= endOfWeekStr;
  });
});

// 计算属性：生成会议统计的文本
const meetingCountText = computed(() => {
  const count = filteredMeetings.value.length;
  return `您共有 ${count} 个会议需要参加`;
});
</script>

<style scoped>
.my-meetings-container {
  padding: 10px;
}
.meetings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.meetings-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 16px;
}
.meetings-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}
.meetings-count {
  font-size: 14px;
  color: #606266;
}
.card-header {
  font-weight: bold;
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.carousel-title {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  margin: 0;
  font-size: 14px;
}

/* 修改指示器颜色 */
:deep(.el-carousel__indicator--horizontal .el-carousel__button) {
  background-color: #8a96a9;
}
</style>
