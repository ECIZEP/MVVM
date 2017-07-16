import Dep from './dep';
import { def } from './util';
import { arrayMethods } from './array';


function protoAugment(target, src) {
    target.__proto__ = src;
}

function copyAugment(target, src, keys) {
    for (let i = 0; i < keys.length; i++) {
        def(target, key[i], src[key[i]]);
    }
}

export default function observer(data) {
    if (!data || typeof data !== 'object') {
        return;
    } else if (data.hasOwnProperty("__ob__") && data["__ob__"] instanceof Observer) {
        return;
    }
    // 对象才能进
    return new Observer(data);
}

class Observer {
    constructor(data) {
        this.dep = new Dep();
        // 给每个数据一个指向Observer的引用，array.js会用到
        def(data, "__ob__", this);
        this.data = data;

        if (Array.isArray(data)) {
            const argment = data.__proto__ ? protoAugment : copyAugment;
            // 劫持数组方法
            argment(data, arrayMethods, Object.keys(arrayMethods));
            // 对数组元素遍历下，有元素可能是对象
            this.observerArray(data);
        } else {
            this.walk(data);
        }

    }

    walk(data) {
        Object.keys(this.data).forEach( key => {
            this.defineReactice(data, key, data[key]);
        });
    }

    observerArray(items) {
        for (let i = 0; i < items.length; i++) {
            // 数组的元素是对象就监听
            observer(items[i]);
        }
    }

    defineReactice(data, key, value) {
        // dep作用
        // 一是在当前被拦截的属性被 get（访问到）的时候把自己交给数据订阅模块 Watcher 作记录
        // 二是在当前被拦截的属性被 set（设置新值）的时候告诉跟自己有关系的所有 Watcher ：“我的值变成 XXX 了，你们都马上更新下！”。
        let dep = new Dep(),
            descriptor = Object.getOwnPropertyDescriptor(data, key);
        if (descriptor && !descriptor.configurable) {
            return;
        }

        let childObserver = observer(value);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function () {
                if (Dep.target) {
                    // 添加依赖
                    dep.depend();
                    if (childObserver) {
                        childObserver.dep.depend();
                    }
                }
                return value;
            },
            set: function (newValue) {
                if (newValue == value) {
                    return;
                }
                if (typeof newValue === 'object') {
                    observer(newValue);
                }
                value = newValue;
                // 告诉所有订阅者Watcher，数据更新了！
                dep.notify();
            }
        });
    }
}

