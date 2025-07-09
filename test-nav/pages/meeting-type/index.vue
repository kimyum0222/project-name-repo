<template>
  <main-layout>
    <view class="meeting-type-container">
      <el-card class="box-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>信息编辑区</span>
          </div>
        </template>
        <el-form :model="form" label-width="100px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="会议类型">
                <!-- 关键修改：v-model 绑定到 form.typeName -->
                <el-input v-model="form.typeName" placeholder="请输入会议类型" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="类型备注">
                <el-input v-model="form.remark" placeholder="请输入备注信息" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
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
            <span>类型信息</span>
          </div>
        </template>
        <el-table :data="tableData" style="width: 100%" height="400" @row-click="handleRowClick" highlight-current-row>
          <el-table-column type="index" label="序号" width="80" />
          <!-- 关键修改：prop="typeName" 必须和后端模型字段名一致 -->
          <el-table-column prop="typeName" label="会议类型" />
          <el-table-column prop="remark" label="类型备注" />
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
import { ref, reactive, onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import meetingTypeService from '@/api/meetingTypeService.js'; // 引入我们新的API服务

// --- 真实数据状态 ---
const tableData = ref([]);
const listLoading = ref(true);
const selectedId = ref(null);

// 表单数据，注意字段名和后端模型对应
const form = reactive({
  typeName: '',
  remark: '',
  disabled: false
});

// 从后端获取所有会议类型的函数
async function fetchMeetingTypes() {
  listLoading.value = true;
  try {
    tableData.value = await meetingTypeService.getAll();
  } catch (error) {
    console.error("获取会议类型列表失败:", error);
    alert('获取会议类型列表失败！');
  } finally {
    listLoading.value = false;
  }
}

// 在页面加载时自动获取数据
onMounted(() => {
  fetchMeetingTypes();
});

// 点击表格行时，将数据填充到上方表单
const handleRowClick = (row) => {
  selectedId.value = row.id;
  form.typeName = row.typeName;
  form.remark = row.remark;
  form.disabled = row.disabled;
};

// 重置表单和选中状态
const handleReset = () => {
  selectedId.value = null;
  form.typeName = '';
  form.remark = '';
  form.disabled = false;
};

// 添加新类型
const handleAdd = async () => {
  if (!form.typeName) {
    alert('“会议类型”不能为空！');
    return;
  }
  try {
    // 直接用 form 对象，因为它的字段名已经和后端匹配
    await meetingTypeService.create(form);
    alert('添加成功！');
    handleReset();
    fetchMeetingTypes(); // 刷新列表
  } catch(error) {
    console.error("添加失败:", error);
    alert('添加失败，可能类型名称已存在！');
  }
};

// 修改选中的类型
const handleUpdate = async () => {
  if (selectedId.value === null) {
    alert('请先从下方表格中点击选择要修改的行！');
    return;
  }
  try {
    await meetingTypeService.update(selectedId.value, form);
    alert('修改成功！');
    handleReset();
    fetchMeetingTypes(); // 刷新列表
  } catch(error) {
    console.error("修改失败:", error);
    alert('修改失败！');
  }
};

// 删除选中的类型
const handleDelete = async () => {
  if (selectedId.value === null) {
    alert('请先从下方表格中点击选择要删除的行！');
    return;
  }
  
  const res = await uni.showModal({
      title: '请确认',
      content: `您确定要删除【${form.typeName}】吗？`
  });

  if (res.confirm) {
    try {
      await meetingTypeService.delete(selectedId.value);
      alert('删除成功！');
      handleReset();
      fetchMeetingTypes(); // 刷新列表
    } catch(error) {
      console.error("删除失败:", error);
      alert('删除失败！');
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
