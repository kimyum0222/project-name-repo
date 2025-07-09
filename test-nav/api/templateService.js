// src/api/templateService.js

import axios from 'axios';

// 创建一个axios实例，用于配置基础URL和超时时间
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API的基础路径
  timeout: 10000, // 请求超时时间
});

// 导出包含所有API请求方法的对象
export default {
  /**
   * 获取所有模板
   * GET /api/templates
   */
  getAll() {
    return apiClient.get('/templates').then(res => res.data);
  },

  /**
   * 根据ID获取单个模板（你的页面暂时没用到，但可以备着）
   * GET /api/templates/{id}
   */
  getById(id) {
    return apiClient.get(`/templates/${id}`).then(res => res.data);
  },

  /**
   * 创建新模板
   * POST /api/templates
   * @param {object} templateData - 表单中的模板数据
   */
  create(templateData) {
    // 后端 @RequestBody 需要一个 JSON 对象
    return apiClient.post('/templates', templateData).then(res => res.data);
  },

  /**
   * 更新模板
   * PUT /api/templates/{id}
   * @param {string} id - 要更新的模板ID
   * @param {object} templateData - 更新后的模板数据
   */
  update(id, templateData) {
    return apiClient.put(`/templates/${id}`, templateData).then(res => res.data);
  },

  /**
   * 删除模板
   * DELETE /api/templates/{id}
   * @param {string} id - 要删除的模板ID
   */
  delete(id) {
    return apiClient.delete(`/templates/${id}`);
  },
};