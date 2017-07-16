/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dep = __webpack_require__(2);

var _dep2 = _interopRequireDefault(_dep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Watcher = function () {
    function Watcher(vm, expression, callback) {
        _classCallCheck(this, Watcher);

        this.callback = callback;
        this.vm = vm;
        // watch的数据属性
        this.expression = expression;
        this.callback = callback;
        // watcher监听的属性的Id
        this.depIds = {};
        // 把值备份下，以便缓冲变化
        this.oldValue = this.get();
    }

    _createClass(Watcher, [{
        key: 'update',
        value: function update() {
            var newValue = this.get();
            var oldValue = this.oldValue;
            if (newValue !== this.oldValue) {
                // 更新备份，准备下次对比
                this.oldValue = newValue;
                // 执行回调更新视图
                this.callback.call(this.vm, newValue, oldValue);
            }
        }
    }, {
        key: 'addDep',
        value: function addDep(dep) {
            if (!this.depIds.hasOwnProperty(dep.id)) {
                // 添加订阅者
                dep.addSub(this);
                // 该属性的依赖列表
                this.depIds[dep.id] = dep;
            }
        }
    }, {
        key: 'get',
        value: function get() {
            _dep2.default.target = this;
            // 求值的过程会触发监听数据的getter, 为了使之访问到watch
            var value = this.getVMVal();
            // 访问完了，置空
            _dep2.default.target = null;
            return value;
        }
    }, {
        key: 'getVMVal',
        value: function getVMVal() {
            var expression = this.expression.split('.');
            var value = this.vm;
            expression.forEach(function (curVal) {
                // 这里取值的过程，会调用到每一个数据的get，根据getter里面的闭包
                // 从而访问到数据的dep,调用dep.depend
                // 属性dep.depend, 进一步调用到Watch的addDep，让watcher添加进去
                value = value[curVal];
            });
            return value;
        }
    }]);

    return Watcher;
}();

exports.default = Watcher;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = observer;

var _dep = __webpack_require__(2);

var _dep2 = _interopRequireDefault(_dep);

var _util = __webpack_require__(3);

var _array = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function protoAugment(target, src) {
    target.__proto__ = src;
}

function copyAugment(target, src, keys) {
    for (var i = 0; i < keys.length; i++) {
        (0, _util.def)(target, key[i], src[key[i]]);
    }
}

function observer(data) {
    if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
        return;
    } else if (data.hasOwnProperty("__ob__") && data["__ob__"] instanceof Observer) {
        return;
    }
    // 对象才能进
    return new Observer(data);
}

var Observer = function () {
    function Observer(data) {
        _classCallCheck(this, Observer);

        this.dep = new _dep2.default();
        // 给每个数据一个指向Observer的引用，array.js会用到
        (0, _util.def)(data, "__ob__", this);
        this.data = data;

        if (Array.isArray(data)) {
            var argment = data.__proto__ ? protoAugment : copyAugment;
            // 劫持数组方法
            argment(data, _array.arrayMethods, Object.keys(_array.arrayMethods));
            // 对数组元素遍历下，有元素可能是对象
            this.observerArray(data);
        } else {
            this.walk(data);
        }
    }

    _createClass(Observer, [{
        key: 'walk',
        value: function walk(data) {
            var _this = this;

            Object.keys(this.data).forEach(function (key) {
                _this.defineReactice(data, key, data[key]);
            });
        }
    }, {
        key: 'observerArray',
        value: function observerArray(items) {
            for (var i = 0; i < items.length; i++) {
                // 数组的元素是对象就监听
                observer(items[i]);
            }
        }
    }, {
        key: 'defineReactice',
        value: function defineReactice(data, key, value) {
            // dep作用
            // 一是在当前被拦截的属性被 get（访问到）的时候把自己交给数据订阅模块 Watcher 作记录
            // 二是在当前被拦截的属性被 set（设置新值）的时候告诉跟自己有关系的所有 Watcher ：“我的值变成 XXX 了，你们都马上更新下！”。
            var dep = new _dep2.default(),
                descriptor = Object.getOwnPropertyDescriptor(data, key);
            if (descriptor && !descriptor.configurable) {
                return;
            }

            var childObserver = observer(value);

            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: false,
                get: function get() {
                    if (_dep2.default.target) {
                        // 添加依赖
                        dep.depend();
                        if (childObserver) {
                            childObserver.dep.depend();
                        }
                    }
                    return value;
                },
                set: function set(newValue) {
                    if (newValue == value) {
                        return;
                    }
                    if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object') {
                        observer(newValue);
                    }
                    value = newValue;
                    // 告诉所有订阅者Watcher，数据更新了！
                    dep.notify();
                }
            });
        }
    }]);

    return Observer;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watcher = __webpack_require__(0);

