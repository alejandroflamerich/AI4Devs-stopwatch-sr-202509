// stopwatch-AF: soporta múltiples cronómetros y cuentas regresivas
(function(){
  const qs = (s)=>document.querySelector(s);
  const qsa = (s)=>Array.from(document.querySelectorAll(s));

  const typeEl = qs('#type');
  const labelEl = qs('#label');
  const durationEl = qs('#duration');
  const createBtn = qs('#create');
  const timersList = qs('#timersList');
  const requestPermBtn = qs('#requestPerm');

  let timers = []; // {id,type,label,startedAt,elapsed, running, duration, remaining, alarmed}

  const sound = (function(){
    // simple beep using WebAudio
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    return function play(){
      try{
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type='sine'; o.frequency.value = 880;
        o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime+0.01);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+1.2);
        o.stop(ctx.currentTime+1.25);
      }catch(e){console.warn('Audio failed',e)}
    }
  })();

  function uid(){return Math.random().toString(36).slice(2,9)}

  function parseHMS(str){
    const parts = str.split(':').map(p=>parseInt(p,10)||0);
    while(parts.length<3) parts.unshift(0);
    return parts[0]*3600+parts[1]*60+parts[2];
  }

  function formatHMS(sec){
    const s = Math.max(0, Math.floor(sec));
    const hh = String(Math.floor(s/3600)).padStart(2,'0');
    const mm = String(Math.floor(s%3600/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${hh}:${mm}:${ss}`;
  }

  function save(){ localStorage.setItem('stopwatch-AF:timers', JSON.stringify(timers)); }
  function load(){ try{ timers = JSON.parse(localStorage.getItem('stopwatch-AF:timers')||'[]')||[] }catch(e){timers=[]} }

  function render(){
    timersList.innerHTML='';
    timers.forEach(t=>{
      const li = document.createElement('li'); li.className='card'+(t.alarmed? ' finished':'');
      const left = document.createElement('div'); left.className='meta';
      const lbl = document.createElement('div'); lbl.innerHTML=`<div class="label">${t.label|| (t.type==='stopwatch'? 'Cronómetro':'Cuenta')}</div><div class="muted">${t.type}</div>`;
      const time = document.createElement('div'); time.className='time';
      if(t.type==='stopwatch'){
        time.textContent = formatHMS( (t.elapsed||0) + (t.running? ((Date.now()-t.startedAt)/1000):0) );
      }else{
        const rem = t.running? t.remaining - ((Date.now()-t.startedAt)/1000) : t.remaining;
        time.textContent = formatHMS(rem);
      }
      left.appendChild(lbl); left.appendChild(time);

      const controls = document.createElement('div'); controls.className='controls';
      const start = document.createElement('button'); start.textContent = t.running? 'Pausa':'Iniciar'; start.className='pill';
      start.addEventListener('click',()=>toggleStart(t.id));
      const reset = document.createElement('button'); reset.textContent='Reset'; reset.className='pill secondary'; reset.addEventListener('click',()=>resetTimer(t.id));
      const del = document.createElement('button'); del.textContent='Eliminar'; del.className='pill secondary'; del.addEventListener('click',()=>deleteTimer(t.id));
      controls.append(start,reset,del);

      li.append(left,controls);
      timersList.appendChild(li);
    });
  }

  function createTimer({type,label,duration}){
    const t = {id:uid(), type, label, running:false, startedAt:0, elapsed:0, duration:duration||0, remaining: duration||0, alarmed:false};
    timers.unshift(t); save(); render();
  }

  function toggleStart(id){
    const t = timers.find(x=>x.id===id); if(!t) return;
    if(t.running){
      // pause
      if(t.type==='stopwatch') t.elapsed += (Date.now()-t.startedAt)/1000;
      else t.remaining -= (Date.now()-t.startedAt)/1000;
      t.running=false; t.startedAt=0;
    }else{
      t.running=true; t.startedAt = Date.now(); t.alarmed=false;
    }
    save(); render();
  }

  function resetTimer(id){
    const t = timers.find(x=>x.id===id); if(!t) return;
    t.alarmed=false; t.running=false; t.startedAt=0; t.elapsed=0; t.remaining = t.duration; save(); render();
  }

  function deleteTimer(id){ timers = timers.filter(x=>x.id!==id); save(); render(); }

  function tick(){
    let changed=false;
    timers.forEach(t=>{
      if(t.running){
        if(t.type==='countdown'){
          const rem = t.remaining - ((Date.now()-t.startedAt)/1000);
          if(rem<=0 && !t.alarmed){
            // alarm
            t.alarmed=true; t.running=false; t.startedAt=0; t.remaining=0;
            notifyFinish(t);
            sound();
            changed=true;
          }
        }
      }
    });
    if(changed) save(); render();
  }

  function notifyFinish(t){
    const title = t.label || (t.type==='countdown'? 'Cuenta finalizada':'Cronómetro');
    if(window.Notification && Notification.permission==='granted'){
      try{ new Notification(title, {body: t.type==='countdown'? 'La cuenta regresiva terminó':'Listado', tag:t.id}); }catch(e){console.warn('Notif failed',e)}
    }
    // also flash title
    const old = document.title; document.title = '🔔 '+title; setTimeout(()=>document.title=old,4000);
  }

  function loop(){ tick(); render(); requestAnimationFrame(loop); }

  createBtn.addEventListener('click', ()=>{
    const type = typeEl.value; const label = labelEl.value.trim();
    if(type==='countdown'){
      const secs = parseHMS(durationEl.value);
      if(secs<=0){ alert('Introduce una duración válida'); return; }
      createTimer({type,label,duration:secs});
    }else{
      createTimer({type,label});
    }
    labelEl.value='';
  });

  typeEl.addEventListener('change', ()=>{
    qs('#countdownFields').style.display = typeEl.value==='countdown'? 'block':'none';
  });

  requestPermBtn.addEventListener('click', async ()=>{
    if(!('Notification' in window)){ alert('Las notificaciones no son soportadas en este navegador.'); return; }
    const r = await Notification.requestPermission(); alert('Permiso: '+r);
  });

  function restoreDefaults(){ load(); // ensure older items get defaults
    timers = (timers||[]).map(t=>Object.assign({running:false,startedAt:0,elapsed:0,remaining:t.duration||0,alarmed:false},t));
    save(); render();
  }

  // small initialization sample
  restoreDefaults();
  loop();

  // expose for debugging
  window._stopwatchAF = {timers, save, load, createTimer, toggleStart, resetTimer, deleteTimer};

})();
