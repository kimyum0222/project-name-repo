import axios from 'axios';

const API_URL = 'http://localhost:8080/api/roles';

const roleService = {
  // 获取所有角色
  getAllRoles() {
    return axios.get(API_URL).then(response => response.data);
  },
  // 添加角色
  addRole(roleData) {
    return axios.post(API_URL, roleData).then(response => response.data);
  },
  // 修改角色
  updateRole(id, roleData) {
    return axios.put(`${API_URL}/${id}`, roleData).then(response => response.data);
  },
  // 删除角色
  deleteRole(id) {
    return axios.delete(`${API_URL}/${id}`);
  },
  // 为角色添加成员
  addMemberToRole(roleId, memberId) {
    return axios.post(`${API_URL}/${roleId}/members`, { memberId });
  },
  // 从角色中移除成员
  removeMemberFromRole(roleId, memberId) {
    return axios.delete(`${API_URL}/${roleId}/members/${memberId}`);
  }
};

export default roleService;
