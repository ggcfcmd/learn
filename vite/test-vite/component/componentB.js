import componentBCss from "./componentB.module.css";

console.log('componentBCss: ', componentBCss);

const divElementB = document.createElement('div');
divElementB.className = componentBCss.footer;

document.body.appendChild(divElementB);