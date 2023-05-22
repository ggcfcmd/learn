console.log("hello world");

let str: string = "helloworld";

console.log("meta", import.meta.env.VITE_PROXY_TARGET);

interface PersonField {
    name: string;
    age: number;
}

function demo(params: PersonField) {
    console.log("name log :", params.name);
}

demo({ name: 'shenzn', age: 18 });