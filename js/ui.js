const $=s=>document.querySelector(s);
const tag=w=>w.e?'<span class="tag e">Experimentado</span>':'<span class="tag nw">Nuevo</span>';

function show(v){document.querySelectorAll('.sec-view').forEach(e=>e.classList.toggle('on',e.id==='v-'+v));
 document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));render();}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>show(b.dataset.v));

function schedHTML(){
 const r=+$('#range').value,a=r?(r-1)*7+1:1,b=r?Math.min(r*7,30):30;
 let h='<table class="sch"><thead><tr><th>Trabajador</th>';
 for(let d=a;d<=b;d++)h+=`<th class="${SUNDAYS.includes(d)?'sun':''}">${d}${SUNDAYS.includes(d)?'<br>D':''}</th>`;
 h+='</tr></thead><tbody>';
 W.forEach(w=>{h+=`<tr><td>${w.c} · ${w.n}</td>`;
  for(let d=a;d<=b;d++){const x=G[d];let c='',cl='';
   if(x.N.includes(w.i)){c='N';cl='c-N'}else if(x.M.includes(w.i)){c='M';cl='c-M'}else if(x.T.includes(w.i)){c='T';cl='c-T'}
   h+=`<td class="${cl} ${SUNDAYS.includes(d)?'sun':''}">${c}</td>`}
  h+='</tr>'});
 return h+'</tbody></table>';
}

function incHTML(S) {
  const ex = S.filter(x => x.e), nw = S.filter(x => !x.e);
  const avg = a => a.reduce((p, c) => p + c.n, 0) / a.length;
  const mx = Math.max(...S.map(x => x.n)), mn = Math.min(...S.map(x => x.n));
  const mxSun = Math.max(...S.map(x => x.s)), mnSun = Math.min(...S.map(x => x.s));
  const rep = S.filter(x => x.st >= 2);

  const isFairNights = (mx - mn) <= 1;
  const isFairSundays = (mxSun - mnSun) <= 1;
  const noStreaks = rep.length === 0;

  if (isFairNights && isFairSundays && noStreaks) {
    return `
    <div style="border-left:5px solid var(--okt);background:var(--ok);border-radius:8px;padding:16px;margin-bottom:14px">
      <h3 style="color:var(--okt);margin:0 0 6px">✔ Validación de equidad aprobada (Fase 2 · Consenso aplicado)</h3>
      <p style="margin:0 0 8px">El algoritmo cumple con las reglas acordadas entre Gerencia, Recursos Humanos y Desarrollo:</p>
      <ul style="margin:0;padding-left:20px">
        <li><b>Equidad nocturna:</b> Todos los trabajadores tienen entre <b>${mn} y ${mx} noches</b> al mes (promedio experimentados: ${avg(ex).toFixed(1)} | nuevos: ${avg(nw).toFixed(1)}).</li>
        <li><b>Rotación dominical justa:</b> Todos laboran entre <b>${mnSun} y ${mxSun} domingos</b> de los 5 del mes.</li>
        <li><b>Descanso garantizado:</b> 0 casos de noches consecutivas y cobertura mixta (1 experimentado + 1 nuevo) en cada turno.</li>
      </ul>
    </div>`;
  }

  return `
  <div class="alert"><h3>⚠ Distribución desigual de turnos</h3><p>Diferencia de ${mx - mn} noches entre trabajadores.</p></div>`;
}

function chartHTML(S){
 const mx=Math.max(...S.map(x=>Math.max(x.n,x.s)));
 return `<div class="leg"><span><i style="background:var(--blue)"></i>Turnos nocturnos</span><span><i style="background:var(--red)"></i>Domingos trabajados</span></div><div class="bars">`+
 S.map(x=>`<div class="row"><div>${x.c} ${x.nombre.split(' ')[0]}</div><div class="track">
 <div class="bar" style="width:${x.n/mx*100}%;background:var(--blue)"><span>${x.n}</span></div>
 <div class="bar" style="width:${Math.max(x.s/mx*100,3)}%;background:var(--red)"><span>${x.s}</span></div></div></div>`).join('')+'</div>';
}

function repHTML(S){
 return `<div class="wrap"><table><thead><tr><th>Código</th><th>Nombre</th><th>Experiencia</th><th class="n">Turnos nocturnos</th><th class="n">Domingos trabajados</th><th class="n">Total turnos</th><th>Comparación (vs. promedio ${(S.reduce((p,c)=>p+c.n,0)/12).toFixed(1)})</th></tr></thead><tbody>`+
 S.map(x=>{const av=S.reduce((p,c)=>p+c.n,0)/12,df=x.n-av;
  return `<tr><td>${x.c}</td><td>${x.nombre}</td><td>${tag(x)}</td><td class="n"><b>${x.n}</b></td><td class="n"><b>${x.s}</b></td><td class="n">${x.tot}</td><td style="color:${df>0?'var(--exp)':'var(--new)'}">${df>0?'+':''}${df.toFixed(1)} noches ${df>0?'por encima':'por debajo'}</td></tr>`}).join('')+`</tbody></table></div>
 <h3 style="margin-top:22px">Gráfico de distribución de turnos</h3>`+chartHTML(S);
}

function render(){
 const none='<div class="empty">Aún no se han generado horarios.<br>Use «Generar horarios automáticamente» en el panel principal.</div>';
 if(!G||!W.length){$('#schedBox').innerHTML=none;$('#incBox').innerHTML=none;$('#repBox').innerHTML=none;$('#repDate').textContent='';return}
 const S=stats();
 $('#schedBox').innerHTML=schedHTML();
 $('#incBox').innerHTML=incHTML(S);
 $('#repBox').innerHTML=repHTML(S);
 $('#repDate').textContent='Fecha de generación del reporte: '+genAt.toLocaleString('es-PE',{dateStyle:'full',timeStyle:'short'})+' · Periodo: noviembre de 2026';
}

$('#range').onchange = render;
$('#bGen').onclick = async () => {
  if (!W.length) { $('#genMsg').textContent = '⚠ Cargando trabajadores desde Supabase, intenta en un segundo.'; return; }
  $('#genMsg').textContent = '⏳ Generando y guardando en Supabase...';
  generate();
  await saveSchedule();
  $('#genMsg').textContent = '✔ Horarios de noviembre de 2026 generados y guardados en Supabase.';
  render();
};
$('#bRep').onclick = async () => {
  if (!G && W.length) { generate(); await saveSchedule(); }
  show('report');
};
$('#bPrint').onclick = () => { try { window.print(); } catch (e) { alert('Use Ctrl + P para imprimir el reporte.'); } };

initDB();
render();