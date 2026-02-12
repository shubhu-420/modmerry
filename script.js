document.addEventListener('DOMContentLoaded', () => {
  // Hero Slider Animation
    const heroSection = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  
  // Animate hero content on page load
  heroContent.style.opacity = '0';
  heroContent.style.transform = 'translateY(20px)';
  setTimeout(() => {
      heroContent.style.transition = 'all 1s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
  }, 500);

  // Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
    const navBackdrop = document.querySelector('[data-nav-backdrop]');

  const setMenuState = (isOpen) => {
      navMenu.classList.toggle('active', isOpen);
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', isOpen);
      if (navBackdrop) navBackdrop.setAttribute('aria-hidden', String(!isOpen));
  };

  if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
          const isOpen = !navMenu.classList.contains('active');
          setMenuState(isOpen);
      });

      navBackdrop?.addEventListener('click', () => setMenuState(false));

      navMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
          link.addEventListener('click', () => setMenuState(false));
      });

      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') setMenuState(false);
      });
  }

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
          });
      });
  });

  // Form Submission Handler
  document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('bookingForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');

    // Add floating label effect
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Note: submit handling is managed later (WhatsApp flow)

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
});

  // Gallery Hover Effects
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
          item.style.transform = 'scale(1.05)';
      });
      item.addEventListener('mouseleave', () => {
          item.style.transform = 'scale(1)';
      });
  });

  // Navigation scroll styling is handled later via class toggles.

  // Accessibility Enhancements
  const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
  focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
          element.style.outline = '2px solid var(--color-primary)';
      });
      element.addEventListener('blur', () => {
          element.style.outline = 'none';
      });
  });
});

// Hero portrait reel (9:16) - auto rotates images
document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.getElementById('heroPortrait');
    const img = wrap?.querySelector('.hero-portrait-img');
    if (!wrap || !img) return;

    const bgWrap = document.querySelector('.hero-bg');
    const bgImg = document.getElementById('heroBgImg');

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    const imagesRaw = (wrap.dataset.images || '').split(',').map((s) => s.trim()).filter(Boolean);
    const images = imagesRaw.length ? imagesRaw : [img.getAttribute('src')].filter(Boolean);
    if (images.length <= 1 || reduceMotion) return;

    let index = Math.max(0, images.indexOf(img.getAttribute('src')));
    let timer = null;
    let isPaused = false;

    const waitForLoaded = (imageEl) => {
        if (!imageEl) return Promise.resolve();
        // If already loaded enough to paint, resolve immediately.
        if (imageEl.complete && imageEl.naturalWidth > 0) return Promise.resolve();

        return new Promise((resolve) => {
            const done = () => {
                imageEl.removeEventListener('load', done);
                imageEl.removeEventListener('error', done);
                resolve();
            };

            imageEl.addEventListener('load', done, { once: true });
            imageEl.addEventListener('error', done, { once: true });

            // Safety timeout so we never hang.
            window.setTimeout(done, 2500);
        });
    };

    const preloadAndWait = async (src) => {
        if (!src) return;
        const pre = new Image();
        pre.src = src;
        try {
            // decode() is best-case, but not always available.
            await pre.decode?.();
            if (pre.complete && pre.naturalWidth > 0) return;
        } catch {
            // ignore decode failures
        }

        // Fallback: wait for load/error/timeout
        await new Promise((resolve) => {
            const done = () => {
                pre.removeEventListener('load', done);
                pre.removeEventListener('error', done);
                resolve();
            };
            pre.addEventListener('load', done, { once: true });
            pre.addEventListener('error', done, { once: true });
            window.setTimeout(done, 2500);
        });
    };

    const preload = (src) => {
        const pre = new Image();
        pre.src = src;
    };

    const setImage = async (nextSrc) => {
        if (!nextSrc || nextSrc === img.getAttribute('src')) return;
        wrap.classList.add('is-fading');
        bgWrap?.classList.add('is-fading');

        // Only swap once the next image is ready to paint.
        await preloadAndWait(nextSrc);

        window.setTimeout(() => {
            img.src = nextSrc;
            img.alt = 'Featured salon look';
            wrap.classList.remove('is-fading');

            if (bgImg) {
                bgImg.src = nextSrc;
            }
            bgWrap?.classList.remove('is-fading');
        }, 260);
    };

    const tick = () => {
        if (isPaused) return;
        index = (index + 1) % images.length;
        const next = images[index];
        preload(images[(index + 1) % images.length]);
        setImage(next);
    };

    const start = () => {
        if (timer) window.clearInterval(timer);
        timer = window.setInterval(tick, 3200);
    };

    wrap.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    wrap.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Start only after the initial image has loaded (helps mobile).
    (async () => {
        await waitForLoaded(img);
        preload(images[(index + 1) % images.length]);
        start();
    })();
});

