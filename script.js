document.addEventListener('DOMContentLoaded', () => {
  // Hero Slider Animation
  const heroSection = document.querySelector('.hero-section');
  const heroContent = document.querySelector('.hero-content');
  
  // Animate hero content on page load
  heroContent.style.opacity = '0';
  heroContent.style.transform = 'translateY(20px)';
  setTimeout(() => {
      heroContent.style.transition = 'all 1s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
  }, 500);

/*Navbar handling */




  // Form Submission Handler
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
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

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Gather form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            details: document.getElementById('details').value
        };

        // Here you would typically send the data to your server
        console.log('Form submitted:', formData);
        
        // Show success message (you can customize this)
        alert('Thank you! Your appointment request has been submitted.');
        form.reset();
    });

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

  // Scroll-activated Navigation Shadow
  window.addEventListener('scroll', () => {
      const nav = document.querySelector('nav');
      if (window.scrollY > 50) {
          nav.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      } else {
          nav.style.boxShadow = 'none';
      }
  });

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

// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Parallax Effect for Hero Section
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

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

    // Dynamic Navigation
    const nav = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            nav.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Enhanced Form Validation and Submission
    const form = document.querySelector('.contact-form');
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
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            form.reset();
            showNotification('Message sent successfully!', 'success');
        } catch (error) {
            showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = 'Send Message';
            submitBtn.disabled = false;
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
    
    function updateSlide() {
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

    // Typewriter effect
    const typewriterText = document.querySelector('.typewriter-text');
    const phrases = [
        'Luxury Treatments',
        'Expert Care',
        'Timeless Beauty',
        'Premium Experience',
        'Personalized Service'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typewriterDelay = 100;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typewriterDelay = 50;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typewriterDelay = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typewriterDelay = 1500; // Pause at the end of typing
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typewriterDelay = 500; // Pause before starting new phrase
        }

        setTimeout(typeWriter, typewriterDelay);
    }

    // Start the typewriter effect
    setTimeout(typeWriter, 1500); // Delay start to allow other animations to complete
});


//here is the gallery
document.addEventListener('DOMContentLoaded', function() {
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    const progress = document.querySelector('.progress');
    const currentSlide = document.querySelector('.gallery-counter .current');
    const totalSlides = document.querySelector('.gallery-counter .total');
    let current = 0;

    // Set total number of slides
    totalSlides.textContent = galleryItems.length.toString().padStart(2, '0');

    function updateGallery() {
        galleryItems.forEach((item, index) => {
            item.classList.remove('active');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            item.style.zIndex = '0';
        });
        
        galleryItems[current].classList.add('active');
        galleryItems[current].style.opacity = '1';
        galleryItems[current].style.transform = 'scale(1)';
        galleryItems[current].style.zIndex = '10';
        
        currentSlide.textContent = (current + 1).toString().padStart(2, '0');
        
        // Reset and start progress bar
        progress.style.width = '0';
        setTimeout(() => {
            progress.style.width = '100%';
        }, 50);
    }

    function nextSlide() {
        current = (current + 1) % galleryItems.length;
        updateGallery();
    }

    function prevSlide() {
        current = (current - 1 + galleryItems.length) % galleryItems.length;
        updateGallery();
    }

    // Initialize progress bar
    updateGallery();

    // Auto advance slides smoothly
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
});