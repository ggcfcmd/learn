# 概念

babel 是一个 JavaScript 编译器，旨在将 ES6 及以上的语法编写的代码转化成向后兼容的 JavaScript 语法，以便于代码可以在当前或者旧版本浏览器中正常运行（相当于 postcss）。整体采用插件化架构，开箱即用，灵活，很好地实现不同功能之间的解耦

## 编译流程

parse -> traverse -> generate

### parse

parse 是最基本的阶段，主要工作是把输入的源代码字符串经过词法分析、语法分析转化成能够后续处理的 AST 中间代码表示结构，AST 遵循 estree 规范，此阶段用到 @babel/parser

### traverse

traverse 阶段主要是对 parse 阶段生成的 AST 进行深度优先遍历，遍历的方式根据 type 类型决定分支是什么从而往下遍历，此阶段用到 @babel/traverse 和 @babel/types

### generate

此阶段会将 traverse 遍历修改的 AST 转化成最终的源码，只不过在遍历 AST 过程中会根据每一个单元的 type 类型调用不同的 generate 函数输出不同的源代码，此阶段用到 @babel/generate，其中会用到一个设计模式 -- 访问者模式（定义在下面）

generate 另一个比较重要的点是可以配置是否需要输出 sourcemap，这是一种编译后得到的代码与源码的映射。其存在的好处一是开发阶段可以快速定位源码位置，非常方便；二是上线的时候通过对源代码和对应的 sourcemap 分开部署，可以根据 sourcemap 快速定位源码位置以便捕获线上错误

## babel 的 Plugin

### 概念

babel 经过 parse、traverse、generate 几个抽象的过程后将高级源码转化成低级源码，而 plugin 就是对具体语法转化的实现

· @babel/parser 解析源码得到 AST
· @babel/traverse 遍历 AST
· @babel/types 用于构建 AST 节点和校验 AST 节点类型
· @babel/generate 打印 AST，生成目标代码和 sourcemap

### 访问者模式（Visitor Pattern）

在访问者模式中，我们使用了一个访问者类，他改变了目标元素的执行算法。通过这种方式，元素的执行算法可以随着访问者改变而改变。而在当前场景下，访问者既是一个用于 AST 遍历的模式，简单的说他就是一个对象，定义了用于在一个树状结构中获取具体节点的方法。当访问者把他用于遍历中时，每当在树中遇见一个对应类型，都会调用该类型对应的方法

### plugin 分类

babel 根据解析过程以及语言特性的分类，将 plugin 分为了 syntax、transform、proposal 三种类型，如果项目中使用了 babel 可以在 node_modules 的@babel 文件夹中发现 plugin-syntax-xxx、plugin-transform-xxx、plugin-proposal-xxx 开头的插件

#### syntax

syntax 插件只是对 manipulateOptions 钩子函数的实现，目的就是让 babel 在解析过程中可以支持特定的语法，避免解析不出来报错

#### transform

transform plugin 中大多是对高级语法的转化实现，比如各种 es20xx 语言特性、typescript、jsx 等语言特性等。其中会实现不同 AST 单元的具体转换行为，所以要基于 parse 阶段语法解析的结果来做，所以通常 @babel/plugin-transform-xxx 都会引用继承 @babel/plugin-syntax-xxx

#### proposal

proposal plugin 用来处理未加入语言标准特性的 AST 转换插件，其本质和 transform 一样，都是做转换，只是为了和标准特性区分开来，所以把非标准的单独拎出来划作一类
