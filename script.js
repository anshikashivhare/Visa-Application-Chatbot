(function(){
  const faqs = [
    {q:'documents', keywords:['documents','document','paperwork','checklist'], a:'Common documents: passport, photos, application form, proof of funds, invitation/offer letters, travel itinerary.'},
    {q:'timeline', keywords:['time','timeline','processing','how long','wait'], a:'Processing times vary: typically 2 weeks to 3 months depending on visa type and country.'},
    {q:'fees', keywords:['fee','fees','cost','price','payment'], a:'Fees depend on visa class and country; check the official consulate site for exact amounts and payment methods.'},
    {q:'passport', keywords:['passport','expiry','expire','valid'], a:'Passport should generally be valid for at least 6 months from date of travel—renew if needed before applying.'},
    {q:'biometrics', keywords:['biometric','biometrics','interview'], a:'Some visas require biometrics or an interview — you will be notified when booking or after submission.'}
  ];

  const chatWidget = document.getElementById('chat-widget');
  const toggle = document.getElementById('chat-toggle');
  const closeBtn = document.getElementById('chat-close');
  const messagesEl = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  function appendMessage(text, who='bot'){
    const el = document.createElement('div');
    el.className = 'msg ' + (who==='user' ? 'user' : 'bot');
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function findFAQ(text){
    const t = text.toLowerCase();
    for(const f of faqs){
      for(const k of f.keywords){
        if(t.includes(k)) return f.a;
      }
    }
    return null;
  }

  async function handleUserMessage(text){
    appendMessage(text,'user');
    const quick = findFAQ(text);
    if(quick){
      setTimeout(()=>appendMessage(quick,'bot'),300);
      return;
    }

    // Fallback: show helpful next steps and optional API hook
    setTimeout(()=>appendMessage('I don\'t have an exact match. Try asking about "documents", "timeline" or "fees". For more detailed answers you can enable the LLM integration in README.', 'bot'),400);

    // Example: if you want to connect to an LLM backend, uncomment and implement sendToServer below
    // const resp = await sendToServer(text);
    // appendMessage(resp, 'bot');
  }

  // Example server hook (requires server-side proxy to protect keys)
  async function sendToServer(message){
    try{
      const res = await fetch('/api/chat',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message})
      });
      const j = await res.json();
      return j.reply || 'No reply from server.';
    }catch(e){
      return 'Error contacting server: ' + e.message;
    }
  }

  toggle.addEventListener('click',()=>{
    chatWidget.classList.remove('chat-closed');
    input.focus();
  });
  closeBtn.addEventListener('click',()=>chatWidget.classList.add('chat-closed'));

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const v = input.value.trim();
    if(!v) return;
    input.value = '';
    handleUserMessage(v);
  });

  // welcome message
  appendMessage('Hello — I\'m the Visa Assistant. Ask about documents, timeline, fees, or type your question.','bot');

})();

/* UI interactions: dark mode, accordion, smooth nav */
(function(){
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const current = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  function applyTheme(t){
    if(t === 'dark'){
      document.body.setAttribute('data-theme','dark');
      root.setAttribute('data-theme','dark');
      themeToggle.textContent = '☀️';
    } else {
      document.body.removeAttribute('data-theme');
      root.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
    }
    localStorage.setItem('theme', t);
  }
  applyTheme(current === 'dark' ? 'dark' : 'light');
  themeToggle && themeToggle.addEventListener('click', ()=>{
    const now = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(now);
  });

  // Accordion
  document.querySelectorAll('.accordion .acc-item').forEach(item=>{
    const btn = item.querySelector('.acc-toggle');
    btn.addEventListener('click', ()=>{
      const open = item.classList.toggle('open');
      // close siblings
      if(open){
        document.querySelectorAll('.accordion .acc-item').forEach(other=>{if(other!==item) other.classList.remove('open')});
      }
    });
  });

  // smooth scroll for nav links
  document.querySelectorAll('.top-nav a').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

})();
