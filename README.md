# 工厂产线3D监控系统

基于 React + Three.js 的工厂生产线三维实时监控可视化系统。

## 技术栈

- **构建工具**: Vite
- **框架**: React 18 + TypeScript
- **3D渲染**: @react-three/fiber + @react-three/drei + three.js
- **样式**: 内联于 index.html（无外部 CSS 文件）
- **数据**: 组件内模拟数据，无后端依赖

## 功能特性

- **3D产线布局**: 传送带、CNC加工中心、冲压机、焊接机械臂、质检系统、包装机按实际工艺顺序排列
- **状态指示**: 设备上方绿色/黄色/红色浮动气泡标识运行状态
- **悬浮详情**: 鼠标悬浮设备弹出详情面板，显示设备名称、运行时长、当前产能、产能利用率和故障预警
- **顶部数据栏**: 实时跳动显示今日产量、良品率、设备在线率、累计能耗
- **底部时间轴**: 拖动滑块回放过去8小时的产线状态变化，设备颜色随之切换
- **右侧工位列表**: 按工位排列显示操作员、当前工序、产量计数
- **异常告警**: 故障设备闪烁红色并发出告警提示

## 快速开始

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:5173

## 项目结构

```
wje-188/
├── index.html                  # 入口 HTML，含全部内联样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx                # React 入口
    ├── App.tsx                 # 主应用组件
    ├── vite-env.d.ts
    ├── data/
    │   └── factoryData.ts      # 模拟产线数据
    └── components/
        ├── Scene.tsx           # 3D 场景（Canvas + 灯光 + 地面）
        ├── Machine.tsx         # 单台设备 3D 模型
        ├── ConveyorBelt.tsx    # 动态传送带
        ├── StatusBubble.tsx    # 状态气泡
        ├── TopBar.tsx          # 顶部数据栏
        ├── BottomTimeline.tsx  # 底部时间轴
        ├── RightPanel.tsx      # 右侧工位列表
        └── DeviceDetail.tsx    # 设备悬浮详情面板
```

## 操作说明

- **旋转视角**: 鼠标左键拖拽
- **缩放**: 滚轮
- **平移**: 鼠标右键拖拽
- **查看设备详情**: 鼠标悬浮到任意设备
- **回放历史**: 拖动底部时间轴滑块
- **关闭告警**: 点击告警横幅右侧关闭按钮
