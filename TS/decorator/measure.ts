/**
 * 装饰函数的装饰器
 * 大多用来在不改变基于原有函数使用的基础上，通过装饰器的写法，去修改原有函数的逻辑
 *
 * @export
 * @param {*} target
 * @param {*} name
 * @param {*} descriptor
 * @returns
 */
export function measure(target: any, name: any, descriptor: any) {
    const oldValue = descriptor.value;
    
    descriptor.value = async function(...args: any) {
        const start = Date.now();
        const res = await oldValue.apply(this, args);
        console.log(`${name}执行耗时 ${Date.now() - start}ms`);
        return res;
    };

    return descriptor;
}