var _watcher2 = _interopRequireDefault(_watcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uid = 0;

var Dep = function () {
    function Dep() {
        _classCallCheck(this, Dep);

        this.id = uid++;
        this.subs = [];
    }

    _createClass(Dep, [{
        key: 'addSub',
        value: function addSub(sub) {
            this.subs.push(sub);
        }
    }, {
        key: 'removeSub',
        value: function removeSub(sub) {
            var index = this.subs.indexOf(sub);
            if (index != -1) {
                this.subs.splice(index, 1);
            }
        }
    }, {
        key: 'depend',
        value: function depend() {
            Dep.target.addDep(this);
        }
    }, {
        key: 'notify',
        value: function notify() {
            // 订阅者收到更新，然后通知订阅者watcher去更新视图
            this.subs.forEach(function (sub) {
                return sub.update();
            });
        }
    }]);

    return Dep;
}();

exports.default = Dep;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["def"] = def;
/* harmony export (immutable) */ __webpack_exports__["debounce"] = debounce;
function def(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        value: value,
        writeable: true,
        configurable: true,
        enumerable: !!enumerable
    });
}

function debounce(func, wait, immediate) {
  var timeout = null;
  
  return function () {
    var delay = function () {
      timeout = null;
      // 需要判断下，否则对于immediate为true的情况会触发两次
      if (!immediate) {
        func.apply(this, arguments);
      }
    }
    var callnow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(delay ,wait);
    // 第一次触发事件立即执行
    console.log(callnow);
    if (callnow) {
      func.apply(this, arguments);
    }
  }
}

/*
export function computeExpression(vm, exp) {
    try {
        with (vm) {
            return eval(exp);
        }
    } catch (e) {
        console.error('ERROR', e);
    }
}*/

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watcher = __webpack_require__(0);

var _watcher2 = _interopRequireDefault(_watcher);

var _observer = __webpack_require__(1);

