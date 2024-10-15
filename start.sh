#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Ideaflow 项目启动脚本${NC}"
echo "=================================="

echo -e "${YELLOW}正在安装依赖...${NC}"
npm install

echo -e "${YELLOW}正在启动开发服务器...${NC}"
npm run dev