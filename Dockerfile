# 使用一个官方的 Node.js 镜像作为基础镜像。
# 项目 README 要求 node >= 18.x，我们选择一个长期支持版(LTS) 20。
# Alpine 版本更小，但可能缺少编译原生模块的工具。
FROM node:20-alpine

# `isolated-vm` 是一个原生模块，需要编译工具。
# 为 Alpine Linux 安装 `python`, `make` 和 `g++`。
RUN apk add --no-cache python3 make g++

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
# 这样可以利用 Docker 的缓存机制，仅在依赖变化时才重新安装
COPY package.json package-lock.json ./

# 安装项目依赖
# 使用 npm ci 可以确保从 package-lock.json 精确安装，更适合 CI/CD 和 Docker 构建
RUN npm ci

# 复制项目的所有其他文件
COPY . .

# 暴露服务器运行的端口
EXPOSE 3000

# 容器启动时运行的命令
CMD [ "node", "server.js" ]
