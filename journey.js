'use strict';
(() => {
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const stages=[
 {k:'EL SISTEMA DE LA PIEDRA CONECTADA',t:'La piedra<br> tiene <em>memoria.</em>',d:'Una identidad que nace en el origen y conecta cada corte, cada movimiento y cada nueva vida.',r:'IDENTIDAD PERSISTENTE',id:'ST—0248',l:'Origen → siguiente vida',v:'Un historial conectado'},
 {k:'01 / EL ORIGEN DE TODO',t:'Antes de ser<br> <em>arquitectura.</em>',d:'Procedencia, lote y características del material. El primer registro conecta el bloque con todo lo que vendrá después.',r:'ORIGEN DOCUMENTADO',id:'ST—0248',l:'Cantera · lote L-026',v:'Material + procedencia'},
 {k:'02 / LA FORMA CAMBIA',t:'Cada corte.<br> La misma <em>historia.</em>',d:'La tabla, la pieza y el retal reciben su propia identidad. La genealogía mantiene el vínculo con el bloque de origen.',r:'GENEALOGÍA DE MATERIAL',id:'ST—0248—A',l:'Bloque → tabla → pieza',v:'Retal R · origen conservado'},
 {k:'03 / LA INFORMACIÓN SE MUEVE',t:'La materia<br> entra en <em>flujo.</em>',d:'Lecturas y reglas conectan recepciones, ubicaciones y expediciones. Stock y albaranes parten de datos conciliados.',r:'MOVIMIENTO CON CONTEXTO',id:'EV—003',l:'Recepción · almacén A-03',v:'Propuesta → revisión → aceptación'},
 {k:'04 / EL ESPACIO CONECTADO',t:'Habitar<br> la <em>memoria.</em>',d:'Fachadas, pavimentos, escaleras y mobiliario conservan su identidad. Instalación, incidencias y cuidado se vinculan al elemento.',r:'HISTORIAL DEL ELEMENTO',id:'ST—0248—A',l:'Proyecto · elemento F-01',v:'Instalación + mantenimiento'},
 {k:'05 / UN NUEVO COMIENZO',t:'Otra forma.<br> Otra <em>vida.</em>',d:'La información acompaña la recuperación. Estado, dimensiones e historial ayudan a evaluar la aptitud para un nuevo uso.',r:'CONTINUIDAD CIRCULAR',id:'ST—0248—R',l:'Retal recuperado · zona R',v:'Nueva aplicación por evaluar'}
];
const section=$('#recorrido'), camera=$('#camera'), viewport=$('#world-viewport');
const stageBox=section.querySelector('.expedition-stage'),images=$$('.terrain-tile'),navButtons=$$('[data-go]');
const els=Object.fromEntries(['story-kicker','story-title','story-description','story-number','record-type','record-id','record-label','record-value','progress-bar','camera-time','focus-caption','journey-play','play-state','journey-scrub'].map(id=>[id,document.getElementById(id)]));
const labels=['Atlas','Origen','Forma','Flujo','Espacio','Reinicio'];
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const smooth=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
let progress=0,target=0,playing=false,last=0,raf=0,active=-1,visible=false,lastSecond=-1,top=0,span=1,internalScrollUntil=0,copyAnimation,viewW=1000,viewH=600;
const stops=[0,.18,.36,.54,.72,.90],duration=110000;
const route=$('#terrain-route-active'),routeLength=route.getTotalLength();route.style.strokeDasharray=routeLength;
function measure(){top=section.getBoundingClientRect().top+scrollY;span=Math.max(1,section.offsetHeight-stageBox.offsetHeight);viewW=viewport.clientWidth;viewH=viewport.clientHeight;}
function scrollProgress(){return clamp((scrollY-top)/span);}
function pointScroll(p,animated=false){window.scrollTo({top:top+clamp(p)*span,behavior:animated&&!reduced.matches?'smooth':'instant'});}
function showCopy(index){
 if(index===active)return;active=index;const s=stages[index];
 els['story-kicker'].textContent=s.k;els['story-title'].innerHTML=s.t;els['story-description'].textContent=s.d;els['story-number'].textContent=String(index).padStart(2,'0');els['record-type'].textContent=s.r;els['record-id'].textContent=s.id;els['record-label'].textContent=s.l;els['record-value'].textContent=s.v;
 navButtons.forEach((b,i)=>{b.classList.toggle('active',i===index);if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 if(els['camera-time'])els['camera-time'].nextElementSibling.textContent=String(index+1).padStart(2,'0')+' / 06';
 if(els['focus-caption'])els['focus-caption'].textContent=['IDENTIDAD / ORIGEN','LOTE / PROCEDENCIA','CORTE / GENEALOGÍA','LECTURA / MOVIMIENTO','ELEMENTO / HISTORIAL','RETAL / NUEVO DESTINO'][index];
 els['journey-scrub']?.setAttribute('aria-valuetext',labels[index]+', etapa '+(index+1)+' de 6');
 if(!reduced.matches&&visible){copyAnimation?.cancel();copyAnimation=els['story-title'].animate([{opacity:.35,transform:'translate3d(0,6px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:420,easing:'cubic-bezier(.2,.7,.2,1)'});}
}
// Fixed spatial coordinates: images stay in the same world for the entire trip.
// Only the camera transform changes. There are no image replacements or crossfades.
const poses=[
 [0,2180,650,4550], [.18,970,550,1840], [.36,2150,760,1810],
 [.54,2230,985,1510], [.72,3460,440,1750], [.90,3300,815,1830], [1,2180,650,4550]
];
function cameraAt(p){
 let i=0;while(i<poses.length-2&&p>poses[i+1][0])i++;
 const a=poses[i],b=poses[i+1],span=b[0]-a[0],u=clamp((p-a[0])/span);
 const out=[];
 for(let k=1;k<4;k++){
  const before=poses[Math.max(0,i-1)],after=poses[Math.min(poses.length-1,i+2)];
  const m0=i===0?0:(b[k]-before[k])/(b[0]-before[0]);
  const m1=i+1===poses.length-1?0:(after[k]-a[k])/(after[0]-a[0]);
  out.push((2*u*u*u-3*u*u+1)*a[k]+(u*u*u-2*u*u+u)*span*m0+(-2*u*u*u+3*u*u)*b[k]+(u*u*u-u*u)*span*m1);
 }
 return out;
}
function draw(p){
 const [cx,cy,field]=cameraAt(reduced.matches?0:p);const mobile=innerWidth<=760;
 const scale=viewW/(Math.max(1350,field)*(mobile?.89:1));
 const x=viewW*.5-cx*scale,y=viewH*.5-cy*scale;
 camera.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${scale.toFixed(6)})`;
 route.style.strokeDashoffset=(routeLength*(1-clamp(p/.90))).toFixed(2);
 els['progress-bar'].style.width='100%';els['progress-bar'].style.transform=`scaleX(${p})`;
 if(els['journey-scrub']&&document.activeElement!==els['journey-scrub'])els['journey-scrub'].value=Math.round(p*1000);
 const second=Math.floor(p*duration/1000);if(second!==lastSecond&&els['camera-time']){lastSecond=second;els['camera-time'].textContent=String(Math.floor(second/60)).padStart(2,'0')+':'+String(second%60).padStart(2,'0');}
 let nearest=0;stops.forEach((stop,i)=>{if(Math.abs(stop-p)<Math.abs(stops[nearest]-p))nearest=i;});showCopy(nearest);
}
function frame(time){
 raf=0;if(document.hidden||!visible){last=0;return;}
 const dt=last?Math.min(time-last,64):16.67;last=time;
 if(playing){progress=(progress+dt/duration)%1;target=progress;}
 else{const alpha=reduced.matches?1:1-Math.exp(-dt/230);progress+=(target-progress)*alpha;if(Math.abs(progress-target)<.00004)progress=target;}
 draw(progress);if(playing||Math.abs(progress-target)>.00004)raf=requestAnimationFrame(frame);else last=0;
}
function schedule(){if(visible&&!document.hidden&&!raf)raf=requestAnimationFrame(frame);}
function playbackUI(){els['journey-play'].setAttribute('aria-pressed',String(playing));els['journey-play'].setAttribute('aria-label',playing?'Pausar recorrido':'Reproducir recorrido en bucle');els['journey-play'].textContent=playing?'Ⅱ':'▶';els['play-state'].textContent=playing?'VIAJE EN CURSO':'EXPLORA A TU RITMO';}
function stop(align=true){if(!playing)return;playing=false;playbackUI();if(align&&visible){internalScrollUntil=performance.now()+120;pointScroll(progress);}target=progress;last=0;schedule();}
function go(p){stop(false);measure();pointScroll(p,true);}
navButtons.forEach(b=>b.addEventListener('click',()=>go(stops[Number(b.dataset.go)])));
if(els['journey-scrub']){
 els['journey-scrub'].addEventListener('pointerdown',()=>stop(false));
 els['journey-scrub'].addEventListener('input',e=>{stop(false);target=clamp(Number(e.target.value)/1000);internalScrollUntil=performance.now()+120;pointScroll(target);schedule();});
}
els['journey-play'].addEventListener('click',()=>{if(playing){stop();return;}measure();target=progress=scrollProgress();playing=true;playbackUI();last=0;schedule();});
window.addEventListener('scroll',()=>{if(playing||performance.now()<internalScrollUntil)return;target=scrollProgress();schedule();},{passive:true});
window.addEventListener('resize',()=>{measure();if(!playing)target=scrollProgress();schedule();},{passive:true});
new ResizeObserver(()=>{measure();if(!playing){target=scrollProgress();schedule();}}).observe(section);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){stop(false);if(raf)cancelAnimationFrame(raf);raf=0;last=0;}else{measure();if(!playing)target=scrollProgress();schedule();}},{rootMargin:'100px 0px'}).observe(section);
window.addEventListener('wheel',()=>stop(),{passive:true});
window.addEventListener('touchstart',e=>{if(!e.target.closest('#journey-play'))stop();},{passive:true});
window.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)&&e.target===document.body)stop();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop(false);if(raf)cancelAnimationFrame(raf);raf=0;}else{last=0;target=scrollProgress();schedule();}});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>stop(false)));
reduced.addEventListener('change',()=>{stop();target=progress=scrollProgress();draw(progress);});
measure();target=progress=scrollProgress();draw(progress);playbackUI();
new ResizeObserver(()=>{measure();draw(progress);}).observe(viewport);
Promise.allSettled(images.map(img=>img.decode())).then(()=>{measure();schedule();});

// Independent, isolated operational atlas. No external services or credentials.
const modal=$('#demo-modal');let opener;
$$('[data-open-demo]').forEach(b=>b.addEventListener('click',()=>{stop();opener=b;if(!$('#demo-frame').getAttribute('src')&&!$('#demo-frame').getAttribute('srcdoc')){if(window.IDSTONE_ATLAS_HTML)$('#demo-frame').srcdoc=window.IDSTONE_ATLAS_HTML;else $('#demo-frame').src='atlas.html';}modal.showModal();document.body.classList.add('modal-open');$('#demo-close').focus();}));
function closeModal(){modal.close();}
$('#demo-close').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});modal.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
const capabilities={
stock:{meta:'STOCK / ALBARANES',status:'RECEPCIÓN CONCILIADA',title:'Un movimiento. Datos compartidos.',text:'Una recepción validada actualiza la unidad y su ubicación. Las mismas referencias preparan el albarán, evitando volver a introducir los datos.',rows:[['ST—0248—A','Almacén A-03','Disponible'],['Pedido P-016','2 unidades','Preparación'],['Albarán AL-016','Origen + destino','Borrador']],note:'La disponibilidad global se confirma tras conciliar. Disponible, reservado, bloqueado y en tránsito son estados distintos. La autoridad del inventario, la emisión y la numeración del albarán se acuerdan con el sistema de gestión.'},
quality:{meta:'EVIDENCIAS / PROCEDIMIENTOS',status:'DATOS CON FUENTE',title:'Documentación que parte de hechos.',text:'Los eventos aceptados pueden rellenar lote, fecha, unidad y responsable. La plantilla conserva la referencia al dato de origen y señala los campos pendientes.',rows:[['Lote / unidad','Evento EV-0248','Prerrelleno'],['Fecha / responsable','Registro aceptado','Prerrelleno'],['Ensayo / aprobación','Revisión técnica','Pendiente']],note:'Las plantillas se adaptan al procedimiento ISO / UNE aplicable. Un dato registrado no sustituye el ensayo ni demuestra por sí solo conformidad.'},
people:{meta:'PERSONAS / EPIs',status:'ACCESO POR ROLES',title:'También cuenta quien hace el trabajo.',text:'Relaciona función, formación y autorizaciones con cada tarea. Gestiona alta y asignación de EPIs, entrega con acuse, devolución, revisiones y reposición según tipo e instrucciones. Avisos de vigencia e incidencias para revisión.',rows:[['EPI—083','Asignado a OP-02','En uso'],['Entrega / devolución','Fecha + responsable','Registrable'],['Inspección / vigencia','Regla del equipo','Por revisar']],note:'Identificadores de ejemplo. La asignación de un EPI no acredita su aptitud ni sustituye la evaluación preventiva o la formación.'},
space:{meta:'ARQUITECTURA / MANTENIMIENTO',status:'ELEMENTO CON HISTORIAL',title:'El edificio también puede recordar.',text:'Una placa de fachada, un banco o un peldaño pueden conservar el vínculo con su material. Las intervenciones se registran sobre el elemento concreto.',rows:[['Elemento F-01','Identidad ST-0248-A','Vinculado'],['Instalación','Foto + ubicación','Por validar'],['Mantenimiento','Incidencia + tarea','Historial']],note:'La instalación se documenta con contexto y evidencias. La lectura de la etiqueta identifica el elemento; no prueba automáticamente su correcta ejecución.'}
};
function capability(key){const c=capabilities[key];$$('[data-capability]').forEach(b=>{const selected=b.dataset.capability===key;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1;});const panel=$('#capability-panel');panel.setAttribute('aria-labelledby','tab-'+key);panel.innerHTML=`<div class="panel-meta"><span>${c.meta}</span><span>${c.status}</span></div><h3>${c.title}</h3><p>${c.text}</p><div class="mock-table">${c.rows.map(r=>'<div class="mock-row">'+r.map(v=>'<span>'+v+'</span>').join('')+'</div>').join('')}</div><p class="mini-note">${c.note}</p>`;}
$$('[data-capability]').forEach((b,i)=>{b.addEventListener('click',()=>capability(b.dataset.capability));b.addEventListener('keydown',e=>{const buttons=$$('[data-capability]');let n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%buttons.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+buttons.length-1)%buttons.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=buttons.length-1;else return;e.preventDefault();buttons[n].focus();capability(buttons[n].dataset.capability);});});
if($('#capability-panel'))capability('stock');
const key='idstone-journey-local-v4';let local={offline:true,events:[],next:1},persist=true;
try{const data=JSON.parse(localStorage.getItem(key)||'null');if(data&&Array.isArray(data.events))local={offline:data.offline!==false,events:data.events.filter(e=>e&&Number.isInteger(e.id)&&['pending','accepted'].includes(e.status)).slice(-100),next:Number.isInteger(data.next)&&data.next>0?data.next:1};}catch{persist=false;}
function saveLocal(){try{localStorage.setItem(key,JSON.stringify(local));}catch{persist=false;}}
function renderLocal(){if(!$('#local-count'))return;const pending=local.events.filter(e=>e.status==='pending');$('#local-count').textContent=String(pending.length).padStart(2,'0');$('#connection-mode').setAttribute('aria-pressed',String(local.offline));$('#connection-mode span').textContent=local.offline||!navigator.onLine?'Offline':'Online';$('#local-sync').disabled=local.offline||!navigator.onLine||!pending.length;$('#local-events').innerHTML=local.events.length?local.events.slice(-3).reverse().map(e=>`<div class="local-event"><span>EV—${String(e.id).padStart(3,'0')} · Movimiento</span><span>${e.status==='pending'?'Local / pendiente':'Conciliado · demo'}</span></div>`).join(''):'Sin eventos. Registra tu primer movimiento.';if(!persist)$('#local-status').textContent='Almacenamiento no disponible: los datos durarán esta sesión.';}
if($('#local-capture')){
$('#local-capture').addEventListener('click',()=>{if(local.events.length>=100){$('#local-status').textContent='Límite de 100 eventos de prueba. Reinicia para continuar.';return;}local.events.push({id:local.next++,status:'pending'});saveLocal();renderLocal();if(persist)$('#local-status').textContent='Movimiento guardado localmente. Pendiente de conciliación.';});
$('#connection-mode').addEventListener('click',()=>{local.offline=!local.offline;saveLocal();renderLocal();$('#local-status').textContent=local.offline?'Modo local: puedes seguir registrando.':!navigator.onLine?'El dispositivo sigue sin conexión. La cola local se conserva.':'Online elegido. Los eventos siguen pendientes hasta que concilies.';});
$('#local-sync').addEventListener('click',()=>{if(local.offline||!navigator.onLine)return;const n=local.events.filter(e=>e.status==='pending').length;local.events.forEach(e=>e.status='accepted');saveLocal();renderLocal();$('#local-status').textContent=`${n} ${n===1?'evento conciliado':'eventos conciliados'} en la simulación local. Ningún dato enviado.`;});
$('#local-reset').addEventListener('click',()=>{local={offline:true,events:[],next:1};saveLocal();renderLocal();$('#local-status').textContent='Prueba reiniciada. Puedes comenzar de nuevo.';});
window.addEventListener('offline',renderLocal);window.addEventListener('online',renderLocal);renderLocal();}
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
