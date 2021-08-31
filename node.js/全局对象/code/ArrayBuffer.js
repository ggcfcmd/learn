const buffer = new ArrayBuffer(16);

// console.log(buffer);

const int16Buffer = new Int16Array(buffer);

// console.log(int16Buffer);

const uint8 = new Uint8Array(2);

uint8[0] = 42;
console.log(uint8[0]); // 42
console.log(uint8.length); // 2
console.log(uint8.BYTES_PER_ELEMENT); // 每个元素所占的字节数
