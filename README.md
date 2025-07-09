🌟 项目简介
这是一个高效的会议室管理系统，旨在简化会议的预订、管理和追踪流程。系统涵盖了从用户登录到会议排程、查询及详细管理的全方位功能，支持创建周期性会议模板，并提供会议室、角色、类型和服务的精细化管理。

✨ 功能特性
用户登录： 安全的用户认证系统。
我的会议： 展示用户个人相关的所有会议信息。
会议日历： 直观的日历视图，方便用户查看和安排会议。
会议查询： 强大的搜索功能，帮助用户快速查找特定会议。
周期会议模板： 支持创建和管理重复性会议的模板，提高预订效率。
会议明细管理：
会议室管理： 对会议室进行添加、编辑、删除和状态管理。
会议角色管理： 定义和分配会议参与者角色。
会议类型管理： 定义不同类型的会议（如项目会议、培训等）。
会议服务管理： 管理会议所需的服务（如投影仪、茶水等）。

🛠️ 技术栈
本项目采用主流的前后端分离架构，确保了高效开发和灵活部署。
前端
Vue.js： 渐进式 JavaScript 框架，用于构建用户界面。
Vue Router： 官方路由管理器，用于单页面应用的导航。
其他相关库： ( Axios 用于 HTTP 请求，Element UI)

后端
Java： 后端开发语言。
Spring Boot： 基于 Spring 框架的微服务开发框架，简化了后端应用的构建和部署。
[数据库]： H2 。
[数据访问层]： Spring Data JPA 。
[构建工具]： Maven 。

🚀 快速开始 (安装与运行)
以下是在本地搭建并运行该会议室管理系统的步骤。

1. 克隆仓库
首先，将项目仓库克隆到你的本地机器：

Bash
git clone https://github.com/kimyum0222/project-name-repo.git
cd project-name-repo

2. 后端设置 (bookroom 文件夹)

进入后端项目目录 bookroom，安装依赖并配置数据库：

Bash
cd bookroom
数据库配置：

你需要在 bookroom 文件夹下的 Spring Boot 项目中找到或创建数据库配置文件。

使用 Maven 或 Gradle 构建你的 Spring Boot 项目：

Bash
# 如果使用 Maven
./mvnw clean install # 清理并打包项目
java -jar target/[你的jar包名称].jar # 运行打包后的jar文件

# 或者在开发环境中直接运行（如果你使用IDE如IntelliJ IDEA，通常可以直接运行主类）

# 如果使用 Maven
./mvnw spring-boot:run

# 如果使用 Gradle
./gradlew bootRun
后端服务通常会在 http://localhost:8080 (Spring Boot 默认端口) 运行。

3. 前端设置 (test-nav 文件夹)

打开一个新的终端窗口，进入前端项目目录 test-nav，安装依赖：

Bash
cd ../test-nav
npm install 
环境变量配置 (.env 文件):

Code snippet
VUE_APP_API_BASE_URL=http://localhost:8080/api # 确保这个地址指向你本地运行的后端服务及API前缀
运行前端应用：

Bash
npm run serve # 通常是 Vue CLI 项目的启动命令
前端应用通常会在 http://localhost:5173 运行，并自动打开浏览器。

📂 项目结构
一个简化的项目文件结构如下：

.
├── bookroom/                 # 后端 Spring Boot 应用
│   ├── src/                  # Java 源代码
│   │   ├── main/
│   │   │   ├── java/         # Java 代码（Controllers, Services, Repositories, Models等）
│   │   │   └── resources/    # 配置文件（application.properties/yml）、静态资源等
│   │   └── test/             # 测试代码
│   ├── pom.xml               # Maven 配置文件（或 build.gradle）
│   └── ...                   # 其他后端相关文件
├── test-nav/                 # 前端 Vue.js 应用
│   ├── api/                  # Vue 源代码
│   ├──layouts/               # 页面顺序整理
│   ├──pages/                 # 页面组件（登录页、我的会议、会议日历等）
│   ├──static/                # 存放静态资源文件
│   ├──unpackage/             # 图片、图标等
│   ├── main.js               # 前端相关配置
│   ├── pages.json            # 图片、图标等
│   └── ...                   # 其他前端相关文件
├── .gitignore                # Git 忽略文件配置
└── README.md                 # 项目说明文件
🤝 贡献指南 (可选)
如果你欢迎其他人为你的项目贡献代码，请说明贡献流程：

Fork (分叉) 本仓库到你的 GitHub 账号。

克隆 你分叉后的仓库到本地。

从 main 分支 创建 一个新的功能分支 (git checkout -b feature/your-awesome-feature)。

在你的功能分支上 进行更改并提交 (git commit -m 'feat: add your feature description')。

将你的分支 推送到 你的分叉仓库 (git push origin feature/your-awesome-feature)。

在 GitHub 上 打开一个 Pull Request (PR) 到原仓库的 main 分支，详细描述你的更改。


📞 联系方式
如果你有任何问题或建议，欢迎通过以下方式联系我：

GitHub： @kimyum0222

邮箱： [kimyum@163.com]
