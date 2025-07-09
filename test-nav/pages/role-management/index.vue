<template>
  <main-layout>
    <view class="role-container">
      <el-card class="box-card role-panel" shadow="never">
        <template #header>
          <div class="card-header">
            <span>角色</span>
          </div>
        </template>
        <div class="action-area">
          <el-input v-model="roleInput" placeholder="请输入角色名称"></el-input>
          <div class="buttons">
            <el-button type="primary" size="small" @click="addRole">增加</el-button>
            <el-button size="small" @click="updateRole">修改</el-button>
            <el-button type="danger" size="small" @click="deleteRole">删除</el-button>
          </div>
        </div>
        <div class="role-list">
         <div
            v-for="role in roles"
            :key="role.id"
            class="role-item"
            :class="{ 'is-active': selectedRole && selectedRole.id === role.id }"
            @click="selectRole(role)"
          >
            {{ role.roleName }}
          </div>
        </div>
      </el-card>

      <el-card class="box-card user-panel" shadow="never">
        <template #header>
          <div class="card-header">
            <span>人员</span>
          </div>
        </template>
        <div class="action-area">
           <el-select v-model="userToAdd" placeholder="请选择要添加的人员" style="width: 100%;">
             <el-option
                v-for="user in allUsers"
                :key="user.id"
                :label="user.name + ' (' + user.id + ')'"
                :value="user.id"
              ></el-option>
           </el-select>
          <div class="buttons">
            <el-button type="primary" size="small" @click="addUserToRole">增加</el-button>
            <el-button type="danger" size="small" @click="removeUserFromRole">删除</el-button>
          </div>
        </div>
        <el-table :data="displayedMembers" style="width: 100%" height="450" @row-click="selectMember" highlight-current-row>
          <el-table-column prop="id" label="工号"></el-table-column>
          <el-table-column prop="name" label="人员"></el-table-column>
        </el-table>
      </el-card>

    </view>
  </main-layout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import roleService from '@/api/roleService.js';
import userService from '@/api/userService.js'; // 引入 userService

// --- 真实数据状态 ---
const allUsers = ref([]);
const roles = ref([]);
const listLoading = ref(true);

// --- 左侧角色面板逻辑 ---
const roleInput = ref('');
const selectedRole = ref(null);

// 获取所有数据
async function fetchData() {
  listLoading.value = true;
  try {
    // 并行获取角色和用户数据，速度更快
    const [rolesData, usersData] = await Promise.all([
      roleService.getAllRoles(),
      userService.getAllUsers()
    ]);
    roles.value = rolesData;
    allUsers.value = usersData;
  } catch (error) {
    console.error("获取初始数据失败:", error);
    alert('获取初始数据失败！');
  } finally {
    listLoading.value = false;
  }
}

onMounted(() => {
  fetchData();
});

const selectRole = (role) => {
  selectedRole.value = role;
  roleInput.value = role.roleName;
};

const addRole = async () => {
  if (!roleInput.value) return alert('角色名称不能为空！');
  try {
    await roleService.addRole({ roleName: roleInput.value });
    alert('增加成功！');
    roleInput.value = '';
    fetchData(); // 刷新所有数据
  } catch (error) {
    console.error("增加角色失败:", error);
    alert('增加角色失败！');
  }
};

const updateRole = async () => {
  if (!selectedRole.value) return alert('请先选择要修改的角色！');
  if (!roleInput.value) return alert('角色名称不能为空！');
  try {
    await roleService.updateRole(selectedRole.value.id, { roleName: roleInput.value });
    alert('修改成功！');
    roleInput.value = '';
    selectedRole.value = null;
    fetchData();
  } catch (error) {
    console.error("修改角色失败:", error);
    alert('修改角色失败！');
  }
};

const deleteRole = async () => {
  if (!selectedRole.value) return alert('请先选择要删除的角色！');
  const res = await uni.showModal({
    title: '请确认',
    content: `您确定要删除【${selectedRole.value.roleName}】吗？`
  });
  if (res.confirm) {
    try {
      await roleService.deleteRole(selectedRole.value.id);
      alert('删除成功！');
      roleInput.value = '';
      selectedRole.value = null;
      fetchData();
    } catch (error) {
      console.error("删除角色失败:", error);
      alert('删除角色失败！');
    }
  }
};

// --- 右侧人员面板逻辑 ---
const userToAdd = ref('');
const selectedMember = ref(null);

const displayedMembers = computed(() => {
  if (!selectedRole.value) return [];
  return allUsers.value.filter(user => selectedRole.value.memberIds.includes(user.id));
});

const addUserToRole = async () => {
  if (!selectedRole.value) return alert('请先在左侧选择一个角色！');
  if (!userToAdd.value) return alert('请从下拉框选择要添加的人员！');
  if (selectedRole.value.memberIds.includes(userToAdd.value)) {
    return alert('该人员已在此角色中！');
  }
  try {
    await roleService.addMemberToRole(selectedRole.value.id, userToAdd.value);
    userToAdd.value = '';
    fetchData(); // 刷新数据以更新成员列表
  } catch (error) {
    console.error("添加成员失败:", error);
    alert('添加成员失败！');
  }
};

const selectMember = (member) => {
  selectedMember.value = member;
};

const removeUserFromRole = async () => {
  if (!selectedRole.value) return alert('请先在左侧选择一个角色！');
  if (!selectedMember.value) return alert('请在右侧表格中点击选择要删除的人员！');
  const res = await uni.showModal({
    title: '请确认',
    content: `您确定要从【${selectedRole.value.roleName}】中移除人员【${selectedMember.value.name}】吗？`
  });
  if (res.confirm) {
    try {
      await roleService.removeMemberFromRole(selectedRole.value.id, selectedMember.value.id);
      selectedMember.value = null;
      fetchData();
    } catch (error) {
      console.error("删除成员失败:", error);
      alert('删除成员失败！');
    }
  }
};
</script>

<style scoped>
.role-container {
  display: flex;
  gap: 20px;
}
.role-panel {
  width: 300px;
  flex-shrink: 0;
}
.user-panel {
  flex-grow: 1;
}
.action-area {
  margin-bottom: 20px;
}
.buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.role-list {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  height: 400px;
  overflow-y: auto;
}
.role-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #e4e7ed;
}
.role-item:last-child {
  border-bottom: none;
}
.role-item:hover {
  background-color: #f5f7fa;
}
.role-item.is-active {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: bold;
}
</style>
