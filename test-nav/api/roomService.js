// src/api/roomService.js

import axios from 'axios';

// 创建一个axios实例，用于配置基础URL和超时时间
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API的基础路径
  timeout: 10000, // 请求超时时间
});

// 导出包含所有会议室API请求方法的对象
export default {
  /**
   * 获取所有会议室
   * GET /api/rooms
   */
  getAllRooms() {
    return apiClient.get('/rooms').then(res => res.data);
  },
  // 如果未来需要，可以在这里添加其他会议室相关的API方法，例如 create, update, delete
};
