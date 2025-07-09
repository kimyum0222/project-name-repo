<template>
  <main-layout>
    <view class="service-container">
      <el-card class="box-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>信息编辑区</span>
          </div>
        </template>
        <el-form :model="form" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="会议服务">
                <!-- 关键修改：v-model 绑定到 form.serviceName -->
                <el-input v-model="form.serviceName" placeholder="请输入服务名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否停用">
                <el-checkbox v-model="form.disabled" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">添 加</el-button>
            <el-button @click="handleUpdate">修 改</el-button>
            <el-button @click="handleReset">重 置</el-button>
            <el-button type="danger" @click="handleDelete">删 除</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="box-card" shadow="never" style="margin-top: 20px;">
        <template #header>
          <div class="card-header">
            <span>服务信息</span>
          </div>
        </template>
        <!-- 注意：这里的 :data="tableData" 会绑定下面 script 里的真实数据 -->
        <el-table :data="tableData" style="width: 100%" height="450" @row-click="handleRowClick" highlight-current-row>
          <el-table-column type="index" label="序号" width="80" />
          <!-- 关键修改：prop="serviceName" 必须和后端模型字段名一致 -->
          <el-table-column prop="serviceName" label="会议服务" />
          <el-table-column prop="disabled" label="停用" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.disabled ? 'danger' : 'success'">
                {{ scope.row.disabled ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </view>
  </main-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'; // 引入 onMounted
import MainLayout from '@/layouts/MainLayout.vue';
import serviceItemService from '@/api/serviceItemService.js'; // 引入我们新的API服务

// 表格数据，初始化为空数组，等待从后端获取
const tableData = ref([]);
const listLoading = ref(true);

// 选中的行的ID，用于修改和删除
const selectedId = ref(null);

// 表单数据，注意字段名和后端模型对应
const form = reactive({
  serviceName: '',
  disabled: false
});

// 从后端获取所有服务项的函数
async function fetchServices() {
  listLoading.value = true;
  try {
    tableData.value = await serviceItemService.getAll();
  } catch (error) {
    console.error("获取服务列表失败:", error);
    alert('获取服务列表失败！');
  } finally {
    listLoading.value = false;
  }
}

// 在页面加载时自动获取数据
onMounted(() => {
  fetchServices();
});


// 点击表格行，填充表单
const handleRowClick = (row) => {
  selectedId.value = row.id;
  form.serviceName = row.serviceName; // 字段名对应
  form.disabled = row.disabled;
};

// 重置表单
const handleReset = () => {
  selectedId.value = null;
  form.serviceName = '';
  form.disabled = false;
};

// 添加
const handleAdd = async () => {
  if (!form.serviceName) {
    alert('“会议服务”名称不能为空！');
    return;
  }
  try {
    // 直接用 form 对象，因为它的字段名已经和后端匹配
    await serviceItemService.create(form);
    alert('添加成功！');
    handleReset();
    fetchServices(); // 刷新列表
  } catch(error) {
    console.error("添加服务失败:", error);
    alert('添加服务失败！');
  }
};

// 修改
const handleUpdate = async () => {
  if (selectedId.value === null) {
    alert('请先从下方表格中点击选择要修改的行！');
    return;
  }
  try {
    await serviceItemService.update(selectedId.value, form);
    alert('修改成功！');
    handleReset();
    fetchServices(); // 刷新列表
  } catch(error) {
    console.error("修改服务失败:", error);
    alert('修改服务失败！');
  }
};

// 删除
const handleDelete = async () => {
  if (selectedId.value === null) {
    alert('请先从下方表格中点击选择要删除的行！');
    return;
  }
  
  const res = await uni.showModal({
      title: '请确认',
      content: `您确定要删除【${form.serviceName}】吗？`
  });

  if (res.confirm) {
    try {
      await serviceItemService.delete(selectedId.value);
      alert('删除成功！');
      handleReset();
      fetchServices(); // 刷新列表
    } catch(error) {
      console.error("删除服务失败:", error);
      alert('删除服务失败！');
    }
  }
};
</script>

<style scoped>
.box-card {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
.card-header {
  font-weight: bold;
}
</style>
