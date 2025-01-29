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

  // Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('open');
  });

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
  const contactForm = document.querySelector('.contact-form');
  contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic form validation
      const inputs = contactForm.querySelectorAll('input, select, textarea');
      let isValid = true;
      
      inputs.forEach(input => {
          if (!input.value.trim()) {
              input.classList.add('error');
              isValid = false;
          } else {
              input.classList.remove('error');
          }
      });

      if (isValid) {
          // Simulate form submission
          const submitBtn = contactForm.querySelector('button');
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;

          // Simulated async submission
          setTimeout(() => {
              alert('Thank you! We will contact you soon.');
              contactForm.reset();
              submitBtn.textContent = 'Request Appointment';
              submitBtn.disabled = false;
          }, 1500);
      }
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