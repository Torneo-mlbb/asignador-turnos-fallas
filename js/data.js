const SUPABASE_URL = 'https://oayrivzczrgahpgnlriv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_IIYBWCyhhrn-XxeTv2Wtfw_XnvzdvtA';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let W = [];
const SUNDAYS = [1, 8, 15, 22, 29];
let G = null, genAt = null;

async function initDB() {
  const { data: workers } = await db.from('trabajadores').select('*').order('id');
  if (workers && workers.length > 0) {
    W = workers.map(w => ({ i: w.id, c: w.codigo, n: w.nombre, e: w.experimentado }));
    $('#wBody').innerHTML = W.map(w => `<tr><td>${w.c}</td><td>${w.n}</td><td>${tag(w)}</td><td>Disponible</td></tr>`).join('');
  }

  const { data: sched } = await db.from('horarios').select('*').eq('periodo', '2026-11').order('creado_en', { ascending: false }).limit(1);
  if (sched && sched.length > 0) {
    G = sched[0].datos;
    genAt = new Date(sched[0].creado_en);
    render();
  }
}

async function saveSchedule() {
  await db.from('horarios').insert([{ periodo: '2026-11', datos: G }]);
}