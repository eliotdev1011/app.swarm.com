(self.webpackChunk_swarm_swarm=self.webpackChunk_swarm_swarm||[]).push([[4103],{74532:function(t,e){var r="undefined"!==typeof self?self:this,n=function(){function t(){this.fetch=!1,this.DOMException=r.DOMException}return t.prototype=r,new t}();!function(t){!function(e){var r="URLSearchParams"in t,n="Symbol"in t&&"iterator"in Symbol,o="FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),i="FormData"in t,s="ArrayBuffer"in t;if(s)var a=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],c=ArrayBuffer.isView||function(t){return t&&a.indexOf(Object.prototype.toString.call(t))>-1};function u(t){if("string"!==typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function l(t){return"string"!==typeof t&&(t=String(t)),t}function p(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return n&&(e[Symbol.iterator]=function(){return e}),e}function f(t){this.map={},t instanceof f?t.forEach((function(t,e){this.append(e,t)}),this):Array.isArray(t)?t.forEach((function(t){this.append(t[0],t[1])}),this):t&&Object.getOwnPropertyNames(t).forEach((function(e){this.append(e,t[e])}),this)}function d(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function y(t){return new Promise((function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}}))}function h(t){var e=new FileReader,r=y(e);return e.readAsArrayBuffer(t),r}function b(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function m(){return this.bodyUsed=!1,this._initBody=function(t){var e;this._bodyInit=t,t?"string"===typeof t?this._bodyText=t:o&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:i&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:r&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():s&&o&&((e=t)&&DataView.prototype.isPrototypeOf(e))?(this._bodyArrayBuffer=b(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):s&&(ArrayBuffer.prototype.isPrototypeOf(t)||c(t))?this._bodyArrayBuffer=b(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"===typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):r&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},o&&(this.blob=function(){var t=d(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?d(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(h)}),this.text=function(){var t=d(this);if(t)return t;if(this._bodyBlob)return function(t){var e=new FileReader,r=y(e);return e.readAsText(t),r}(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},i&&(this.formData=function(){return this.text().then(v)}),this.json=function(){return this.text().then(JSON.parse)},this}f.prototype.append=function(t,e){t=u(t),e=l(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},f.prototype.delete=function(t){delete this.map[u(t)]},f.prototype.get=function(t){return t=u(t),this.has(t)?this.map[t]:null},f.prototype.has=function(t){return this.map.hasOwnProperty(u(t))},f.prototype.set=function(t,e){this.map[u(t)]=l(e)},f.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},f.prototype.keys=function(){var t=[];return this.forEach((function(e,r){t.push(r)})),p(t)},f.prototype.values=function(){var t=[];return this.forEach((function(e){t.push(e)})),p(t)},f.prototype.entries=function(){var t=[];return this.forEach((function(e,r){t.push([r,e])})),p(t)},n&&(f.prototype[Symbol.iterator]=f.prototype.entries);var g=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function w(t,e){var r=(e=e||{}).body;if(t instanceof w){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new f(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,r||null==t._bodyInit||(r=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new f(e.headers)),this.method=function(t){var e=t.toUpperCase();return g.indexOf(e)>-1?e:t}(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&r)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(r)}function v(t){var e=new FormData;return t.trim().split("&").forEach((function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}})),e}function x(t){var e=new f;return t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach((function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();e.append(n,o)}})),e}function E(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new f(e.headers),this.url=e.url||"",this._initBody(t)}w.prototype.clone=function(){return new w(this,{body:this._bodyInit})},m.call(w.prototype),m.call(E.prototype),E.prototype.clone=function(){return new E(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},E.error=function(){var t=new E(null,{status:0,statusText:""});return t.type="error",t};var O=[301,302,303,307,308];E.redirect=function(t,e){if(-1===O.indexOf(e))throw new RangeError("Invalid status code");return new E(null,{status:e,headers:{location:t}})},e.DOMException=t.DOMException;try{new e.DOMException}catch(A){e.DOMException=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack},e.DOMException.prototype=Object.create(Error.prototype),e.DOMException.prototype.constructor=e.DOMException}function j(t,r){return new Promise((function(n,i){var s=new w(t,r);if(s.signal&&s.signal.aborted)return i(new e.DOMException("Aborted","AbortError"));var a=new XMLHttpRequest;function c(){a.abort()}a.onload=function(){var t={status:a.status,statusText:a.statusText,headers:x(a.getAllResponseHeaders()||"")};t.url="responseURL"in a?a.responseURL:t.headers.get("X-Request-URL");var e="response"in a?a.response:a.responseText;n(new E(e,t))},a.onerror=function(){i(new TypeError("Network request failed"))},a.ontimeout=function(){i(new TypeError("Network request failed"))},a.onabort=function(){i(new e.DOMException("Aborted","AbortError"))},a.open(s.method,s.url,!0),"include"===s.credentials?a.withCredentials=!0:"omit"===s.credentials&&(a.withCredentials=!1),"responseType"in a&&o&&(a.responseType="blob"),s.headers.forEach((function(t,e){a.setRequestHeader(e,t)})),s.signal&&(s.signal.addEventListener("abort",c),a.onreadystatechange=function(){4===a.readyState&&s.signal.removeEventListener("abort",c)}),a.send("undefined"===typeof s._bodyInit?null:s._bodyInit)}))}j.polyfill=!0,t.fetch||(t.fetch=j,t.Headers=f,t.Request=w,t.Response=E),e.Headers=f,e.Request=w,e.Response=E,e.fetch=j,Object.defineProperty(e,"__esModule",{value:!0})}({})}(n),n.fetch.ponyfill=!0,delete n.fetch.polyfill;var o=n;(e=o.fetch).default=o.fetch,e.fetch=o.fetch,e.Headers=o.Headers,e.Request=o.Request,e.Response=o.Response,t.exports=e},79505:t=>{"use strict";var e="%[a-f0-9]{2}",r=new RegExp("("+e+")|([^%]+?)","gi"),n=new RegExp("("+e+")+","gi");function o(t,e){try{return[decodeURIComponent(t.join(""))]}catch(i){}if(1===t.length)return t;e=e||1;var r=t.slice(0,e),n=t.slice(e);return Array.prototype.concat.call([],o(r),o(n))}function i(t){try{return decodeURIComponent(t)}catch(i){for(var e=t.match(r)||[],n=1;n<e.length;n++)e=(t=o(e,n).join("")).match(r)||[];return t}}t.exports=function(t){if("string"!==typeof t)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof t+"`");try{return t=t.replace(/\+/g," "),decodeURIComponent(t)}catch(e){return function(t){for(var r={"%FE%FF":"\ufffd\ufffd","%FF%FE":"\ufffd\ufffd"},o=n.exec(t);o;){try{r[o[0]]=decodeURIComponent(o[0])}catch(e){var s=i(o[0]);s!==o[0]&&(r[o[0]]=s)}o=n.exec(t)}r["%C2"]="\ufffd";for(var a=Object.keys(r),c=0;c<a.length;c++){var u=a[c];t=t.replace(new RegExp(u,"g"),r[u])}return t}(t)}}},89608:t=>{"use strict";t.exports=function(t,e){for(var r={},n=Object.keys(t),o=Array.isArray(e),i=0;i<n.length;i++){var s=n[i],a=t[s];(o?-1!==e.indexOf(s):e(s,a,t))&&(r[s]=a)}return r}},40988:(t,e,r)=>{"use strict";const n=r(63331),o=r(79505),i=r(22879),s=r(89608),a=Symbol("encodeFragmentIdentifier");function c(t){if("string"!==typeof t||1!==t.length)throw new TypeError("arrayFormatSeparator must be single character string")}function u(t,e){return e.encode?e.strict?n(t):encodeURIComponent(t):t}function l(t,e){return e.decode?o(t):t}function p(t){return Array.isArray(t)?t.sort():"object"===typeof t?p(Object.keys(t)).sort(((t,e)=>Number(t)-Number(e))).map((e=>t[e])):t}function f(t){const e=t.indexOf("#");return-1!==e&&(t=t.slice(0,e)),t}function d(t){const e=(t=f(t)).indexOf("?");return-1===e?"":t.slice(e+1)}function y(t,e){return e.parseNumbers&&!Number.isNaN(Number(t))&&"string"===typeof t&&""!==t.trim()?t=Number(t):!e.parseBooleans||null===t||"true"!==t.toLowerCase()&&"false"!==t.toLowerCase()||(t="true"===t.toLowerCase()),t}function h(t,e){c((e=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},e)).arrayFormatSeparator);const r=function(t){let e;switch(t.arrayFormat){case"index":return(t,r,n)=>{e=/\[(\d*)\]$/.exec(t),t=t.replace(/\[\d*\]$/,""),e?(void 0===n[t]&&(n[t]={}),n[t][e[1]]=r):n[t]=r};case"bracket":return(t,r,n)=>{e=/(\[\])$/.exec(t),t=t.replace(/\[\]$/,""),e?void 0!==n[t]?n[t]=[].concat(n[t],r):n[t]=[r]:n[t]=r};case"colon-list-separator":return(t,r,n)=>{e=/(:list)$/.exec(t),t=t.replace(/:list$/,""),e?void 0!==n[t]?n[t]=[].concat(n[t],r):n[t]=[r]:n[t]=r};case"comma":case"separator":return(e,r,n)=>{const o="string"===typeof r&&r.includes(t.arrayFormatSeparator),i="string"===typeof r&&!o&&l(r,t).includes(t.arrayFormatSeparator);r=i?l(r,t):r;const s=o||i?r.split(t.arrayFormatSeparator).map((e=>l(e,t))):null===r?r:l(r,t);n[e]=s};case"bracket-separator":return(e,r,n)=>{const o=/(\[\])$/.test(e);if(e=e.replace(/\[\]$/,""),!o)return void(n[e]=r?l(r,t):r);const i=null===r?[]:r.split(t.arrayFormatSeparator).map((e=>l(e,t)));void 0!==n[e]?n[e]=[].concat(n[e],i):n[e]=i};default:return(t,e,r)=>{void 0!==r[t]?r[t]=[].concat(r[t],e):r[t]=e}}}(e),n=Object.create(null);if("string"!==typeof t)return n;if(!(t=t.trim().replace(/^[?#&]/,"")))return n;for(const o of t.split("&")){if(""===o)continue;let[t,s]=i(e.decode?o.replace(/\+/g," "):o,"=");s=void 0===s?null:["comma","separator","bracket-separator"].includes(e.arrayFormat)?s:l(s,e),r(l(t,e),s,n)}for(const o of Object.keys(n)){const t=n[o];if("object"===typeof t&&null!==t)for(const r of Object.keys(t))t[r]=y(t[r],e);else n[o]=y(t,e)}return!1===e.sort?n:(!0===e.sort?Object.keys(n).sort():Object.keys(n).sort(e.sort)).reduce(((t,e)=>{const r=n[e];return Boolean(r)&&"object"===typeof r&&!Array.isArray(r)?t[e]=p(r):t[e]=r,t}),Object.create(null))}e.extract=d,e.parse=h,e.stringify=(t,e)=>{if(!t)return"";c((e=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},e)).arrayFormatSeparator);const r=r=>{return e.skipNull&&(null===(n=t[r])||void 0===n)||e.skipEmptyString&&""===t[r];var n},n=function(t){switch(t.arrayFormat){case"index":return e=>(r,n)=>{const o=r.length;return void 0===n||t.skipNull&&null===n||t.skipEmptyString&&""===n?r:null===n?[...r,[u(e,t),"[",o,"]"].join("")]:[...r,[u(e,t),"[",u(o,t),"]=",u(n,t)].join("")]};case"bracket":return e=>(r,n)=>void 0===n||t.skipNull&&null===n||t.skipEmptyString&&""===n?r:null===n?[...r,[u(e,t),"[]"].join("")]:[...r,[u(e,t),"[]=",u(n,t)].join("")];case"colon-list-separator":return e=>(r,n)=>void 0===n||t.skipNull&&null===n||t.skipEmptyString&&""===n?r:null===n?[...r,[u(e,t),":list="].join("")]:[...r,[u(e,t),":list=",u(n,t)].join("")];case"comma":case"separator":case"bracket-separator":{const e="bracket-separator"===t.arrayFormat?"[]=":"=";return r=>(n,o)=>void 0===o||t.skipNull&&null===o||t.skipEmptyString&&""===o?n:(o=null===o?"":o,0===n.length?[[u(r,t),e,u(o,t)].join("")]:[[n,u(o,t)].join(t.arrayFormatSeparator)])}default:return e=>(r,n)=>void 0===n||t.skipNull&&null===n||t.skipEmptyString&&""===n?r:null===n?[...r,u(e,t)]:[...r,[u(e,t),"=",u(n,t)].join("")]}}(e),o={};for(const s of Object.keys(t))r(s)||(o[s]=t[s]);const i=Object.keys(o);return!1!==e.sort&&i.sort(e.sort),i.map((r=>{const o=t[r];return void 0===o?"":null===o?u(r,e):Array.isArray(o)?0===o.length&&"bracket-separator"===e.arrayFormat?u(r,e)+"[]":o.reduce(n(r),[]).join("&"):u(r,e)+"="+u(o,e)})).filter((t=>t.length>0)).join("&")},e.parseUrl=(t,e)=>{e=Object.assign({decode:!0},e);const[r,n]=i(t,"#");return Object.assign({url:r.split("?")[0]||"",query:h(d(t),e)},e&&e.parseFragmentIdentifier&&n?{fragmentIdentifier:l(n,e)}:{})},e.stringifyUrl=(t,r)=>{r=Object.assign({encode:!0,strict:!0,[a]:!0},r);const n=f(t.url).split("?")[0]||"",o=e.extract(t.url),i=e.parse(o,{sort:!1}),s=Object.assign(i,t.query);let c=e.stringify(s,r);c&&(c="?".concat(c));let l=function(t){let e="";const r=t.indexOf("#");return-1!==r&&(e=t.slice(r)),e}(t.url);return t.fragmentIdentifier&&(l="#".concat(r[a]?u(t.fragmentIdentifier,r):t.fragmentIdentifier)),"".concat(n).concat(c).concat(l)},e.pick=(t,r,n)=>{n=Object.assign({parseFragmentIdentifier:!0,[a]:!1},n);const{url:o,query:i,fragmentIdentifier:c}=e.parseUrl(t,n);return e.stringifyUrl({url:o,query:s(i,r),fragmentIdentifier:c},n)},e.exclude=(t,r,n)=>{const o=Array.isArray(r)?t=>!r.includes(t):(t,e)=>!r(t,e);return e.pick(t,o,n)}},63331:t=>{"use strict";t.exports=t=>encodeURIComponent(t).replace(/[!'()*]/g,(t=>"%".concat(t.charCodeAt(0).toString(16).toUpperCase())))},22879:t=>{"use strict";t.exports=(t,e)=>{if("string"!==typeof t||"string"!==typeof e)throw new TypeError("Expected the arguments to be of type `string`");if(""===e)return[t];const r=t.indexOf(e);return-1===r?[t]:[t.slice(0,r),t.slice(r+e.length)]}}}]);
//# sourceMappingURL=4103.3a8a2fc4.chunk.js.map