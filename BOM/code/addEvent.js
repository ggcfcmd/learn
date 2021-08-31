class BomEvent {
    constructor(element) {
        this.element = element;
    }

    addEvent(type, handler) {
        // chrome firefox safari opera ie9及以上
        // Netscape 支持捕获事件流 故addEventListener的第三个参数为 useCapture 是否监听捕获事件流
        if (this.element.addEventListener) {
            this.element.addEventListener(type, handler, false);
            // ie8及以下 仅支持冒泡事件流 即不支持监听事件的捕获阶段
        } else if (this.element.attachEvent) {
            this.element.attachEvent(`on${type}`, function() {
                // 能走到这个判断条件的宿主环境很可能不支持箭头函数 手动更改this指向
                handler.call(element);
            });
            // 连attachEvent都没有的环境 采用DOM0注册事件的方式 el.onclick (on + 事件类型)
        } else {
            this.element[`on${type}`] = handler;
        }
    }

    removeEvent(type, handler) {
        if (this.element.removeEventListener) {
            this.element.removeEventListener(type, handler, false);
        } else if (this.element.detachEvent) {
            this.element.detachEvent(`on${type}`, handler);
        } else {
            this.element[`on${type}`] = null;
        }
    }
}

function stopPropagation(el) {
    if (el.stopPropagation) {
        el.stopPropagation();   // 标准w3c浏览器
    } else if (el.cancelBubble) {
        el.cancelBubble = true;   // IE
    }
}

function preventDefault(el) {
    if (el.preventDefault) {
        el.preventDefault();
    } else if (el.returnValue) {
        el.returnValue = false;
    }
}