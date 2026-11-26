function generate() {
  const g = {};
  const nCount = Array(12).fill(0);
  const sCount = Array(12).fill(0);
  const totCount = Array(12).fill(0);
  let lastNights = new Set();

  for (let d = 1; d <= 30; d++) {
    const isSun = SUNDAYS.includes(d);
    const nextIsSun = SUNDAYS.includes(d + 1);
    const needN = d <= 26 ? 2 : 1;
    const usedToday = new Set();

    const expPool = [0, 1, 2, 3, 4, 5];
    const newPool = [6, 7, 8, 9, 10, 11];

    if (isSun) {
      const rankSun = (pool) => pool
        .filter(i => !usedToday.has(i) && !lastNights.has(i))
        .sort((a, b) => (sCount[a] - sCount[b]) || (totCount[a] - totCount[b]) || (nCount[a] - nCount[b]));

      const sunExp = rankSun(expPool).slice(0, 3);
      const sunNew = rankSun(newPool).slice(0, 3);

      sunExp.sort((a, b) => nCount[a] - nCount[b]);
      sunNew.sort((a, b) => nCount[a] - nCount[b]);

      const pickN = needN === 2 ? [sunExp[0], sunNew[0]] : [sunExp[0] < sunNew[0] ? sunExp[0] : sunNew[0]];
      const remExp = sunExp.filter(i => !pickN.includes(i));
      const remNew = sunNew.filter(i => !pickN.includes(i));

      const pickM = [remExp[0], remNew[0]];
      const pickT = [remExp[1], remNew[1]];

      [...pickN, ...pickM, ...pickT].forEach(i => { sCount[i]++; totCount[i]++; });
      pickN.forEach(i => nCount[i]++);

      g[d] = { M: pickM, T: pickT, N: pickN };
      lastNights = new Set(pickN);
      continue;
    }

    const rankCandidates = (pool, isNightShift) => {
      return pool
        .filter(i => !usedToday.has(i) && !lastNights.has(i))
        .sort((a, b) => {
          if (nextIsSun && isNightShift && sCount[a] !== sCount[b]) return sCount[b] - sCount[a];
          if (isNightShift && nCount[a] !== nCount[b]) return nCount[a] - nCount[b];
          if (totCount[a] !== totCount[b]) return totCount[a] - totCount[b];
          return ((a + d) % 12) - ((b + d) % 12);
        });
    };

    const pickN = [];
    const candExpN = rankCandidates(expPool, true);
    const candNewN = rankCandidates(newPool, true);

    if (needN === 2) {
      if (candExpN.length) pickN.push(candExpN[0]);
      if (candNewN.length) pickN.push(candNewN[0]);
    } else {
      const allN = rankCandidates([...expPool, ...newPool], true);
      if (allN.length) pickN.push(allN[0]);
    }
    pickN.forEach(i => { usedToday.add(i); nCount[i]++; totCount[i]++; });

    const pickM = [];
    const candExpM = rankCandidates(expPool, false);
    const candNewM = rankCandidates(newPool, false);
    if (candExpM.length) pickM.push(candExpM[0]);
    if (candNewM.length) pickM.push(candNewM[0]);
    pickM.forEach(i => { usedToday.add(i); totCount[i]++; });

    const pickT = [];
    const candExpT = rankCandidates(expPool, false);
    const candNewT = rankCandidates(newPool, false);
    if (candExpT.length) pickT.push(candExpT[0]);
    if (candNewT.length) pickT.push(candNewT[0]);
    pickT.forEach(i => { usedToday.add(i); totCount[i]++; });

    g[d] = { M: pickM, T: pickT, N: pickN };
    lastNights = new Set(pickN);
  }

  G = g;
  genAt = new Date();
}

function stats() {
  return W.map(w => {
    let n = 0, s = 0, st = 0, run = 0, m = 0, t = 0;
    for (let d = 1; d <= 30; d++) {
      const isN = G[d].N.includes(w.i);
      if (isN) { n++; run++; st = Math.max(st, run); } else run = 0;
      if (G[d].M.includes(w.i)) m++;
      if (G[d].T.includes(w.i)) t++;
      if (SUNDAYS.includes(d) && (isN || G[d].M.includes(w.i) || G[d].T.includes(w.i))) s++;
    }
    return { i: w.i, c: w.c, e: w.e, nombre: w.n, n, s, st, m, t, tot: n + m + t };
  });
}
