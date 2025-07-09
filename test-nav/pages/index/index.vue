<template>
  <main-layout>
    <div class="search-container">
      <div class="main-content">
        <el-card shadow="never">
          <el-form :model="searchForm" :inline="true">
            <el-form-item label="日期">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="审核中" value="审核中"></el-option>
                <el-option label="已审核" value="已审核"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查 询</el-button>
              <el-button @click="openNewMeetingDialog">+ 新建会议</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" style="margin-top: 20px;">
          <el-table :data="tableData" style="width: 100%" height="600" @row-click="handleRowClick" highlight-current-row>
            <el-table-column prop="id" label="申请单号" width="100" />
            <el-table-column prop="name" label="会议名称" width="150" />
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="startTime" label="开始" width="80" />
            <el-table-column prop="endTime" label="结束" width="80" />
            <el-table-column prop="room" label="会议室" width="150" />
            <el-table-column prop="initiator" label="发起人" width="100" />
            <el-table-column prop="status" label="审核状态" width="100">
               <template #default="scope">
                <el-tag :type="scope.row.status === '已审核' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button size="small" @click.stop="handleEdit(scope.row)">修改</el-button>
                <el-button size="small" type="danger" @click.stop="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <div class="details-pane" v-if="selectedMeeting">
        <el-card shadow="never">
           <template #header>
            <div class="card-header">
              <span>会议详细信息</span>
            </div>
          </template>
          <div class="details-content">
            <p><strong>申请单号:</strong> {{ selectedMeeting.id }}</p>
            <p><strong>会议名称:</strong> {{ selectedMeeting.name }}</p>
            <p><strong>发起人:</strong> {{ selectedMeeting.initiator }}</p>
            <p><strong>联系人:</strong> {{ selectedMeeting.contact }}</p>
            <p><strong>日期:</strong> {{ selectedMeeting.date }}</p>
            <p><strong>时间:</strong> {{ selectedMeeting.startTime }} - {{ selectedMeeting.endTime }}</p>
            <p><strong>参会人员:</strong> {{ selectedMeeting.attendees }}</p>
            <p><strong>会议服务:</strong> {{ selectedMeeting.services }}</p>
            <p><strong>附件:</strong> <el-link type="primary">点击下载</el-link></p>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="新建会议" width="700px">
        <el-form label-width="100px">
            <el-form-item label="会议名称">
                <el-input />
            </el-form-item>
            <el-form-item label="会议日期">
                <el-date-picker type="date" style="width: 100%;"/>
            </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
        </template>
    </el-dialog>

  </main-layout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';

// 搜索表单数据
const searchForm = reactive({
  dateRange: '',
  status: ''
});

// 表格数据 (模拟)
const tableData = ref([
  { id: 'M00138', name: '培训会', date: '2021-05-23', startTime: '21:00', endTime: '22:20', room: '第一会议室(所) 314', initiator: '张三', contact: '张三', status: '审核中', attendees: '张三, 李四', services: '茶水' },
  { id: 'M00137', name: '测试3', date: '2021-05-23', startTime: '20:00', endTime: '21:00', room: '第五会议室(所) 313', initiator: '李四', contact: '李四', status: '审核中', attendees: '李四, 王五', services: '文件打印' },
  { id: 'M00136', name: '第三次周例会', date: '2021-05-23', startTime: '19:04', endTime: '20:04', room: '第三会议室(所) 0', initiator: '王五', contact: '王五', status: '已审核', attendees: '全体员工', services: '投影仪' }
]);

// 当前选中的会议，用于在右侧显示详情
const selectedMeeting = ref(null);

// 新建会议弹窗的可见性
const dialogVisible = ref(false);


// 点击查询按钮
const handleSearch = () => {
  console.log('搜索条件:', searchForm);
  alert('查询功能（前端模拟）');
};

// 点击表格行
const handleRowClick = (row) => {
  selectedMeeting.value = row;
};

// 打开新建会议弹窗
const openNewMeetingDialog = () => {
    dialogVisible.value = true;
};

// 点击修改按钮
const handleEdit = (row) => {
    console.log('修改:', row.id);
    alert(`准备修改单号为 ${row.id} 的会议`);
};

// 点击删除按钮
const handleDelete = (row) => {
    console.log('删除:', row.id);
    alert(`准备删除单号为 ${row.id} 的会议`);
};

</script>

<style scoped>
.search-container {
  display: flex;
  gap: 20px;
}
.main-content {
  flex-grow: 1;
}
.details-pane {
  width: 350px;
  flex-shrink: 0;
}
.card-header {
  font-weight: bold;
}
.details-content p {
  margin: 10px 0;
  font-size: 14px;
}
.details-content p strong {
  margin-right: 8px;
}
</style>