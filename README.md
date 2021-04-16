# Nest DApp

## Getting Started


Testing Environment:

```bash
npm run dev
```

Staging:

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Tech Stack:

- [React](https://zh-hans.reactjs.org/)
- [Nextjs](https://www.nextjs.cn/)
- [TypeScript](https://typescript.bootcss.com/tutorials/react.html)
- [CSS Module](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)
- [next-localization](https://github.com/StarpTech/next-localization/tree/master/example)
- [redux toolkit](https://redux-toolkit.js.org/)
- [redux state management redux-localstorage-simple](https://github.com/kilkelly/redux-localstorage-simple)
- [react web3](https://github.com/NoahZinsmeister/web3-react)
- [Ethers.js](https://github.com/ethers-io/ethers.js/)

Code strcuture:

- pages 
  - _app.tsx Global env
  - index.tsx Homepage
  - income.tsx Income
  
- components 
  - common 
  - ui 
  - home 
  - income 
  
- abi 

- constants 
  - Contracts.json Contract related constants
  - enums.ts 
  
- store redux 
  - reducers.ts reducer
  - store.ts store
  - favorites 
  
- locales 
- hooks 
- utils  
- services  
- public  
- styles  
- next.config.js