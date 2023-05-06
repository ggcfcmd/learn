# render

## 概览

1. 从 rootFiber 开始向下深度优先遍历（"捕获" 阶段），为遍历到的每一个 Fiber 节点调用 beginWork 方法，该方法会根据传入的 Fiber 节点创建子 Fiber 节点，并将两个 Fiber 节点连接起来（创建 Fiber 树），遍历到叶子节点时就会进入 "冒泡" 阶段（开始往回走）
2. "冒泡" 阶段会调用 completeWork 处理 Fiber 节点。当某个 Fiber 节点执行完 completeWork，如果其存在兄弟 Fiber 节点（即 sibling !== null），就会进入其兄弟 Fiber 的 "捕获" 阶段
3. 如果不存在兄弟 Fiber，则进入父级 Fiber 节点的 "冒泡" 阶段
4. "捕获" 和 "冒泡" 交替执行直到 "冒泡" 到 rootFiber，此时，render 阶段结束

ps: 通过事件的 "捕获" 和 "冒泡" 阶段模拟 树的向下找和向上找
