<template>
  <main-layout>
    <view class="template-container">
      <el-card class="box-card" shadow="never">
        <div class="button-area">
          <el-button type="primary" @click="handleAddClick">+ 增加模板</el-button>
          <el-button @click="handleEditClick">修改模板</el-button>
          <el-button type="danger" @click="handleDeleteClick">删除模板</el-button>
        </div>
      </el-card>

      <el-card class="box-card" shadow="never" style="margin-top: 20px;">
        <template #header>
          <div class="card-header">
            <span>模板展示区</span>
          </div>
        </template>
        <el-table :data="tableData" style="width: 100%" height="500" @row-click="handleRowClick" @row-dblclick="handleRowDoubleClick" highlight-current-row>
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="name" label="会议名称" />
          <el-table-column prop="type" label="会议类型" />
          <el-table-column prop="room" label="会议室" />
          <el-table-column prop="content" label="会议内容" />
          <el-table-column prop="initiator" label="发起人" />
        </el-table>
      </el-card>

      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
        <el-form :model="form" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="会议名称" required>
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label="召集人" required>
                 <el-select v-model="form.initiator" placeholder="请选择召集人" style="width:100%">
                   <el-option
                     v-for="user in usersList"
                     :key="user.id"
                     :label="user.name"
                     :value="user.id"
                   ></el-option>
                 </el-select>
              </el-form-item>
              <el-form-item label="会议地点" required>
                 <el-select v-model="form.room" placeholder="请选择会议室" style="width:100%">
                   <el-option
                     v-for="room in roomsList"
                     :key="room.roomNumber"
                     :label="room.roomNumber"
                     :value="room.roomNumber"
                   ></el-option>
                 </el-select>
              </el-form-item>
              <el-form-item label="会议内容">
                <el-input v-model="form.content" type="textarea" :rows="4"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="会议类型" required>
                  <el-select v-model="form.type" placeholder="请选择类型" style="width:100%">
                    <el-option
                      v-for="type in meetingTypesList"
                      :key="type.id"
                      :label="type.typeName"
                      :value="type.typeName"
                    ></el-option>
                  </el-select>
               </el-form-item>
              <el-form-item label="联系人" required>
                 <el-select v-model="form.contact" placeholder="请选择联系人" style="width:100%">
                   <el-option
                     v-for="user in usersList"
                     :key="user.id"
                     :label="user.name"
                     :value="user.id"
                   ></el-option>
                 </el-select>
              </el-form-item>
               <el-form-item label="自定义地点">
                <el-input v-model="form.customRoom" />
              </el-form-item>
              <el-form-item label="会议服务">
                  <el-checkbox-group v-model="form.services">
                      <el-checkbox label="文件打印" />
                      <el-checkbox label="茶水" />
                  </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 认</el-button>
          </span>
        </template>
      </el-dialog>

    </view>
  </main-layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import MainLayout from '../../layouts/MainLayout.vue';
import templateService from '@/api/templateService.js';
import userService from '@/api/userService.js';   // 引入用户API服务
import roomService from '@/api/roomService.js';     // 引入会议室API服务
import meetingTypeService from '@/api/meetingTypeService.js'; // 重新引入会议类型API服务

// --- 数据 ---
const tableData = ref([]);
const dialogVisible = ref(false);
const dialogMode = ref('add');
const dialogTitle = computed(() => dialogMode.value === 'add' ? '新增会议模板' : '修改会议模板');
const selectedRow = ref(null);

const form = reactive({
  id: null, name: '', type: '', room: '', customRoom: '', 
  content: '', initiator: '', contact: '', services: []
});

// 下拉列表数据
const usersList = ref([]);
const roomsList = ref([]);
const meetingTypesList = ref([]); // 重新声明为可从后端获取的空数组


// --- 核心函数 ---
// 获取模板列表
async function fetchTemplates() {
    try {
        tableData.value = await templateService.getAll();
    } catch (error) {
        console.error("加载模板列表失败:", error);
        uni.showToast({
          title: "加载模板列表失败，请检查后端服务。",
          icon: 'none',
          duration: 2000
        });
    }
}

// 获取用户列表 (召集人、联系人)
async function fetchUsers() {
  try {
    usersList.value = await userService.getAllUsers();
  } catch (error) {
    console.error("加载用户列表失败:", error);
    uni.showToast({
      title: "加载用户列表失败。",
      icon: 'none',
      duration: 2000
    });
  }
}

