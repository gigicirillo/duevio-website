(() => {
  'use strict';

  const html = document.documentElement;
  const lang = html.dataset.lang || 'en';
  // Resolve from this script, so root hosting and project subpaths both work.
  const root = new URL('../../', document.currentScript.src).href;
  const validPages = new Set(['home','product','industries','pricing','enterprise','demo','privacy','cookies','ai','terms']);
  const preferenceKey = 'duevio_privacy_preferences_v1';
  let messages = {};

  const localeMessages = {
    en:{invalid:'Please complete all required fields and check that the passwords match.',signupOk:'Online registration and payment are completed through Duevio\'s dedicated signup service.',demoOk:'Request sent successfully. We will contact you shortly.',demoError:'The request could not be sent. Please try again later.',demoSending:'Sending request…',contact:'Contact us',users:'Agreed setup',requestSetup:'Request setup',commercialOk:'Professional and Custom use a guided commercial and implementation path. Request a demo or Custom consultation to continue.',next2Title:'Commercial follow-up',next2Text:'We review the selected plan, team size and implementation needs with you.',next3Title:'Implementation path',next3Text:'Agree setup, onboarding support and integration priorities before activation.'},
    it:{invalid:'Completa tutti i campi obbligatori e verifica che le password coincidano.',signupOk:'Registrazione e pagamento online vengono completati tramite il servizio di signup dedicato di Duevio.',demoOk:'Richiesta inviata correttamente. Ti contatteremo a breve.',demoError:'Non è stato possibile inviare la richiesta. Riprova più tardi.',demoSending:'Invio richiesta…',contact:'Contattaci',users:'Configurazione concordata',requestSetup:'Richiedi configurazione',commercialOk:'Professional e Custom seguono un percorso commerciale e di implementazione guidato. Richiedi una demo o una consulenza Custom per proseguire.',next2Title:'Contatto commerciale',next2Text:'Verifichiamo con te piano scelto, dimensione del team ed esigenze di implementazione.',next3Title:'Percorso di implementazione',next3Text:'Concordiamo configurazione, supporto all’onboarding e priorità di integrazione prima dell’attivazione.'},
    mt:{invalid:'Jekk jogħġbok imla l-oqsma obbligatorji kollha u ċċekkja li l-passwords jaqblu.',signupOk:'Ir-reġistrazzjoni u l-ħlas online jitlestew permezz tas-servizz separat ta’ signup ta’ Duevio.',demoOk:'It-talba ntbagħtet b’suċċess. Se nikkuntattjawk dalwaqt.',demoError:'It-talba ma setgħetx tintbagħat. Erġa’ pprova aktar tard.',demoSending:'Qed tintbagħat it-talba…',contact:'Ikkuntattjana',users:'Setup miftiehem',requestSetup:'Itlob setup',commercialOk:'Professional u Custom jużaw triq kummerċjali u ta’ implementazzjoni ggwidata. Itlob demo jew konsultazzjoni Custom biex tkompli.',next2Title:'Follow-up kummerċjali',next2Text:'Nirrevedu miegħek il-pjan magħżul, id-daqs tat-tim u l-ħtiġijiet ta’ implementazzjoni.',next3Title:'Triq ta’ implementazzjoni',next3Text:'Naqblu fuq setup, appoġġ għall-onboarding u prijoritajiet ta’ integrazzjoni qabel l-attivazzjoni.'},
    de:{invalid:'Bitte füllen Sie alle Pflichtfelder aus und prüfen Sie, ob die Passwörter übereinstimmen.',signupOk:'Online-Registrierung und Zahlung werden über den separaten Duevio-Anmeldedienst abgeschlossen.',demoOk:'Anfrage erfolgreich gesendet. Wir werden Sie in Kürze kontaktieren.',demoError:'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.',demoSending:'Anfrage wird gesendet…',contact:'Kontakt aufnehmen',users:'Vereinbarte Konfiguration',requestSetup:'Einrichtung anfragen',commercialOk:'Professional und Custom nutzen einen begleiteten kommerziellen und technischen Implementierungsweg. Fordern Sie eine Demo oder Custom-Beratung an.',next2Title:'Kommerzielle Abstimmung',next2Text:'Wir prüfen mit Ihnen Tarif, Teamgröße und Implementierungsbedarf.',next3Title:'Implementierungsweg',next3Text:'Vereinbaren Sie Einrichtung, Onboarding-Support und Integrationsprioritäten vor der Aktivierung.'},
    es:{invalid:'Completa todos los campos obligatorios y comprueba que las contraseñas coincidan.',signupOk:'El registro y el pago online se completan mediante el servicio de registro dedicado de Duevio.',demoOk:'Solicitud enviada correctamente. Nos pondremos en contacto contigo pronto.',demoError:'No se pudo enviar la solicitud. Inténtalo de nuevo más tarde.',demoSending:'Enviando solicitud…',contact:'Contactar',users:'Configuración acordada',requestSetup:'Solicitar configuración',commercialOk:'Professional y Custom siguen un proceso comercial y de implantación guiado. Solicita una demo o una consulta Custom para continuar.',next2Title:'Seguimiento comercial',next2Text:'Revisamos contigo el plan elegido, el tamaño del equipo y las necesidades de implantación.',next3Title:'Ruta de implantación',next3Text:'Acordamos configuración, soporte de onboarding y prioridades de integración antes de la activación.'},
    fr:{invalid:'Complétez tous les champs obligatoires et vérifiez que les mots de passe correspondent.',signupOk:'L\'inscription et le paiement en ligne sont effectués via le service d\'inscription dédié de Duevio.',demoOk:'Demande envoyée avec succès. Nous vous contacterons prochainement.',demoError:'La demande n’a pas pu être envoyée. Veuillez réessayer plus tard.',demoSending:'Envoi de la demande…',contact:'Nous contacter',users:'Configuration convenue',requestSetup:'Demander la configuration',commercialOk:'Professional et Custom suivent un parcours commercial et de mise en œuvre accompagné. Demandez une démo ou une consultation Custom pour continuer.',next2Title:'Suivi commercial',next2Text:'Nous examinons avec vous l’offre choisie, la taille de l’équipe et les besoins de mise en œuvre.',next3Title:'Parcours de mise en œuvre',next3Text:'Convenez de la configuration, du support onboarding et des priorités d’intégration avant activation.'},
    ru:{invalid:'Заполните все обязательные поля и проверьте, что пароли совпадают.',signupOk:'Регистрация подписки и онлайн-оплата выполняются через отдельный сервис регистрации Duevio.',demoOk:'Запрос успешно отправлен. Мы свяжемся с вами в ближайшее время.',demoError:'Не удалось отправить запрос. Повторите попытку позже.',demoSending:'Отправка запроса…',contact:'Связаться с нами',users:'Согласованная конфигурация',requestSetup:'Запросить настройку',commercialOk:'Professional и Custom используют сопровождаемый коммерческий процесс и процесс внедрения. Запросите демо или консультацию Custom, чтобы продолжить.',next2Title:'Коммерческое сопровождение',next2Text:'Мы вместе проверим выбранный тариф, размер команды и потребности внедрения.',next3Title:'Путь внедрения',next3Text:'До активации согласуем настройку, поддержку онбординга и приоритеты интеграции.'}
  };

  const languageNames={en:'EN',it:'IT',mt:'MT',de:'DE',es:'ES',fr:'FR',ru:'RU'};

  function currentRoute(){
    const hash=window.location.hash.replace(/^#/,'').split('?')[0];
    if(hash==='signup'||hash==='signup-form'){
      window.location.replace('https://signup.duevio.com/signup.aspx');
      return 'home';
    }
    if(hash==='demo-form') return hash;
    if(hash&&validPages.has(hash)) return hash;
    const seoRoute=html.dataset.seoRoute||'';
    if(seoRoute&&validPages.has(seoRoute)) return seoRoute;
    return 'home';
  }

  function showPage(route){
    let page=route;
    if(route==='demo-form') page='demo';
    if(!validPages.has(page)) page='home';
    // SEO landings contain one route. Home-only sections live on the original homepage.
    if(!document.querySelector('[data-page="'+page+'"]')){
      const landing=html.dataset.seoRoute||'';
      if(landing&&['demo','enterprise','privacy','cookies','terms','ai'].includes(page)){
        window.location.replace(root+(lang==='en'?'':lang+'/')+'#'+page);
        return;
      }
      page=landing&&validPages.has(landing)?landing:'home';
    }
    document.querySelectorAll('[data-page]').forEach(section=>{
      const active=section.dataset.page===page;
      section.hidden=!active;
      section.classList.toggle('active',active);
    });
    document.querySelectorAll('[data-route]').forEach(link=>{
      const active=link.dataset.route===page;
      link.classList.toggle('active',active);
      active?link.setAttribute('aria-current','page'):link.removeAttribute('aria-current');
    });
    const mobileNav=document.getElementById('mobileNav');
    const mobileToggle=document.querySelector('.mobile-toggle,.mobile-menu-button');
    // The four primary routes stay visible on mobile, independently of JavaScript.
    if(mobileNav) mobileNav.hidden=window.matchMedia('(min-width:861px)').matches;
    if(mobileToggle) mobileToggle.setAttribute('aria-expanded','true');
    requestAnimationFrame(()=>{
      if(route==='demo-form') document.getElementById('demo-form')?.scrollIntoView({behavior:'smooth',block:'start'});
      else window.scrollTo({top:0,behavior:'auto'});
    });
  }

  async function loadTranslations(){
    if(lang==='en') return;
    try{
      const response=await fetch(`${root}assets/i18n/${lang}.json`,{cache:'no-cache'});
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      messages=await response.json();
      document.querySelectorAll('[data-i18n]').forEach(node=>{
        const value=messages[node.dataset.i18n];
        if(typeof value==='string') node.textContent=value;
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(node=>{
        const value=messages[node.dataset.i18nPlaceholder];
        if(typeof value==='string') node.setAttribute('placeholder',value);
      });
    }catch(error){console.error('Duevio i18n loading error',error);}
  }

  function prepareLanguageMenu(){
    const button=document.getElementById('languageButton');
    const menu=document.getElementById('languageMenu');
    if(menu&&!menu.querySelector('[data-lang-link="mt"]')){
      const mt=document.createElement('a');
      mt.setAttribute('role','menuitem');
      mt.dataset.langLink='mt';
      mt.href=`${root}mt/`;
      mt.textContent='Malti';
      const de=menu.querySelector('[data-lang-link="de"]');
      menu.insertBefore(mt,de||null);
    }
    const label=document.querySelector('.language-button .language-code,.language-button span:first-child');
    if(label) label.textContent=languageNames[lang]||'EN';
    document.querySelectorAll('[data-lang-link]').forEach(link=>{
      const targetLang=link.dataset.langLink;
      if(targetLang===lang) link.setAttribute('aria-current','true');
      link.addEventListener('click',event=>{
        // SEO landings use their existing canonical per-language paths.
        if(html.dataset.seoRoute) return;
        const nextLang=link.dataset.langLink;
        const prefix=root+(nextLang==='en'?'':nextLang+'/');
        const hash=window.location.hash.replace(/^#/,'').split('?')[0];
        let target=prefix;
        if(['product','industries','pricing'].includes(hash)) target=prefix+hash+'/';
        if(['demo','enterprise','privacy','cookies','terms','ai'].includes(hash)) target=prefix+'#'+hash;
        event.preventDefault();
        window.location.assign(target);
      });
    });
    if(!button||!menu) return;
    button.addEventListener('click',()=>{
      const opening=menu.hidden;
      menu.hidden=!opening;
      button.setAttribute('aria-expanded',String(opening));
    });
    document.addEventListener('click',event=>{
      if(!event.target.closest('.language-switcher')){
        menu.hidden=true;
        button.setAttribute('aria-expanded','false');
      }
    });
  }

  function prepareMobileNav(){
    const nav=document.getElementById('mobileNav');
    if(!nav) return;
    // Mobile visitors must have direct, working links even on standalone SEO routes.
    const prefix=root+(lang==='en'?'':lang+'/');
    nav.querySelectorAll('a[data-route],a[href^="#"]').forEach(link=>{
      const href=link.getAttribute('href')||'';
      const page=link.dataset.route||(href.startsWith('#')?href.slice(1):'');
      if(!['home','product','industries','pricing'].includes(page)) return;
      link.href=page==='home'?prefix:prefix+page+'/';
      link.dataset.route=page;
    });
    nav.hidden=window.matchMedia('(min-width:861px)').matches;
    const toggle=document.querySelector('.mobile-toggle,.mobile-menu-button');
    if(toggle){
      toggle.hidden=true;
      toggle.setAttribute('aria-expanded','true');
    }
  }

  function prepareParallax(){
    const scenes=[...document.querySelectorAll('[data-parallax-scene]')];
    if(!scenes.length||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let scheduled=false;
    const update=()=>{
      const viewport=window.innerHeight;
      scenes.forEach(scene=>{
        const rect=scene.getBoundingClientRect();
        const progress=(viewport-rect.top)/(viewport+rect.height)-.5;
        const offset=Math.max(-48,Math.min(48,progress*96));
        scene.style.setProperty('--parallax-y',`${offset}px`);
      });
      scheduled=false;
    };
    const requestUpdate=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}};
    update();
    window.addEventListener('scroll',requestUpdate,{passive:true});
    window.addEventListener('resize',requestUpdate);
  }

  function validateForm(form){
    let valid=form.checkValidity();
    const password=form.querySelector('[name="password"]');
    const confirm=form.querySelector('[name="passwordConfirm"]');
    if(password&&confirm&&password.value!==confirm.value){valid=false;confirm.setCustomValidity('Passwords do not match');}
    else if(confirm) confirm.setCustomValidity('');
    if(!valid) form.reportValidity();
    return valid;
  }

  async function sendEnquiry(form,kind){
    const data=Object.fromEntries(new FormData(form));
    data.kind=kind;
    data.language=lang;
    data.privacyAccepted=Array.from(form.querySelectorAll('input[type="checkbox"][required]')).every(input=>input.checked);
    delete data._subject;
    delete data._template;
    delete data._captcha;
    const response=await fetch('https://techitapp-form.dev3r-6af.workers.dev/duevio',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(data)
    });
    const result=await response.json().catch(()=>null);
    if(!response.ok || !result || result.ok!==true) throw new Error(result?.error || 'Request rejected');
  }

  const enquiryFeedback={
    en:{demoTitle:'Thank you. Your demo request has been sent.',customTitle:'Thank you. Your Custom enquiry has been sent.',detail:'The Duevio team will review your message and contact you at',note:'Please check your inbox, including your spam folder.',again:'Send another request'},
    it:{demoTitle:'Grazie, la tua richiesta demo è stata inviata.',customTitle:'Grazie, la tua richiesta Custom è stata inviata.',detail:'Il team Duevio esaminerà il tuo messaggio e ti risponderà all’indirizzo',note:'Controlla la posta in arrivo e, se necessario, la cartella spam.',again:'Invia un’altra richiesta'},
    mt:{demoTitle:'Grazzi. It-talba tiegħek għal demo ntbagħtet.',customTitle:'Grazzi. It-talba tiegħek għal Custom intbagħtet.',detail:'It-tim ta’ Duevio se jirrevedi l-messaġġ tiegħek u jikkuntattjak fuq',note:'Iċċekkja l-inbox tiegħek u, jekk meħtieġ, il-folder tal-ispam.',again:'Ibgħat talba oħra'},
    de:{demoTitle:'Vielen Dank. Ihre Demo-Anfrage wurde gesendet.',customTitle:'Vielen Dank. Ihre Custom-Anfrage wurde gesendet.',detail:'Das Duevio-Team prüft Ihre Nachricht und antwortet Ihnen unter',note:'Prüfen Sie auch Ihren Spam-Ordner.',again:'Weitere Anfrage senden'},
    es:{demoTitle:'Gracias. Tu solicitud de demostración se ha enviado.',customTitle:'Gracias. Tu solicitud Custom se ha enviado.',detail:'El equipo de Duevio revisará tu mensaje y te responderá a',note:'Revisa tu bandeja de entrada y la carpeta de spam.',again:'Enviar otra solicitud'},
    fr:{demoTitle:'Merci. Votre demande de démonstration a été envoyée.',customTitle:'Merci. Votre demande Custom a été envoyée.',detail:'L’équipe Duevio examinera votre message et vous répondra à',note:'Vérifiez votre boîte de réception et votre dossier de courriers indésirables.',again:'Envoyer une autre demande'},
    ru:{demoTitle:'Спасибо. Ваш запрос на демонстрацию отправлен.',customTitle:'Спасибо. Ваш запрос Custom отправлен.',detail:'Команда Duevio рассмотрит ваше сообщение и ответит по адресу',note:'Проверьте входящие сообщения и папку «Спам».',again:'Отправить ещё один запрос'}
  };

  function showEnquiryConfirmation(form,kind,email){
    const copy=enquiryFeedback[lang]||enquiryFeedback.en;
    const panel=document.createElement('section');
    panel.className='enquiry-confirmation';
    panel.setAttribute('role','status');
    panel.setAttribute('aria-live','polite');
    const icon=document.createElement('span');
    icon.className='enquiry-confirmation-icon';
    icon.setAttribute('aria-hidden','true');
    icon.textContent='✓';
    const title=document.createElement('h2');
    title.tabIndex=-1;
    title.textContent=kind==='custom'?copy.customTitle:copy.demoTitle;
    const detail=document.createElement('p');
    detail.textContent=copy.detail+' ';
    const address=document.createElement('strong');
    address.textContent=email;
    detail.append(address);
    const note=document.createElement('p');
    note.className='enquiry-confirmation-note';
    note.textContent=copy.note;
    const again=document.createElement('button');
    again.type='button';
    again.className='button button-primary';
    again.textContent=copy.again;
    again.addEventListener('click',()=>{
      panel.remove();
      form.hidden=false;
      form.querySelector('input[name="organisation"]')?.focus();
    });
    panel.append(icon,title,detail,note,again);
    form.hidden=true;
    form.insertAdjacentElement('afterend',panel);
    panel.scrollIntoView({behavior:'smooth',block:'center'});
    title.focus({preventScroll:true});
  }

  function prepareForms(){
    const demo=document.getElementById('demo-form');
    demo?.addEventListener('submit',async event=>{
      event.preventDefault();
      const status=document.getElementById('demoStatus');
      const copy=localeMessages[lang]||localeMessages.en;
      const submit=demo.querySelector('button[type="submit"]');
      if(!validateForm(demo)){if(status) status.textContent=copy.invalid;return;}
      if(status) status.textContent=copy.demoSending||localeMessages.en.demoSending;
      if(submit) submit.disabled=true;
      try{
        await sendEnquiry(demo,'demo');
        if(typeof window.duevioTrack==='function') window.duevioTrack('generate_lead',{lead_type:'demo'});
        if(typeof window.duevioTrack==='function') window.duevioTrack('demo_submit_success',{lead_type:'demo'});
        const replyAddress=demo.elements.namedItem('email')?.value.trim()||'';
        demo.reset();
        if(status) status.textContent='';
        showEnquiryConfirmation(demo,'demo',replyAddress);
      }catch{
        if(status) status.textContent=copy.demoError||localeMessages.en.demoError;
      }finally{
        if(submit) submit.disabled=false;
      }
    });    const enterprise=document.getElementById('enterprise-form');
    enterprise?.addEventListener('submit',async event=>{
      event.preventDefault();
      const status=document.getElementById('enterpriseStatus');
      const copy=localeMessages[lang]||localeMessages.en;
      const submit=enterprise.querySelector('button[type="submit"]');
      if(!validateForm(enterprise)){if(status) status.textContent=copy.invalid;return;}
      if(status) status.textContent=copy.demoSending||localeMessages.en.demoSending;
      if(submit) submit.disabled=true;
      try{
        await sendEnquiry(enterprise,'custom');
        if(typeof window.duevioTrack==='function') window.duevioTrack('generate_lead',{lead_type:'custom'});
        if(typeof window.duevioTrack==='function') window.duevioTrack('custom_submit_success',{lead_type:'custom'});
        const replyAddress=enterprise.elements.namedItem('email')?.value.trim()||'';
        enterprise.reset();
        if(status) status.textContent='';
        showEnquiryConfirmation(enterprise,'custom',replyAddress);
      }catch{
        if(status) status.textContent=copy.demoError||localeMessages.en.demoError;
      }finally{
        if(submit) submit.disabled=false;
      }
    });

  }

  function readPreferences(){
    try{const raw=localStorage.getItem(preferenceKey);return raw?JSON.parse(raw):null;}catch{return null;}
  }
  function storePreferences(analytics,marketing){
    const value={essential:true,analytics:Boolean(analytics),marketing:Boolean(marketing),updatedAt:new Date().toISOString()};
    try{localStorage.setItem(preferenceKey,JSON.stringify(value));}catch{}
    html.dataset.analyticsConsent=String(value.analytics);
    html.dataset.marketingConsent=String(value.marketing);
    return value;
  }

  function preparePrivacyControls(){
    const banner=document.getElementById('cookieBanner');
    const modal=document.getElementById('cookieModal');
    const analytics=document.getElementById('analyticsConsent');
    const marketing=document.getElementById('marketingConsent');
    const close=modal?.querySelector('.modal-close');
    const apply=prefs=>{
      if(!prefs) return;
      html.dataset.analyticsConsent=String(Boolean(prefs.analytics));
      html.dataset.marketingConsent=String(Boolean(prefs.marketing));
      if(analytics) analytics.checked=Boolean(prefs.analytics);
      if(marketing) marketing.checked=Boolean(prefs.marketing);
    };
    const openModal=()=>{apply(readPreferences()||{analytics:false,marketing:false});if(modal) modal.hidden=false;document.body.classList.add('modal-open');close?.focus();};
    const closeModal=()=>{if(modal) modal.hidden=true;document.body.classList.remove('modal-open');};
    const existing=readPreferences();
    if(existing) apply(existing); else if(banner) banner.hidden=false;
    document.querySelectorAll('[data-cookie-action]').forEach(button=>button.addEventListener('click',()=>{
      const action=button.dataset.cookieAction;
      if(action==='settings') return openModal();
      if(action==='accept') storePreferences(true,true);
      if(action==='reject') storePreferences(false,false);
      if(banner) banner.hidden=true;
    }));
    document.getElementById('saveCookieSettings')?.addEventListener('click',()=>{storePreferences(analytics?.checked,marketing?.checked);if(banner) banner.hidden=true;closeModal();});
    document.getElementById('openCookieSettings')?.addEventListener('click',openModal);
    document.getElementById('footerCookieSettings')?.addEventListener('click',openModal);
    close?.addEventListener('click',closeModal);
    modal?.addEventListener('click',event=>{if(event.target===modal) closeModal();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal&&!modal.hidden) closeModal();});
  }

  async function init(){
    await loadTranslations();
    prepareLanguageMenu();
    prepareMobileNav();
    prepareParallax();
    prepareForms();
    preparePrivacyControls();
    showPage(currentRoute());
    window.addEventListener('hashchange',()=>showPage(currentRoute()));
  }

  init();
})();
