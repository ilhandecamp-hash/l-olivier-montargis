/* ================================================
   L'OLIVIER MONTARGIS — JAVASCRIPT
   Design by Velum Studio (velum.site)
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== PRELOADER ==========
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 800);
  });
  // Fallback: hide preloader after 3s
  setTimeout(() => preloader.classList.add('loaded'), 3000);

  // ========== HERO PARTICLES ==========
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('hero-particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
      particle.style.animationDelay = (Math.random() * 6) + 's';
      particlesContainer.appendChild(particle);
    }
  }

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ========== MOBILE NAV TOGGLE ==========
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // ========== SCROLL REVEAL ANIMATIONS ==========
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== COUNTER ANIMATION ==========
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const decimal = element.getAttribute('data-decimal') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(eased * target);

      if (decimal) {
        element.textContent = current + decimal;
      } else {
        element.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========== MENU TABS ==========
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanel = tab.getAttribute('data-tab');

      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      menuPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === 'panel-' + targetPanel) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ========== GALLERY LIGHTBOX ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentImageIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-caption');
    galleryImages.push({
      src: img.src,
      alt: img.alt,
      caption: caption ? caption.textContent : ''
    });

    item.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    const image = galleryImages[currentImageIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightboxCaption.textContent = image.caption;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightbox();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }

  function updateLightbox() {
    const image = galleryImages[currentImageIndex];
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      lightboxImg.src = image.src;
      lightboxImg.alt = image.alt;
      lightboxCaption.textContent = image.caption;
      lightboxImg.style.opacity = 1;
    }, 200);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  lightboxImg.style.transition = 'opacity 0.2s ease';

  // ========== TESTIMONIALS CAROUSEL ==========
  const track = document.getElementById('testimonialsTrack');
  const cards = track.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  let cardsPerView = 3;
  let currentSlide = 0;
  let totalSlides = 0;
  let autoPlayInterval;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function setupCarousel() {
    cardsPerView = getCardsPerView();
    totalSlides = Math.ceil(cards.length / cardsPerView);
    currentSlide = Math.min(currentSlide, totalSlides - 1);

    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === currentSlide) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    updateCarousel();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoPlay();
  }

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 16; // margin
    const offset = currentSlide * cardsPerView * cardWidth;
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

  setupCarousel();
  autoPlayInterval = setInterval(nextSlide, 5000);
  window.addEventListener('resize', setupCarousel);

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  track.addEventListener('mouseleave', () => { autoPlayInterval = setInterval(nextSlide, 5000); });

  // Touch swipe for carousel
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { nextSlide(); }
      else { prevSlide(); }
      resetAutoPlay();
    }
  }, { passive: true });

  // ========== BACK TO TOP ==========
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========== PARALLAX EFFECT (desktop only) ==========
  const isMobile = window.matchMedia('(max-width: 768px)').matches
    || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!isMobile) {
    const parallaxBgs = document.querySelectorAll('.parallax-bg');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxBgs.forEach(bg => {
        const section = bg.parentElement;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollY + window.innerHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
          const speed = 0.3;
          const yOffset = (scrollY - sectionTop) * speed;
          bg.style.transform = `translateY(${yOffset}px)`;
        }
      });
    }, { passive: true });
  }

});