// Hero portrait placement (desktop right-side, mobile under badge)
document.addEventListener('DOMContentLoaded', () => {
    const portrait = document.getElementById('heroPortrait');
    if (!portrait) return;

    const desktopHost = document.querySelector('.hero-gallery');
    const mobileHost = document.querySelector('[data-hero-portrait-slot="mobile"]');
    if (!desktopHost || !mobileHost) return;

    const mq = window.matchMedia('(max-width: 1024px)');

    const syncPlacement = () => {
        const target = mq.matches ? mobileHost : desktopHost;
        if (portrait.parentElement === target) return;
        target.appendChild(portrait);
    };

    // Initial + on breakpoint changes
    syncPlacement();
    mq.addEventListener?.('change', syncPlacement);

    // Safety: also sync after orientation/resize
    window.addEventListener('resize', () => {
        window.clearTimeout(syncPlacement._t);
        syncPlacement._t = window.setTimeout(syncPlacement, 120);
    });
});

// Hero fast booking card -> WhatsApp
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.hero-mini[data-wa-number]');
    if (!card) return;

    const number = String(card.dataset.waNumber || '').replace(/\D/g, '');
    const rawText = String(card.dataset.waText || '').trim();
    let text = rawText.length
        ? rawText
        : 'Hi Mod Merry Salon! I want to book an appointment. Please share available slots.';

    // Allow authoring with %0A etc in HTML attributes.
    try {
        if (/%[0-9A-Fa-f]{2}/.test(text)) {
            text = decodeURIComponent(text);
        }
    } catch {
        // ignore decode issues
    }

    if (!number) return;

    const buildUrl = () => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    const openWhatsApp = () => {
        window.open(buildUrl(), '_blank', 'noopener');
    };

    // Make the whole card clickable, but don't hijack clicks on the buttons/links.
    card.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, select, textarea, label')) return;
        openWhatsApp();
    });

    // Keyboard support when card itself is focused.
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.addEventListener('keydown', (event) => {
        if (event.target !== card) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openWhatsApp();
    });
});

// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Parallax (background only). On mobile, start a bit later so the hero image
    // and content can settle before the effect kicks in.
    const heroSection = document.querySelector('.hero');
    const heroBgImg = document.querySelector('.hero-bg img');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (heroSection && heroBgImg && !reduceMotion) {
        const mqMobile = window.matchMedia('(max-width: 768px)');
        let rafId = 0;

        const baseScale = 1.14;

        const update = () => {
            rafId = 0;
            const y = window.scrollY || window.pageYOffset || 0;
            const startOffset = mqMobile.matches ? 180 : 0;

            if (y <= startOffset) {
                heroBgImg.style.transform = `translate3d(0, 0, 0) scale(${baseScale})`;
                return;
            }

            const rel = y - startOffset;
            const max = Math.max(1, heroSection.offsetHeight);
            const clamped = Math.min(rel, max);
            const translate = clamped * 0.18;

            heroBgImg.style.transform = `translate3d(0, ${translate}px, 0) scale(${baseScale})`;
        };

        const onScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        mqMobile.addEventListener?.('change', onScroll);
    }

    // Smooth Reveal Animation for Sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });

    // Dynamic Navigation + scroll color
    const nav = document.querySelector('nav');
    if (nav) {
        const navMenu = nav.querySelector('.nav-menu');

        let lastScroll = window.scrollY || window.pageYOffset || 0;
        let rafId = 0;

        const SCROLLED_AT = 16;
        const HIDE_AFTER = 140;

        const updateNav = () => {
            rafId = 0;
            const currentScroll = window.scrollY || window.pageYOffset || 0;

            // Color / background change
            nav.classList.toggle('scrolled', currentScroll > SCROLLED_AT);

            // Never hide nav when menu is open (mobile)
            const menuOpen = !!navMenu?.classList.contains('active');
            if (menuOpen) {
                nav.classList.remove('scroll-down');
                nav.classList.add('scroll-up');
                lastScroll = currentScroll;
                return;
            }

            // Hide on scroll down, show on scroll up (after a little scroll)
            if (currentScroll <= 0) {
                nav.classList.remove('scroll-down');
                nav.classList.remove('scroll-up');
                lastScroll = currentScroll;
                return;
            }

            if (currentScroll > lastScroll && currentScroll > HIDE_AFTER) {
                nav.classList.add('scroll-down');
                nav.classList.remove('scroll-up');
            } else if (currentScroll < lastScroll) {
                nav.classList.remove('scroll-down');
                nav.classList.add('scroll-up');
            }

            lastScroll = currentScroll;
        };

        const onScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(updateNav);
        };

        updateNav();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
    }

    // Enhanced Form Validation and WhatsApp Submission
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const WA_NUMBER = '917887236773';

        const fullName = (document.getElementById('fullName')?.value || '').trim();
        const email = (document.getElementById('email')?.value || '').trim();
        const phone = (document.getElementById('phone')?.value || '').trim();
        const serviceSelect = document.getElementById('service');
        const serviceLabel = (serviceSelect?.selectedOptions?.[0]?.textContent || serviceSelect?.value || '').trim();
        const details = (document.getElementById('details')?.value || '').trim();

        const lines = [
            'Hi Mod Merry Salon! I want to schedule my experience / book an appointment.',
            '',
            `Name: ${fullName || '-'}`,
            `Phone: ${phone || '-'}`,
            `Email: ${email || '-'}`,
            `Service: ${serviceLabel || '-'}`,
            `Details: ${details || '-'}`,
        ];

        const message = lines.join('\n');
        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.85';
        }

        try {
            window.open(url, '_blank', 'noopener');
            form.reset();
            showNotification('Opening WhatsApp with your details…', 'success');
        } catch (error) {
            showNotification('Could not open WhatsApp. Please try again.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                submitBtn.innerHTML = originalBtnHtml;
            }
        }
    });

    // Custom Notification System
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }, 100);
    }

    // Service Cards Hover Effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Counter animation
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter, target) => {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.floor(startValue + (target - startValue) * progress);
            counter.textContent = value;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    // Progress bar animation
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        bar.style.width = '100%';
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('counter')) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                } else if (entry.target.classList.contains('slide-up')) {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    // Observe elements
    counters.forEach(counter => observer.observe(counter));
    document.querySelectorAll('.slide-up').forEach(el => observer.observe(el));
});

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const servicesSection = document.querySelector('.beauty-services');
    const serviceItems = document.querySelectorAll('.service-item');
    const particles = document.querySelectorAll('.particle');
    const buttons = document.querySelectorAll('.book-btn, .view-all-btn');
    const luxuryTag = document.querySelector('.luxury-tag');
    
    // Scroll reveal animation with stagger effect
    const scrollReveal = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal');
                }, index * 200);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    serviceItems.forEach(item => {
        scrollReveal.observe(item);
    });

    // Particle movement based on mouse position
    const moveParticles = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.03;
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;
            
            particle.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.05}deg)`;
        });
    };

    // Optimized particle movement with requestAnimationFrame
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                moveParticles(e);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Service card hover effects
    serviceItems.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const icon = this.querySelector('.service-icon');
            const pattern = this.querySelector('.service-pattern');
            
            // Icon animation
            icon.style.transform = 'scale(1.1) rotate(10deg)';
            
            // Dynamic pattern movement
            pattern.style.transform = 'rotate(5deg) scale(1.1)';
            pattern.style.opacity = '0.4';
        });

        card.addEventListener('mouseleave', function(e) {
            const icon = this.querySelector('.service-icon');
            const pattern = this.querySelector('.service-pattern');
            
            icon.style.transform = 'scale(1) rotate(0deg)';
            pattern.style.transform = 'rotate(0deg) scale(1)';
            pattern.style.opacity = '0.3';
        });

        // Mouse move effect on cards
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // Button hover effects
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(5px)';
            }
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(0)';
            }
        });
    });

    // Luxury tag parallax effect
    let luxuryTagAnimation;
    document.addEventListener('scroll', () => {
        if (luxuryTagAnimation) {
            window.cancelAnimationFrame(luxuryTagAnimation);
        }

        luxuryTagAnimation = window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.05;
            luxuryTag.style.transform = `translateY(${rate}px)`;
        });
    });

    // Service features animation
    const features = document.querySelectorAll('.service-features li');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';

        scrollReveal.observe(feature);
    });

    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Performance optimization for animations
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            serviceItems.forEach(item => {
                item.style.transform = 'none';
            });
        }
    });

    // Add loading animation
    window.addEventListener('load', () => {
        servicesSection.classList.add('loaded');
        
        // Animate particles into position
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.classList.add('active');
            }, index * 300);
        });
    });
});

// Optional: Add preloader
const preloader = () => {
    const loader = document.createElement('div');
    loader.className = 'preloader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
        </div>
    `;
    document.body.appendChild(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
};

