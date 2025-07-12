import{r as b}from"./app-CHTEX8vJ.js";import{b as d}from"./index-BI5pr6dR.js";import{c as n}from"./createLucideIcon-535sBb6P.js";function y(r){const[h,e]=b.useState(void 0);return d(()=>{if(r){e({width:r.offsetWidth,height:r.offsetHeight});const f=new ResizeObserver(o=>{if(!Array.isArray(o)||!o.length)return;const c=o[0];let i,t;if("borderBoxSize"in c){const s=c.borderBoxSize,a=Array.isArray(s)?s[0]:s;i=a.inlineSize,t=a.blockSize}else i=r.offsetWidth,t=r.offsetHeight;e({width:i,height:t})});return f.observe(r,{box:"border-box"}),()=>f.unobserve(r)}else e(void 0)},[r]),h}/**
 * @license lucide-react v0.373.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=n("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);export{g as C,y as u};
