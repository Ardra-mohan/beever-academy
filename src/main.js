import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const init = () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ==========================================
  // 1. PAGE LOADER
  // ==========================================
  const loader = document.getElementById('loader');
  
  const hideLoader = () => {
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
          
          // Trigger Hero Animations on Load
          animateHero();
        }, 800);
      }
    }, 800); // Premium brief hold for branding impact
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  // Fallback in case load event takes too long
  setTimeout(() => {
    if (loader && loader.style.opacity !== '0') {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        animateHero();
      }, 800);
    }
  }, 3000);

  // ==========================================
  // 2. NAV BAR ON SCROLL
  // ==========================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 3. MOBILE MENU OVERLAY
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMenu = () => {
    mobileToggle.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : 'auto';
  };

  mobileToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileOverlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // ==========================================
  // 4. GSAP PAGE ANIMATIONS
  // ==========================================
  
  // Hero Animation
  function animateHero() {
    const heroTl = gsap.timeline();
    
    heroTl.from('.premium-badge', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.hero-title', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-ctas .btn', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-image-wrapper', {
      scale: 0.95,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=1.2')
    .from('.hero-logo-overlay', {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.4');
  }

  // Scroll Triggered Card Staggers (Why Choose Us)
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.features-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // About Section Animations
  gsap.from('.about-image-wrapper', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 75%',
    },
    x: -50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  });

  gsap.from('.about-glass-overlay', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%',
    },
    scale: 0.9,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: 'back.out(1.2)'
  });

  gsap.from('.about-content > *', {
    scrollTrigger: {
      trigger: '.about-content',
      start: 'top 75%',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Programs Grid Stagger
  gsap.from('.program-card', {
    scrollTrigger: {
      trigger: '.programs-grid',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Faculty Stagger
  gsap.from('.faculty-card', {
    scrollTrigger: {
      trigger: '.faculty-grid',
      start: 'top 80%',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Blog Stagger
  gsap.from('.blog-card', {
    scrollTrigger: {
      trigger: '.blog-grid',
      start: 'top 85%',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // ==========================================
  // 5. ANIMATED STATS COUNTER
  // ==========================================
  const statsSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statsSection) {
    gsap.from(statNumbers, {
      scrollTrigger: {
        trigger: statsSection,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      innerText: 0,
      duration: 2.2,
      snap: { innerText: 1 },
      stagger: 0.1,
      ease: 'power1.out',
      onUpdate: function() {
        // Formats final innerText with + or % based on data-target
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          const currentVal = parseInt(stat.innerText);
          if (currentVal >= target) {
            if (target === 1000) stat.innerText = '1000+';
            else if (target === 50) stat.innerText = '50+';
            else if (target === 25) stat.innerText = '25+';
            else if (target === 98) stat.innerText = '98%';
          }
        });
      }
    });
  }

  // ==========================================
  // 6. TESTIMONIAL CAROUSEL
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentSlide = 0;
  let carouselInterval;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      showSlide(index);
      resetAutoplay();
    });
  });

  const startAutoplay = () => {
    carouselInterval = setInterval(nextSlide, 6000);
  };

  const resetAutoplay = () => {
    clearInterval(carouselInterval);
    startAutoplay();
  };

  startAutoplay();

  // ==========================================
  // 7. CAMPUS LIFE GALLERY (FILTERS & MASONRY)
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryGrid = document.getElementById('gallery-grid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filter = e.target.getAttribute('data-filter');

      // Create filter transition timeline
      const tl = gsap.timeline();

      tl.to(galleryItems, {
        scale: 0.9,
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          galleryItems.forEach(item => {
            const cat = item.getAttribute('data-category');
            if (filter === 'all' || cat === filter) {
              item.classList.remove('hide');
              item.classList.add('animate-grid-item');
            } else {
              item.classList.add('hide');
              item.classList.remove('animate-grid-item');
            }
          });
        }
      })
      .to(galleryItems, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.out'
      });
    });
  });

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentGalleryIndex = 0;
  
  // Get currently visible items
  const getVisibleItems = () => {
    return Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
  };

  const openLightbox = (index) => {
    const visibleItems = getVisibleItems();
    currentGalleryIndex = index;
    const item = visibleItems[currentGalleryIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const category = item.querySelector('.item-category').innerText;
    const title = item.querySelector('.item-title').innerText;

    lightboxImg.src = img.src;
    lightboxCategory.innerText = category;
    lightboxTitle.innerText = title;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Attach click listener to gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  const navigateLightbox = (direction) => {
    const visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;
    
    let newIndex = (currentGalleryIndex + direction + visibleItems.length) % visibleItems.length;
    
    // Smooth transition between lightbox content
    gsap.to(lightboxImg, {
      opacity: 0,
      scale: 0.95,
      duration: 0.15,
      onComplete: () => {
        openLightbox(newIndex);
        gsap.to(lightboxImg, {
          opacity: 1,
          scale: 1,
          duration: 0.25
        });
      }
    });
  };

  if (lightboxPrev && lightboxNext) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });

    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    } else if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    }
  });

  // ==========================================
  // 8. ADMISSIONS TIMELINE PROGRESS ANIMATION
  // ==========================================
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const progressLine = document.getElementById('timeline-progress');

  if (timelineSteps.length && progressLine) {
    // Add scroll triggers for each step to light up the progress
    timelineSteps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 65%',
        end: 'bottom 65%',
        onEnter: () => {
          step.classList.add('active');
          updateTimelineProgress();
        },
        onLeaveBack: () => {
          step.classList.remove('active');
          updateTimelineProgress();
        }
      });
    });

    function updateTimelineProgress() {
      const activeSteps = document.querySelectorAll('.timeline-step.active');
      const totalSteps = timelineSteps.length;
      
      if (activeSteps.length === 0) {
        progressLine.style.height = '0%';
      } else {
        // Set height to point just past the center marker of the last active step
        const lastActiveIndex = activeSteps.length - 1;
        const progressPercentage = (lastActiveIndex / (totalSteps - 1)) * 100;
        progressLine.style.height = `${progressPercentage}%`;
      }
    }
  }

  // ==========================================
  // 9. CONTACT FORM INQUIRY SUBMIT
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Select submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      
      // Loading visual state
      submitBtn.innerText = 'PROCESSING INQUIRY...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        // Success notification popup (simple, high-end alert)
        alert('Thank you for your interest in Beever Academy. A senior admissions ambassador will review your profile and contact you within 24 business hours.');
        contactForm.reset();
        
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 1500);
    });
  }

  // Active navigation link tracking on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
      
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
          navItem.classList.add('active');
        }
      }
    });
  });
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
