import componentACss from "./componentA.module.css";
import componentALess from "../index.module.less";

console.log('componentACss: ', componentACss);
console.log('componentALess: ', componentALess);

const divElementA = document.createElement('div');
divElementA.className = componentACss.footerContent;

document.body.appendChild(divElementA);