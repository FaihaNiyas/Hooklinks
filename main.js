(function(){
var VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
var FS=[
'precision highp float;',
'uniform vec2 res;uniform vec3 sph;uniform float rot;uniform float tilt;uniform sampler2D tex;uniform float ready;',
'float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
'void main(){',
' vec2 f=gl_FragCoord.xy;vec2 q=(f-sph.xy)/sph.z;float r2=dot(q,q);',
' vec3 col=vec3(0.);float a=0.;',
' vec2 g=floor(f/2.);float s=h(g);',
' if(s>0.9965){float tw=0.45+0.55*h(g+7.);col+=vec3(0.82,0.9,1.)*tw;a+=tw*0.8;}',
' if(r2<1.){',
'  float z=sqrt(1.-r2);vec3 n=vec3(q.x,q.y,z);',
'  float ct=cos(tilt),st=sin(tilt);n=vec3(n.x,n.y*ct-n.z*st,n.y*st+n.z*ct);',
'  float cr=cos(rot),sr=sin(rot);n=vec3(n.x*cr+n.z*sr,n.y,-n.x*sr+n.z*cr);',
'  float lat=asin(clamp(n.y,-1.,1.));float lon=atan(n.x,n.z);',
'  vec2 uv=vec2(lon/6.2831853+0.5,lat/3.1415927+0.5);',
'  vec3 t=texture2D(tex,uv).rgb*ready;',
'  vec3 lights=pow(t,vec3(1.15))*vec3(1.45,1.3,1.05);',
'  vec3 base=vec3(0.012,0.03,0.085)+t*0.25*vec3(0.4,0.6,1.);',
'  col=base+lights;',
'  col*=0.32+0.68*pow(z,0.6);',
'  col+=vec3(0.08,0.42,0.95)*pow(1.-z,2.6)*0.75;',
'  a=1.;',
' }else{',
'  float d=sqrt(r2)-1.;float gl=exp(-d*7.5)*0.6;',
'  vec3 gc=vec3(0.08,0.55,0.98)*gl;col=col*(1.-gl)+gc;a=max(a,gl);',
' }',
' gl_FragColor=vec4(col*a,a);',
'}'].join('\n');
document.querySelectorAll('canvas.globe').forEach(function(c){
 var gl=c.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:true});
 if(!gl)return;
 function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o;}
 var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
 if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;
 gl.useProgram(pr);
 var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 var lp=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
 var U={};['res','sph','rot','tilt','tex','ready'].forEach(function(k){U[k]=gl.getUniformLocation(pr,k);});
 var tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,1,1,0,gl.RGB,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0]));
 var ready=0;var img=new Image();
 img.onload=function(){gl.bindTexture(gl.TEXTURE_2D,tx);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
  gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);ready=1;t0=performance.now();};
 img.src='earth-night.jpg';
 var dpr=Math.min(window.devicePixelRatio||1,1.75),W=0,H=0,t0=performance.now();
 var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 function size(){var r=c.getBoundingClientRect();W=r.width;H=r.height;c.width=Math.max(1,Math.round(W*dpr));c.height=Math.max(1,Math.round(H*dpr));gl.viewport(0,0,c.width,c.height);}
 function draw(t){
  if(!W||!H)size();if(!W)return;
  var mobile=W<760,R=mobile?Math.min(W*0.8,H*0.5):Math.min(H*0.64,W*0.35),cy=mobile?H*0.5:H*0.6;
  var fade=Math.min(1,(t-t0)/900);
  gl.uniform2f(U.res,c.width,c.height);gl.uniform3f(U.sph,c.width/2,c.height-cy*dpr,R*dpr);
  gl.uniform1f(U.rot,(reduce?0:t*0.000045)-0.35);gl.uniform1f(U.tilt,-0.42);gl.uniform1f(U.ready,ready*fade);
  gl.uniform1i(U.tex,0);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 }
 function loop(t){if(c.offsetParent!==null)draw(t);if(!reduce||!ready)requestAnimationFrame(loop);else draw(t);}
 window.addEventListener('resize',size);window.addEventListener('hashchange',function(){setTimeout(function(){size();draw(performance.now());},30);});
 size();requestAnimationFrame(loop);
});})();


document.documentElement.classList.add('js');
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:0.12}):null;
function show(){var h=(location.hash||'#home').slice(1);if(!document.getElementById('pg-'+h))h='home';
document.querySelectorAll('.pg').forEach(function(p){p.hidden=p.id!=='pg-'+h});
var pg=document.getElementById('pg-'+h);pg.querySelectorAll('.rv').forEach(function(e){if(io)io.observe(e);else e.classList.add('in')});
window.scrollTo(0,0);}
window.addEventListener('hashchange',show);show();
document.querySelectorAll('.burger').forEach(function(b){b.addEventListener('click',function(){b.closest('.nav').classList.toggle('open');});});
document.querySelectorAll('.nav ul a').forEach(function(a){a.addEventListener('click',function(){a.closest('.nav').classList.remove('open')})});
document.querySelectorAll('.scroll-chip').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var p=a.closest('.hero2');window.scrollTo({top:p.offsetTop+p.offsetHeight-20,behavior:'smooth'});});});
document.querySelectorAll('form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var b=f.querySelector('button');if(b){b.textContent="Thanks! We'll be in touch.";}})});

(function(){function tone(){document.querySelectorAll('.nav').forEach(function(n){if(n.offsetParent===null&&getComputedStyle(n).position!=='fixed')return;var p=n.querySelector('.pill');if(!p)return;var r=p.getBoundingClientRect();if(!r.width)return;var y=r.top+r.height/2,dark=false;var xs=[r.left+r.width*0.2,r.left+r.width*0.5,r.left+r.width*0.8];xs.forEach(function(x){var st=document.elementsFromPoint(x,y);for(var i=0;i<st.length;i++){if(n.contains(st[i]))continue;if(st[i].closest('.dark,.foot'))dark=true;break;}});n.classList.toggle('on-dark',dark);});}
window.addEventListener('scroll',tone,{passive:true});window.addEventListener('resize',tone);window.addEventListener('hashchange',function(){setTimeout(tone,50)});setTimeout(tone,60);})();
(function(){function tt(){var on=window.scrollY>600;document.querySelectorAll('.to-top').forEach(function(b){b.classList.toggle('show',on)});}window.addEventListener('scroll',tt,{passive:true});document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.to-top');if(b){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});}});tt();})();
(function(){function mb(){var on=window.scrollY>window.innerHeight*0.55;document.querySelectorAll('.mbar').forEach(function(m){m.classList.toggle('show',on)});}window.addEventListener('scroll',mb,{passive:true});window.addEventListener('hashchange',function(){setTimeout(mb,60)});mb();})();
