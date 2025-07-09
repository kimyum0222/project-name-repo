<template>
  <main-layout>
    <view class="container">
      <view class="table-section">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>会议室信息</span>
            </div>
          </template>
          <el-table :data="tableData" style="width: 100%" @row-click="handleRowClick" highlight-current-row>
            <el-table-column prop="roomNumber" label="房号" width="60" />
            <el-table-column prop="name" label="会议室名称" width="100" />
            <el-table-column prop="address" label="地址" width="130" />
            <el-table-column prop="managingUnit" label="管理单位" width="180" />
			<el-table-column prop="projectionDevice" label="投影设备" width="90" />
			<el-table-column prop="computerConfig" label="电脑配置" width="80" />
            <el-table-column prop="capacity" label="容纳人数"width="80"/>
          </el-table>
        </el-card>
      </view>

      <view class="form-section">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>数据输入区</span>
            </div>
          </template>
          <el-form :model="form" label-width="100px">
            <el-form-item label="房号">
              <el-input v-model="form.id" />
            </el-form-item>
            <el-form-item label="会议室名称">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="管理单位">
              <el-select v-model="form.managingUnit" placeholder="请选择管理单位" style="width:100%">
                <el-option
                  v-for="unit in managingUnitOptions"
                  :key="unit"
                  :label="unit"
                  :value="unit"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="form.location" />
            </el-form-item>
			<el-form-item label="投影设备">
			  <el-input v-model="form.projectionDevice" />
			</el-form-item>
			<el-form-item label="电脑配置">
			  <el-input v-model="form.computerConfig" />
			</el-form-item>
            <el-form-item label="容纳人数">
              <el-input v-model="form.capacity" />
            </el-form-item>
            <el-form-item>
              <div class="button-group">
                <el-button type="primary" @click="submitNewRoom">添加</el-button>
                <el-button @click="handleUpdate">修改</el-button>
                <el-button @click="handleReset">重置</el-button>
                <el-button type="danger" @click="handleDelete">删除</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </view>
    </view>
  </main-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import MainLayout from '../../layouts/MainLayout.vue';
import meetingRoomService from '@/api/meetingRoomService.js';

const tableData = ref([]);
const managingUnitOptions = ref([]); 
const form = reactive({
  id: '', 
  name: '',
  location: '',
  managingUnit: '',
  capacity: '',
  projectionDevice: '',
  computerConfig: ''
});

const fetchMeetingRooms = async () => {
  try {
    const response = await meetingRoomService.getAll();
    if (Array.isArray(response)) {
      tableData.value = response;
      const allUnits = response.map(room => room.managingUnit);
      const uniqueUnits = [...new Set(allUnits)];
      const validUnits = uniqueUnits.filter(unit => unit && unit.trim() !== '');
      managingUnitOptions.value = validUnits;
    } else {
      tableData.value = [];
      console.warn("从后端获取的数据不是一个期望的数组格式:", response);
    }
  } catch (error) {
    console.error("获取会议室列表失败:", error);
    tableData.value = [];
    uni.showToast({ title: '加载会议室列表失败', icon: 'none' });
  }
};

onMounted(() => {
  fetchMeetingRooms();
});

const handleRowClick = (row) => {
  form.id = row.roomNumber; 
  form.name = row.name;
  form.location = row.address;
  form.managingUnit = row.managingUnit;
  form.capacity = row.capacity;
  form.projectionDevice = row.projectionDevice;
  form.computerConfig = row.computerConfig;
};

const handleReset = () => {
  form.id = '';
  form.name = '';
  form.location = '';
  form.managingUnit = '';
  form.capacity = '';
  form.projectionDevice = '';
  form.computerConfig = '';
};

const submitNewRoom = async () => {
  if (!form.id || !form.name) {
    alert('会议室房号和名称是必填项！');
    return;
  }
  const newRoomData = {
    roomNumber: form.id,
    name: form.name,
    address: form.location,
    capacity: form.capacity,
    managingUnit: form.managingUnit,
    projectionDevice: form.projectionDevice,
    computerConfig: form.computerConfig
  };

  try {
    await meetingRoomService.create(newRoomData);
    alert('添加成功！');
    handleReset(); 
    fetchMeetingRooms(); 
  } catch (error) {
    const errorMessage = error.response?.data || "添加失败，请检查网络或联系管理员。";
    alert(errorMessage);
    console.error("添加会议室失败:", error);
  }
};


// === vvv 【已升级】修改功能的函数 vvv ===
const handleUpdate = async () => {
  // 1. 检查是否已从表格中选择了一行
  if (!form.id) {
    alert('请先从左侧表格中点击您想修改的会议室！');
    return;
  }

  // 2. 准备要发送给后端的更新数据
  const updatedRoomData = {
    // roomNumber 字段后端不需要，因为它在URL里，但为了完整性可以保留
    roomNumber: form.id,
    name: form.name,
    address: form.location,
    capacity: form.capacity,
    managingUnit: form.managingUnit,
    projectionDevice: form.projectionDevice,
    computerConfig: form.computerConfig
  };

  // 3. 调用 API 服务发送 PUT 请求
  try {
    // 把要修改的会议室ID (form.id) 和新数据一起传过去
    await meetingRoomService.update(form.id, updatedRoomData);
    alert('修改成功！');
    handleReset();
    fetchMeetingRooms();
  } catch (error) {
    const errorMessage = error.response?.data || "修改失败，请检查网络或联系管理员。";
    alert(errorMessage);
    console.error("修改会议室失败:", error);
  }
};

// === vvv 【已升级】删除功能的函数 vvv ===
const handleDelete = async () => {
  // 1. 检查是否已从表格中选择了一行
  if (!form.id) {
    alert('请先从左侧表格中点击您想删除的会议室！');
    return;
  }

  // 2. 弹出一个确认框，防止误删
  const res = await uni.showModal({
    title: '请确认',
    content: `您确定要删除房号为【${form.id}】的会议室吗？这个操作无法撤销。`
  });

  // 3. 如果用户点击了“确认”
  if (res.confirm) {
    try {
      // 调用 API 服务发送 DELETE 请求
      await meetingRoomService.delete(form.id);
      alert('删除成功！');
      handleReset();
      fetchMeetingRooms();
    } catch (error) {
      const errorMessage = error.response?.data || "删除失败，请检查网络或联系管理员。";
      alert(errorMessage);
      console.error("删除会议室失败:", error);
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  gap: 5px;
}

.table-section {
  flex: 8; 
  min-width: 0;
}

.form-section {
  flex: 1;
}

.button-group {
  display: flex;
  gap: 10px;
}
.card-header {
  font-weight: bold;
}

:deep(.el-card__body) {
  padding: 10px; 
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

/* --- ↓↓↓ 为表格表头添加颜色的新样式 ↓↓↓ --- */
:deep(.el-table thead) {
  /* 设置表头文字颜色，可以根据喜好调整 */
  color: #333; 
}

:deep(.el-table th.el-table__cell) {
  /* 设置表头的背景颜色，这是一个清爽的浅灰色 */
  background-color: #f5f7fa;
}

</style>