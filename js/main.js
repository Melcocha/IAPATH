/* AI Path Academy — interacciones */
document.addEventListener('DOMContentLoaded', function () {

  // Aparicion al hacer scroll
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  // Video: carga el reproductor al hacer clic
  var frame = document.getElementById('videoFrame');
  var title = document.getElementById('videoTitle');
  function loadVideo(id, text) {
    if (!frame) return;
    frame.classList.add('playing');
    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + text + '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    if (title) title.textContent = text;
  }
  var playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.addEventListener('click', function () { loadVideo(frame.dataset.video, frame.dataset.title); });
  document.querySelectorAll('.video-item').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.video-item').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      loadVideo(b.dataset.video, b.dataset.title);
    });
  });

  // Suscripciones: mensual / anual
  var tgl = document.querySelectorAll('.billing-toggle button');
  tgl.forEach(function (b) {
    b.addEventListener('click', function () {
      tgl.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var annual = b.dataset.billing === 'anual';
      document.querySelectorAll('[data-monthly]').forEach(function (el) {
        el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
      });
      document.querySelectorAll('.billing-note').forEach(function (el) {
        el.textContent = annual ? 'facturado anualmente' : 'facturado mensualmente';
      });
    });
  });

  // Cotizador
  var form = document.getElementById('quoteForm');
  if (form) {
    var money = function (n) { return '$' + n.toLocaleString('en-US'); };
    var calc = function () {
      var opt = form.service.options[form.service.selectedIndex];
      var base = +opt.dataset.price, per = +opt.dataset.per;
      var people = Math.max(1, +form.people.value || 1);
      var mod = +form.modality.options[form.modality.selectedIndex].dataset.mult;
      var extras = 0, extraNames = [];
      form.querySelectorAll('input[name=extra]:checked').forEach(function (c) { extras += +c.dataset.price; extraNames.push(c.value); });
      var sub = (base + per * people) * mod + extras;
      var disc = people >= 20 ? .15 : people >= 10 ? .1 : people >= 5 ? .05 : 0;
      var total = Math.round(sub * (1 - disc));
      document.getElementById('qService').textContent = opt.value;
      document.getElementById('qPeople').textContent = people;
      document.getElementById('qMod').textContent = form.modality.value;
      document.getElementById('qExtras').textContent = extras ? money(extras) : '—';
      document.getElementById('qDisc').textContent = disc ? '-' + (disc * 100) + '%' : '—';
      document.getElementById('qTotal').textContent = money(total);
      return { total: total, extras: extraNames };
    };
    form.addEventListener('input', calc);
    form.addEventListener('change', calc);
    calc();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = calc();
      var ok = document.getElementById('quoteOk');
      ok.classList.remove('d-none');
      ok.querySelector('.q-amount').textContent = money(r.total);
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Navbar: clase scrolled con sombra y desenfoque
  var nav = document.querySelector('.navbar-aipath');
  if (nav) {
    var checkScroll = function () {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  // Cerrar menú móvil al tocar un enlace o el botón de cotizar
  var navCollapse = document.getElementById('navMain');
  if (navCollapse) {
    navCollapse.querySelectorAll('.nav-link, .btn-nav-cotizar').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
          var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      });
    });
  }
});