var _observer2 = _interopRequireDefault(_observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tagRE = /\{\{\{(.*?)\}\}\}|\{\{(.*?)\}\}/g,
    htmlRE = /^\{\{\{(.*)\}\}\}$/,
    paramsRE = /\((.+)\)/g,
    stringRE = /\'(.*)\'/g;

// 实现指令系统
// 目的： 替换模板中的指令，初始化值并且对这个值new一个订阅者watcher

var Compiler = function () {
    function Compiler(el, vm) {
        _classCallCheck(this, Compiler);

        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);

        if (this.$el) {
            this.$fragment = this.createFragment(this.$el);
            this.compileElement(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    _createClass(Compiler, [{
        key: 'createFragment',
        value: function createFragment(el) {
            var fragment = document.createDocumentFragment(),
                child;

            while (child = el.firstChild) {
                fragment.appendChild(child);
            }

            return fragment;
        }
    }, {
        key: 'compileElement',
        value: function compileElement(el) {
            var childNodes = el.childNodes,
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
    }, {
        key: 'compileNodeAttr',
        value: function compileNodeAttr(node) {
            var nodeAttrs = node.attributes,
                self = this,
                lazyComplier = void 0,
                lazyExp = void 0;

            [].slice.call(nodeAttrs).forEach(function (attr) {
                var attrName = attr.name;
                if (self.isDirective(attrName)) {
                    // expression就是methods里面指定的时间响应函数
                    var expression = attr.value;
                    // directicve
                    var directive = attrName.substring(2);
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
    }, {
        key: 'compileText',
        value: function compileText(node) {
            var _this = this;

            var tokens = this.parseText(node.wholeText);
            var fragment = document.createDocumentFragment();
            tokens.forEach(function (token) {
                var el = void 0;
                if (token.tag) {
                    // html解析
                    if (token.html) {
                        // html 解析 创建空文档
                        el = document.createDocumentFragment();
                        el.$parent = node.parentNode;
                        el.$oncetime = true;
                        directiveUtil.html(el, _this.$vm, token.value);
                    } else {
                        // 新的响应式文本节点
                        el = document.createTextNode(" ");
                        directiveUtil.text(el, _this.$vm, token.value);
                    }
                } else {
                    el = document.createTextNode(token.value);
                }
                el && fragment.appendChild(el);
            });
            node.parentNode.replaceChild(fragment, node);
        }
    }, {
        key: 'parseText',
        value: function parseText(text) {

            if (!tagRE.test(text)) {
                return;
            }
            var tokens = [];
            var lastIndex = tagRE.lastIndex = 0;
            var match = void 0,
                index = void 0,
                html = void 0,
                value = void 0;
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

    }, {
        key: 'isDirective',
        value: function isDirective(attr) {
            return attr.indexOf('v-') === 0;
        }
    }, {
        key: 'isEventDirective',
        value: function isEventDirective(dir) {
            return dir.indexOf('on') === 0;
        }
    }, {
        key: 'isElementNode',
        value: function isElementNode(node) {
            return node.nodeType === 1;
        }
    }, {
        key: 'isTextNode',
        value: function isTextNode(node) {
            return node.nodeType === 3;
        }
    }]);

    return Compiler;
}();

exports.default = Compiler;


var directiveUtil = {
    text: function text(node, vm, expression) {
        this.bind(node, vm, expression, 'text');
    },

    html: function html(node, vm, expression) {
        this.bind(node, vm, expression, 'html');
    },

    class: function _class(node, vm, expression) {
        this.bind(node, vm, expression, 'class');
    },

    for: function _for(node, vm, expression) {
        var itemName = expression.split('in')[0].replace(/\s/g, ''),
            arrayName = expression.split('in')[1].replace(/\s/g, '').split('.'),
            parentNode = node.parentNode,
            startNode = document.createTextNode(''),
            endNode = document.createTextNode(''),
            range = document.createRange();

        // 去掉原始模板
        parentNode.replaceChild(endNode, node);
        parentNode.insertBefore(startNode, endNode);

        var value = vm;
        arrayName.forEach(function (curVal) {
            value = value[curVal] ? value[curVal] : void 666;
            if (!value) {
                throw new Error("wrong expression");
            }
        });

        // 初始化
        value.forEach(function (item, index) {
            var cloneNode = node.cloneNode(true);
            parentNode.insertBefore(cloneNode, endNode);
            var forVm = Object.create(vm);
            // 绑定item作用域
            forVm[itemName] = item;
            // 继续编译cloneNode
            new Compiler(cloneNode, forVm);
        });

        new _watcher2.default(vm, arrayName + ".length", function (newValue, oldValue) {
            var _this2 = this;

            range.setStart(startNode, 0);
            range.setEnd(endNode, 0);
            range.deleteContents();
            value.forEach(function (item, index) {
                var cloneNode = node.cloneNode(true);
                parentNode.insertBefore(cloneNode, endNode);
                var forVm = Object.create(_this2);
                // 绑定item作用域
                forVm[itemName] = item;
                // 继续编译cloneNode
                new Compiler(cloneNode, forVm);
            });
        });
    },

    model: function model(node, vm, expression) {
        var _this3 = this;

        this.bind(node, vm, expression, 'model');

        // 对于model做双向绑定
        var value = this._getVMVal(vm, expression);

        // compositon是针对中文输入的优化
        var composing = false;

        node.addEventListener('compositionstart', function () {
            composing = true;
        }, false);

        node.addEventListener('compositionend', function (event) {
            composing = false;
            if (value !== event.target.value) {
                _this3._setVMVal(vm, expression, event.target.value);
            }
        }, false);

        node.addEventListener('keyup', function (event) {
            if (!composing && value !== event.target.value) {
                _this3._setVMVal(vm, expression, event.target.value);
            }
        }, false);
    },

    bind: function bind(node, vm, expression, directive) {
        var updaterFn = updater[directive + 'Updater'];
        // 根据指令初始化视图里面的值
        var value = this._getVMVal(vm, expression);
        updaterFn && updaterFn(node, value);
        // 监听该数据的值，给订阅者Watcher传入更新视图的回调函数
        new _watcher2.default(vm, expression, function (newValue, oldValue) {
            updaterFn && updaterFn(node, newValue, oldValue);
        });
    },

    addEvent: function addEvent(node, vm, directive, expression) {
        var eventType = directive.split(':');
        var fn = vm.$options.methods && vm.$options.methods[expression];

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
            var match = paramsRE.exec(expression),
                fnName = expression.replace(match[0], ''),
                paramNames = match[1].split(','),
                params = [];

            paramsRE.exec("remove(todo)");
            fn = vm.$options.methods[fnName];
            // 矫正参数
            for (var i = 0; i < paramNames.length; i++) {
                var name = paramNames[i].trim(),
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

    _getVMVal: function _getVMVal(vm, expression) {
        expression = expression.trim();
        var value = vm;
        expression = expression.split('.');
        expression.forEach(function (key) {
            if (value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                throw new Error("can not find the property: " + key);
            }
        });

        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            return JSON.stringify(value);
        } else {
            return value;
        }
    },

    _setVMVal: function _setVMVal(vm, expression, value) {
        expression = expression.trim();
        var data = vm._data;
        expression = expression.split('.');
        expression.forEach(function (key, index) {
            if (index == expression.length - 1) {
                data[key] = value;
            } else {
                data = data[key];
            }
        });
    }
};

var cacheDiv = document.createElement('div');

var updater = {
    textUpdater: function textUpdater(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },

    htmlUpdater: function htmlUpdater(node, value) {
        if (node.$parent) {
            // {{{}}}html解析，传进来的node是一个空的fragment，得特殊处理
            cacheDiv.innerHTML = value;
            var childNodes = cacheDiv.childNodes,
                doms = [];
            var len = childNodes.length,
                tempNode = void 0;
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
                var newFragment = document.createDocumentFragment();
                while (len--) {
                    tempNode = childNodes[0];
                    newFragment.appendChild(tempNode);
                    doms.push(tempNode);
                }
                // 插入新的节点
                node.$parent.insertBefore(newFragment, node.$doms[0]);
                // 删除原来的节点
                node.$doms.forEach(function (childNode) {
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

    classUpdater: function classUpdater(node, value, oldValue) {
        var nodeNames = node.className;
        if (oldValue) {
            nodeNames = nodeNames.replace(oldValue, '').replace(/\s$/, '');
        }
        var space = nodeNames && value ? ' ' : '';
        node.className = nodeNames + space + value;
    },

    modelUpdater: function modelUpdater(node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watcher = __webpack_require__(0);

var _watcher2 = _interopRequireDefault(_watcher);

var _observer = __webpack_require__(1);

var _observer2 = _interopRequireDefault(_observer);

var _compiler = __webpack_require__(4);

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MVVM = function () {
    function MVVM(options) {
        var _this = this;

        _classCallCheck(this, MVVM);

        this.$options = options;
        this._data = this.$options.data;
        var self = this;
        // 数据代理 vm._data => vm.data 方便访问
        Object.keys(this.$options.data).forEach(function (key) {
            _this._proxy(key);
        });
        (0, _observer2.default)(this._data);

        this.$compiler = new _compiler2.default(options.el || document.body, this);
    }

    _createClass(MVVM, [{
        key: '$watch',
        value: function $watch(expression, callback) {
            new _watcher2.default(this, expression, callback);
        }
    }, {
        key: '_proxy',
        value: function _proxy(key) {
            var self = this;
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: true,
                get: function get() {
                    return self._data[key];
                },
                set: function set(value) {
                    self._data[key] = value;
                }
            });
        }
    }]);

    return MVVM;
}();

window.MVVM = MVVM;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.arrayMethods = undefined;

var _util = __webpack_require__(3);

var arrayProto = Array.prototype;
var arrayMethods = exports.arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
    // 缓存一份原始方法
    var original = arrayProto[method];
    // 覆盖
    (0, _util.def)(arrayMethods, method, function () {
        var i = arguments.length;
        // const args = [].slice.call(arguments)
        var args = new Array(i);
        while (i--) {
            args[i] = arguments[i];
        }
        var result = original.apply(this, args);
        var ob = this.__ob__;
        var inserted = void 0;
        switch (method) {
            case 'push':
                inserted = args;
                break;
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted) ob.observerArray(inserted);

        ob.dep.notify();
        return result;
    });
});

/***/ })
/******/ ]);