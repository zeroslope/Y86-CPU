# Y86 -CPU

> a simple y86 cpu

## 环境配置

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

之后在浏览器(推荐`Chrome`,或其他现代浏览器)中打开`localhost:8080`,就可以看到Y86-CPU的界面。

如果没有`node.js`的环境，请直接打开`http://118.89.196.163/` 。

## 使用说明

建议开启全屏模式进行使用。

网站中初始的测试数据为`/src/test`文件夹下的`asum.yo`、`List_Sum.yo`、`Halt.yo`三个文件。

网站支持拖拽上传，仅支持`*.yo`文件，上传后将出现在最后一个`tab`中。

有五种控制按键，从左到右依次为`单步后退`、`暂停`、`自动运行`、`单步前进`、`Reset`。

网站中显示的数据有：`cycle`、`ZF OF CF`、`cpi`、`各个寄存器的值`、`写入代码之后内存的情况及变化`、`流水线的各个阶段的寄存器的值`、`最右侧的执行历史，点击可以跳转到之前执行的某个cycle`。

当流水线中寄存器数值发生变化时，会有相应的动画。

为了让动画效果更明显，默认频率的4Hz。

当切换`tab`后，执行状态会执行`Reset` 。

测试数据的内存不宜过大。

