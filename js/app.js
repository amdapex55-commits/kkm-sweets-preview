/* KKM Sweets & Nimco Center — front-end prototype (no backend) */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rs = n => '₨' + n.toLocaleString('en-PK');

  /* ── Catalogue ─────────────────────────────────────────────────────── */
  const PRODUCTS = [
    { id:'mithai-box',   name:'1 KG Mix Mithai Box', cat:'Sweets', img:'assets/products/1KG-MIX-MITHAI.png',      from:2700, was:3400, sizes:'1 kg tin', rating:5,   flag:'Best seller' },
    { id:'malai-khaja',  name:'Malai Khaja',         cat:'Sweets', img:'assets/products/MALAI-KHAJA.png',         from:399,  to:1399,  sizes:'250 g – 1 kg', rating:5 },
    { id:'habshi-halwa', name:'Habshi Halwa',        cat:'Sweets', img:'assets/products/HABSI-HALWA.png',         from:499,  to:1799,  sizes:'250 g – 1 kg', rating:5 },
    { id:'mix-nimco',    name:'Mix Nimco',           cat:'Nimco',  img:'assets/products/MIX-NIMCO.png',           from:149,  to:549,   sizes:'200 g – 1 kg', rating:5,  flag:'Counter favourite' },
    { id:'namkeen-chewra',name:'Namkeen Chewra',     cat:'Nimco',  img:'assets/products/NAMKEEN-CHEWRA.png',      from:199,  to:649,   sizes:'250 g – 1 kg', rating:5 },
    { id:'daal-moong',   name:'Fried Daal Moong',    cat:'Nimco',  img:'assets/products/DAAL-MOONG.png',          from:199,  to:649,   sizes:'250 g – 1 kg', rating:5 },
    { id:'crinkle-chips',name:'Plain Crinkle Chips', cat:'Chips',  img:'assets/products/PLAIN-CRINKLE-CHIPS.png', from:199,  to:599,   sizes:'150 g – 500 g', rating:5 },
    { id:'masala-chips', name:'Plain Masala Chips',  cat:'Chips',  img:'assets/products/PLAIN-MASALA-CHIPS.png',  from:199,  to:599,   sizes:'150 g – 500 g', rating:5 },
    { id:'fish-papar',   name:'Fish Papar',          cat:'Chips',  img:'assets/products/FISH-PAPAR.png',          from:199,  to:599,   sizes:'150 g – 500 g', rating:4 }
  ];

  const FAQS = [
    ['Do you deliver across Pakistan?','Yes. Karachi is same day when ordered before 4pm; other cities take two to three working days by courier.'],
    ['Is everything really made the same day?','Yes. The halwai starts before dawn and the counter is stocked by ten. Nothing is carried over to the next day.'],
    ['Do you make traditional Memon sweets?','That is the whole shop. Malai khaja, habshi halwa, patisa and the mix box all follow the recipes the family has used since 1948.'],
    ['Can I order in bulk for a wedding or Eid?','Yes — trays, gift boxes and wholesale nimco. Send us the headcount and the date and we will quote the same day.'],
    ['What else do you sell?','Mithai, nimco, chips, bakery snacks and raw material for other shops and home bakers.'],
    ['How is hygiene handled?','Everything is cooked in the shop karkhana, packed sealed by hand, and never re-bagged from open trays.'],
    ['Can I pay cash on delivery?','Yes, across Pakistan. Bank transfer is available for bulk orders.'],
    ['How do I place an order?','Add what you want to the order list here, or call the shop on 0322 1835325 and someone will take it down.']
  ];

  /* ── Ticker + marquee ──────────────────────────────────────────────── */
  const tick = ['Freshly made every morning','Jodia Bazar, Karachi','Since 1948','Cash on delivery',
                'Free shipping over ₨3,000','Wedding &amp; Eid trays','Same-day in Karachi'];
  $('#tickerRow').innerHTML = [...tick, ...tick].map(t => `<span>${t}</span>`).join('');

  const marq = ['Mithai','<em class="u">مٹھائی</em>','Nimco','<em class="u">نمکو</em>','Chips','<em class="u">چپس</em>'];
  $('#marqRow').innerHTML = [...marq, ...marq, ...marq].map(t => `<span>${t}</span>`).join('');

  /* ── The counter ───────────────────────────────────────────────────── */
  const grid = $('#grid'), gridEmpty = $('#gridEmpty');
  let filter = 'All', query = '';

  const priceHtml = p => p.was
    ? `${rs(p.from)} <s>${rs(p.was)}</s>`
    : `${rs(p.from)} – ${rs(p.to)}`;

  function renderGrid(){
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter(p =>
      (filter === 'All' || p.cat === filter) &&
      (!q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)));

    grid.innerHTML = list.map(p => `
      <article class="item">
        <div class="item__fig"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
        <div class="item__info">
          <div class="item__top">
            <span class="item__name">${p.name}</span>
            <span class="item__dots"></span>
            <span class="item__price">${priceHtml(p)}</span>
          </div>
          <div class="item__meta">
            <span class="item__cat">${p.cat === 'Sweets' ? 'Mithai' : p.cat}</span>
            <span class="dia"></span>
            <span>${p.sizes}</span>
            <span class="item__stars">${'★'.repeat(p.rating)}</span>
            ${p.flag ? `<span class="item__flag">${p.flag}</span>` : ''}
          </div>
          <button class="item__add" data-add="${p.id}">Add to order</button>
        </div>
      </article>`).join('');

    gridEmpty.hidden = list.length > 0;
  }

  $$('#filters .tab').forEach(btn => btn.addEventListener('click', () => {
    $$('#filters .tab').forEach(b => {
      b.classList.toggle('is-on', b === btn);
      b.setAttribute('aria-selected', String(b === btn));
    });
    filter = btn.dataset.cat;
    renderGrid();
  }));

  $$('.kind[data-filter]').forEach(a => a.addEventListener('click', () => {
    const chip = $$('#filters .tab').find(c => c.dataset.cat === a.dataset.filter);
    if (chip) chip.click();
  }));

  $('#searchInput').addEventListener('input', e => { query = e.target.value; renderGrid(); });
  renderGrid();

  /* ── Ask (accordion) ───────────────────────────────────────────────── */
  const acc = $('#acc');
  acc.innerHTML = FAQS.map(([q, a], i) => `
    <div class="qa__item">
      <button class="qa__q" aria-expanded="false" aria-controls="qa-${i}">
        <span class="n">${String(i + 1).padStart(2, '0')}</span>
        <span>${q}</span>
        <span class="pm" aria-hidden="true">+</span>
      </button>
      <div class="qa__a" id="qa-${i}"><p>${a}</p></div>
    </div>`).join('');

  acc.addEventListener('click', e => {
    const q = e.target.closest('.qa__q');
    if (!q) return;
    const item = q.parentElement, body = q.nextElementSibling;
    const wasOpen = item.classList.contains('is-open');

    $$('.qa__item', acc).forEach(it => {
      it.classList.remove('is-open');
      it.querySelector('.qa__q').setAttribute('aria-expanded', 'false');
      it.querySelector('.qa__a').style.maxHeight = '0px';
    });
    if (!wasOpen) {
      item.classList.add('is-open');
      q.setAttribute('aria-expanded', 'true');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });

  /* ── Hero rotation (crossfades the arch, swaps the headline) ───────── */
  const SCENES = [
    { img:'assets/cats/Sweets-Cat.jpeg', alt:'A tray of traditional Memon mithai',
      h:'Mithai the way<br>Jodia Bazar<br><em>has always</em> made it.',
      l:'Three generations of Memon recipes, cooked in small batches before the shop opens and sent out the same day.' },
    { img:'assets/cats/Nimco-Cat.jpeg', alt:'Fresh nimco in a copper bowl',
      h:'Nimco fried<br>at dawn, bagged<br><em>while warm.</em>',
      l:'Chewra, daal moong and bareek gathiya — the tea-time counter that keeps half of Karachi coming back.' },
    { img:'assets/cats/Chips-Cat.png', alt:'Crispy crinkle chips',
      h:'Chips cut thin<br>and packed<br><em>the same hour.</em>',
      l:'Crinkle, masala and fish papar, sealed the moment they cool so the crunch survives the courier.' }
  ];
  const arch = $('#heroArch'), hImg = $('#heroImg'), hH = $('#heroH'), hL = $('#heroLede'), hN = $('#heroNum');
  let si = 0, timer = null;

  function scene(n){
    si = (n + SCENES.length) % SCENES.length;
    const s = SCENES[si];
    arch.classList.add('is-swap');
    setTimeout(() => {
      hImg.src = s.img; hImg.alt = s.alt;
      hH.innerHTML = s.h; hL.textContent = s.l;
      hN.textContent = String(si + 1).padStart(2, '0');
      arch.classList.remove('is-swap');
    }, reduced ? 0 : 280);
  }
  const play = () => { stop(); if (!reduced) timer = setInterval(() => scene(si + 1), 7000); };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };

  $('#heroPrev').addEventListener('click', () => { scene(si - 1); play(); });
  $('#heroNext').addEventListener('click', () => { scene(si + 1); play(); });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());
  if (!location.search.includes('static')) play();

  /* ── Drawer ────────────────────────────────────────────────────────── */
  const drawer = $('#drawer');
  const setDrawer = open => {
    drawer.hidden = !open;
    $('#burger').setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  $('#burger').addEventListener('click', () => setDrawer(true));
  $('#drawerClose').addEventListener('click', () => setDrawer(false));
  drawer.addEventListener('click', e => { if (e.target === drawer) setDrawer(false); });
  $$('.drawer nav a').forEach(a => a.addEventListener('click', () => setDrawer(false)));

  /* ── Order sheet ───────────────────────────────────────────────────── */
  const order = new Map();
  const sheet = $('#cart'), sheetBody = $('#cartBody');

  function drawOrder(){
    const items = [...order.values()];
    $('#cartCount').textContent = items.reduce((n, i) => n + i.qty, 0);
    $('#cartTotal').textContent = rs(items.reduce((n, i) => n + i.qty * i.from, 0));

    sheetBody.innerHTML = items.length ? items.map(i => `
      <div class="srow">
        <img src="${i.img}" alt="">
        <div>
          <b>${i.name}</b>
          <small>${rs(i.from)} · ${i.sizes}</small>
          <span class="qty">
            <button data-dec="${i.id}" aria-label="Fewer">−</button>
            <span>${i.qty}</span>
            <button data-inc="${i.id}" aria-label="More">+</button>
          </span>
        </div>
        <b>${rs(i.qty * i.from)}</b>
      </div>`).join('')
      : `<p class="sheet__empty">Nothing on the list yet.</p>`;
  }

  const setSheet = open => {
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  $('#cartBtn').addEventListener('click', () => { drawOrder(); setSheet(true); });
  $('#cartClose').addEventListener('click', () => setSheet(false));
  sheet.addEventListener('click', e => { if (e.target === sheet) setSheet(false); });
  $('#checkout').addEventListener('click', () => toast('Design prototype — no live checkout yet.'));

  sheetBody.addEventListener('click', e => {
    const inc = e.target.dataset.inc, dec = e.target.dataset.dec;
    if (inc) order.get(inc).qty++;
    if (dec) { const it = order.get(dec); it.qty--; if (it.qty < 1) order.delete(dec); }
    if (inc || dec) drawOrder();
  });

  grid.addEventListener('click', e => {
    const id = e.target.dataset.add;
    if (!id) return;
    const p = PRODUCTS.find(x => x.id === id);
    order.has(id) ? order.get(id).qty++ : order.set(id, { ...p, qty:1 });
    drawOrder();
    toast(`${p.name} added to your order`);
  });
  drawOrder();

  /* ── Toast ─────────────────────────────────────────────────────────── */
  let tT;
  function toast(msg){
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(tT);
    tT = setTimeout(() => t.classList.remove('is-on'), 2400);
  }

  addEventListener('keydown', e => {
    if (e.key === 'Escape') { setDrawer(false); setSheet(false); }
  });

  /* ── Reveal ────────────────────────────────────────────────────────── */
  const targets = $$('.reveal');
  if (reduced || document.hidden || !('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((es, obs) => es.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      obs.unobserve(en.target);
    }), { rootMargin:'0px 0px -50px 0px', threshold:.1 });
    targets.forEach(t => io.observe(t));
    setTimeout(() => targets.forEach(t => t.classList.add('is-in')), 2500);
  }
})();
