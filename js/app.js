(()=>{
const S=SITE,$=s=>document.querySelector(s),H=document.documentElement;
Object.assign(S.ui,{list:{ru:"список",en:"list"},grid:{ru:"сетка",en:"grid"},theme:{ru:"тема",en:"theme"}});
const st=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}};
let lang=st('lang')||(navigator.language.startsWith('ru')?'ru':'en');
let theme=st('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
let view=st('view')||'grid';
const L=[...S.projects].sort((a,b)=>b.year-a.year),T=o=>o[lang],U=k=>S.ui[k][lang];
const sub=p=>`${T(p.type)}, ${p.year}`;
const first=t=>(t.match(/^.*?[.?!](\s|$)/)||[t])[0];
function home(){document.title=T(S.name);
const sw=`<div class="sw">${['grid','list'].map(v=>`<button data-v="${v}" class="${view==v?'a':''}">${U(v)}</button>`).join('')}</div>`;
return sw+(view=='grid'
?`<div class="grid">${L.map(p=>`<a class="tile" href="#/p/${p.id}"><span class="ph">${T(p.title)}</span><img src="img/${p.id}/cover.jpg" alt="" onerror="this.remove()"><div class="ov"><h3>${T(p.title)}</h3><span>${sub(p)}</span><p>${first(T(p.text))}</p></div></a>`).join('')}</div>`
:`<div class="list">${L.map(p=>`<a class="row" href="#/p/${p.id}" data-id="${p.id}" data-ti="${T(p.title)}"><span class="t">${T(p.title)}</span><span class="m">${T(p.type)}</span><span class="m">${p.year}</span></a>`).join('')}</div>`)}
function proj(id){const i=L.findIndex(p=>p.id==id);if(i<0)return home();
const p=L[i],n=L[(i+1)%L.length],v=L[(i+L.length-1)%L.length];document.title=`${T(p.title)} — ${T(S.name)}`;
return `<article class="pj"><div class="side"><a class="m" href="#/">← ${U('back')}</a><h1 style="margin-top:14px">${T(p.title)}</h1><p class="m">${sub(p)}</p></div>
<div><p class="tx">${T(p.text)}</p>
${p.video?`<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${p.video}" allow="fullscreen" allowfullscreen loading="lazy"></iframe></div>`:''}
${p.embed?`<div class="embed"><button class="start" data-src="${p.embed}">${U('start')}</button></div><a class="m" target="_blank" rel="noopener" href="${p.embed}">${U('full')} ↗</a>`:''}
<div class="gal">${p.images.map(f=>`<img src="img/${p.id}/${f}" loading="lazy" alt="">`).join('')}</div>
<div class="pn"><a href="#/p/${v.id}">← ${T(v.title)}</a><a href="#/p/${n.id}">${T(n.title)} →</a></div></div></article>`}
const cont=()=>`<a href="mailto:${S.email}">${S.email}</a><br><a target="_blank" rel="noopener" href="https://instagram.com/${S.insta}">@${S.insta}</a>`;
const about=()=>{document.title=`${U('about')} — ${T(S.name)}`;return `<div class="ab"><h1>${U('about')}</h1><div>${S.about[lang].map(t=>`<p>${t}</p>`).join('')}</div><h1>${U('contact')}</h1><div><p>${cont()}</p></div></div>`};
const contact=()=>{document.title=`${U('contact')} — ${T(S.name)}`;return `<div class="ab"><h1>${U('contact')}</h1><div><p>${cont()}</p></div></div>`};
const pv=$('#pv'),pi=pv.querySelector('img'),ps=pv.querySelector('span');
function route(){const[,p,id]=location.hash.split('/'),a=$('#app');
a.style.animation='none';a.offsetWidth;a.style.animation='';scrollTo(0,0);pv.classList.remove('on');
a.innerHTML=p=='p'?proj(id):p=='about'?about():p=='contact'?contact():home();
a.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{view=b.dataset.v;st('view',view);route()});
a.querySelectorAll('.start').forEach(b=>b.onclick=()=>{const f=document.createElement('iframe');f.src=b.dataset.src;f.allow='autoplay; fullscreen';f.allowFullscreen=true;b.replaceWith(f)});
a.querySelectorAll('.row').forEach(r=>{r.onmouseenter=()=>{ps.textContent=r.dataset.ti;pi.style.display='none';pi.onload=()=>pi.style.display='block';pi.src=`img/${r.dataset.id}/cover.jpg`;pv.classList.add('on')};r.onmouseleave=()=>pv.classList.remove('on')});
a.querySelectorAll('.tile').forEach(t=>{const im=t.querySelector('img');if(!im)return;
t.onmousemove=e=>{const r=t.getBoundingClientRect();im.style.transform=`scale(1.12) translate(${-((e.clientX-r.left)/r.width-.5)*26}px,${-((e.clientY-r.top)/r.height-.5)*26}px)`};
t.onmouseleave=()=>im.style.transform=''})}
function apply(){H.lang=lang;H.dataset.theme=theme;$('#lang').textContent=lang=='ru'?'EN':'RU';
document.querySelectorAll('header [data-t]').forEach(e=>e.textContent=U(e.dataset.t));
$('#logo').textContent=$('#fn').textContent=T(S.name);$('#yr').textContent=new Date().getFullYear();route()}
$('#lang').onclick=()=>{lang=lang=='ru'?'en':'ru';st('lang',lang);apply()};
$('#theme').onclick=()=>{theme=theme=='dark'?'light':'dark';st('theme',theme);apply()};
addEventListener('hashchange',route);
const cur=$('#cur');let mx=-99,my=-99,px=0,py=0;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;document.body.classList.add('mv');cur.style.transform=`translate(${mx}px,${my}px)`});
document.addEventListener('mouseover',e=>{const t=e.target;cur.classList.toggle('big',!!t.closest('a,button'));document.body.classList.toggle('nc',t.tagName=='IFRAME')});
(function lp(){px+=(mx-px)*.14;py+=(my-py)*.14;const x=px+28>innerWidth-320?px-328:px+28;pv.style.transform=`translate(${x}px,${py+28}px)`;requestAnimationFrame(lp)})();
apply();
})();
