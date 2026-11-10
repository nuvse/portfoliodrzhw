(()=>{
const S=SITE,$=s=>document.querySelector(s),H=document.documentElement;
Object.assign(S.ui,{list:{ru:"список",en:"list"},grid:{ru:"сетка",en:"grid"},theme:{ru:"тема",en:"theme"},tag:{ru:"художница, Владивосток",en:"artist, Vladivostok"},see:{ru:"смотреть",en:"view"},zoom:{ru:"увеличить",en:"zoom"},docs:{ru:"Документы",en:"Documents"},open:{ru:"смотреть",en:"view"},close:{ru:"скрыть",en:"hide"},dl:{ru:"скачать",en:"download"}});
const st=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}};
let lang=st('lang')||(navigator.language.startsWith('ru')?'ru':'en');
let theme=st('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
let view=st('view')||'grid',letters=[],lt=[];
const L=[...S.projects].sort((a,b)=>b.year-a.year),T=o=>o[lang],U=k=>S.ui[k][lang];
const sub=p=>`${T(p.type)}, ${p.year}`,first=t=>(t.match(/^.*?[.?!](\s|$)/)||[t])[0];
function home(){document.title=T(S.name);
const sw=`<div class="sw">${['grid','list'].map(v=>`<button data-v="${v}" class="${view==v?'a':''}">${U(v)}</button>`).join('')}</div>`;
return `<section class="hero"><h1>${[...T(S.name)].map(c=>`<span>${c==' '?'&nbsp;':c}</span>`).join('')}</h1><p class="m">${U('tag')}</p></section>`+sw+(view=='grid'
?`<div class="grid">${L.map(p=>`<div class="rv"><a class="tile" data-cur="${U('see')}" href="#/p/${p.id}"><span class="ph">${T(p.title)}</span><img src="img/${p.id}/cover.jpg" alt="" onerror="this.remove()"><div class="ov"><h3>${T(p.title)}</h3><span>${sub(p)}</span><p>${first(T(p.text))}</p></div></a></div>`).join('')}</div>`
:`<div class="list">${L.map(p=>`<a class="row rv" href="#/p/${p.id}" data-id="${p.id}" data-ti="${T(p.title)}"><span class="t">${T(p.title)}</span><span class="m">${T(p.type)}</span><span class="m">${p.year}</span></a>`).join('')}</div>`)}
function proj(id){const i=L.findIndex(p=>p.id==id);if(i<0)return home();
const p=L[i],n=L[(i+1)%L.length],v=L[(i+L.length-1)%L.length];document.title=`${T(p.title)} — ${T(S.name)}`;
const g=p.images.length?`<div class="gw"><div class="car">${p.images.map((f,k)=>`<img class="sl" data-cur="${U('zoom')}" data-i="${k}" src="img/${p.id}/${f}" alt="" loading="lazy">`).join('')}</div><div class="cc"><button data-d="-1" aria-label="Prev">←</button><span class="m">1 / ${p.images.length}</span><button data-d="1" aria-label="Next">→</button></div></div>`:'';
return `<article class="pj"><div class="side"><a class="m" href="#/">← ${U('back')}</a><h1 style="margin-top:14px">${T(p.title)}</h1><p class="m">${sub(p)}</p></div>
<div>${g}${p.video?`<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${p.video}" allow="fullscreen" allowfullscreen loading="lazy"></iframe></div>`:''}
${p.embed?`<div class="embed"><button class="start" data-src="${p.embed}">${U('start')}</button></div><a class="m" target="_blank" rel="noopener" href="${p.embed}">${U('full')} ↗</a>`:''}
<p class="tx rv">${T(p.text)}</p>
<div class="pn"><a href="#/p/${v.id}">← ${T(v.title)}</a><a href="#/p/${n.id}">${T(n.title)} →</a></div></div></article>`}
const cont=()=>`<div class="cl">${S.contacts.map(c=>`<a href="${c.url}" target="_blank" rel="noopener"><span class="m">${c.name}</span><span>${c.text}</span><span>↗</span></a>`).join('')}</div>`;
const about=()=>{document.title=`${U('about')} — ${T(S.name)}`;
return `<div class="ab"><h1>${U('about')}</h1><div>${S.about[lang].map(t=>`<p class="rv">${t}</p>`).join('')}</div>
${S.docs.length?`<h1 class="dd">${U('docs')}</h1><div class="dd">${S.docs.map(d=>`<div class="doc" data-f="${d.file}"><span>${T(d.title)}</span><span class="ac"><button class="vw">${U('open')}</button><a href="${d.file}" download>${U('dl')}</a></span></div><div class="pbx"></div>`).join('')}</div>`:''}
<h1>${U('contact')}</h1><div>${cont()}</div></div>`};
const contact=()=>{document.title=`${U('contact')} — ${T(S.name)}`;return `<div class="ab"><h1>${U('contact')}</h1><div>${cont()}</div></div>`};
const pv=$('#pv'),pi=pv.querySelector('img'),ps=pv.querySelector('span');
const LB=$('#lb'),li=LB.querySelector('img'),lc=$('#lc');let ls=[],lj=0;
function lb(i,s){if(s)ls=s;lj=(i+ls.length)%ls.length;li.src=ls[lj];lc.textContent=`${lj+1} / ${ls.length}`;LB.classList.add('on')}
const lx=()=>LB.classList.remove('on');
$('#lx').onclick=lx;$('#lp').onclick=()=>lb(lj-1);$('#ln').onclick=()=>lb(lj+1);LB.onclick=e=>{if(e.target==LB)lx()};
addEventListener('keydown',e=>{if(!LB.classList.contains('on'))return;if(e.key=='Escape')lx();if(e.key=='ArrowLeft')lb(lj-1);if(e.key=='ArrowRight')lb(lj+1)});
let tx=0;LB.ontouchstart=e=>tx=e.touches[0].clientX;LB.ontouchend=e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)lb(lj+(d<0?1:-1))};
function route(){const[,p,id]=location.hash.split('/'),a=$('#app');
a.style.animation='none';a.offsetWidth;a.style.animation='';scrollTo(0,0);pv.classList.remove('on');
a.innerHTML=p=='p'?proj(id):p=='about'?about():p=='contact'?contact():home();
letters=[...a.querySelectorAll('.hero h1 span')];lt=letters.map(()=>({y:0,r:0}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});
a.querySelectorAll('.rv').forEach((e,i)=>{e.style.transitionDelay=Math.min(i%4,3)*.08+'s';io.observe(e)});
a.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{view=b.dataset.v;st('view',view);route()});
a.querySelectorAll('.start').forEach(b=>b.onclick=()=>{const f=document.createElement('iframe');f.src=b.dataset.src;f.allow='autoplay; fullscreen';f.allowFullscreen=true;b.replaceWith(f)});
a.querySelectorAll('.row').forEach(r=>{r.onmouseenter=()=>{ps.textContent=r.dataset.ti;pi.style.display='none';pi.onload=()=>pi.style.display='block';pi.src=`img/${r.dataset.id}/cover.jpg`;pv.classList.add('on')};r.onmouseleave=()=>pv.classList.remove('on')});
a.querySelectorAll('.tile').forEach(t=>{const im=t.querySelector('img');
t.onmousemove=e=>{const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`;if(im)im.style.transform=`scale(1.14) translate(${-x*30}px,${-y*30}px)`};
t.onmouseleave=()=>{t.style.transform='';if(im)im.style.transform=''}});
const car=a.querySelector('.car');if(car){const cn=a.querySelector('.cc span'),n=car.children.length;
car.onscroll=()=>cn.textContent=`${Math.round(car.scrollLeft/car.clientWidth)+1} / ${n}`;
a.querySelectorAll('.cc button').forEach(b=>b.onclick=()=>car.scrollBy({left:b.dataset.d*car.clientWidth,behavior:'smooth'}));
car.querySelectorAll('.sl').forEach(im=>im.onclick=()=>lb(+im.dataset.i,[...car.children].map(x=>x.src)))}
a.querySelectorAll('.doc').forEach(d=>{const bx=d.nextElementSibling,b=d.querySelector('.vw');
b.onclick=()=>{if(bx.firstChild){bx.innerHTML='';b.textContent=U('open')}else{bx.innerHTML=`<iframe class="pb" src="${d.dataset.f}#view=FitH"></iframe>`;b.textContent=U('close')}}});
if(location.protocol!='file:')Promise.all([...a.querySelectorAll('.doc')].map(d=>fetch(d.dataset.f,{method:'HEAD'}).then(r=>{if(!r.ok){d.nextElementSibling.remove();d.remove()}}).catch(()=>{}))).then(()=>{if(!a.querySelector('.doc'))a.querySelectorAll('.dd').forEach(e=>e.remove())})}
function go(){const a=$('#app');a.classList.add('out');setTimeout(()=>{a.classList.remove('out');route()},220)}
function apply(){H.lang=lang;H.dataset.theme=theme;$('#lang').textContent=lang=='ru'?'EN':'RU';
document.querySelectorAll('header [data-t]').forEach(e=>e.textContent=U(e.dataset.t));
$('#logo').textContent=$('#fn').textContent=T(S.name);$('#yr').textContent=new Date().getFullYear();route()}
$('#lang').onclick=()=>{lang=lang=='ru'?'en':'ru';st('lang',lang);apply()};
$('#theme').onclick=()=>{theme=theme=='dark'?'light':'dark';st('theme',theme);apply()};
addEventListener('hashchange',go);
const cur=$('#cur');let mx=-99,my=-99,px=0,py=0;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;document.body.classList.add('mv');cur.style.transform=`translate(${mx}px,${my}px)`});
document.addEventListener('mouseover',e=>{const t=e.target,c=t.closest('[data-cur]');cur.textContent=c?c.dataset.cur:'';cur.classList.toggle('lbl',!!c);cur.classList.toggle('big',!c&&!!t.closest('a,button'));document.body.classList.toggle('nc',t.tagName=='IFRAME')});
(function lp(){px+=(mx-px)*.14;py+=(my-py)*.14;pv.style.transform=`translate(${px+28>innerWidth-340?px-348:px+28}px,${py+28}px)`;
if(letters.length&&scrollY<600){const h=letters[0].offsetParent.getBoundingClientRect();
letters.forEach((s,i)=>{const dx=mx-(h.left+s.offsetLeft+s.offsetWidth/2),dy=my-(h.top+s.offsetTop+s.offsetHeight/2),k=Math.max(0,1-Math.hypot(dx,dy)/210),o=lt[i];
o.y+=(-k*38-o.y)*.12;o.r+=(-dx*k*.025-o.r)*.12;s.style.transform=`translateY(${o.y}px) rotate(${o.r}deg)`})}
requestAnimationFrame(lp)})();
apply();
})();
