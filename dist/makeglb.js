!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.MakeGLB=t():e.MakeGLB=t()}(window,function(){return function(e){var t=window.webpackHotUpdateMakeGLB;window.webpackHotUpdateMakeGLB=function(e,n){!function(e,t){if(!O[e]||!w[e])return;for(var n in w[e]=!1,t)Object.prototype.hasOwnProperty.call(t,n)&&(y[n]=t[n]);0==--g&&0===m&&D()}(e,n),t&&t(e,n)};var n,r=!0,o="c543a0f1224a74603c10",i=1e4,c={},a=[],d=[];function s(e){var t=P[e];if(!t)return L;var r=function(r){return t.hot.active?(P[r]?-1===P[r].parents.indexOf(e)&&P[r].parents.push(e):(a=[e],n=r),-1===t.children.indexOf(r)&&t.children.push(r)):(console.warn("[HMR] unexpected require("+r+") from disposed module "+e),a=[]),L(r)},o=function(e){return{configurable:!0,enumerable:!0,get:function(){return L[e]},set:function(t){L[e]=t}}};for(var i in L)Object.prototype.hasOwnProperty.call(L,i)&&"e"!==i&&"t"!==i&&Object.defineProperty(r,i,o(i));return r.e=function(e){return"ready"===l&&p("prepare"),m++,L.e(e).then(t,function(e){throw t(),e});function t(){m--,"prepare"===l&&(v[e]||x(e),0===m&&0===g&&D())}},r.t=function(e,t){return 1&t&&(e=r(e)),L.t(e,-2&t)},r}function f(e){var t={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],_main:n!==e,active:!0,accept:function(e,n){if(void 0===e)t._selfAccepted=!0;else if("function"==typeof e)t._selfAccepted=e;else if("object"==typeof e)for(var r=0;r<e.length;r++)t._acceptedDependencies[e[r]]=n||function(){};else t._acceptedDependencies[e]=n||function(){}},decline:function(e){if(void 0===e)t._selfDeclined=!0;else if("object"==typeof e)for(var n=0;n<e.length;n++)t._declinedDependencies[e[n]]=!0;else t._declinedDependencies[e]=!0},dispose:function(e){t._disposeHandlers.push(e)},addDisposeHandler:function(e){t._disposeHandlers.push(e)},removeDisposeHandler:function(e){var n=t._disposeHandlers.indexOf(e);n>=0&&t._disposeHandlers.splice(n,1)},check:_,apply:E,status:function(e){if(!e)return l;u.push(e)},addStatusHandler:function(e){u.push(e)},removeStatusHandler:function(e){var t=u.indexOf(e);t>=0&&u.splice(t,1)},data:c[e]};return n=void 0,t}var u=[],l="idle";function p(e){l=e;for(var t=0;t<u.length;t++)u[t].call(null,e)}var h,y,b,g=0,m=0,v={},w={},O={};function j(e){return+e+""===e?+e:e}function _(e){if("idle"!==l)throw new Error("check() is only allowed in idle status");return r=e,p("check"),(t=i,t=t||1e4,new Promise(function(e,n){if("undefined"==typeof XMLHttpRequest)return n(new Error("No browser support"));try{var r=new XMLHttpRequest,i=L.p+""+o+".hot-update.json";r.open("GET",i,!0),r.timeout=t,r.send(null)}catch(e){return n(e)}r.onreadystatechange=function(){if(4===r.readyState)if(0===r.status)n(new Error("Manifest request to "+i+" timed out."));else if(404===r.status)e();else if(200!==r.status&&304!==r.status)n(new Error("Manifest request to "+i+" failed."));else{try{var t=JSON.parse(r.responseText)}catch(e){return void n(e)}e(t)}}})).then(function(e){if(!e)return p("idle"),null;w={},v={},O=e.c,b=e.h,p("prepare");var t=new Promise(function(e,t){h={resolve:e,reject:t}});y={};return x(0),"prepare"===l&&0===m&&0===g&&D(),t});var t}function x(e){O[e]?(w[e]=!0,g++,function(e){var t=document.createElement("script");t.charset="utf-8",t.src=L.p+""+e+"."+o+".hot-update.js",document.head.appendChild(t)}(e)):v[e]=!0}function D(){p("ready");var e=h;if(h=null,e)if(r)Promise.resolve().then(function(){return E(r)}).then(function(t){e.resolve(t)},function(t){e.reject(t)});else{var t=[];for(var n in y)Object.prototype.hasOwnProperty.call(y,n)&&t.push(j(n));e.resolve(t)}}function E(t){if("ready"!==l)throw new Error("apply() is only allowed in ready status");var n,r,i,d,s;function f(e){for(var t=[e],n={},r=t.slice().map(function(e){return{chain:[e],id:e}});r.length>0;){var o=r.pop(),i=o.id,c=o.chain;if((d=P[i])&&!d.hot._selfAccepted){if(d.hot._selfDeclined)return{type:"self-declined",chain:c,moduleId:i};if(d.hot._main)return{type:"unaccepted",chain:c,moduleId:i};for(var a=0;a<d.parents.length;a++){var s=d.parents[a],f=P[s];if(f){if(f.hot._declinedDependencies[i])return{type:"declined",chain:c.concat([s]),moduleId:i,parentId:s};-1===t.indexOf(s)&&(f.hot._acceptedDependencies[i]?(n[s]||(n[s]=[]),u(n[s],[i])):(delete n[s],t.push(s),r.push({chain:c.concat([s]),id:s})))}}}}return{type:"accepted",moduleId:e,outdatedModules:t,outdatedDependencies:n}}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];-1===e.indexOf(r)&&e.push(r)}}t=t||{};var h={},g=[],m={},v=function(){console.warn("[HMR] unexpected require("+_.moduleId+") to disposed module")};for(var w in y)if(Object.prototype.hasOwnProperty.call(y,w)){var _;s=j(w);var x=!1,D=!1,E=!1,H="";switch((_=y[w]?f(s):{type:"disposed",moduleId:w}).chain&&(H="\nUpdate propagation: "+_.chain.join(" -> ")),_.type){case"self-declined":t.onDeclined&&t.onDeclined(_),t.ignoreDeclined||(x=new Error("Aborted because of self decline: "+_.moduleId+H));break;case"declined":t.onDeclined&&t.onDeclined(_),t.ignoreDeclined||(x=new Error("Aborted because of declined dependency: "+_.moduleId+" in "+_.parentId+H));break;case"unaccepted":t.onUnaccepted&&t.onUnaccepted(_),t.ignoreUnaccepted||(x=new Error("Aborted because "+s+" is not accepted"+H));break;case"accepted":t.onAccepted&&t.onAccepted(_),D=!0;break;case"disposed":t.onDisposed&&t.onDisposed(_),E=!0;break;default:throw new Error("Unexception type "+_.type)}if(x)return p("abort"),Promise.reject(x);if(D)for(s in m[s]=y[s],u(g,_.outdatedModules),_.outdatedDependencies)Object.prototype.hasOwnProperty.call(_.outdatedDependencies,s)&&(h[s]||(h[s]=[]),u(h[s],_.outdatedDependencies[s]));E&&(u(g,[_.moduleId]),m[s]=v)}var M,U=[];for(r=0;r<g.length;r++)s=g[r],P[s]&&P[s].hot._selfAccepted&&U.push({module:s,errorHandler:P[s].hot._selfAccepted});p("dispose"),Object.keys(O).forEach(function(e){!1===O[e]&&function(e){delete installedChunks[e]}(e)});for(var k,I,S=g.slice();S.length>0;)if(s=S.pop(),d=P[s]){var A={},B=d.hot._disposeHandlers;for(i=0;i<B.length;i++)(n=B[i])(A);for(c[s]=A,d.hot.active=!1,delete P[s],delete h[s],i=0;i<d.children.length;i++){var G=P[d.children[i]];G&&((M=G.parents.indexOf(s))>=0&&G.parents.splice(M,1))}}for(s in h)if(Object.prototype.hasOwnProperty.call(h,s)&&(d=P[s]))for(I=h[s],i=0;i<I.length;i++)k=I[i],(M=d.children.indexOf(k))>=0&&d.children.splice(M,1);for(s in p("apply"),o=b,m)Object.prototype.hasOwnProperty.call(m,s)&&(e[s]=m[s]);var T=null;for(s in h)if(Object.prototype.hasOwnProperty.call(h,s)&&(d=P[s])){I=h[s];var q=[];for(r=0;r<I.length;r++)if(k=I[r],n=d.hot._acceptedDependencies[k]){if(-1!==q.indexOf(n))continue;q.push(n)}for(r=0;r<q.length;r++){n=q[r];try{n(I)}catch(e){t.onErrored&&t.onErrored({type:"accept-errored",moduleId:s,dependencyId:I[r],error:e}),t.ignoreErrored||T||(T=e)}}}for(r=0;r<U.length;r++){var N=U[r];s=N.module,a=[s];try{L(s)}catch(e){if("function"==typeof N.errorHandler)try{N.errorHandler(e)}catch(n){t.onErrored&&t.onErrored({type:"self-accept-error-handler-errored",moduleId:s,error:n,originalError:e}),t.ignoreErrored||T||(T=n),T||(T=e)}else t.onErrored&&t.onErrored({type:"self-accept-errored",moduleId:s,error:e}),t.ignoreErrored||T||(T=e)}}return T?(p("fail"),Promise.reject(T)):(p("idle"),new Promise(function(e){e(g)}))}var P={};function L(t){if(P[t])return P[t].exports;var n=P[t]={i:t,l:!1,exports:{},hot:f(t),parents:(d=a,a=[],d),children:[]};return e[t].call(n.exports,n,n.exports,s(t)),n.l=!0,n.exports}return L.m=e,L.c=P,L.d=function(e,t,n){L.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},L.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},L.t=function(e,t){if(1&t&&(e=L(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(L.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)L.d(n,r,function(t){return e[t]}.bind(null,r));return n},L.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return L.d(t,"a",t),t},L.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},L.p="",L.h=function(){return o},s(0)(L.s=0)}([function(e,t,n){"use strict";n.r(t);const r={"image/png":["png"],"image/jpeg":["jpg","jpeg"],"text/plain":["glsl","vert","vs","frag","fs","txt"],"image/vnd-ms.dds":["dds"]},o=(e,t)=>{let n=0;if(e>0){const r=e%t;n=e+(0===r?0:t-r)}return n},i=async(e,t)=>{let n=0;const i={},c=(e=>{const t=[];return e.buffers.forEach(e=>{const{uri:n}=e;t.push({type:"buffer",uri:n})}),e.images&&e.images.forEach(e=>{const{uri:n}=e;t.push({type:"image",uri:n})}),t})(e),a=await(async(e,t)=>{const n=e.map(e=>{const{uri:n}=e;return new Promise(async e=>{if(t){const r=n.split("/"),o=r[r.length-1].toLowerCase();e(t[o])}else{const t=await fetch(n);e(await t.arrayBuffer())}})});return new Promise(t=>{Promise.all(n).then(n=>{const r=e.map((e,t)=>{const{type:r}=e;return{index:t,type:r,data:n[t]}});t(r)})})})(c,t);return e.buffers.map((e,t)=>{delete e.uri,e.byteLength=a[t].data.byteLength,i[t]=n,n+=o(a[t].data.byteLength,4)}),e.images&&e.images.map((t,c)=>{const d=e.buffers.length+c;i[d]=n;const s={buffer:0,byteOffset:n,byteLength:a[d].data.byteLength};n+=o(a[d].data.byteLength,4);const f=e.bufferViews.length;e.bufferViews.push(s),t.bufferView=f,t.mimeType=(e=>{const t=Object.keys(r);for(let n=0;n<t.length;++n){const o=t[n];for(let t=0;t<r[o].length;++t){const n=r[o][t];if(e.toLowerCase().indexOf(n)>0)return o}}return"application/octet-stream"})(t.uri),delete t.uri}),{bufferMap:i,bufferSize:n,buffers:a}},c=async(e,t)=>{const n=JSON.parse(JSON.stringify(e)),{bufferMap:r,bufferSize:c,buffers:a}=await i(n,t);n.buffers=[{byteLength:c}];const d=(new TextEncoder).encode(JSON.stringify(n)),s=o(d.length,4),f=s-d.length,u=20+s+8+c,l=new ArrayBuffer(u),p=new DataView(l);let h=0;p.setUint32(h,1179937895,!0),h+=4,p.setUint32(h,2,!0),h+=4,p.setUint32(h,u,!0),h+=4,p.setUint32(h,s,!0),h+=4,p.setUint32(h,1313821514,!0),h+=4;for(let e=0;e<d.length;++e)p.setUint8(h,d[e]),h+=1;for(let e=0;e<f;++e)p.setUint8(h,32),h+=1;p.setUint32(h,c,!0),h+=4,p.setUint32(h,5130562,!0),h+=4;for(let e=0;e<a.length;++e){const t=h+r[e],n=new Uint8Array(a[e].data);for(let r=0;r<a[e].data.byteLength;++r)p.setUint8(t+r,n[r])}return l},a=e=>new Blob([e],{type:"model/json-binary"});n.d(t,"GLBfromGLTF",function(){return c}),n.d(t,"BLOBfromGLB",function(){return a})}])});