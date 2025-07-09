import axios from 'axios';

// 定义我们后端 "会议服务" API 的基础 URL
const API_URL = 'http://localhost:8080/api/services';

const serviceItemService = {
  
  /**
   * 获取所有服务项
   */
  getAll() {
    return axios.get(API_URL).then(response => response.data);
  },

  /**
   * 添加一个新的服务项
   * @param {object} serviceData - 包含 serviceName 和 disabled 的对象
   */
  create(serviceData) {
    return axios.post(API_URL, serviceData).then(response => response.data);
  },

  /**
   * 修改一个已有的服务项
   * @param {number} id - 要修改的服务项的ID
   * @param {object} serviceData - 新的服务项数据
   */
  update(id, serviceData) {
    return axios.put(`${API_URL}/${id}`, serviceData).then(response => response.data);
  },

  /**
   * 删除一个服务项
   * @param {number} id - 要删除的服务项的ID
   */
  delete(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
};

export default serviceItemService;
