export function def(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        value: value,
        writeable: true,
        configurable: true,
        enumerable: !!enumerable
    });
}

/*export function computeExpression(vm, exp) {
    try {
        with (vm) {
            return eval(exp);
        }
    } catch (e) {
        console.error('ERROR', e);
    }
}*/