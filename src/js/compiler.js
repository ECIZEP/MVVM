import Watcher from './watcher';
import observer from './observer';

const tagRE = /\{\{\{(.*?)\}\}\}|\{\{(.*?)\}\}/g,
    htmlRE = /^\{\{\{(.*)\}\}\}$/,
    paramsRE = /\((.+)\)/g,
    stringRE = /\'(.*)\'/g;


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

    createFragment(el) {
        var fragment = document.createDocumentFragment(),
            child;

        while (child = el.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }

    compileElement(el) {
        let childNodes = el.childNodes,
            self = this;

        [].slice.call(childNodes).forEach(function (node) {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/g;

            if (self.isElementNode(node)) {
                self.compileNodeAttr(node);
            } else if (self.isTextNode(node) && reg.test(text)) {
                self.compileText(node);
            }
        });
    }

    compileNodeAttr(node) {
        let nodeAttrs = node.attributes,
            self = this,
            lazyComplier,
            lazyExp;

        [].slice.call(nodeAttrs).forEach(function (attr) {
            let attrName = attr.name;
            if (self.isDirective(attrName)) {
                // expression就是methods里面指定的时间响应函数
                let expression = attr.value;
                // directicve
                let directive = attrName.substring(2);
                if (directive === 'for') {
                    // for指令懒编译
                    lazyComplier = directive;
                    lazyExp = expression;
                } else if (self.isEventDirective(directive)) {
                    // 事件指令
                    directiveUtil.addEvent(node, self.$vm, directive, expression);
                } else {
                    directiveUtil[directive] && directiveUtil[directive](node, self.$vm, expression);
                }
                // 处理完指令后将其移出
                node.removeAttribute(attrName);
            }
        });

        if (lazyComplier === 'for') {
            directiveUtil[lazyComplier] && directiveUtil[lazyComplier](node, this.$vm, lazyExp);
        } else if (node.childNodes && node.childNodes.length) {
            self.compileElement(node);
        }
    }

    compileText(node) {
        const tokens = this.parseText(node.wholeText);
        let fragment = document.createDocumentFragment();
        tokens.forEach(token => {
            let el;
            if (token.tag) {
                // html解析
                if (token.html) {
                    // html 解析 创建空文档
                    el = document.createDocumentFragment();
                    el.$parent = node.parentNode;
                    el.$oncetime = true;
                    directiveUtil.html(el, this.$vm, token.value);

                } else {
                    // 新的响应式文本节点
                    el = document.createTextNode(" ");
                    directiveUtil.text(el, this.$vm, token.value);
                }
            } else {
                el = document.createTextNode(token.value);
            }
            el && fragment.appendChild(el);
        });
        node.parentNode.replaceChild(fragment, node);
    }

    parseText(text) {

        if (!tagRE.test(text)) {
            return;
        }
        const tokens = [];
        let lastIndex = tagRE.lastIndex = 0;
        let match, index, html, value;
        while (match = tagRE.exec(text)) {
            index = match.index;
            // 先把{{}} 或者 {{{}}} 之前的文本提取
            if (index > lastIndex) {
                tokens.push({
                    value: text.slice(lastIndex, index)
                });
            }
            // 是按html解析还是按text解析
            // 如果是文本 value存放文本信息，如果tag为true表示是一个节点，存放expression
            html = htmlRE.test(match[0]);
            value = html ? match[1] : match[2];
            tokens.push({
                value: value,
                tag: true,
                html: html
            });
            lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
            tokens.push({
                value: text.slice(lastIndex)
            });
        }
        return tokens;
    }

    // 是不是vue指令
    isDirective(attr) {
        return attr.indexOf('v-') === 0;
    }

    isEventDirective(dir) {
        return dir.indexOf('on') === 0;
    }

    isElementNode(node) {
        return node.nodeType === 1;
    }

    isTextNode(node) {
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

    for: function (node, vm, expression) {
        let itemName = expression.split('in')[0].replace(/\s/g, ''),
            arrayName = expression.split('in')[1].replace(/\s/g, '').split('.'),
            parentNode = node.parentNode,
            startNode = document.createTextNode(''),
            endNode = document.createTextNode(''),
            range = document.createRange();

        // 去掉原始模板
        parentNode.replaceChild(endNode, node);
        parentNode.insertBefore(startNode, endNode);

        let value = vm;
        arrayName.forEach(function (curVal) {
            value = value[curVal] ? value[curVal] : void 666;
            if (!value) {
                throw new Error("wrong expression");
            }
        });

        // 初始化
        value.forEach((item, index) => {
            let cloneNode = node.cloneNode(true);
            parentNode.insertBefore(cloneNode, endNode);
            let forVm = Object.create(vm);
            // 绑定item作用域
            forVm[itemName] = item;
            // 继续编译cloneNode
            new Compiler(cloneNode, forVm);
        });

        new Watcher(vm, arrayName + ".length", function (newValue, oldValue) {
            range.setStart(startNode, 0);
            range.setEnd(endNode, 0);
            range.deleteContents();
            value.forEach((item, index) => {
                let cloneNode = node.cloneNode(true);
                parentNode.insertBefore(cloneNode, endNode);
                let forVm = Object.create(this);
                // 绑定item作用域
                forVm[itemName] = item;
                // 继续编译cloneNode
                new Compiler(cloneNode, forVm);
            });
        });

    },

    model: function (node, vm, expression) {
        this.bind(node, vm, expression, 'model');

        // 对于model做双向绑定
        let value = this._getVMVal(vm, expression);

        // compositon是针对中文输入的优化
        let composing = false;

        node.addEventListener('compositionstart', () => {
            composing = true;
        }, false);

        node.addEventListener('compositionend', event => {
            composing = false;
            if (value !== event.target.value) {
                this._setVMVal(vm, expression, event.target.value);
            }
        }, false);

        node.addEventListener('keyup', event => {
            if (!composing && value !== event.target.value) {
                this._setVMVal(vm, expression, event.target.value);
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

        if (eventType[1] && typeof fn === 'function') {
            node.addEventListener(eventType[1], fn.bind(vm), false);
        } else {
            /*
            function computeExpression(exp, vm) {
                try {
                    with (vm) {
                        return eval(exp);
                    }
                } catch (e) {
                    console.error('ERROR', e);
                }
            }
            */
            let match = paramsRE.exec(expression),
                fnName = expression.replace(match[0], ''),
                paramNames = match[1].split(','),
                params = [];

            paramsRE.exec("remove(todo)");
            fn = vm.$options.methods[fnName];
            // 矫正参数
            for (let i = 0; i < paramNames.length; i++) {
                let name = paramNames[i].trim(),
                    stringMatch = stringRE.exec(name);
                if (stringMatch) {
                    // 字符串常量
                    params.push(stringMatch[1]);
                } else {
                    // vm中变量
                    params.push(vm[name]);
                }
                
            }
            node.addEventListener(eventType[1], function () {
                fn.apply(vm, params);
            }, false);
        }
    },

    _getVMVal: function (vm, expression) {
        expression = expression.trim();
        let value = vm;
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
        expression = expression.trim();
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

const cacheDiv = document.createElement('div');

const updater = {
    textUpdater: function (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },

    htmlUpdater: function (node, value) {
        if (node.$parent) {
            // {{{}}}html解析，传进来的node是一个空的fragment，得特殊处理
            cacheDiv.innerHTML = value;
            const childNodes = cacheDiv.childNodes,
                doms = [];
            let len = childNodes.length,
                tempNode;
            if (node.$oncetime) {
                while (len--) {
                    tempNode = childNodes[0];
                    node.appendChild(tempNode);
                    doms.push(tempNode);
                }
                node.$doms = doms;
                node.$oncetime = false;
            } else {
                // 使用fragment减少回流
                let newFragment = document.createDocumentFragment();
                while (len--) {
                    tempNode = childNodes[0];
                    newFragment.appendChild(tempNode);
                    doms.push(tempNode);
                }
                // 插入新的节点
                node.$parent.insertBefore(newFragment, node.$doms[0]);
                // 删除原来的节点
                node.$doms.forEach(childNode => {
                    node.$parent.removeChild(childNode);
                });
                // 保存新节点引用，下次用来删除
                node.$doms = doms;
            }

        } else {
            // v-html指令
            node.innerHTML = typeof value === 'undefined' ? '' : value;
        }
    },

    classUpdater: function (node, value, oldValue) {
        var nodeNames = node.className;
        if (oldValue) {
            nodeNames = nodeNames.replace(oldValue, '').replace(/\s$/, '');
        }
        var space = nodeNames && value ? ' ' : '';
        node.className = nodeNames + space + value;
    },

    modelUpdater: function (node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    },
}