preloader();

document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const progress = document.querySelector('.progress');
    const currentSlide = document.querySelector('.current');
    let current = 0;

    const hasSlider = !!(slides.length && prevBtn && nextBtn && progress && currentSlide);
    
    function updateSlide() {
        if (!hasSlider) return;
        slides.forEach(slide => slide.classList.remove('active'));
        slides[current].classList.add('active');
        currentSlide.textContent = (current + 1).toString().padStart(2, '0');
        
        // Reset and start progress bar
        progress.style.width = '0';
        setTimeout(() => {
            progress.style.width = '100%';
        }, 50);
    }
    
    function nextSlide() {
        current = (current + 1) % slides.length;
        updateSlide();
    }
    
    function prevSlide() {
        current = (current - 1 + slides.length) % slides.length;
        updateSlide();
    }

    if (hasSlider) {
        // Initialize progress bar
        progress.style.width = '0';
        setTimeout(() => {
            progress.style.width = '100%';
        }, 50);

        // Auto advance slides
        let slideInterval = setInterval(nextSlide, 5000);

        // Event listeners
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            prevSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });

        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // Typewriter effect (Hero title)
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const typewriterText = document.querySelector('.hero-typewriter') || document.querySelector('.typewriter-text');
    if (!typewriterText) return;

    const rawPhrases = String(typewriterText.dataset.phrases || '').trim();
    const phrases = rawPhrases
        ? rawPhrases.split('|').map((s) => s.trim()).filter(Boolean)
        : [
            'Bridal • Party • Hair — done beautifully',
            'Flawless bridal glow, all-day wear',
            'Party glam that turns heads',
            'Hair styling that stays picture-perfect',
            'HD makeup for camera-ready confidence',
            'Airbrush finish, lightweight feel'
        ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typewriterDelay = 60;

    if (reduceMotion) {
        typewriterText.textContent = phrases[0] || '';
        return;
    }

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typewriterDelay = 32;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typewriterDelay = 60;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typewriterDelay = 1100; // Pause at the end of typing
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typewriterDelay = 350; // Pause before starting new phrase
        }

        setTimeout(typeWriter, typewriterDelay);
    }

    // Start the typewriter effect
    setTimeout(typeWriter, 600); // Start sooner
});


