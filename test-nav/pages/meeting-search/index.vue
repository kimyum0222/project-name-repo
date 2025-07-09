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
              <el-button type="primary" @click="handleSearch">统 计</el-button>
              <el-button @click="openMeetingDialog(null)">+ 新建会议</el-button>
              <el-checkbox v-model="searchForm.showAll" label="显示所有" style="margin-left: 15px;" />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>会议明细</span>
            </div>
          </template>
          <el-table 
            :data="tableData" 
            style="width: 100%" 
            height="600" 
            @row-click="handleRowClick" 
            @row-contextmenu="handleRowContextMenu"
            highlight-current-row
          >
            <el-table-column prop="id" label="申请单号" width="100" />
            <el-table-column prop="name" label="会议名称" width="150" />
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="startTime" label="开始" width="80" />
            <el-table-column prop="endTime" label="结束" width="80" />
            <el-table-column prop="room" label="会议室" width="180" />
            <el-table-column prop="initiator" label="发起人" width="100" />
            <el-table-column prop="status" label="审核状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已审核' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <div class="details-pane" v-if="selectedMeeting">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          <div class="details-content">
            <p><strong>申请单号:</strong> {{ selectedMeeting.id }}</p>
            <p><strong>会议名称:</strong> {{ selectedMeeting.name }}</p>
            <p><strong>日期:</strong> {{ selectedMeeting.date }}</p>
            <p><strong>时间:</strong> {{ selectedMeeting.startTime }} - {{ selectedMeeting.endTime }}</p>
            <p><strong>会议室:</strong> {{ selectedMeeting.room }}</p>
            <p><strong>发起人:</strong> {{ selectedMeeting.initiator }}</p>
            <p><strong>审核状态:</strong> {{ selectedMeeting.status }}</p>
            <p v-if="selectedMeeting.attachment"><strong>附件:</strong> 有</p>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" @close="resetMeetingForm">
      <el-form :model="meetingForm" label-width="100px">
        <el-form-item label="会议名称" required>
          <el-input v-model="meetingForm.name" />
        </el-form-item>
        <el-form-item label="会议室" required>
          <el-input v-model="meetingForm.room" />
        </el-form-item>
        <el-form-item label="日期" required>
          <el-date-picker v-model="meetingForm.date" type="date" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-input v-model="meetingForm.startTime" />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-input v-model="meetingForm.endTime" />
        </el-form-item>
        <el-form-item label="发起人">
          <el-input v-model="meetingForm.initiator" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmMeeting">确 认</el-button>
        </span>
      </template>
    </el-dialog>
    
    <div v-if="contextMenu.visible" :style="contextMenuStyle" class="context-menu" @click.stop>
      <div class="context-menu-item" @click="contextMenuAction('new')">新建</div>
      <div v-if="contextMenu.canEdit" class="context-menu-item" @click="contextMenuAction('edit')">修改</div>
      <div v-if="contextMenu.canDelete" class="context-menu-item" @click="contextMenuAction('delete')">删除</div>
      <div v-if="contextMenu.hasAttachment" class="context-menu-item" @click="contextMenuAction('download')">下载文件</div>
    </div>
  </main-layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import MainLayout from '../../layouts/MainLayout.vue';
import axios from 'axios';
import { ElMessageBox } from 'element-plus'; // 导入 Element Plus 的 MessageBox

// API 基础 URL
const API_BASE_URL = 'http://localhost:8080/api/meetings'; // **更新为新的 API 路径**

// --- 数据 ---
const tableData = ref([]); // 初始时让 tableData 为空，数据从后端加载
const searchForm = reactive({ dateRange: [], status: '', showAll: false });
const selectedMeeting = ref(null);

// --- 弹窗和表单逻辑 ---
const dialogVisible = ref(false);
const dialogTitle = ref('新建会议');
const isEditMode = ref(false);
const initialMeetingForm = {
  id: null,
  name: '',
  date: '', // 注意：el-date-picker 返回的是 Date 对象
  startTime: '',
  endTime: '',
  room: '',
  initiator: '',
  status: '审核中', // 默认状态
  attachment: false, // 默认附件状态
};
const meetingForm = reactive({ ...initialMeetingForm });

const resetMeetingForm = () => {
  Object.assign(meetingForm, initialMeetingForm);
};

const openMeetingDialog = (rowData) => {
  if (rowData) {
    dialogTitle.value = '修改会议';
    isEditMode.value = true;
    // 直接赋值，因为前端和后端字段名一致
    Object.assign(meetingForm, rowData);
    // 日期字段需要转换为 Date 对象以便 el-date-picker 正确显示
    if (meetingForm.date) {
      meetingForm.date = new Date(meetingForm.date);
    }
  } else {
    dialogTitle.value = '新建会议';
    isEditMode.value = false;
    resetMeetingForm();
  }
  dialogVisible.value = true;
};

