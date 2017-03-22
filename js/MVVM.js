function MVVM(options) {
    this.$options = options;
    this._data = this.$options.data;
    var self = this;
    // 数据代理
    Object.keys(this.$options.data).forEach(key => {
        this._proxy(key);
    });
    new Observer(this._data);

    this.$compiler = new Compiler(options.el || document.body, this);
}

MVVM.prototype = {
    $watch: function (expression, callback) {
        new Watcher(this, expression, callback);
    },

    _proxy: function (key) {
        let self = this;
        Object.defineProperty(this, key, {
            configurable: false,
            enumerable: true,
            get() {
                return self._data[key];
            },
            set(value) {
                self._data[key] = value;
            }
        });
    }
}