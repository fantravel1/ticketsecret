/* ==========================================================================
   TicketSecret — Main JavaScript
   Navigation, scroll effects, animations, and interactivity
   ========================================================================== */

(function () {
    'use strict';

    /* ---------- DOM References ---------- */
    const header = document.getElementById('site-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    /* ---------- Header scroll effect ---------- */
    function handleHeaderScroll() {
        if (!header) return;

        let ticking = false;

        function update() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        update();
    }

    /* ---------- Mobile navigation ---------- */
    function initMobileNav() {
        if (!mobileToggle || !navMenu) return;

        mobileToggle.addEventListener('click', function () {
            const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';

            mobileToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                mobileToggle.focus();
            }
        });
    }

    /* ---------- Smooth scroll for anchor links ---------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                var headerOffset = 80;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* ---------- Scroll-triggered fade-in animations ---------- */
    function initScrollAnimations() {
        // Elements to animate
        var animateSelectors = [
            '.section-label',
            '.section-title',
            '.section-subtitle',
            '.archetype-card',
            '.audience-card',
            '.invisible-item',
            '.vip-card',
            '.card-brand',
            '.upgrade-step',
            '.maps-feature',
            '.verified-item',
            '.faq-item',
            '.coming-soon-card',
            '.intro-quote',
            '.travel-banner',
            '.newsletter-content'
        ];

        var elements = document.querySelectorAll(animateSelectors.join(', '));

        elements.forEach(function (el) {
            el.classList.add('fade-in-up');
        });

        // Use Intersection Observer for performance
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        // Stagger animations for grid children
                        var parent = entry.target.parentElement;
                        if (parent) {
                            var siblings = parent.querySelectorAll('.fade-in-up');
                            var index = Array.prototype.indexOf.call(siblings, entry.target);
                            if (index > 0) {
                                entry.target.style.transitionDelay = (index * 0.08) + 's';
                            }
                        }
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            elements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show all immediately
            elements.forEach(function (el) {
                el.classList.add('visible');
            });
        }
    }

    /* ---------- Newsletter form handling ---------- */
    function initNewsletterForms() {
        document.querySelectorAll('.newsletter-form').forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                var emailInput = form.querySelector('input[type="email"]');
                var submitBtn = form.querySelector('button[type="submit"]');

                if (!emailInput || !emailInput.value) return;

                // Visual feedback
                var originalText = submitBtn.textContent;
                submitBtn.textContent = 'Subscribed!';
                submitBtn.style.pointerEvents = 'none';
                emailInput.value = '';

                setTimeout(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.style.pointerEvents = '';
                }, 3000);
            });
        });
    }

    /* ---------- FAQ accordion behavior ---------- */
    function initFaqAccordion() {
        var faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function (item) {
            item.querySelector('summary').addEventListener('click', function () {
                // Optional: close other items (accordion behavior)
                faqItems.forEach(function (other) {
                    if (other !== item && other.hasAttribute('open')) {
                        other.removeAttribute('open');
                    }
                });
            });
        });
    }

    /* ---------- Lazy loading enhancement ---------- */
    function initLazyImages() {
        // Native lazy loading is handled by the loading="lazy" attribute
        // This adds a fade-in effect when images load
        document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';

            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.addEventListener('load', function () {
                    img.style.opacity = '1';
                });
                img.addEventListener('error', function () {
                    img.style.opacity = '1';
                });
            }
        });
    }

    /* ---------- Anchor links from coming-soon page ---------- */
    function handleHashNavigation() {
        // If arriving from coming-soon with a hash anchor (e.g. /#archetypes)
        if (window.location.hash) {
            setTimeout(function () {
                var target = document.querySelector(window.location.hash);
                if (target) {
                    var headerOffset = 80;
                    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        }
    }

    /* ---------- Initialize everything ---------- */
    function init() {
        handleHeaderScroll();
        initMobileNav();
        initSmoothScroll();
        initScrollAnimations();
        initNewsletterForms();
        initFaqAccordion();
        initLazyImages();
        handleHashNavigation();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
