# youngjs-admin

Youngjs 后台管理系统前端，基于 Vue 3 + Vite + TypeScript + Pinia + Element Plus 构建。

## 技术栈

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) + `<script setup>`
- [Vite](https://vitejs.dev/) 构建
- [Pinia](https://pinia.vuejs.org/) 状态管理
- [Vue Router](https://router.vuejs.org/) 动态路由（根据后端菜单树动态注册）
- [Element Plus](https://element-plus.org/) 组件库
- [ECharts](https://echarts.apache.org/) 图表
- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) / [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 自动导入

## 功能特性

- 登录鉴权（JWT，token 存储与自动注入）
- 动态路由与菜单（依据后端返回的菜单树生成）
- 系统管理：用户、角色、菜单、参数、定时任务
- 多标签页（TagsView）、面包屑、侧边栏折叠、主题切换
- ECharts 仪表盘
- 错误页（403 / 404）

## 快速开始

环境要求：Node.js 18+、pnpm。

```bash
# 安装依赖
pnpm install

# 启动开发服务（默认端口 5173）
pnpm dev

# 类型检查
pnpm type-check

# 构建生产包
pnpm build

# 代码检查
pnpm lint
```

### 后端代理

开发环境默认将 `/admin` 接口代理到 `http://localhost:3001`（youngjs-last 服务），可通过 [.env.development](.env.development) 中的 `VITE_PROXY_TARGET` 修改。

## 目录结构

```
src/
├── api/          # 接口请求
├── assets/       # 静态资源与样式
├── components/   # 通用组件（EChart、IconPicker）
├── layout/       # 布局（侧边栏、导航栏、标签页、面包屑）
├── router/       # 路由配置、守卫、动态路由、视图映射
├── store/        # Pinia 状态（app、permission、tagsView、user）
├── types/        # TypeScript 类型
├── utils/        # 工具（request、auth、theme、icons）
└── views/        # 页面（登录、仪表盘、系统管理、个人中心、错误页）
```

## 相关项目

- [youngjs-core](https://gitee.com/FenDou2014/youngjs-core)：Youngjs 框架核心（MVC、ORM、队列、任务调度）
- [youngjs](https://gitee.com/FenDou2014/youngjs)：框架示例工程（配套后端服务）
- [youngjs-admin](https://gitee.com/FenDou2014/youngjs-admin)：本后台管理系统
