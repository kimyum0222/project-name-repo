import axios from 'axios';

// 定义我们后端 API 的基础 URL
// 我们的 Spring Boot 服务运行在 8080 端口
const API_URL = 'http://localhost:8080/api/rooms';

// 创建一个 service 对象
const meetingRoomService = {
  
  /**
   * 获取所有会议室列表
   * 这个函数对应你 Vue 文件里的 `meetingRoomService.getAll()`
   */
  getAll() {
    // 使用 axios 发送 GET 请求到 API_URL
    // .then() 用来处理返回的数据，我们只需要 data 部分
    return axios.get(API_URL).then(response => response.data);
  },

  /**
   * 添加一个新的会议室
   * (为了未来的“添加”功能准备)
   */
  create(roomData) {
    // 发送 POST 请求到 API_URL
    return axios.post(API_URL, roomData).then(response => response.data);
  },

  /**
   * 修改一个已有的会议室
   * (为了未来的“修改”功能准备)
   */
  update(roomNumber, roomData) {
    // 发送 PUT 请求到 /api/rooms/{roomNumber}
    return axios.put(`${API_URL}/${roomNumber}`, roomData).then(response => response.data);
  },

  /**
   * 删除一个会议室
   * (为了未来的“删除”功能准备)
   */
  delete(roomNumber) {
    // 发送 DELETE 请求到 /api/rooms/{roomNumber}
    return axios.delete(`${API_URL}/${roomNumber}`).then(response => response.data);
  }
};

export default meetingRoomService;