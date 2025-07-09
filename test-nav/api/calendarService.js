// src/api/calendarService.js
import axios from 'axios';

// 定义后端 API 的基础 URL
// 这里的端口号(8080)需要和你后端服务运行的端口号一致
const API_URL = 'http://localhost:8080/api'; // 将基础URL调整为更通用的 /api

const calendarService = {
  
  /**
   * 获取所有会议室资源 (用于日历左侧列表)
   */
  getResources() {
    return axios.get(`${API_URL}/calendar/resources`).then(response => response.data);
  },

  /**
   * 获取所有会议事件 (显示在日历上)
   */
  getEvents() {
    return axios.get(`${API_URL}/calendar/events`).then(response => response.data);
  },

  /**
   * 创建一个新的会议
   * @param {object} meetingRequest - 对应后端 NewMeetingRequest 的数据对象
   */
  createEvent(meetingRequest) {
    return axios.post(`${API_URL}/calendar/events`, meetingRequest).then(response => response.data);
  },

  /**
   * 获取所有用户 (用于联系人、召集人和内部参会人员)
   */
  getUsers() {
    // 对应 UserController.java 中的 /api/users 接口
    return axios.get(`${API_URL}/users`).then(response => response.data);
  },

  /**
   * 获取所有会议类型
   */
  getMeetingTypes() {
    // 对应 MeetingTypeController.java 中的 /api/meeting-types 接口
    return axios.get(`${API_URL}/meeting-types`).then(response => response.data);
  }
};

export default calendarService;