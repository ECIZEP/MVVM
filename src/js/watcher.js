import Dep from './dep'

export default class Watcher {

    constructor(vm, expression, callback) {
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

    update () {
        var newValue = this.get();
        var oldValue = this.oldValue;
        if (newValue !== this.oldValue) {
            // 更新备份，准备下次对比
            this.oldValue = newValue;
            // 执行回调更新视图
            this.callback.call(this.vm, newValue, oldValue);
        }
    }

    addDep (dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            // 该属性的dep添加订阅者
            dep.addSub(this);
            // 该属性的依赖列表
            this.depIds[dep.id] = dep;
        }
    }

    get () {
        Dep.target = this;
        // 求值的过程会触发监听数据的getter, 为了使之访问到watch
        var value = this.getVMVal();
        // 访问完了，置空
        Dep.target = null;
        return value;
    }

    getVMVal () {
        var expression = this.expression.split('.');
        var value = this.vm._data;
        expression.forEach(function (curVal) {
            // 这里取值的过程，会调用到每一个数据的get，更具getter里面的闭包
            // 从而访问到数据的dep,调用dep.depend
            // 属性dep.depend, 进一步调用到Watch的addDep，让watcher添加进去
            value = value[curVal];
        });
        return value;
    }
}