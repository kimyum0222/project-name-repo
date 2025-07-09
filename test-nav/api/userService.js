import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const userService = {
  // 获取所有用户
  getAllUsers() {
    return axios.get(API_URL).then(response => response.data);
  }
};

export default userService;
