# 1.模式设计

* 类似bilibili的模式，用户可上传内容，也可在网站浏览内容

* 发行一种平台币，作为网站的经济激励
* 奖励细则：
  * up主上传好的视频资源，获用户点赞越多，获得的代币奖励越多
  * 用户浏览网站视频，可根据浏览时长给予代币奖励
  * 用户注册，奖励一定量的代币
  * 用户每日登录可获得固定数量的代币奖励
  * 接入YouTube的搜索API，用户可在本站搜索YouTube内容，返回结果包含两部分：本站相关的内容和YouTube上的内容，如果本站有用户需要的内容，可直接观看；如果没有，可翻墙的用户直接通过搜索返回的YouTube链接跳转到YouTube，不会翻墙的可以用自己的代币发起一份悬赏，鼓励up主从YouTube搬运资源到本站

# 2.细节

* 前端：
  * 五个页面：首页、搜索结果展示页、视频播放页、悬赏列表页、个人中心
  * 一些简单的交互
* 后端：
  * 数据库（sqlite或MySQL），用户表，资源表（图片、视频存路径）等，接口用Python封装好，方便调用
  * flask route，和前端配合
  * 接入YouTube的搜索API

# 3.更进一步

* 可以尝试在以太坊上发行我们的平台币，类似传统的网站积分，发行总量固定，比如100000000，开发团队保留30%，20%用作运营基金，50%作为平台用户奖励

### 以上只是一个简单设想，实现起来有难度，大家有不同意见就在群里提出来




## 初步分锅，先实现基础功能

### 前端
	推荐Vue.js
	首页：展示现在视频库里面的视频之类的（缩略图）
	个人主页：用户信息、以及发布的视频
	播放页：视频播放（怎么和后端接起来是个问题，最好边加载边播放）
	上传页：视频上传，可加上一句话描述

### 后端
	nodejs，处理GET/POST请求，返回前端需要的json格式数据
	数据库：
		个人信息表，个人发布的视频表，所有视频资源的表（id，视频路径等，描述）
		常用的数据库查询操作封装好，返回json格式数据，方便调用
	搜索：本地搜索，在所有资源列表里根据资源描述和搜索关键词进行匹配
		youtube搜索，调用youtube提供的api



## 前端实现的一些问题

​	现在所有代码都在src文件夹：

```
./
├── README.md
└── src
    ├── app.js
    ├── bin
    ├── data
    ├── models
    ├── node_modules
    ├── package.json
    ├── public
    ├── routes
    ├── utils
    └── views

9 directories, 3 files
```

前端涉及到两个文件夹：public和views，其中public文件夹是css，js，images等资源文件，views是ejs模板文件（就是之前的HTML），文件名小写

ejs模板文件注意：

* 页面跳转：<a href='/'>是跳转到首页，<a href='/register'>是跳转到注册页，用相对路径，不要用href='xxx.html'

* register和login页面：

  ​	1.需要提交给后端处理的数据字段，form标签要注明 method="post"

  ​	2.submit按钮和填写内容的框放在同一个form里面，这样点击submit后才能把这个form里面的所有数据post到后端

  ​	3.input标签需要注明name属性，否则后端没办法根据名字获取input的值

  ​	4.password字段type应该是"password"不是"text"

  修改后的login表单部分：

  ```html
  <form method="post">
      <div>
          <span>Email Address<label>*</label></span>
          <input type="text" name="email">
      </div>
      <div>
          <span>Password<label>*</label></span>
          <input type="password" name="password">
      </div>
      <input type="submit" value="Log in">
  </form>
  ```

大部分问题我已经改过来了，注册登录和后端已经接起来了，前端还有一些需要修改的地方：

​	1.public/css/style.css里面：

```css
background: url('../images/search.png')no-repeat  3px -2px;
```

​	images里面没有search.png

​	2.login.ejs和register.ejs文件：

​	把密码输入框的type改成password之后输入框样式变了：

![1](/Users/apple/Desktop/junior/DAMCourse-2018/wiliwili/1.png)

​	submit按钮和上面的输入框放到一个form里面之后样式也变了，需要调整一下



修改后按照下面的步骤运行程序查看效果：

1.把github上的master分支clone到本地：

```shell
git clone https://github.com/C790266922/wiliwili.git
```

2.进入clone下来的文件夹，安装nodejs模块（需要先安装好node和npm）：

```shell
npm install
```

3.运行：

```shell
npm start
```

4.浏览器 http://127.0.0.1:3000 查看效果



新添加页面的话就把ejs模板文件放在views里面，css、图片、js放在public对应的文件夹里面，但是需要从浏览器去访问这个页面的话还需要添加路由

具体步骤：

1.在routes文件夹新建一个xxx.js文件，仿照routes里面其他js文件写好处理get请求post请求的函数

2.在app.js里面添加：

```js
...
var xxxRouter = require('./routes/xxx');
...
app.use('/xxx', xxxRouter);
```

3.npm start运行程序，浏览器访问http://127.0.0.1:3000/xxx 查看刚刚添加的页面