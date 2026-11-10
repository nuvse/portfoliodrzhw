(()=>{
const S=SITE,$=s=>document.querySelector(s),H=document.documentElement;
Object.assign(S.ui,{list:{ru:"список",en:"list"},grid:{ru:"сетка",en:"grid"},theme:{ru:"тема",en:"theme"},all:{ru:"все",en:"all"},soon:{ru:"файл скоро появится",en:"file coming soon"},see:{ru:"смотреть",en:"view"},zoom:{ru:"увеличить",en:"zoom"},docs:{ru:"Документы",en:"Documents"},open:{ru:"открыть",en:"open"},dl:{ru:"скачать",en:"download"},intro:{ru:"Художница из Владивостока. Работает с видео, звуком, цифровыми изображениями и интерактивными системами.",en:"Artist based in Vladivostok, working with video, sound, digital images and interactive systems."}});
const st=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}};
let lang=st('lang')||(navigator.language.startsWith('ru')?'ru':'en');
let theme=st('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
let view=st('view')||'grid',flt='all',rt=0,CAR=null;
const L=[...S.projects].sort((a,b)=>b.year-a.year),T=o=>o[lang],U=k=>S.ui[k][lang];
const sub=p=>`${T(p.type)}, ${p.year}`,first=t=>(t.match(/^.*?[.?!](\s|$)/)||[t])[0];
/* поиск картинок: img/<id>/cover.jpg (обложка) и 1.jpg, 2.jpg, 3.jpg ... (галерея) */
const EX=['jpg','jpeg','png','webp','JPG','JPEG','PNG'];
const tryImg=b=>new Promise(r=>{let i=0;const nx=()=>{if(i>=EX.length)return r(null);const im=new Image(),u=`${b}.${EX[i++]}`;im.onload=()=>r(u);im.onerror=nx;im.src=u};nx()});
const COV={},GAL={};
const cover=id=>COV[id]||(COV[id]=tryImg(`img/${id}/cover`).then(u=>u||tryImg(`img/${id}/1`)));
const gallery=p=>p.images.length?Promise.resolve(p.images.map(f=>`img/${p.id}/${f}`)):GAL[p.id]||(GAL[p.id]=(async()=>{const o=[];for(let n=1;n<=40;n++){const u=await tryImg(`img/${p.id}/${n}`);if(!u)break;o.push(u)}return o})());
function home(){document.title=T(S.name);
const ys=['all',...new Set(L.map(p=>p.year))],ps=L.filter(p=>flt=='all'||p.year==flt);
const ctl=`<div class="ctl"><div class="chips">${ys.map(y=>`<button data-f="${y}" class="${flt==y?'a':''}">${y=='all'?U('all'):y}</button>`).join('')}</div><div class="sw">${['grid','list'].map(v=>`<button data-v="${v}" class="${view==v?'a':''}">${U(v)}</button>`).join('')}</div></div>`;
return `<p class="intro">${U('intro')}</p>`+ctl+(view=='grid'
?`<div class="grid">${ps.map(p=>`<a class="card rv" href="#/p/${p.id}"><div class="tile" data-id="${p.id}" data-cur="${U('see')}"><span class="ph">${T(p.title)}</span><div class="ov"><p>${first(T(p.text))}</p></div></div><div class="cap"><b>${T(p.title)}</b><span class="m">${sub(p)}</span></div></a>`).join('')}</div>`
:`<div class="list">${ps.map(p=>`<a class="row rv" href="#/p/${p.id}" data-id="${p.id}"><span class="t">${T(p.title)}</span><span class="m">${T(p.type)}</span><span class="m">${p.year}</span></a>`).join('')}</div>`)}
function proj(id){const i=L.findIndex(p=>p.id==id);if(i<0)return home();
const p=L[i],n=L[(i+1)%L.length],v=L[(i+L.length-1)%L.length];document.title=`${T(p.title)} — ${T(S.name)}`;
return `<article><div id="gw"></div><div class="pm"><div><a class="m" href="#/">← ${U('back')}</a><h1>${T(p.title)}</h1><p class="m">${sub(p)}</p></div>
<div><p class="tx">${T(p.text)}</p>${p.video?`<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${p.video}" allow="fullscreen" allowfullscreen loading="lazy"></iframe></div>`:''}
${p.embed?`<div class="embed"><button class="start" data-src="${p.embed}">${U('start')}</button></div><a class="m" target="_blank" rel="noopener" href="${p.embed}">${U('full')} ↗</a>`:''}</div></div>
<div class="pn"><a href="#/p/${v.id}">← ${T(v.title)}</a><a href="#/p/${n.id}">${T(n.title)} →</a></div></article>`}
function mountG(gw,list){
gw.innerHTML=`<div class="cw"><div class="car">${list.map((u,i)=>`<img class="sl" data-cur="${U('zoom')}" data-i="${i}" src="${u}" alt="">`).join('')}</div>${list.length>1?'<button class="ar l" data-d="-1" aria-label="Prev">←</button><button class="ar r" data-d="1" aria-label="Next">→</button>':''}</div><div class="bar"><span class="m cn"></span>${list.length>1?`<div class="th">${list.map((u,i)=>`<button data-i="${i}"><img src="${u}" alt=""></button>`).join('')}</div>`:''}</div>`;
const car=gw.querySelector('.car'),cn=gw.querySelector('.cn'),ths=[...gw.querySelectorAll('.th button')];CAR=car;
car.onscroll=()=>{const i=Math.round(car.scrollLeft/car.clientWidth);cn.textContent=`${i+1} / ${list.length}`;ths.forEach((b,k)=>b.classList.toggle('a',k==i))};car.onscroll();
gw.querySelectorAll('.ar').forEach(b=>b.onclick=()=>car.scrollBy({left:b.dataset.d*car.clientWidth,behavior:'smooth'}));
ths.forEach(b=>b.onclick=()=>car.scrollTo({left:b.dataset.i*car.clientWidth,behavior:'smooth'}));
car.querySelectorAll('.sl').forEach(im=>im.onclick=()=>lb(+im.dataset.i,list))}
const cont=()=>`<div class="cl">${S.contacts.map(c=>`<a href="${c.url}" target="_blank" rel="noopener"><span class="m">${c.name}</span><span>${c.text}</span><span>↗</span></a>`).join('')}</div>`;
const about=()=>{document.title=`${U('about')} — ${T(S.name)}`;
return `<div class="ab"><h1>${U('about')}</h1><div>${S.about[lang].map((t,i)=>`<p class="rv${i?'':' lead'}">${t}</p>`).join('')}</div>
<h1>${U('docs')}</h1><div class="cl">${S.docs.map(d=>`<a href="#/docs"><span class="m">PDF</span><span>${T(d.title)}</span><span>→</span></a>`).join('')}</div>
<h1>${U('contact')}</h1><div>${cont()}</div></div>`};
const docs=()=>{document.title=`${U('docs')} — ${T(S.name)}`;
return `<div class="dp"><h1>${U('docs')}</h1>${S.docs.map(d=>`<section class="dc" data-f="${d.file}"><div class="dh"><h2>${T(d.title)}</h2><span class="ac"><a href="${d.file}" target="_blank" rel="noopener">${U('open')}</a><a href="${d.file}" download>${U('dl')}</a></span></div><div class="pf"></div></section>`).join('')}</div>`};
const contact=()=>{document.title=`${U('contact')} — ${T(S.name)}`;return `<div class="ab"><h1>${U('contact')}</h1><div>${cont()}</div></div>`};
const pv=$('#pv'),pi=pv.querySelector('img'),LB=$('#lb'),li=LB.querySelector('img'),lc=$('#lc');let ls=[],lj=0;
function lb(i,s){if(s)ls=s;lj=(i+ls.length)%ls.length;li.src=ls[lj];lc.textContent=`${lj+1} / ${ls.length}`;LB.classList.add('on')}
const lx=()=>LB.classList.remove('on');
$('#lx').onclick=lx;$('#lp').onclick=()=>lb(lj-1);$('#ln').onclick=()=>lb(lj+1);LB.onclick=e=>{if(e.target==LB)lx()};
addEventListener('keydown',e=>{const k=e.key;if(LB.classList.contains('on')){if(k=='Escape')lx();if(k=='ArrowLeft')lb(lj-1);if(k=='ArrowRight')lb(lj+1);return}
if(CAR&&(k=='ArrowLeft'||k=='ArrowRight'))CAR.scrollBy({left:(k=='ArrowRight'?1:-1)*CAR.clientWidth,behavior:'smooth'})});
let tx=0;LB.ontouchstart=e=>tx=e.touches[0].clientX;LB.ontouchend=e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)lb(lj+(d<0?1:-1))};
function route(){const[,p,id]=location.hash.split('/'),a=$('#app'),tk=++rt;CAR=null;
a.style.animation='none';a.offsetWidth;a.style.animation='';scrollTo(0,0);pv.classList.remove('on');
document.querySelectorAll('nav a').forEach(x=>x.classList.toggle('on',x.getAttribute('href')=='#/'+(p=='p'||!p?'':p)));
a.innerHTML=p=='p'?proj(id):p=='about'?about():p=='docs'?docs():p=='contact'?contact():home();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06});
a.querySelectorAll('.rv').forEach((e,i)=>{e.style.transitionDelay=Math.min(i%4,3)*.08+'s';io.observe(e)});
a.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{view=b.dataset.v;st('view',view);route()});
a.querySelectorAll('[data-f]:not(.dc)').forEach(b=>b.onclick=()=>{flt=b.dataset.f;route()});
a.querySelectorAll('.start').forEach(b=>b.onclick=()=>{const f=document.createElement('iframe');f.src=b.dataset.src;f.allow='autoplay; fullscreen';f.allowFullscreen=true;b.replaceWith(f)});
a.querySelectorAll('.tile').forEach(t=>{cover(t.dataset.id).then(u=>{if(!u||tk!=rt)return;const im=new Image();im.alt='';im.onload=()=>im.classList.add('ok');im.src=u;t.prepend(im)});
t.onmousemove=e=>{const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,im=t.querySelector('img');t.style.transform=`perspective(900px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;if(im)im.style.transform=`scale(1.14) translate(${-x*28}px,${-y*28}px)`};
t.onmouseleave=()=>{t.style.transform='';const im=t.querySelector('img');if(im)im.style.transform=''}});
a.querySelectorAll('.row').forEach(r=>{r.onmouseenter=()=>{pv.classList.add('on');pi.style.display='none';cover(r.dataset.id).then(u=>{if(u&&pv.classList.contains('on')){pi.src=u;pi.style.display='block'}})};r.onmouseleave=()=>pv.classList.remove('on')});
const gw=a.querySelector('#gw');if(gw)gallery(L.find(x=>x.id==id)).then(l=>{if(tk!=rt)return;l.length?mountG(gw,l):gw.remove()});
a.querySelectorAll('.dc').forEach(d=>{const f=d.dataset.f,pf=d.querySelector('.pf'),ok=()=>pf.innerHTML=`<iframe src="${f}#view=FitH" title=""></iframe>`,no=()=>{pf.innerHTML=`<p class="m">${U('soon')}</p>`;d.querySelector('.ac').remove()};
location.protocol=='file:'?ok():fetch(f,{method:'HEAD'}).then(r=>r.ok?ok():no()).catch(no)})}
function go(){const a=$('#app');a.classList.add('out');setTimeout(()=>{a.classList.remove('out');route()},220)}
function apply(){H.lang=lang;H.dataset.theme=theme;$('#lang').textContent=lang=='ru'?'EN':'RU';
document.querySelectorAll('header [data-t]').forEach(e=>e.textContent=U(e.dataset.t));
$('#logo').textContent=T(S.name);$('#fn').textContent=T(S.name)+' · v4';$('#yr').textContent=new Date().getFullYear();route()}
$('#lang').onclick=()=>{lang=lang=='ru'?'en':'ru';st('lang',lang);apply()};
$('#theme').onclick=()=>{theme=theme=='dark'?'light':'dark';st('theme',theme);apply()};
addEventListener('hashchange',go);
const cur=$('#cur');let mx=-99,my=-99,px=0,py=0;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;document.body.classList.add('mv');cur.style.transform=`translate(${mx}px,${my}px)`});
document.addEventListener('mouseover',e=>{const t=e.target,c=t.closest('[data-cur]');cur.textContent=c?c.dataset.cur:'';cur.classList.toggle('lbl',!!c);cur.classList.toggle('big',!c&&!!t.closest('a,button'));document.body.classList.toggle('nc',t.tagName=='IFRAME')});
(function lp(){px+=(mx-px)*.14;py+=(my-py)*.14;pv.style.transform=`translate(${px+28>innerWidth-350?px-348:px+28}px,${py+28}px)`;requestAnimationFrame(lp)})();
apply();
})();
