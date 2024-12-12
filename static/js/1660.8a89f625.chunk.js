/*! For license information please see 1660.8a89f625.chunk.js.LICENSE.txt */
(self.webpackChunk_swarm_swarm=self.webpackChunk_swarm_swarm||[]).push([[1660],{77242:t=>{"use strict";var e,i="object"===typeof Reflect?Reflect:null,n=i&&"function"===typeof i.apply?i.apply:function(t,e,i){return Function.prototype.apply.call(t,e,i)};e=i&&"function"===typeof i.ownKeys?i.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var r=Number.isNaN||function(t){return t!==t};function s(){s.init.call(this)}t.exports=s,t.exports.once=function(t,e){return new Promise((function(i,n){function r(i){t.removeListener(e,s),n(i)}function s(){"function"===typeof t.removeListener&&t.removeListener("error",r),i([].slice.call(arguments))}v(t,e,s,{once:!0}),"error"!==e&&function(t,e,i){"function"===typeof t.on&&v(t,"error",e,i)}(t,r,{once:!0})}))},s.EventEmitter=s,s.prototype._events=void 0,s.prototype._eventsCount=0,s.prototype._maxListeners=void 0;var h=10;function o(t){if("function"!==typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function a(t){return void 0===t._maxListeners?s.defaultMaxListeners:t._maxListeners}function l(t,e,i,n){var r,s,h,l;if(o(i),void 0===(s=t._events)?(s=t._events=Object.create(null),t._eventsCount=0):(void 0!==s.newListener&&(t.emit("newListener",e,i.listener?i.listener:i),s=t._events),h=s[e]),void 0===h)h=s[e]=i,++t._eventsCount;else if("function"===typeof h?h=s[e]=n?[i,h]:[h,i]:n?h.unshift(i):h.push(i),(r=a(t))>0&&h.length>r&&!h.warned){h.warned=!0;var u=new Error("Possible EventEmitter memory leak detected. "+h.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");u.name="MaxListenersExceededWarning",u.emitter=t,u.type=e,u.count=h.length,l=u,console&&console.warn&&console.warn(l)}return t}function u(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function f(t,e,i){var n={fired:!1,wrapFn:void 0,target:t,type:e,listener:i},r=u.bind(n);return r.listener=i,n.wrapFn=r,r}function c(t,e,i){var n=t._events;if(void 0===n)return[];var r=n[e];return void 0===r?[]:"function"===typeof r?i?[r.listener||r]:[r]:i?function(t){for(var e=new Array(t.length),i=0;i<e.length;++i)e[i]=t[i].listener||t[i];return e}(r):p(r,r.length)}function _(t){var e=this._events;if(void 0!==e){var i=e[t];if("function"===typeof i)return 1;if(void 0!==i)return i.length}return 0}function p(t,e){for(var i=new Array(e),n=0;n<e;++n)i[n]=t[n];return i}function v(t,e,i,n){if("function"===typeof t.on)n.once?t.once(e,i):t.on(e,i);else{if("function"!==typeof t.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof t);t.addEventListener(e,(function r(s){n.once&&t.removeEventListener(e,r),i(s)}))}}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return h},set:function(t){if("number"!==typeof t||t<0||r(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");h=t}}),s.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},s.prototype.setMaxListeners=function(t){if("number"!==typeof t||t<0||r(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},s.prototype.getMaxListeners=function(){return a(this)},s.prototype.emit=function(t){for(var e=[],i=1;i<arguments.length;i++)e.push(arguments[i]);var r="error"===t,s=this._events;if(void 0!==s)r=r&&void 0===s.error;else if(!r)return!1;if(r){var h;if(e.length>0&&(h=e[0]),h instanceof Error)throw h;var o=new Error("Unhandled error."+(h?" ("+h.message+")":""));throw o.context=h,o}var a=s[t];if(void 0===a)return!1;if("function"===typeof a)n(a,this,e);else{var l=a.length,u=p(a,l);for(i=0;i<l;++i)n(u[i],this,e)}return!0},s.prototype.addListener=function(t,e){return l(this,t,e,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(t,e){return l(this,t,e,!0)},s.prototype.once=function(t,e){return o(e),this.on(t,f(this,t,e)),this},s.prototype.prependOnceListener=function(t,e){return o(e),this.prependListener(t,f(this,t,e)),this},s.prototype.removeListener=function(t,e){var i,n,r,s,h;if(o(e),void 0===(n=this._events))return this;if(void 0===(i=n[t]))return this;if(i===e||i.listener===e)0===--this._eventsCount?this._events=Object.create(null):(delete n[t],n.removeListener&&this.emit("removeListener",t,i.listener||e));else if("function"!==typeof i){for(r=-1,s=i.length-1;s>=0;s--)if(i[s]===e||i[s].listener===e){h=i[s].listener,r=s;break}if(r<0)return this;0===r?i.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(i,r),1===i.length&&(n[t]=i[0]),void 0!==n.removeListener&&this.emit("removeListener",t,h||e)}return this},s.prototype.off=s.prototype.removeListener,s.prototype.removeAllListeners=function(t){var e,i,n;if(void 0===(i=this._events))return this;if(void 0===i.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==i[t]&&(0===--this._eventsCount?this._events=Object.create(null):delete i[t]),this;if(0===arguments.length){var r,s=Object.keys(i);for(n=0;n<s.length;++n)"removeListener"!==(r=s[n])&&this.removeAllListeners(r);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"===typeof(e=i[t]))this.removeListener(t,e);else if(void 0!==e)for(n=e.length-1;n>=0;n--)this.removeListener(t,e[n]);return this},s.prototype.listeners=function(t){return c(this,t,!0)},s.prototype.rawListeners=function(t){return c(this,t,!1)},s.listenerCount=function(t,e){return"function"===typeof t.listenerCount?t.listenerCount(e):_.call(t,e)},s.prototype.listenerCount=_,s.prototype.eventNames=function(){return this._eventsCount>0?e(this._events):[]}},73104:(t,e,i)=>{var n=i(8276),r=n.Buffer;function s(t,e){for(var i in t)e[i]=t[i]}function h(t,e,i){return r(t,e,i)}r.from&&r.alloc&&r.allocUnsafe&&r.allocUnsafeSlow?t.exports=n:(s(n,e),e.Buffer=h),h.prototype=Object.create(r.prototype),s(r,h),h.from=function(t,e,i){if("number"===typeof t)throw new TypeError("Argument must not be a number");return r(t,e,i)},h.alloc=function(t,e,i){if("number"!==typeof t)throw new TypeError("Argument must be a number");var n=r(t);return void 0!==e?"string"===typeof i?n.fill(e,i):n.fill(e):n.fill(0),n},h.allocUnsafe=function(t){if("number"!==typeof t)throw new TypeError("Argument must be a number");return r(t)},h.allocUnsafeSlow=function(t){if("number"!==typeof t)throw new TypeError("Argument must be a number");return n.SlowBuffer(t)}},50721:(t,e,i)=>{var n=i(73104).Buffer;function r(t,e){this._block=n.alloc(t),this._finalSize=e,this._blockSize=t,this._len=0}r.prototype.update=function(t,e){"string"===typeof t&&(e=e||"utf8",t=n.from(t,e));for(var i=this._block,r=this._blockSize,s=t.length,h=this._len,o=0;o<s;){for(var a=h%r,l=Math.min(s-o,r-a),u=0;u<l;u++)i[a+u]=t[o+u];o+=l,(h+=l)%r===0&&this._update(i)}return this._len+=s,this},r.prototype.digest=function(t){var e=this._len%this._blockSize;this._block[e]=128,this._block.fill(0,e+1),e>=this._finalSize&&(this._update(this._block),this._block.fill(0));var i=8*this._len;if(i<=4294967295)this._block.writeUInt32BE(i,this._blockSize-4);else{var n=(4294967295&i)>>>0,r=(i-n)/4294967296;this._block.writeUInt32BE(r,this._blockSize-8),this._block.writeUInt32BE(n,this._blockSize-4)}this._update(this._block);var s=this._hash();return t?s.toString(t):s},r.prototype._update=function(){throw new Error("_update must be implemented by subclass")},t.exports=r},31617:(t,e,i)=>{var n=t.exports=function(t){t=t.toLowerCase();var e=n[t];if(!e)throw new Error(t+" is not supported (we accept pull requests)");return new e};n.sha=i(13735),n.sha1=i(5e3),n.sha224=i(79919),n.sha256=i(12878),n.sha384=i(47022),n.sha512=i(12527)},13735:(t,e,i)=>{var n=i(51339),r=i(50721),s=i(73104).Buffer,h=[1518500249,1859775393,-1894007588,-899497514],o=new Array(80);function a(){this.init(),this._w=o,r.call(this,64,56)}function l(t){return t<<30|t>>>2}function u(t,e,i,n){return 0===t?e&i|~e&n:2===t?e&i|e&n|i&n:e^i^n}n(a,r),a.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this},a.prototype._update=function(t){for(var e,i=this._w,n=0|this._a,r=0|this._b,s=0|this._c,o=0|this._d,a=0|this._e,f=0;f<16;++f)i[f]=t.readInt32BE(4*f);for(;f<80;++f)i[f]=i[f-3]^i[f-8]^i[f-14]^i[f-16];for(var c=0;c<80;++c){var _=~~(c/20),p=0|((e=n)<<5|e>>>27)+u(_,r,s,o)+a+i[c]+h[_];a=o,o=s,s=l(r),r=n,n=p}this._a=n+this._a|0,this._b=r+this._b|0,this._c=s+this._c|0,this._d=o+this._d|0,this._e=a+this._e|0},a.prototype._hash=function(){var t=s.allocUnsafe(20);return t.writeInt32BE(0|this._a,0),t.writeInt32BE(0|this._b,4),t.writeInt32BE(0|this._c,8),t.writeInt32BE(0|this._d,12),t.writeInt32BE(0|this._e,16),t},t.exports=a},5e3:(t,e,i)=>{var n=i(51339),r=i(50721),s=i(73104).Buffer,h=[1518500249,1859775393,-1894007588,-899497514],o=new Array(80);function a(){this.init(),this._w=o,r.call(this,64,56)}function l(t){return t<<5|t>>>27}function u(t){return t<<30|t>>>2}function f(t,e,i,n){return 0===t?e&i|~e&n:2===t?e&i|e&n|i&n:e^i^n}n(a,r),a.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this},a.prototype._update=function(t){for(var e,i=this._w,n=0|this._a,r=0|this._b,s=0|this._c,o=0|this._d,a=0|this._e,c=0;c<16;++c)i[c]=t.readInt32BE(4*c);for(;c<80;++c)i[c]=(e=i[c-3]^i[c-8]^i[c-14]^i[c-16])<<1|e>>>31;for(var _=0;_<80;++_){var p=~~(_/20),v=l(n)+f(p,r,s,o)+a+i[_]+h[p]|0;a=o,o=s,s=u(r),r=n,n=v}this._a=n+this._a|0,this._b=r+this._b|0,this._c=s+this._c|0,this._d=o+this._d|0,this._e=a+this._e|0},a.prototype._hash=function(){var t=s.allocUnsafe(20);return t.writeInt32BE(0|this._a,0),t.writeInt32BE(0|this._b,4),t.writeInt32BE(0|this._c,8),t.writeInt32BE(0|this._d,12),t.writeInt32BE(0|this._e,16),t},t.exports=a},79919:(t,e,i)=>{var n=i(51339),r=i(12878),s=i(50721),h=i(73104).Buffer,o=new Array(64);function a(){this.init(),this._w=o,s.call(this,64,56)}n(a,r),a.prototype.init=function(){return this._a=3238371032,this._b=914150663,this._c=812702999,this._d=4144912697,this._e=4290775857,this._f=1750603025,this._g=1694076839,this._h=3204075428,this},a.prototype._hash=function(){var t=h.allocUnsafe(28);return t.writeInt32BE(this._a,0),t.writeInt32BE(this._b,4),t.writeInt32BE(this._c,8),t.writeInt32BE(this._d,12),t.writeInt32BE(this._e,16),t.writeInt32BE(this._f,20),t.writeInt32BE(this._g,24),t},t.exports=a},12878:(t,e,i)=>{var n=i(51339),r=i(50721),s=i(73104).Buffer,h=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],o=new Array(64);function a(){this.init(),this._w=o,r.call(this,64,56)}function l(t,e,i){return i^t&(e^i)}function u(t,e,i){return t&e|i&(t|e)}function f(t){return(t>>>2|t<<30)^(t>>>13|t<<19)^(t>>>22|t<<10)}function c(t){return(t>>>6|t<<26)^(t>>>11|t<<21)^(t>>>25|t<<7)}function _(t){return(t>>>7|t<<25)^(t>>>18|t<<14)^t>>>3}n(a,r),a.prototype.init=function(){return this._a=1779033703,this._b=3144134277,this._c=1013904242,this._d=2773480762,this._e=1359893119,this._f=2600822924,this._g=528734635,this._h=1541459225,this},a.prototype._update=function(t){for(var e,i=this._w,n=0|this._a,r=0|this._b,s=0|this._c,o=0|this._d,a=0|this._e,p=0|this._f,v=0|this._g,d=0|this._h,w=0;w<16;++w)i[w]=t.readInt32BE(4*w);for(;w<64;++w)i[w]=0|(((e=i[w-2])>>>17|e<<15)^(e>>>19|e<<13)^e>>>10)+i[w-7]+_(i[w-15])+i[w-16];for(var g=0;g<64;++g){var y=d+c(a)+l(a,p,v)+h[g]+i[g]|0,b=f(n)+u(n,r,s)|0;d=v,v=p,p=a,a=o+y|0,o=s,s=r,r=n,n=y+b|0}this._a=n+this._a|0,this._b=r+this._b|0,this._c=s+this._c|0,this._d=o+this._d|0,this._e=a+this._e|0,this._f=p+this._f|0,this._g=v+this._g|0,this._h=d+this._h|0},a.prototype._hash=function(){var t=s.allocUnsafe(32);return t.writeInt32BE(this._a,0),t.writeInt32BE(this._b,4),t.writeInt32BE(this._c,8),t.writeInt32BE(this._d,12),t.writeInt32BE(this._e,16),t.writeInt32BE(this._f,20),t.writeInt32BE(this._g,24),t.writeInt32BE(this._h,28),t},t.exports=a},47022:(t,e,i)=>{var n=i(51339),r=i(12527),s=i(50721),h=i(73104).Buffer,o=new Array(160);function a(){this.init(),this._w=o,s.call(this,128,112)}n(a,r),a.prototype.init=function(){return this._ah=3418070365,this._bh=1654270250,this._ch=2438529370,this._dh=355462360,this._eh=1731405415,this._fh=2394180231,this._gh=3675008525,this._hh=1203062813,this._al=3238371032,this._bl=914150663,this._cl=812702999,this._dl=4144912697,this._el=4290775857,this._fl=1750603025,this._gl=1694076839,this._hl=3204075428,this},a.prototype._hash=function(){var t=h.allocUnsafe(48);function e(e,i,n){t.writeInt32BE(e,n),t.writeInt32BE(i,n+4)}return e(this._ah,this._al,0),e(this._bh,this._bl,8),e(this._ch,this._cl,16),e(this._dh,this._dl,24),e(this._eh,this._el,32),e(this._fh,this._fl,40),t},t.exports=a},12527:(t,e,i)=>{var n=i(51339),r=i(50721),s=i(73104).Buffer,h=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591],o=new Array(160);function a(){this.init(),this._w=o,r.call(this,128,112)}function l(t,e,i){return i^t&(e^i)}function u(t,e,i){return t&e|i&(t|e)}function f(t,e){return(t>>>28|e<<4)^(e>>>2|t<<30)^(e>>>7|t<<25)}function c(t,e){return(t>>>14|e<<18)^(t>>>18|e<<14)^(e>>>9|t<<23)}function _(t,e){return(t>>>1|e<<31)^(t>>>8|e<<24)^t>>>7}function p(t,e){return(t>>>1|e<<31)^(t>>>8|e<<24)^(t>>>7|e<<25)}function v(t,e){return(t>>>19|e<<13)^(e>>>29|t<<3)^t>>>6}function d(t,e){return(t>>>19|e<<13)^(e>>>29|t<<3)^(t>>>6|e<<26)}function w(t,e){return t>>>0<e>>>0?1:0}n(a,r),a.prototype.init=function(){return this._ah=1779033703,this._bh=3144134277,this._ch=1013904242,this._dh=2773480762,this._eh=1359893119,this._fh=2600822924,this._gh=528734635,this._hh=1541459225,this._al=4089235720,this._bl=2227873595,this._cl=4271175723,this._dl=1595750129,this._el=2917565137,this._fl=725511199,this._gl=4215389547,this._hl=327033209,this},a.prototype._update=function(t){for(var e=this._w,i=0|this._ah,n=0|this._bh,r=0|this._ch,s=0|this._dh,o=0|this._eh,a=0|this._fh,g=0|this._gh,y=0|this._hh,b=0|this._al,m=0|this._bl,E=0|this._cl,L=0|this._dl,B=0|this._el,I=0|this._fl,N=0|this._gl,C=0|this._hl,x=0;x<32;x+=2)e[x]=t.readInt32BE(4*x),e[x+1]=t.readInt32BE(4*x+4);for(;x<160;x+=2){var S=e[x-30],k=e[x-30+1],T=_(S,k),O=p(k,S),U=v(S=e[x-4],k=e[x-4+1]),A=d(k,S),j=e[x-14],z=e[x-14+1],M=e[x-32],P=e[x-32+1],R=O+z|0,F=T+j+w(R,O)|0;F=(F=F+U+w(R=R+A|0,A)|0)+M+w(R=R+P|0,P)|0,e[x]=F,e[x+1]=R}for(var D=0;D<160;D+=2){F=e[D],R=e[D+1];var K=u(i,n,r),q=u(b,m,E),W=f(i,b),G=f(b,i),H=c(o,B),J=c(B,o),Q=h[D],V=h[D+1],X=l(o,a,g),Y=l(B,I,N),Z=C+J|0,$=y+H+w(Z,C)|0;$=($=($=$+X+w(Z=Z+Y|0,Y)|0)+Q+w(Z=Z+V|0,V)|0)+F+w(Z=Z+R|0,R)|0;var tt=G+q|0,et=W+K+w(tt,G)|0;y=g,C=N,g=a,N=I,a=o,I=B,o=s+$+w(B=L+Z|0,L)|0,s=r,L=E,r=n,E=m,n=i,m=b,i=$+et+w(b=Z+tt|0,Z)|0}this._al=this._al+b|0,this._bl=this._bl+m|0,this._cl=this._cl+E|0,this._dl=this._dl+L|0,this._el=this._el+B|0,this._fl=this._fl+I|0,this._gl=this._gl+N|0,this._hl=this._hl+C|0,this._ah=this._ah+i+w(this._al,b)|0,this._bh=this._bh+n+w(this._bl,m)|0,this._ch=this._ch+r+w(this._cl,E)|0,this._dh=this._dh+s+w(this._dl,L)|0,this._eh=this._eh+o+w(this._el,B)|0,this._fh=this._fh+a+w(this._fl,I)|0,this._gh=this._gh+g+w(this._gl,N)|0,this._hh=this._hh+y+w(this._hl,C)|0},a.prototype._hash=function(){var t=s.allocUnsafe(64);function e(e,i,n){t.writeInt32BE(e,n),t.writeInt32BE(i,n+4)}return e(this._ah,this._al,0),e(this._bh,this._bl,8),e(this._ch,this._cl,16),e(this._dh,this._dl,24),e(this._eh,this._el,32),e(this._fh,this._fl,40),e(this._gh,this._gl,48),e(this._hh,this._hl,56),t},t.exports=a},21908:(t,e,i)=>{"use strict";var n=i(73104).Buffer,r=n.isEncoding||function(t){switch((t=""+t)&&t.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function s(t){var e;switch(this.encoding=function(t){var e=function(t){if(!t)return"utf8";for(var e;;)switch(t){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return t;default:if(e)return;t=(""+t).toLowerCase(),e=!0}}(t);if("string"!==typeof e&&(n.isEncoding===r||!r(t)))throw new Error("Unknown encoding: "+t);return e||t}(t),this.encoding){case"utf16le":this.text=a,this.end=l,e=4;break;case"utf8":this.fillLast=o,e=4;break;case"base64":this.text=u,this.end=f,e=3;break;default:return this.write=c,void(this.end=_)}this.lastNeed=0,this.lastTotal=0,this.lastChar=n.allocUnsafe(e)}function h(t){return t<=127?0:t>>5===6?2:t>>4===14?3:t>>3===30?4:t>>6===2?-1:-2}function o(t){var e=this.lastTotal-this.lastNeed,i=function(t,e,i){if(128!==(192&e[0]))return t.lastNeed=0,"\ufffd";if(t.lastNeed>1&&e.length>1){if(128!==(192&e[1]))return t.lastNeed=1,"\ufffd";if(t.lastNeed>2&&e.length>2&&128!==(192&e[2]))return t.lastNeed=2,"\ufffd"}}(this,t);return void 0!==i?i:this.lastNeed<=t.length?(t.copy(this.lastChar,e,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(t.copy(this.lastChar,e,0,t.length),void(this.lastNeed-=t.length))}function a(t,e){if((t.length-e)%2===0){var i=t.toString("utf16le",e);if(i){var n=i.charCodeAt(i.length-1);if(n>=55296&&n<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1],i.slice(0,-1)}return i}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=t[t.length-1],t.toString("utf16le",e,t.length-1)}function l(t){var e=t&&t.length?this.write(t):"";if(this.lastNeed){var i=this.lastTotal-this.lastNeed;return e+this.lastChar.toString("utf16le",0,i)}return e}function u(t,e){var i=(t.length-e)%3;return 0===i?t.toString("base64",e):(this.lastNeed=3-i,this.lastTotal=3,1===i?this.lastChar[0]=t[t.length-1]:(this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1]),t.toString("base64",e,t.length-i))}function f(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+this.lastChar.toString("base64",0,3-this.lastNeed):e}function c(t){return t.toString(this.encoding)}function _(t){return t&&t.length?this.write(t):""}e.I=s,s.prototype.write=function(t){if(0===t.length)return"";var e,i;if(this.lastNeed){if(void 0===(e=this.fillLast(t)))return"";i=this.lastNeed,this.lastNeed=0}else i=0;return i<t.length?e?e+this.text(t,i):this.text(t,i):e||""},s.prototype.end=function(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+"\ufffd":e},s.prototype.text=function(t,e){var i=function(t,e,i){var n=e.length-1;if(n<i)return 0;var r=h(e[n]);if(r>=0)return r>0&&(t.lastNeed=r-1),r;if(--n<i||-2===r)return 0;if(r=h(e[n]),r>=0)return r>0&&(t.lastNeed=r-2),r;if(--n<i||-2===r)return 0;if(r=h(e[n]),r>=0)return r>0&&(2===r?r=0:t.lastNeed=r-3),r;return 0}(this,t,e);if(!this.lastNeed)return t.toString("utf8",e);this.lastTotal=i;var n=t.length-(i-this.lastNeed);return t.copy(this.lastChar,0,n),t.toString("utf8",e,n)},s.prototype.fillLast=function(t){if(this.lastNeed<=t.length)return t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,t.length),this.lastNeed-=t.length}},57136:t=>{function e(t){try{if(!window.localStorage)return!1}catch(i){return!1}var e=window.localStorage[t];return null!=e&&"true"===String(e).toLowerCase()}t.exports=function(t,i){if(e("noDeprecation"))return t;var n=!1;return function(){if(!n){if(e("throwDeprecation"))throw new Error(i);e("traceDeprecation")?console.trace(i):console.warn(i),n=!0}return t.apply(this,arguments)}}}}]);
//# sourceMappingURL=1660.8a89f625.chunk.js.map