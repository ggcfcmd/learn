const cacheMap = new Map();

export function cache(target: any, name: any, descriptor: any) {
    const val = descriptor.value;

    descriptor.value = async function(...args: any) {
        const cacheKey = name + JSON.stringify(args);

        // 如果通过key没有拿到内容 说明当前没有缓存
        if (!cacheMap.get(cacheKey)) {
            // 通过Promise.resolve将原函数强转成promise形式
            const cacheValue = Promise.resolve(val.apply(this, args)).catch(() => {
                // 通过 catch 捕获异常情况 存储异常信息无意义 
                cacheMap.set(cacheKey, null);
            })

            cacheMap.set(cacheKey, cacheValue);
        }

        return cacheMap.get(cacheKey);
    };

    return descriptor;
}