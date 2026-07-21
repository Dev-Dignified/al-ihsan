(function() {
    'use strict';

    // ---- DOM refs ----
    const loader = document.getElementById('loader');
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toastMessage');
    const toastText = document.getElementById('toastText');
    const toastClose = document.getElementById('toastClose');

    const navLinkItems = navLinks.querySelectorAll('a[href^="#"]');
    const revealEls = document.querySelectorAll('.reveal');

    let toastTimeout = null;

    // ---- FOOTER YEAR ----
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ---- LOADER ----
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 700);
    });

    // ---- MOBILE NAV ----
    function toggleNav(open) {
        const isOpen = typeof open === 'boolean' ? open : navLinks.classList.contains('open');
        if (typeof open === 'boolean') {
            if (open) {
                navLinks.classList.add('open');
                hamburger.classList.add('active');
                navOverlay.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
            } else {
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
                navOverlay.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            return;
        }
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        navOverlay.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    }

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleNav();
    });

    navOverlay.addEventListener('click', function() {
        toggleNav(false);
    });

    navLinkItems.forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                toggleNav(false);
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            toggleNav(false);
        }
    });

    // ---- NAV SCROLL & ACTIVE ----
    function updateNav() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        const sections = document.querySelectorAll('section[id], header[id]');
        let currentId = 'hero';
        sections.forEach(function(section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120) {
                currentId = section.id || 'hero';
            }
        });

        navLinkItems.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href === '#' + currentId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav, { passive: true });
    updateNav();

    // ---- SCROLL TO TOP ----
    function updateScrollTop() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', updateScrollTop, { passive: true });
    updateScrollTop();

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- SCROLL REVEAL ----
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.10,
            rootMargin: '0px 0px -40px 0px'
        });
        revealEls.forEach(function(el) {
            observer.observe(el);
        });
    } else {
        revealEls.forEach(function(el) {
            el.classList.add('visible');
        });
    }

    // ---- TOAST ----
    function showToast(message) {
        toastText.textContent = message || 'Thank you for contacting Alihsan Business and Internet Services!';
        toast.classList.add('show');

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastTimeout = setTimeout(function() {
            toast.classList.remove('show');
        }, 6000);
    }

    toastClose.addEventListener('click', function() {
        toast.classList.remove('show');
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
    });

    // ---- CONTACT FORM (mailto + custom toast) ----
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        if (!fullName || !email || !phone || !service || !message) {
            showToast('⚠️ Please fill in all required fields.');
            return;
        }

        const to = 'alihsanbusiness@gmail.com';
        const subject = encodeURIComponent('Service Request: ' + service);
        const body = encodeURIComponent(
            'Customer Name: ' + fullName + '\n' +
            'Email: ' + email + '\n' +
            'Phone: ' + phone + '\n' +
            'Service Needed: ' + service + '\n\n' +
            'Message:\n' + message
        );

        // Open mail client
        window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;

        // Show custom thank you message
        showToast('✅ Thank you for contacting Alihsan Business and Internet Services! We will get back to you shortly.');

        // Reset form
        contactForm.reset();
    });

    // ---- SMOOTH ANCHOR SCROLL ----
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset -
                    navHeight - 12;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ---- CLOSE MOBILE NAV ON RESIZE ----
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
            toggleNav(false);
        }
    });

    console.log('AL IHSAN Business & Internet Services — website loaded.');

})();