// 获取会议室列表
async function fetchRooms() {
  try {
    roomsList.value = await roomService.getAllRooms();
  }
  catch (error) {
    console.error("加载会议室列表失败:", error);
    uni.showToast({
      title: "加载会议室列表失败。",
      icon: 'none',
      duration: 2000
    });
  }
}

// 获取会议类型列表
async function fetchMeetingTypes() {
  try {
    const response = await meetingTypeService.getAll();
    console.log("后端返回的会议类型数据:", response); // 打印原始数据
    // 确保后端返回的是一个数组，并且其元素包含 typeName 字段
    if (Array.isArray(response)) {
      // 过滤掉 typeName 为 null 或 undefined 的项，并且过滤掉 disabled 为 true 的项
      meetingTypesList.value = response.filter(type => 
        type.typeName !== null && 
        type.typeName !== undefined &&
        !type.disabled // 过滤掉 disabled 为 true 的会议类型
      );
    } else {
      console.warn("后端返回的会议类型数据不是一个数组:", response);
      uni.showToast({
        title: "会议类型数据格式不正确。",
        icon: 'none',
        duration: 2000
      });
    }
  } catch (error) {
    console.error("加载会议类型列表失败:", error);
    uni.showToast({
      title: "加载会议类型列表失败，请检查后端服务。",
      icon: 'none',
      duration: 2000
    });
  }
}


onMounted(() => {
    fetchTemplates();
    fetchUsers(); // 页面加载时获取用户列表
    fetchRooms(); // 页面加载时获取会议室列表
    fetchMeetingTypes(); // 重新调用此函数以从后端获取会议类型
});

const handleAddClick = () => {
  console.log('“增加模板”按钮被点击了！'); // 添加日志
  dialogMode.value = 'add';
  // 重置表单数据
  Object.assign(form, { id: null, name: '', type: '', room: '', customRoom: '', content: '', initiator: '', contact: '', services: [] });
  dialogVisible.value = true;
};

const handleEditClick = () => {
  if (selectedRow.value === null) {
    uni.showToast({
      title: '请先从下方表格中点击选择要修改的模板！',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  dialogMode.value = 'edit';
  // 复制选中行数据到表单，确保深拷贝以避免直接修改表格数据
  Object.assign(form, JSON.parse(JSON.stringify(selectedRow.value)));
  dialogVisible.value = true;
};

const handleDeleteClick = async () => {
    if (selectedRow.value === null) {
        uni.showToast({
          title: '请先从下方表格中点击选择要删除的模板！',
          icon: 'none',
          duration: 2000
        });
        return;
    }
    const res = await uni.showModal({
        title: '请确认',
        content: `您确定要删除模板【${selectedRow.value.name}】吗？`
    });
    if (res.confirm) {
        try {
            await templateService.delete(selectedRow.value.id);
            uni.showToast({
              title: '删除成功！',
              icon: 'success',
              duration: 2000
            });
            selectedRow.value = null; // 清空选择
            fetchTemplates(); // 刷新列表
        } catch (error) {
            console.error("删除模板失败:", error);
            uni.showToast({
              title: "删除模板失败！",
              icon: 'none',
              duration: 2000
            });
        }
    }
};

const handleConfirm = async () => {
  if (!form.name || !form.type || !form.room || !form.initiator || !form.contact) {
      uni.showToast({
        title: '带*号的为必填项！',
        icon: 'none',
        duration: 2000
      });
      return;
  }

  try {
      if (dialogMode.value === 'add') {
          await templateService.create(form);
          uni.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 2000
          });
      } else {
          await templateService.update(form.id, form);
          uni.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 2000
          });
      }
      dialogVisible.value = false;
      fetchTemplates(); // 刷新列表
  } catch(error) {
      console.error("保存模板失败:", error);
      uni.showToast({
        title: "保存模板失败！",
        icon: 'none',
        duration: 2000
      });
  }
};

const handleRowClick = (row) => {
  selectedRow.value = row;
};

const handleRowDoubleClick = (row) => {
	const templateData = encodeURIComponent(JSON.stringify(row));
	uni.navigateTo({
	  url: `/pages/calendar-view/index?from=template&data=${templateData}`
	});
};
</script>

<style scoped>
.button-area {
  padding: 10px 0;
}
.card-header {
  font-weight: bold;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  padding: 0 10px;
}
</style>
