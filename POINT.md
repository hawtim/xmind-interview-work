## 基本需求

### 加载我们所提供的数据

使用 `csv-loader` 在 `vuex` 实现

> ```js
> import bill from '@/mock/bill.csv'
> import category from '@/mock/category.csv'
> ```

### 以列表的形式展示账单内容，并且提供下拉框选择月份进行筛选，其中列表中所展示的账单为选择月份的账单

> 使用 `elementui` 的 `date-picker` 实现月份选择，通过数组 filter 筛选出所选择月份的账单

### 支持使用者添加账单

> 使用 `elementui` 的 `dialog` 组件，并单独成独立的业务组件，考虑实际项目中的功能入口一般不止一个

### 简单地统计并展示所选月份的收入和支出总金额

> 通过数组的方法计算出对应的总收入和总支出，并展示在当前筛选条件后

## 进阶需求

### 对账单分类进行二次筛选；

> 支持通过月份和分类独立筛选，也支持两者联合筛选，并支持计算当前列表的总支出和总收入

### 对选择月份内的所有账单根据账单分类进行支出金额统计，并进行排序。

> 支持通过月份和分类独立筛选，也支持两者联合筛选，并支持计算当前列表的总支出和总收入



## 在 vue-cli@4 中如何使用 `elementui`

> vue-cli@4 中使用插件的形式，用 `vue add element`，具体参考
[快速上手-使用 vue-cli@3](https://element.eleme.cn/#/zh-CN/component/quickstart#shi-yong-vue-cli-3)

## csv-loader 配置异常

```bash
 error  in ./src/mock/bill.csv

Module parse failed: Identifier directly after number (2:17)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
| type,time,category,amount
> 0,1561910400000,8s0p77c323,5400
| 0,1561910400000,0fnhbcle6hg,1500
| 0,1563897600000,3tqndrjqgrg,3900
...
```

通过 vue.config.js 配置 csv-loader

```js
configureWebpack: {
    module: {
      rules: [
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        }
      ]
    },
```

## 时间处理工具库，dayjs vs momentjs

> `dayjs` 非常小，而且合适这个项目，不用 `moment` 的原因是本身库大并且打包后语言包过多，需要更多的配置来移除相应的冗余文件。

## 统计图表展示使用 v-chart

> 基于 `echart` 的封装，`echart` 的文档是比较繁琐的，对于简单的图表展示，使用这个上手效率高。

> npm i v-charts echarts -S

## 模拟的数据是无序的

> 把 csv 导入的数据，先时间倒序，基于时间戳的数字使用 sort 即可。字符串的 sort 就要另外的方式来排序。

## 如何精准按月将数据进行分块

> 原本考虑用时间范围，比如3月1号到3月31号的毫秒数时间间隔，将时间戳全部转换为字符串，通过对字符串的月份进行判断。避开一个月 28 天 30 天 31 天的问题。

## 新增账单时，现有列表里的账单分类消失

> ```js
> // 当前面为 undefined 的时候，因为现有列表里的 category 已经替换成中文
> // 新增的数据的 category 为数字字母串，走“或运算符”后的逻辑
> item.category = this.category[item.category] || item.category
> ```

## 列表要按月划分还是直接呈现列表

> 按月划分，实际用户需求在直接呈现列表的时，滚动页面会有一种晕眩感
按月划分有月份行的视觉过渡。

## 考虑如何做分页

> 分页组件用 elementui 的，数据的加载通过搭建一个 api 层，
> 接口返回固定条目的 bill 列表，将拿到的较前月份（列表规则默认时间倒序）的 `oldBill.concat(...newBill)`，再 format 一次，功能上就像加载更多数据。


## dialog 点击关闭按钮或者点击遮罩层报错

> element 的 dialog 独立成组件之后，点击关闭按钮或者点击遮罩层会触发组件自身的关闭事件，由于使用 visible.sync 导致在组件里改变父组件传递的 show 的值，进而报错。

> 移除 .sync 修饰符，绑定 @close 时间，emit 事件给父组件来关闭弹窗

## pc 端的界面设计

部分参考了随手记的记账功能

## TODO:移动端的界面设计

参考微信记账本小程序

## 简单思考了一下移动端和 PC 端的架构

1. 使用不同的命令打包确保可以独立分开部署，避免双端版本发布耦合，减低风险
2. 可以共享工具函数，工具函数大的话用 node_modules 管理
3. 统一技术栈为 vue 的生态，降低人力切换成本，提高开发效率
4. 可针对性的过渡到 ts
5. 可共享 iconfont 图标资源
6. PC 使用 elementui 移动端使用 vantui

## 使用 jest 对组件基本功能进行测试

> Jest Could not locate module FileName.css (mapped as identity-obj-proxy)

如何解决

模拟一个对象来处理导入的 css 文件，[官方链接](https://jestjs.io/docs/en/webpack#mocking-css-modules)

```
make sure you have identity-obj-proxy in your devDependencies

"devDependencies": {
  "identity-obj-proxy": "^3.0.0",
  ...
}
if not, run

npm install --save-dev identity-obj-proxy
```

## jest 报 vuex 和 elementui 的相关问题

```js
// 通过注入一个本地创建的 vue 实例来挂载，避免影响到正常业务中使用的 vue
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(ElementUI)
```

## jest 总是有 api 即将废弃的警告

`localVue.config.silent = true`

## api 层，本地化使用 indexedDB，服务化使用 node koa 来搭建


## "Evaluating the object store's key path did not yield a value." after upgrade

设置主键递增

```js
var store = db.createObjectStore('bill', {keyPath: "id", autoIncrement: true});

```

## indexedDB 上手比较复杂

https://github.com/ascott1/indexeddb-demo/blob/master/js/main.js
https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API
https://www.ruanyifeng.com/blog/2018/07/indexeddb.html


## indexedDB 的连表查询

## 测试模式下加载模拟数据，正式环境下没有初始数据

## indexedDB 无法连接，版本问题，需要通过 upgrade 来升级版本

## The object store uses out-of-line keys and has no key generator and the key parameter was not provided.


