// src/api/meetingTypeService.js
import axios from 'axios';

// 创建一个axios实例，用于配置基础URL和超时时间
// 你的后端服务地址是 http://localhost:8080
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API的基础路径
  timeout: 10000, // 请求超时时间
});

// 导出包含所有会议类型API请求方法的对象
const meetingTypeService = {
  /**
   * 获取所有会议类型 (包括停用和启用，通常用于管理界面)
   * GET /api/meeting-types
   */
  getAll() {
    return apiClient.get('/meeting-types').then(res => res.data);
  },

  /**
   * 【新增方法】 获取所有未被停用的会议类型 (用于新建会议等需要过滤的页面)
   * GET /api/meeting-types/enabled
   */
  getEnabled() {
    return apiClient.get('/meeting-types/enabled').then(res => res.data);
  },

  /**
   * 根据ID获取单个会议类型（如果需要）
   * GET /api/meeting-types/{id}
   */
  getById(id) {
    return apiClient.get(`/meeting-types/${id}`).then(res => res.data);
  },

  /**
   * 创建新会议类型
   * POST /api/meeting-types
   * @param {object} typeData - 包含 typeName, remark, disabled 等字段的对象
   */
  create(typeData) {
    return apiClient.post('/meeting-types', typeData).then(res => res.data);
  },

  /**
   * 更新会议类型
   * PUT /api/meeting-types/{id}
   * @param {string} id - 要更新的会议类型ID
   * @param {object} typeData - 更新后的会议类型数据
   */
  update(id, typeData) {
    return apiClient.put(`/meeting-types/${id}`, typeData).then(res => res.data);
  },

  /**
   * 删除会议类型
   * DELETE /api/meeting-types/{id}
   * @param {string} id - 要删除的会议类型ID
   */
  delete(id) {
    return apiClient.delete(`/meeting-types/${id}`);
  },
};

export default meetingTypeService;