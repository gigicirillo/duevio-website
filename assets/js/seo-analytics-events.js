(() => {
  'use strict';

  function send(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.hash,
      page_language: document.documentElement.lang || document.documentElement.dataset.lang || 'en'
    }, params || {}));
  }

  window.duevioTrack = send;

  function classify(link) {
    const href = (link.getAttribute('href') || '').trim();
    const i18n = link.getAttribute('data-i18n') || '';
    const route = link.getAttribute('data-route') || '';
    const text = (link.textContent || '').trim().slice(0, 120);

    if (href === '#demo' || route === 'demo' || i18n === 'cta.bookDemo') {
      return ['demo_request_click', {cta_text: text}];
    }
    if (/^https:\/\/signup\.duevio\.com\/signup\.aspx/i.test(href)) {
      let plan = '';
      try { plan = new URL(href, window.location.href).searchParams.get('plan') || ''; } catch {}
      return ['signup_start', {cta_text: text, plan: plan, link_url: href}];
    }
    if (i18n === 'cta.startOnline' || i18n === 'cta.startNow') {
      return ['start_online_click', {cta_text: text}];
    }
    if (/^https:\/\/suite\.duevio\.com\/?/i.test(href)) {
      return ['login_click', {link_url: href, cta_text: text}];
    }
    if (href === '#pricing' || route === 'pricing') {
      return ['pricing_view_click', {cta_text: text}];
    }
    if (/enterprise/i.test(href) || route === 'enterprise') {
      return ['enterprise_interest_click', {cta_text: text}];
    }
    return null;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const hit = classify(link);
    if (hit) send(hit[0], hit[1]);
  }, true);

  window.addEventListener('hashchange', () => {
    send('page_view', {
      page_title: document.title,
      virtual_page: window.location.hash || '#home'
    });
  });
})();