const handleConfirmMeeting = async () => {
  try {
    // 准备发送给后端的数据，字段名与后端 Meeting 实体完全匹配
    const payload = {
      ...meetingForm,
      // 格式化日期为 'YYYY-MM-DD' 字符串，时间保持原样
      date: meetingForm.date ? new Date(meetingForm.date).toISOString().split('T')[0] : null,
    };

    if (isEditMode.value) {
      // 修改时需要发送 id
      await axios.put(`${API_BASE_URL}/${payload.id}`, payload);
      alert('修改成功！');
    } else {
      // 新建时不需要发送 id (由后端生成)
      delete payload.id;
      // 新建时，如果状态和附件未设置，则由后端提供默认值
      // delete payload.status;
      // delete payload.attachment;

      await axios.post(API_BASE_URL, payload);
      alert('新建成功！');
    }
    dialogVisible.value = false;
    fetchMeetings(); // 刷新列表
  } catch (error) {
    console.error('Error saving meeting:', error.response?.data || error.message);
    alert('保存会议失败！' + (error.response?.data?.message || error.message));
  }
};

// --- 加载会议数据函数 ---
const fetchMeetings = async () => {
  try {
    const params = {};
    if (searchForm.showAll) {
      params.showAll = true;
    } else {
      if (searchForm.dateRange && searchForm.dateRange.length === 2) {
        // 将日期对象格式化为 'YYYY-MM-DD'
        params.startDate = searchForm.dateRange[0] ? new Date(searchForm.dateRange[0]).toISOString().split('T')[0] : null;
        params.endDate = searchForm.dateRange[1] ? new Date(searchForm.dateRange[1]).toISOString().split('T')[0] : null;
      }
      if (searchForm.status) {
        params.status = searchForm.status;
      }
    }

    const response = await axios.get(API_BASE_URL, { params });
    // 后端返回的 Meeting 列表，字段名与前端 tableData 完全一致，直接赋值
    tableData.value = response.data;
    selectedMeeting.value = null; // 查询后清空右侧详情
  } catch (error) {
    console.error('Error fetching meetings:', error.response?.data || error.message);
    alert('加载会议数据失败！' + (error.response?.data?.message || error.message));
  }
};

// --- 右键菜单逻辑 ---
const contextMenu = reactive({
  visible: false, top: 0, left: 0, targetRow: null,
  canEdit: false, canDelete: false, hasAttachment: false,
});
const contextMenuStyle = computed(() => ({
  top: `${contextMenu.top}px`, left: `${contextMenu.left}px`,
}));

const handleRowContextMenu = (row, column, event) => {
  event.preventDefault();
  const status = String(row.status || '').trim();
  contextMenu.left = event.clientX;
  contextMenu.top = event.clientY;
  contextMenu.targetRow = row;
  contextMenu.canEdit = status === '审核中';
  contextMenu.canDelete = status === '审核中';
  contextMenu.hasAttachment = !!row.attachment;
  contextMenu.visible = true;
};

const closeContextMenu = () => {
  contextMenu.visible = false;
};

const contextMenuAction = (action) => {
  const row = contextMenu.targetRow;
  if (!row && action !== 'new') {
    closeContextMenu();
    return;
  }
  switch (action) {
    case 'new': openMeetingDialog(null); break;
    case 'edit': handleEdit(row); break;
    case 'delete': handleDelete(row); break;
    case 'download': handleDownload(row); break;
  }
  closeContextMenu();
};

onMounted(() => {
  document.addEventListener('click', closeContextMenu);
  fetchMeetings(); // 页面加载时自动加载一次数据
});
onBeforeUnmount(() => { document.removeEventListener('click', closeContextMenu); });

// --- 其他页面逻辑 ---
const handleSearch = () => {
  console.log('搜索条件:', searchForm);
  fetchMeetings(); // 调用后端 API
};
const handleRowClick = (row) => {
  selectedMeeting.value = row;
};

const handleEdit = (row) => {
  openMeetingDialog(row);
};

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除会议【${row.name}】吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await axios.delete(`${API_BASE_URL}/${row.id}`);
        alert('删除成功！');
        if (selectedMeeting.value && selectedMeeting.value.id === row.id) {
          selectedMeeting.value = null;
        }
        fetchMeetings(); // 刷新列表
      } catch (error) {
        console.error('Error deleting meeting:', error.response?.data || error.message);
        alert('删除会议失败！' + (error.response?.data?.message || error.message));
      }
    })
    .catch(() => {
      // 用户取消删除
    });
};

const handleDownload = (row) => {
  console.log('下载文件:', row);
  alert(`开始下载【${row.name}】的附件...`);
  // 实际的文件下载需要一个后端接口来提供文件流
};
</script>

<style scoped>
.search-container { display: flex; gap: 20px; }
.main-content { flex-grow: 1; }
.details-pane { width: 350px; flex-shrink: 0; }
.card-header { font-weight: bold; }
.details-content p { margin: 10px 0; font-size: 14px; line-height: 1.5; }
.details-content p strong { margin-right: 8px; color: #606266; }
.context-menu { position: fixed; background: #fff; border: 1px solid #e4e7ed; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); z-index: 3000; padding: 5px 0; }
.context-menu-item { font-size: 14px; padding: 8px 16px; cursor: pointer; }
.context-menu-item:hover { background-color: #ecf5ff; color: #409eff; }
</style>
