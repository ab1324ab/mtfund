# 基金助手v3.0.6

基金助手，实时查看您关注的基金，助您快速获取实时数据。

可以用来查看您的自选基金的实时估值情况，可以自由的增减自选基金。

## 介绍

在决定投资基金后，我迫切渴望找到一个工具，能一站式查看我的基金收益并管理投资操作。经过一番搜索，我确实找到了一个应用，其核心功能与我的需求颇为接近。然而，在实际使用过程中，我意识到该应用的某些功能与我个人的投资习惯并不完全契合，而我真正渴望的一些特性却遗憾地缺席。

幸运的是，我发现了该应用是基于开源代码构建的。起初，这仿佛为我开启了一扇窗，让我得以窥见个性化定制的可能。但好景不长，随着作者停止了后续版本源码的公开分享，我面临着一个新挑战。

不愿就此放弃，我采取了主动，决定在已获取的最新源代码基础上，动手进行个性化改造。这个过程虽不乏挑战，却也让我有机会深入理解软件背后的工作原理，并亲手实现了那些我梦寐以求的功能。通过这样的方式，我不仅满足了自己的需求，还意外地收获了编程技能的提升，让这次投资之旅增添了别样的意义。

首先输入基金代码添加基金，涨跌幅信息和收益信息可以以角标的形式展示在浏览器中，更加简便直观。可以在设置中单独开启显示份额与收益选项，在编辑中输入持有的份额，可以计算出每个基金的实时估值与收益，以及总收益。

## 主要功能

- 连续涨跌日监测
- 累计涨跌幅监测
- 基金平均线监测
- 顶涨跌提醒
- 底涨跌提醒
- 基金涨跌监测提醒
- 每日、每周、每月基金金额定投。
- 基金分组
- 实时角标提醒
- 单个基金特别关注
- 角标内容自定义，单个与全部基金，收益额与收益率
- 支持标准与暗色两种主题
- 基金列表与配置信息支持导入与导出
- 智能判断节假日，切换休市状态
- 支持设置份额或金额，查看当日估值收益
- 支持设置持仓成本价，查看持有收益
- 支持手动加仓减仓功能
- 支持账号登录功能，方便跨平台同步
- 交易日更新当日实际净值后，对应基金有 √ 提示
- 支持查看估值走势图，净值、收益等走势图
- 支持支持查看基金的股票持仓明细
- 支持查看基金基本信息与基金经理信息
- 自定义顶部指数内容
- 自定义基金列表展示内容
- 指数与基金拖拽排序功能
- 基金按照指定项排序功能
- 添加基金时支持按拼音、汉字、编码模糊搜索，支持批量添加
- 行情中心展示，两市资金、行业板块、北向资金、南向资金

## 框架介绍

基于[Vue](https://github.com/vuejs/vue) + [Webpack](https://github.com/webpack/webpack)构建的 vue 项目，使用了[vue-web-extension](https://github.com/Kocal/vue-web-extension/tree/v1)模板快速构建Chrome扩展项目，用到了[Element UI](https://github.com/ElemeFE/element)样式库与[ECharts](https://github.com/apache/echarts)图表库。

## 浏览器安装
- 手动安装：可以通过以下步骤手动安装.crx文件：

- 首先，关闭提示错误的页面。
- 然后，将`.crx`文件的扩展名更改为`.zip`，解压文件。
  打开谷歌浏览器的扩展管理页面`chrome://extensions/`。
  开启“开发者模式”。
  选择“加载已解压的扩展程序”，然后选择解压后的文件夹。

## 运行调试开发

需要 node 环境，先执行
`npm i`
安装依赖

调试模式执行
`npm run watch:dev`
生成 dist 文件夹，浏览器选择“加载已解压的扩展程序”

打包与发布先执行
`npm run build`
生成 dist 文件夹，再执行
`npm run build-zip`
通过从 manifest.json 文件中读取 name 和 version 字段,构建{name}-v{version}.zip 这种格式的压缩文件。

## 界面截图介绍
### 基础界面
![img.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img.png)

### 按钮展开
![img_1.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img_1.png)

### 编辑基金
![img_2.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img_2.png)

### 基金分组
![img_3.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img_3.png)
![img_4.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img_4.png)

### 定投买入、买入卖出记录
![img_5.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img_5.png)
![img_6.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img_6.png)
![img_7.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img_7.png)

### 涨跌历史记录
- 显示MA5线、MA10线、MA20线
![img_8.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img_8.png)
### 基金涨跌监测
- 连续涨跌日、累计涨跌幅、基金平均线、顶涨跌提醒、底涨跌提醒
![img_9.png](https://gitee.com/ab1324ab/mtfund/raw/master/image/img_9.png)

### 暗色模式、导入导出、角标金额

## 更新说明

### v3.0.6 
- 增加新基金涨跌监测提醒
- 连续涨跌日监测，累计涨跌幅监测，基金平均线监测，顶涨跌提醒，底涨跌提醒
- 修复(QDII)类基金收益计算显示错误

###  v3.0.5.1
- 增加新功能每日、每周、每月基金金额定投。
- 新增昨日涨跌列，设置界面同步增加控制按钮。
- 新增买入卖出记录列表。
- 历史净值在原有的图表基础上添加表格更直观。

### v3.0.5.0

- 增加基金分组。
- 修改菜单按钮旋转纽。

### v3.0.4

- 原支修改。
