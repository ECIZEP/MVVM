import Dep from './dep';

export default class Observer {
    constructor(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        this.data = data;
        this.walker(data);
    }

    walker (data) {
        let self = this;
        Object.keys(this.data).forEach(function (key) {
            self.defineReactice(data, key, data[key]);
        });
    }

    defineReactice (data, key, value) {
        // dep作用
        // 一是在当前被拦截的属性被 get（访问到）的时候把自己交给数据订阅模块 Watcher 作记录
        // 二是在当前被拦截的属性被 set（设置新值）的时候告诉跟自己有关系的所有 Watcher ：“我的值变成 XXX 了，你们都马上更新下！”。
        var dep = new Dep();
        new Observer(data[key]);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function () {
                if (Dep.target) {
                    // 添加依赖
                    dep.depend();
                }
                return value;
            },
            set: function (newValue) {
                if (newValue == value) {
                    return;
                }
                if (typeof newValue === 'object') {
                    new Observer(newValue);
                }
                value = newValue;
                // 告诉所有订阅者Watcher，数据更新了！
                dep.notify();
            }
        });
    }
}

