// src/api/meetingService.js (假设您有一个这样的目录结构)
import axios from 'axios';

// 定义后端 "会议查询" API 的基础 URL
// 这里的端口号(8080)需要和你后端服务运行的端口号一致
const API_URL = 'http://localhost:8080/api/meetings'; // <-- 注意：这是新的 API 路径

const meetingService = {

  /**
   * 获取会议明细列表
   * @param {object} params - 包含查询参数的对象，如 startDate, endDate, status, showAll
   */
  getMeetings(params) {
    return axios.get(API_URL, { params }).then(response => response.data);
  },

  /**
   * 创建一个新的会议明细
   * @param {object} meetingData - 对应后端 Meeting 实体的数据对象
   */
  createMeeting(meetingData) {
    return axios.post(API_URL, meetingData).then(response => response.data);
  },

  /**
   * 更新一个会议明细
   * @param {number} id - 会议的 ID
   * @param {object} meetingData - 包含更新内容的会议数据对象
   */
  updateMeeting(id, meetingData) {
    return axios.put(`${API_URL}/${id}`, meetingData).then(response => response.data);
  },

  /**
   * 删除一个会议明细
   * @param {number} id - 会议的 ID
   */
  deleteMeeting(id) {
    return axios.delete(`${API_URL}/${id}`).then(response => response.data);
  }
};

export default meetingService;