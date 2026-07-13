(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const progress=$('#progress'),sticky=$('.sticky');let rafScroll=0;
function onScroll(){if(rafScroll)return;rafScroll=requestAnimationFrame(()=>{rafScroll=0;const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?scrollY/h*100:0)+'%';sticky?.classList.toggle('show',scrollY>520);updateLoss();})}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});
const revealIo='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealIo.unobserve(e.target)}}),{threshold:.12}):null;$$('.reveal').forEach(el=>revealIo?revealIo.observe(el):el.classList.add('visible'));
const money=n=>new Intl.NumberFormat('ru-RU').format(Math.round(n/1000)*1000)+' ₽';
function animateNumber(el,to,duration=650){if(!el)return;const from=Number(el.dataset.current||String(el.textContent).replace(/\D/g,'')||0),start=performance.now();cancelAnimationFrame(el._raf);function tick(now){const t=Math.min(1,(now-start)/duration),v=Math.round(from+(to-from)*(1-Math.pow(1-t,3)));el.textContent=money(v);if(t<1)el._raf=requestAnimationFrame(tick);else el.dataset.current=String(to)}el._raf=requestAnimationFrame(tick)}
const scratchRoot=$('#scratchPaths');
if(scratchRoot){
  let seed=23; const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  const svgNS='http://www.w3.org/2000/svg';
  const addPath=(x,y,x2,y2,cx1,cy1,cx2,cy2,opacity,width,color)=>{const p=document.createElementNS(svgNS,'path');p.setAttribute('d',`M${x.toFixed(1)},${y.toFixed(1)} C${cx1.toFixed(1)},${cy1.toFixed(1)} ${cx2.toFixed(1)},${cy2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`);p.setAttribute('stroke',color);p.setAttribute('stroke-opacity',opacity.toFixed(2));p.setAttribute('stroke-width',width.toFixed(2));scratchRoot.appendChild(p)};
  const scratchCount=matchMedia('(max-width:760px)').matches?58:92;
  for(let i=0;i<scratchCount;i++){const x=80+rnd()*840,y=70+rnd()*560,len=(i%4===0?45:18)+rnd()*(i%4===0?47:34),ang=[-.35,.18,.9,2.85][i%4]+(rnd()-.5)*.35,x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len,cx1=x+(x2-x)*.33+(rnd()-.5)*24,cy1=y+(y2-y)*.33+(rnd()-.5)*18,cx2=x+(x2-x)*.68+(rnd()-.5)*24,cy2=y+(y2-y)*.68+(rnd()-.5)*18;addPath(x,y,x2,y2,cx1,cy1,cx2,cy2,.10+rnd()*.24,.35+rnd()*.47,['#fff','#edf4f6','#b8c5ca'][i%3])}
}
const lab=$('#heroLab'),circle=$('#cleanCircle'),cursor=$('#polishCursor');let pointerMode=false,lastInteraction=0,heroStart=performance.now(),heroVisible=true;
function setPolish(px,py){if(!lab||!circle||!cursor)return;const r=lab.getBoundingClientRect(),x=Math.max(0,Math.min(1,(px-r.left)/r.width)),y=Math.max(0,Math.min(1,(py-r.top)/r.height));circle.setAttribute('cx',(x*1000).toFixed(1));circle.setAttribute('cy',(y*700).toFixed(1));cursor.style.left=(x*100)+'%';cursor.style.top=(y*100)+'%';}
if(lab){
  const isMobile=matchMedia('(max-width:760px)').matches;
  const place=e=>{pointerMode=true;lastInteraction=performance.now();setPolish(e.clientX,e.clientY)};
  lab.addEventListener('pointerdown',place);
  if(!isMobile){lab.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')place(e)});lab.addEventListener('pointerleave',()=>setTimeout(()=>pointerMode=false,900));}
  if('IntersectionObserver'in window)new IntersectionObserver(es=>heroVisible=es[0]?.isIntersecting??true,{threshold:.05}).observe(lab);
}
function heroLoop(now){if(heroVisible&&lab&&circle&&cursor&&(!pointerMode||now-lastInteraction>1500)&&!document.hidden&&!matchMedia('(prefers-reduced-motion: reduce)').matches){pointerMode=false;const t=(now-heroStart)/1000,x=.18+.64*((Math.sin(t*.58)+1)/2),y=.46+.16*Math.sin(t*.83);const r=lab.getBoundingClientRect();setPolish(r.left+x*r.width,r.top+y*r.height)}requestAnimationFrame(heroLoop)}requestAnimationFrame(heroLoop);
const lossSection=$('#loss'),lossSteps=$$('.loss-step'),lossMoney=$('#lossMoney'),readyValue=$('#readyValue'),readyRing=$('#readyRing');
function updateLoss(){if(!lossSection||!lossSteps.length)return;const sectionRect=lossSection.getBoundingClientRect();let idx=-1;if(sectionRect.top<innerHeight*.82){const mark=innerHeight*.68;lossSteps.forEach((step,i)=>{if(step.getBoundingClientRect().top<mark)idx=i});idx=Math.max(0,Math.min(lossSteps.length-1,idx));}lossSteps.forEach((step,i)=>step.classList.toggle('active',i===idx));let total=0;if(idx>=0)for(let i=0;i<=idx;i++)total+=Number(lossSteps[i].dataset.add||0);if(lossMoney&&Number(lossMoney.dataset.value||0)!==total){lossMoney.dataset.value=String(total);animateNumber(lossMoney,total,420)}const ready=idx>=0?(lossSteps[idx].dataset.ready||95):95;if(readyValue)readyValue.textContent=ready+'%';if(readyRing)readyRing.style.setProperty('--p',ready)}
const modes={replace:{label:'Сценарий A · Полная замена',title:'Разбираем готовую конструкцию и собираем процесс заново',money:312000,days:'18–21 день',saving:'Риск переноса сроков',savingText:'Пять этапов и несколько исполнителей',active:['measure','production','delivery','dismantle','finish']},restore:{label:'Сценарий B · Восстановление',title:'Работаем с установленным стеклом непосредственно на объекте',money:96000,days:'около 2 дней',saving:'Экономия 216 000 ₽',savingText:'Без производства, логистики и демонтажа',active:['measure','finish']}};
const modeButtons=$$('.mode-switch button'),modeLabel=$('#modeLabel'),modeTitle=$('#modeTitle'),modeMoney=$('#modeMoney'),modeDays=$('#modeDays'),modeSaving=$('#modeSaving'),modeSavingText=$('#modeSavingText'),timelineItems=$$('.timeline-item');let modeTouched=false,autoMode='replace';
function setMode(name,user=false){const m=modes[name];if(!m)return;if(user)modeTouched=true;modeButtons.forEach(b=>b.classList.toggle('active',b.dataset.mode===name));modeLabel.textContent=m.label;modeTitle.textContent=m.title;animateNumber(modeMoney,m.money);modeDays.textContent=m.days;modeSaving.textContent=m.saving;modeSavingText.textContent=m.savingText;timelineItems.forEach(el=>el.classList.toggle('off',!m.active.includes(el.dataset.step)));autoMode=name}
modeButtons.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode,true)));setMode('replace');const switchSection=$('#switch');if(switchSection&&'IntersectionObserver'in window){const guideIo=new IntersectionObserver(es=>{if(es[0].isIntersecting){guideIo.disconnect();setTimeout(()=>{if(!modeTouched)setMode('restore')},1100)}},{threshold:.35});guideIo.observe(switchSection)}
const qualForm=$('#qualForm'),qualTitle=$('#qualTitle'),qualSaving=$('#qualSaving'),qualTime=$('#qualTime');
function qualify(){if(!qualForm)return null;const d=new FormData(qualForm),area=Math.max(.2,Number(d.get('area'))||.2),replacement=Number(d.get('replacement'))||0,damage=d.get('damage'),object=d.get('object');let low=28,high=52;if(area>10){low+=7;high+=9}if(replacement>150000){low+=7;high+=8}if(object==='construction'||object==='commercial'){low+=4;high+=5}if(damage==='construction'||damage==='haze'){low+=3;high+=4}if(damage==='welding'){low-=5;high-=3}low=Math.max(18,Math.min(55,low));high=Math.max(low+8,Math.min(67,high));qualSaving.textContent=low+'–'+high+'%';qualTime.textContent=area>20?'средний':'высокий';qualTitle.textContent=high>=60?'Высокий потенциал экономии — отправьте фото':'Восстановление имеет смысл рассмотреть';return{d,low,high}}
qualForm?.addEventListener('input',qualify);qualify();$('#sendQual')?.addEventListener('click',()=>{const r=qualify(),d=r.d,object=qualForm.object.options[qualForm.object.selectedIndex].text,damage=qualForm.damage.options[qualForm.damage.selectedIndex].text,repl=d.get('replacement')||'не указана';const text=`Здравствуйте. Хочу проверить возможность восстановления стекла.
Объект: ${object}
Площадь: ${d.get('area')} м²
Повреждение: ${damage}
Известная стоимость замены: ${repl} ₽
Готов отправить фотографии.`;window.open('https://t.me/zhukov_boss?text='+encodeURIComponent(text),'_blank','noopener')});
const countIo='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting||e.target.dataset.done)return;e.target.dataset.done='1';animateNumber(e.target,Number(e.target.dataset.target||e.target.dataset.count),700);countIo.unobserve(e.target)}),{threshold:.6}):null;$$('[data-count]').forEach(el=>{if(countIo){el.dataset.target=el.dataset.count;el.dataset.current='0';el.textContent='0 ₽';countIo.observe(el)}});
$$('[data-track]').forEach(el=>el.addEventListener('click',()=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:el.dataset.track})}));
onScroll();updateLoss();
})();