(() => {
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  document.querySelectorAll('[data-toast]').forEach(button => {
    button.addEventListener('click', () => showToast(button.dataset.toast));
  });

  const favorite = document.getElementById('favorite');
  favorite.addEventListener('click', () => {
    const saved = favorite.classList.toggle('liked');
    favorite.textContent = saved ? '♥' : '♡';
    favorite.setAttribute('aria-pressed', String(saved));
    showToast(saved ? 'Opportunity saved in this demo.' : 'Opportunity removed from saved items.');
  });

  document.getElementById('share').addEventListener('click', async () => {
    const shareData = {
      title: 'UI/UX Designer Internship | GigsForMe',
      text: 'Check out this UI/UX Designer Internship opportunity on Unstop.',
      url: 'https://unstop.com/internships/uiux-designer-internship-gigsforme-1773352'
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Opportunity link copied.');
      } else {
        showToast(shareData.url);
      }
    } catch (error) {
      if (error.name !== 'AbortError') showToast('Unable to open sharing on this device.');
    }
  });

  document.getElementById('refer').addEventListener('click', async () => {
    const url = 'https://unstop.com/internships/uiux-designer-internship-gigsforme-1773352';
    try {
      if (navigator.share) await navigator.share({title: 'Refer this opportunity', text: 'Thought you might like this opportunity.', url});
      else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        showToast('Referral link copied.');
      } else showToast(url);
    } catch (error) {
      if (error.name !== 'AbortError') showToast('Unable to share this link.');
    }
  });

  const readMore = document.getElementById('readMore');
  const extraCopy = document.getElementById('extraCopy');
  readMore.addEventListener('click', () => {
    const expanded = readMore.getAttribute('aria-expanded') === 'true';
    readMore.setAttribute('aria-expanded', String(!expanded));
    extraCopy.hidden = expanded;
    readMore.innerHTML = expanded ? 'Read More <span class="chevron">⌄</span>' : 'Read Less <span class="chevron">⌄</span>';
  });

  const modal = document.getElementById('loginModal');
  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('email').focus(), 50);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-modal="loginModal"]').forEach(button => button.addEventListener('click', openModal));
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
  document.getElementById('loginForm').addEventListener('submit', event => {
    event.preventDefault();
    showToast('Demo only: sign-in is not connected to a server.');
    closeModal();
    event.target.reset();
  });

  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNav = document.getElementById('mobileNav');
  mobileMenu.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    mobileMenu.setAttribute('aria-expanded', String(open));
    mobileMenu.textContent = open ? '×' : '☰';
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    mobileMenu.setAttribute('aria-expanded', 'false');
    mobileMenu.textContent = '☰';
  }));

  const sections = [...document.querySelectorAll('.section[id]')];
  const navLinks = [...document.querySelectorAll('.topnav a[href^="#"], .mobile-nav a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, {rootMargin: '-25% 0px -65% 0px'});
    sections.forEach(section => observer.observe(section));
  }
})();