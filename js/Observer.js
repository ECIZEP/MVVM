function Observer(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    this.data = data;
    this.walker(data);
}

Observer.prototype = {
    walker: function (data) {
        let self = this;
        Object.keys(this.data).forEach(function (key) {
            self.defineReactice(data, key, data[key]);
        });
    },
    defineReactice: function (data, key, value) {
        var dep = new Dep();
        new Observer(data[key]);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function () {
                if (Dep.target) {
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
                //观察者通知订阅者
                dep.notify();
            }
        });
    }
}

let uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.target = null;

Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    removeSub: function (sub) {
        let index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },
    depend: function () {
        Dep.target.addDep(this);
    },
    notify: function () {
        // 订阅者收到更新，然后通知订阅者watcher去更新视图
        this.subs.forEach(sub => sub.update());
    }
}