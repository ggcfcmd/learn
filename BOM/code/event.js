const parent = document.getElementById('parent');
let child = document.getElementById('child');
const son = document.getElementById('son');
const banned = true;

window.addEventListener('click', (e) => {
    // if (banned) {
    //     e.stopPropagation();
    //     alert('你被封禁啦！');
    //     return;
    // }
    console.log('window 捕获', e.target.nodeName, e.currentTarget.nodeName);
}, true);
parent.addEventListener('click', (e) => {
    // e.stopPropagation();
    console.log('parent 捕获', e, e.currentTarget.nodeName);
}, true);
child.addEventListener('click', (e) => {
    console.log('child 捕获', e.target.nodeName, e.currentTarget.nodeName);
}, true);
function handler(v) {
    console.log(v);
}
son.addEventListener('click', (e) => {
    child.removeEventListener('click', handler, false);
    child.innerHTML = '...';
    console.log('son 捕获', e.target.nodeName, e.currentTarget.nodeName);
}, true);

window.addEventListener('click', (e) => {
    console.log('window 冒泡', e.target.nodeName, e.currentTarget.nodeName);
}, false);
parent.addEventListener('click', (e) => {
    console.log('parent 冒泡', e.target.nodeName, e.currentTarget.nodeName);
}, false);
child.addEventListener('click', handler, false);
son.addEventListener('click', (e) => {
    console.log('son 冒泡', e.target.nodeName, e.currentTarget.nodeName);
}, false);