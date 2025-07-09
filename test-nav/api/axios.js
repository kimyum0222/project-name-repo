import axios from 'axios';

// 1. 创建 Axios 实例
const apiClient = axios.create({
  // 基础 URL - 非常重要！
  // 这里的值必须和你后端服务运行的地址和端口完全匹配
  baseURL: 'http://localhost:8080/api', 

  // 超时设置
  timeout: 5000, 

  // 默认请求头
  headers: {
    'Content-Type': 'application/json',
  }
});

// 2. (可选但推荐) 请求拦截器 - 将来可以用来统一添加 Token
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里统一处理认证 Token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. (可选但推荐) 响应拦截器 - 将来可以用来统一处理错误
apiClient.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 我们通常只关心 data 部分
    return response.data;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    console.error('API Error:', error);
    // 这里可以做全局的错误处理
    return Promise.reject(error);
  }
);

// 4. 导出配置好的实例
export default apiClient;