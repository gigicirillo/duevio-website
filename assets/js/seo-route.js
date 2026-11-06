(() => {
  'use strict';
  const html = document.documentElement;
  const route = html.dataset.seoRoute || '';
  const slug = html.dataset.seoSlug || '';
  const lang = html.dataset.lang || 'en';
  if (!route) return;

  const prefix = code => code === 'en' ? '' : `/${code}`;
  const coreUrl = (code, page) => page === 'home' ? `${prefix(code)}/` : `${prefix(code)}/${page}/`;
  const routeHash = `#${route}`;
  const injectedInitialRoute = !window.location.hash;

  function cleanRouteHashWhenRendered() {
    const target = document.querySelector(`[data-page="${route}"]`);
    if (!target) return;

    let observer = null;
    const cleanIfReady = () => {
      const rendered = target.classList.contains('active') && !target.hidden;
      if (rendered && window.location.hash === routeHash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        if (observer) observer.disconnect();
        return true;
      }
      return false;
    };

    if (cleanIfReady()) return;
    observer = new MutationObserver(cleanIfReady);
    observer.observe(target, { attributes: true, attributeFilter: ['class', 'hidden'] });
    setTimeout(() => observer && observer.disconnect(), 15000);
  }

  // The approved site is a single-page visual shell. SEO landing pages reuse it and
  // route to the matching approved section. Keep the temporary hash until app.js has
  // actually rendered that section; translated pages may wait for an i18n fetch first.
  if (injectedInitialRoute) {
    window.location.hash = route;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cleanRouteHashWhenRendered, { once: true });
    } else {
      cleanRouteHashWhenRendered();
    }
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;

    const targetLang = link.dataset.langLink;
    if (targetLang) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const target = `${prefix(targetLang)}/${slug ? slug + '/' : ''}`;
      window.location.href = target || '/';
      return;
    }

    let page = link.dataset.route || '';
    const href = link.getAttribute('href') || '';
    if (!page) {
      const m = href.match(/^#(home|product|industries|pricing)$/);
      if (m) page = m[1];
      else if (link.classList.contains('brand')) page = 'home';
    }
    if (['home','product','industries','pricing'].includes(page)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = coreUrl(lang, page);
    }
  }, true);
})();