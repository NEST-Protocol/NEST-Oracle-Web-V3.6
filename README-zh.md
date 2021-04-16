# Nest DApp

## Getting Started

测试环境:

```bash
npm run dev
```

开发环境:
```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

技术栈
- [React](https://zh-hans.reactjs.org/)
- [Nextjs](https://www.nextjs.cn/)
- [TypeScript](https://typescript.bootcss.com/tutorials/react.html)
- [样式模块 CSS Module](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)
- [国际化 next-localization](https://github.com/StarpTech/next-localization/tree/master/example)
- [状态管理 redux toolkit](https://redux-toolkit.js.org/)
- [redux状态本地持久化存储 redux-localstorage-simple](https://github.com/kilkelly/redux-localstorage-simple)
- [react web3组件](https://github.com/NoahZinsmeister/web3-react)
- [以太坊工具包 提供Contract、Web3 Provider等方法](https://github.com/ethers-io/ethers.js/)

文件结构
- pages 页面主文件
  - _app.tsx 全局页面入口配置
  - index.tsx 首页
  - income.tsx 受益页
  
- components 组件文件夹
  - common 通用组件文件
  - ui ui基础组件文件
  - home 首页组件
  - income 收益页组件
  
- abi 相关合约ABI

- constants 固定值配置
  - Contracts.json 相关合约地址配置文件
  - enums.ts 全局枚举变量
  
- store redux 相关逻辑
  - reducers.ts reducer集成逻辑
  - store.ts store创建逻辑
  - favorites 交易对收藏模块
  
- locales 多语言配置目录
- hooks 通用hook文件
- utils 工具函数集合
- services 后端API接口配置
- public 静态资源文件夹
- styles 页面样式及通用样式文件
- next.config.js next项目配置，如webpack、开发环境反向代理