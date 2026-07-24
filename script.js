/* ============================================
   WONDER ESPACIO GASTRONÓMICO — SCRIPT
   ============================================ */

(function () {
    'use strict';

    /* ---------- DOM READY ---------- */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initScrollAnimations();
        initHeader();
        initMobileMenu();
        initMenuTabs();
        initContactForm();
        initSmoothScroll();
    }

    /* ============================================
       SCROLL ANIMATIONS (Intersection Observer)
       ============================================ */
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.animate');
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        elements.forEach((el) => observer.observe(el));
    }

    /* ============================================
       HEADER — scroll effect
       ============================================ */
    function initHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScroll = 0;

        function onScroll() {
            const scrollY = window.scrollY;
            if (scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = scrollY;
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Run on init
    }

    /* ============================================
       MOBILE MENU
       ============================================ */
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const nav = document.getElementById('nav');
        if (!hamburger || !nav) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a nav link
        nav.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ============================================
       MENU TABS
       ============================================ */
    function initMenuTabs() {
        const tabs = document.querySelectorAll('.menu-tab');
        const panels = document.querySelectorAll('.menu-panel');
        if (!tabs.length || !panels.length) return;

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const targetId = 'panel-' + tab.dataset.tab;

                // Deactivate all tabs
                tabs.forEach((t) => t.classList.remove('active'));
                // Activate clicked tab
                tab.classList.add('active');

                // Hide all panels
                panels.forEach((p) => p.classList.remove('active'));
                // Show target panel
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');

                    // Re-trigger animations for newly visible elements
                    targetPanel.querySelectorAll('.animate:not(.visible)').forEach((el) => {
                        // Small delay so the panel transition starts first
                        setTimeout(() => {
                            el.classList.add('visible');
                        }, 100);
                    });
                }
            });
        });
    }

    /* ============================================
       CONTACT FORM → WhatsApp
       ============================================ */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.querySelector('#form-name').value.trim();
            const phone = form.querySelector('#form-phone').value.trim();
            const date = form.querySelector('#form-date').value;
            const message = form.querySelector('#form-message').value.trim();

            if (!name || !phone) {
                // Brief highlight on empty required fields
                form.querySelectorAll('[required]').forEach((input) => {
                    if (!input.value.trim()) {
                        input.style.borderColor = '#e74c3c';
                        setTimeout(() => {
                            input.style.borderColor = '';
                        }, 2000);
                    }
                });
                return;
            }

            let text = `Hola! Soy *${name}*.\n`;
            if (date) {
                const formattedDate = formatDate(date);
                text += `Me gustaría el día *${formattedDate}*.\n`;
            }
            if (message) {
                text += `${message}\n`;
            }
            text += `\nMi número de contacto: ${phone}`;

            const whatsappUrl =
                'https://wa.me/5493585613984?text=' + encodeURIComponent(text);

            window.open(whatsappUrl, '_blank', 'noopener');
        });
    }

    /* ============================================
       SMOOTH SCROLL — anchor links
       ============================================ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            });
        });
    }

    /* ============================================
       HELPERS
       ============================================ */
    function formatDate(dateStr) {
        const months = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
        ];
        const days = [
            'domingo', 'lunes', 'martes', 'miércoles',
            'jueves', 'viernes', 'sábado',
        ];

        const parts = dateStr.split('-');
        const date = new Date(
            parseInt(parts[0], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[2], 10)
        );

        const dayName = days[date.getDay()];
        const dayNum = date.getDate();
        const monthName = months[date.getMonth()];

        return `${dayName} ${dayNum} de ${monthName}`;
    }
})();