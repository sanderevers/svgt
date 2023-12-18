var window ={};
require('../dist/esbuild/browser.js')

const obj = window.svgt`<line x1=${10} y1=${20} ${30} ${""} x2=${40} y2=${50} ${60}/>`
const svg = window.svgtBox(obj, 100, 100);
console.log(svg);
