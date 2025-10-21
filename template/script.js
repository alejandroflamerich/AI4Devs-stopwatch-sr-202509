// Simple countdown controller for template/index.html
(function(){
	const qs = s => document.querySelector(s);
	const timeEl = qs('.display .time');
	const msEl = qs('.display .ms');
	const startBtn = qs('.btn.start');
	const clearBtn = qs('.btn.clear');

	// Parse HH:MM:SS -> seconds
	function parseHMS(str){
		const parts = str.trim().split(':').map(p=>parseInt(p,10)||0);
		while(parts.length<3) parts.unshift(0);
		return parts[0]*3600 + parts[1]*60 + parts[2];
	}

	function formatHMS(sec){
		const s = Math.max(0, Math.floor(sec));
		const hh = String(Math.floor(s/3600)).padStart(2,'0');
		const mm = String(Math.floor(s%3600/60)).padStart(2,'0');
		const ss = String(s%60).padStart(2,'0');
		return `${hh}:${mm}:${ss}`;
	}

	function beep(){
		try{
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			const o = ctx.createOscillator();
			const g = ctx.createGain();
			o.type = 'sine'; o.frequency.value = 880;
			o.connect(g); g.connect(ctx.destination);
			g.gain.setValueAtTime(0.001, ctx.currentTime);
			g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime+0.01);
			o.start();
			g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+1.0);
			o.stop(ctx.currentTime+1.05);
		}catch(e){ console.warn('beep failed', e); }
	}

	// initial value from display
	const initialSeconds = parseHMS(timeEl ? timeEl.textContent : '00:08:00');
	let remaining = initialSeconds; // float seconds
	let running = false;
	let startTs = 0; // ms timestamp when started
	let raf = null;

	function updateDisplay(rem){
		if(!timeEl) return;
		const whole = Math.max(0, Math.floor(rem));
		const frac = Math.max(0, rem - whole);
		timeEl.textContent = formatHMS(whole);
		if(msEl) msEl.textContent = String(Math.floor(frac*1000)).padStart(3,'0');
	}

	function tick(){
		if(!running) return;
		const now = performance.now();
		const elapsed = (now - startTs)/1000; // seconds
		const newRem = remainingAtStart - elapsed;
		if(newRem <= 0){
			remaining = 0; running = false; cancelAnimationFrame(raf); raf = null;
			updateDisplay(0);
			startBtn.textContent = 'Start';
			// alarm
			beep();
			document.querySelector('.display').classList.add('finished');
			try{ if('Notification' in window && Notification.permission==='granted') new Notification('Cuenta finalizada'); }catch(e){}
			return;
		}
		updateDisplay(newRem);
		raf = requestAnimationFrame(tick);
	}

	let remainingAtStart = remaining; // value when start pressed

	startBtn.addEventListener('click', ()=>{
		if(!running){
			// start
			remainingAtStart = remaining;
			startTs = performance.now();
			running = true;
			startBtn.textContent = 'Pause';
			document.querySelector('.display').classList.remove('finished');
			raf = requestAnimationFrame(tick);
		}else{
			// pause
			const now = performance.now();
			const elapsed = (now - startTs)/1000;
			remaining = Math.max(0, remainingAtStart - elapsed);
			running = false;
			startBtn.textContent = 'Start';
			if(raf){ cancelAnimationFrame(raf); raf = null; }
			updateDisplay(remaining);
		}
	});

	clearBtn.addEventListener('click', ()=>{
		running = false;
		if(raf){ cancelAnimationFrame(raf); raf = null; }
		remaining = initialSeconds;
		startBtn.textContent = 'Start';
		document.querySelector('.display').classList.remove('finished');
		updateDisplay(remaining);
	});

	// initialize UI
	updateDisplay(remaining);

	// request notification permission on first user gesture (optional)
	document.addEventListener('click', function one(){
		if('Notification' in window && Notification.permission === 'default'){
			Notification.requestPermission().catch(()=>{});
		}
		document.removeEventListener('click', one);
	});

})();


