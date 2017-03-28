import Watcher from './watcher'
import Observer from './observer'

// 实现指令系统
// 目的： 替换模板中的指令，初始化值并且对这个值new一个订阅者watcher
export default class Compiler {

    constructor(el, vm) {
        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);

        if (this.$el) {
            this.$fragment = this.createFragment(this.$el);
            this.compileElement(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    createFragment (el) {
        var fragment = document.createDocumentFragment(),
            child;

        while (child = el.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }

    compileElement (el) {
        let childNodes = el.childNodes,
            self = this;

        [].slice.call(childNodes).forEach(function (node) {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/g

            if (self.isElementNode(node)) {
                self.compileNodeAttr(node);
            } else if (self.isTextNode(node) && reg.test(text)) {
                self.compileText(node, RegExp.$1.trim());
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    }

    compileNodeAttr (node) {
        let nodeAttrs = node.attributes,
            self = this;

        [].slice.call(nodeAttrs).forEach(function (attr) {
            let attrName = attr.name;
            if (self.isDirective(attrName)) {
                // expression就是methods里面指定的时间响应函数
                let expression = attr.value.trim();
                // directicve就是事件的类型
                let directive = attrName.substring(2);
                // 事件指令
                if (self.isEventDirective(directive)) {
                    directiveUtil.addEvent(node, self.$vm, directive, expression);
                } else {
                    directiveUtil[directive] && directiveUtil[directive](node, self.$vm, expression);
                }
                // 处理完指令后将其移出
                node.removeAttribute(attrName);
            }
        });
    }

    compileText (node, expression) {
        directiveUtil.text(node, this.$vm, expression);
    }

    // 是不是vue指令
    isDirective (attr) {
        return attr.indexOf('v-') === 0;
    }

    isEventDirective (dir) {
        return dir.indexOf('on') === 0;
    }

    isElementNode (node) {
        return node.nodeType === 1;
    }

    isTextNode (node) {
        return node.nodeType === 3;
    }
}


const directiveUtil = {
    text: function (node, vm, expression) {
        this.bind(node, vm, expression, 'text');
    },

    html: function (node, vm, expression) {
        this.bind(node, vm, expression, 'html');
    },

    class: function (node, vm, expression) {
        this.bind(node, vm, expression, 'class');
    },

    model: function (node, vm, expression) {
        this.bind(node, vm, expression, 'model');

        // 对于model做双向绑定
        let value = this._getVMVal(vm, expression);
        node.addEventListener('input', event => {
            if (value === event.target.value) {
                return;
            } else {
                this._setVMVal(vm, expression, event.target.value);
                value = event.target.value;
            }
        }, false);
    },

    bind: function (node, vm, expression, directive) {
        var updaterFn = updater[directive + 'Updater'];
        // 根据指令初始化视图里面的值
        let value = this._getVMVal(vm, expression);
        updaterFn && updaterFn(node, value);
        // 监听该数据的值，给订阅者Watcher传入更新视图的回调函数
        new Watcher(vm, expression, function (newValue, oldValue) {
            updaterFn && updaterFn(node, newValue, oldValue);
        });
    },

    addEvent: function (node, vm, directive, expression) {
        let eventType = directive.split(':');
        let fn = vm.$options.methods && vm.$options.methods[expression];

        if (eventType[1] && fn) {
            node.addEventListener(eventType[1], fn, false);
        }
    },

    _getVMVal: function (vm, expression) {
        let value = vm._data;
        expression = expression.split('.');
        expression.forEach((key) => {
            if (value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                throw new Error("can not find the property: " + key);
            }
            
        });

        if (typeof value === 'object') {
            return JSON.stringify(value);
        } else {
            return value;
        }
    },

    _setVMVal: function (vm, expression, value) {
        let data = vm._data;
        expression = expression.split('.');
        expression.forEach((key, index) => {
            if (index == expression.length - 1) {
                data[key] = value;
            } else {
                data = data[key];
            }
        });
    }
}

const updater = {
    textUpdater: function (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },

    htmlUpdater: function (node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value;
    },

    classUpdater: function (node, value, oldValue) {
        let nodeNames = node.className;
        nodeNames = nodeNames.replace(oldValue, '').replace(/\s$/, '');
        let space = className && value ? ' ' : '';
        node.className = className + space + value;
    },

    modelUpdater: function (node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    }
}
