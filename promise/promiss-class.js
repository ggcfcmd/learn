const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MPromise {
    constructor(fn) {
        // 初始状态为pending
        this.status = PENDING;
        this.value = null;
        this.reason = null;

        try {
            // bind 兼容传入回调是function格式
            fn(this.resolve.bind(this), this.reject.bind(this));
        } catch (e) {
            this.reject(e);
        }
    }

    resolve(value) {
        if (this.status === PENDING) {
            this.value = value;
            this.status = FULFILLED;
        }
    }
    
    reject(reason) {
        if (this.status === PENDING) {
            this.reason = reason;
            this.status = REJECTED;
        }
    }

    then(onFulfilled, onRejected) {
        
    }

    isFunction(value) {
        return typeof value === 'function';
    }
}