// Gallery grid lightbox (shows all photos)
document.addEventListener('DOMContentLoaded', () => {
    const items = Array.from(document.querySelectorAll('.salon-gallery-item'));
    const lightbox = document.getElementById('lightbox');
    if (!items.length || !lightbox) return;

    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav.next');
    const img = lightbox.querySelector('.lightbox-img');
    const counter = lightbox.querySelector('.lightbox-counter');
    const caption = lightbox.querySelector('.lightbox-caption');

    let currentIndex = 0;
    let lastTrigger = null;

    const getVisibleItems = () => items.filter((btn) => !btn.classList.contains('is-hidden') && !btn.classList.contains('is-collapsed'));

    const setOpen = (open) => {
        lightbox.classList.toggle('is-open', open);
        lightbox.setAttribute('aria-hidden', String(!open));

        if (open) {
            document.body.style.overflow = 'hidden';
            closeBtn?.focus();
        } else {
            document.body.style.overflow = '';
            lastTrigger?.focus?.();
        }
    };

    const showIndex = (index) => {
        const visible = getVisibleItems();
        if (!visible.length) return;
        const safeIndex = (index + visible.length) % visible.length;
        currentIndex = safeIndex;

        const active = visible[safeIndex];
        const src = active.dataset.full;
        const title = active.dataset.title || active.querySelector('img')?.alt || '';

        if (src) img.src = src;
        img.alt = title ? `Selected: ${title}` : 'Selected gallery photo';
        if (caption) caption.textContent = title;

        counter.textContent = `${String(safeIndex + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
    };

    const openFrom = (index) => {
        showIndex(index);
        setOpen(true);
    };

    const close = () => setOpen(false);
    const next = () => showIndex(currentIndex + 1);
    const prev = () => showIndex(currentIndex - 1);

    items.forEach((btn) => {
        btn.addEventListener('click', () => {
            const visible = getVisibleItems();
            const index = visible.indexOf(btn);
            if (index === -1) return;
            lastTrigger = btn;
            openFrom(index);
        });
    });

    backdrop?.addEventListener('click', () => close());
    closeBtn?.addEventListener('click', () => close());
    nextBtn?.addEventListener('click', () => next());
    prevBtn?.addEventListener('click', () => prev());

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;

        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });
});

// Gallery filters + live count
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('[data-gallery-grid]') || document.querySelector('.salon-gallery-grid');
    const filtersWrap = document.querySelector('[data-gallery-filters]');
    if (!grid || !filtersWrap) return;

    const countEl = document.getElementById('galleryCount');
    const moreBtn = document.getElementById('galleryLoadMore');
    const filterButtons = Array.from(filtersWrap.querySelectorAll('button[data-filter]'));
    const items = Array.from(grid.querySelectorAll('.salon-gallery-item'));

    const state = {
        filter: 'all',
        initial: 12,
        step: 12,
        limit: 12,
    };

    const getMatchingItems = () => {
        return items.filter((btn) => {
            const category = btn.dataset.category || 'makeup';
            return state.filter === 'all' || category === state.filter;
        });
    };

    const updateCount = () => {
        if (!countEl) return;
        const total = getMatchingItems().length;
        const showing = items.filter((btn) => !btn.classList.contains('is-hidden') && !btn.classList.contains('is-collapsed')).length;
        countEl.textContent = `Showing ${showing} of ${total}`;
    };

    const setActiveButton = (activeFilter) => {
        filterButtons.forEach((btn) => {
            const isActive = btn.dataset.filter === activeFilter;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });
    };

    const applyFilter = (filter) => {
        state.filter = filter;
        state.limit = state.initial;

        items.forEach((btn) => {
            const category = btn.dataset.category || 'makeup';
            const matches = filter === 'all' || category === filter;
            btn.classList.toggle('is-hidden', !matches);
            btn.setAttribute('aria-hidden', String(!matches));
            btn.classList.remove('is-collapsed');
        });

        // Collapse anything beyond the initial limit (within the matching set)
        const matching = getMatchingItems();
        matching.forEach((btn, index) => {
            btn.classList.toggle('is-collapsed', index >= state.limit);
        });

        setActiveButton(filter);
        updateCount();

        if (moreBtn) {
            const total = matching.length;
            const hasMore = total > state.limit;
            const isExpanded = state.limit > state.initial;
            moreBtn.style.display = total <= state.initial ? 'none' : 'inline-flex';
            moreBtn.textContent = hasMore ? 'Show more' : (isExpanded ? 'Show less' : 'Show more');
            moreBtn.classList.toggle('is-primary', hasMore);
            moreBtn.setAttribute('aria-expanded', String(isExpanded));
        }
    };

    const updatePaging = () => {
        const matching = getMatchingItems();
        matching.forEach((btn, index) => {
            btn.classList.toggle('is-collapsed', index >= state.limit);
        });

        updateCount();

        if (moreBtn) {
            const total = matching.length;
            const hasMore = total > state.limit;
            const isExpanded = state.limit > state.initial;
            moreBtn.style.display = total <= state.initial ? 'none' : 'inline-flex';
            moreBtn.textContent = hasMore ? 'Show more' : (isExpanded ? 'Show less' : 'Show more');
            moreBtn.classList.toggle('is-primary', hasMore);
            moreBtn.setAttribute('aria-expanded', String(isExpanded));
        }
    };

    moreBtn?.addEventListener('click', () => {
        const total = getMatchingItems().length;
        const hasMore = total > state.limit;
        const isExpanded = state.limit > state.initial;

        if (hasMore) {
            state.limit = Math.min(state.limit + state.step, total);
            updatePaging();
            return;
        }

        if (!isExpanded) return;

        // Show less (collapse back to the initial set)
        state.limit = state.initial;
        updatePaging();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => applyFilter(btn.dataset.filter || 'all'));
    });

    applyFilter('all');
});



class ShowcaseSystem {
    constructor() {
        this.maxShowcases = 7;
        this.activeShowcases = new Set();
        this.showcaseContent = {
            audio: {
                category: 'Our Clients',
                title: 'Bridal Makeup',
                items: [
                    {
                        image: 'bridal.jpg',
                        // heading: 'Experience Sound',
                        // description: 'Immerse yourself in crystal-clear audio with our premium headphones.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Wireless Freedom',
                        description: 'Enjoy seamless connectivity with advanced Bluetooth technology.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Lasting Comfort',
                        description: 'Designed for extended wear with premium materials.'
                    }
                ]
            },
            eyewear: {
                category: 'Our Clients',
                title: 'Engagement Makeup',
                items: [
                    {
                        image: 'IMG-20250219-WA0009.jpg',
                        heading: 'Smart Vision',
                        description: 'Navigate your world with intelligent eyewear technology.'
                    },
                    {
                        image: 'IMG-20250219-WA0012.jpg',
                        heading: 'Stylish Design',
                        description: 'Classic looks meet cutting-edge innovation.'
                    },
                    {
                        image: 'IMG-20250219-WA0010.jpg',
                        heading: 'Always Connected',
                        description: 'Stay in touch with seamless smartphone integration.'
                    }
                ]
            },
            products: {
                category: 'Accessories',
                title: 'Innovative Products',
                items: [
                    {
                        image: 'IMG-20250219-WA0018.jpg',
                        heading: 'Capture Moments',
                        description: 'Create lasting memories with our innovative camera technology.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Stay Powered',
                        description: 'Keep your devices charged with advanced power solutions.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Enhanced Protection',
                        description: 'Protect your devices with premium cases and covers.'
                    }
                ]
            },
            hdmakeup: {
                category: 'Accessories',
                title: 'Innovative Products',
                items: [
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Capture Moments',
                        description: 'Create lasting memories with our innovative camera technology.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Stay Powered',
                        description: 'Keep your devices charged with advanced power solutions.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Enhanced Protection',
                        description: 'Protect your devices with premium cases and covers.'
                    }
                ]
            },
            partymakeup: {
                category: 'Accessories',
                title: 'Innovative Products',
                items: [
                    {
                        image: 'IMG-20250219-WA0018.jpg',
                        heading: 'Capture Moments',
                        description: 'Create lasting memories with our innovative camera technology.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Stay Powered',
                        description: 'Keep your devices charged with advanced power solutions.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Enhanced Protection',
                        description: 'Protect your devices with premium cases and covers.'
                    }
                ]
            },
            hairstyle: {
                category: 'Accessories',
                title: 'Innovative Products',
                items: [
                    {
                        image: 'hair/IMG-20250219-WA0013.jpg',
                        heading: 'Capture Moments',
                        description: 'Create lasting memories with our innovative camera technology.'
                    },
                    {
                        image: 'hair/IMG-20250219-WA0014.jpg',
                        heading: 'Stay Powered',
                        description: 'Keep your devices charged with advanced power solutions.'
                    },
                    {
                        image: 'hair/IMG-20250219-WA0015.jpg',
                        heading: 'Enhanced Protection',
                        description: 'Protect your devices with premium cases and covers.'
                    },
                    {
                        image: 'hair/IMG-20250219-WA0016.jpg',
                        heading: 'Enhanced Protection',
                        description: 'Protect your devices with premium cases and covers.'
                    },

                ]
            },
            newsome: {
                category: 'Accessories',
                title: 'Innovative Products',
                items: [
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Capture Moments',
                        description: 'Create lasting memories with our innovative camera technology.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Stay Powered',
                        description: 'Keep your devices charged with advanced power solutions.'
                    },
                    {
                        image: '/api/placeholder/800/400',
                        heading: 'Enhanced Protection',
                        description: 'Protect your devices with premium cases and covers.'
                    }
                ]
            }
        };
        this.initialize();
    }

    initialize() {
        document.querySelectorAll('.showcase-trigger').forEach(button => {
            button.addEventListener('click', () => {
                const showcaseId = button.dataset.showcase;
                this.openShowcase(showcaseId);
            });
        });
    }

    openShowcase(showcaseId) {
        if (this.activeShowcases.size >= this.maxShowcases) {
            alert('Maximum of 7 showcases allowed!');
            return;
        }

        const content = this.showcaseContent[showcaseId];
        if (!content) return;

        const showcaseHTML = this.generateShowcaseHTML(showcaseId, content);
        document.body.insertAdjacentHTML('beforeend', showcaseHTML);

        const showcaseElement = document.getElementById(`showcase-${showcaseId}`);
        this.setupShowcaseEvents(showcaseId, showcaseElement);
        this.displayShowcase(showcaseId, showcaseElement);
        this.initializeCarousel(showcaseId);
    }

    generateShowcaseHTML(showcaseId, content) {
        const itemsHTML = content.items.map((item, index) => `
            <div class="showcase-item ${index === 0 ? 'showcase-current' : ''}" data-index="${index}">
                <img src="${item.image}" alt="${item.heading}" class="showcase-image">
               
            </div>
        `).join('');

        const dotsHTML = content.items.map((_, index) => `
            <div class="showcase-dot ${index === 0 ? 'showcase-current' : ''}" data-index="${index}"></div>
        `).join('');

        return `
            <div class="showcase-backdrop" id="showcase-${showcaseId}">
                <div class="showcase-window">
                    <div class="showcase-header">
                        <div class="showcase-titles">
                            <span class="showcase-category">${content.category}</span>
                            <h2 class="showcase-title">${content.title}</h2>
                        </div>
                        <button class="showcase-close" data-showcase-id="${showcaseId}">×</button>
                    </div>
                    <div class="showcase-body">
                        <div class="showcase-carousel" id="carousel-${showcaseId}">
                            ${itemsHTML}
                            <div class="showcase-navigation">
                                <button class="showcase-nav-button prev" onclick="showcaseManager.changeItem('${showcaseId}', -1)">‹</button>
                                <button class="showcase-nav-button next" onclick="showcaseManager.changeItem('${showcaseId}', 1)">›</button>
                            </div>
                            <div class="showcase-dots">
                                ${dotsHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupShowcaseEvents(showcaseId, element) {
        const closeBtn = element.querySelector('.showcase-close');
        closeBtn.addEventListener('click', () => this.closeShowcase(showcaseId));
        
        element.addEventListener('click', (e) => {
            if (e.target === element) this.closeShowcase(showcaseId);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeShowcase(showcaseId);
        });
    }

    displayShowcase(showcaseId, element) {
        element.style.display = 'flex';
        this.activeShowcases.add(showcaseId);
    }

    closeShowcase(showcaseId) {
        const element = document.getElementById(`showcase-${showcaseId}`);
        if (element) {
            element.remove();
            this.activeShowcases.delete(showcaseId);
        }
    }

    initializeCarousel(showcaseId) {
        const carousel = document.getElementById(`carousel-${showcaseId}`);
        carousel.currentItem = 0;
    }

    changeItem(showcaseId, direction) {
        const carousel = document.getElementById(`carousel-${showcaseId}`);
        const items = carousel.querySelectorAll('.showcase-item');
        const dots = carousel.querySelectorAll('.showcase-dot');
        
        let newIndex = carousel.currentItem + direction;
        
        if (newIndex < 0) newIndex = items.length - 1;
        if (newIndex >= items.length) newIndex = 0;
        
        items[carousel.currentItem].classList.remove('showcase-current');
        dots[carousel.currentItem].classList.remove('showcase-current');
        
        items[newIndex].classList.add('showcase-current');
        dots[newIndex].classList.add('showcase-current');
        
        carousel.currentItem = newIndex;
    }
}

const showcaseManager = new ShowcaseSystem();