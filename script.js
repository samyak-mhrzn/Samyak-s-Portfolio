document.addEventListener('DOMContentLoaded', () => {

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
    }

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    const setActiveLink = () => {
        let current = 'top';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) current = sec.id;
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    };
    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    // Back-to-top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });
    }

    // Scroll-reveal animations
    const revealEls = document.querySelectorAll('.lang-card, .proj-card, .case-row, .about-inner, .section-head');
    revealEls.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));

    // Contact form
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maewljra';
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('cf-submit');

    if (!form) {
        console.error('Contact form not found');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('cf-name').value.trim();
        const email = document.getElementById('cf-email').value.trim();
        const message = document.getElementById('cf-message').value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !emailPattern.test(email) || !message) {
            status.textContent = 'Please fill in your name, a valid email, and a message.';
            status.classList.add('error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        status.classList.remove('error');
        status.textContent = '';

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form)
            });

            if (response.ok) {
                status.textContent = 'Message sent — thanks for reaching out! I\'ll get back to you soon.';
                form.reset();
                // Optional: remove the reload if you don't want the page to refresh
                // setTimeout(() => { location.reload(); }, 1500);
            } else {
                status.textContent = 'Something went wrong sending that. Please try again or email me directly.';
                status.classList.add('error');
            }
        } catch (err) {
            status.textContent = 'Network error — please try again or email me directly.';
            status.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message →';
        }
    });

});