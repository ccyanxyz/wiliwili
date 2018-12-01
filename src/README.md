# WiliWili

## 1.代码结构

```shell
./
├── README.md
├── app.js	// 分发路由
├── bin		// 程序入口
├── contract	// 代币合约
├── data	// 保存数据库数据
├── models	// 数据库Schema定义
├── node_modules	// 依赖模块
├── nodemon.json
├── package.json
├── public	// 资源文件
├── routes 	// 各个页面路由文件
├── utils	// 工具模块
└── views	// 前端页面ejs模版
```

## 2.运行

requirements: mongodb, nodejs

```shell
cd src	# you should be in src
mkdir data/db	
mongod --dbpath ./data/db	# start mongod
npm install	# install dependencies
npm start	# start, then go to http://localhost:3000
```

