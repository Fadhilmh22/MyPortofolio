// Smooth scroll with offset for sticky navbar
function initSmoothScroll() {
  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      
      // Skip if it's just "#" or empty, or external links
      if (!href || href === '#' || href.length <= 1) {
        return;
      }
      
      e.preventDefault();
      const targetId = href;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20;
        
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth"
        });
      }
    });
  });
}

// Initialize smooth scroll when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
  initSmoothScroll();
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  // show after scrolling down a bit
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Certificate Slider
const certificateSlider = () => {
  const track = document.querySelector('.certificate-track');
  const items = document.querySelectorAll('.certificate-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dotsContainer = document.querySelector('.slider-dots');
  const modal = document.getElementById('certificateModal');
  const modalImage = document.getElementById('modalImage');
  const modalPdf = document.getElementById('modalPdf');
  const modalClose = document.querySelector('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');

  if (!track || items.length === 0) return;

  let currentIndex = 0;
  const itemsPerView = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  const totalSlides = Math.ceil(items.length / itemsPerView);

  // Create dots
  const createDots = () => {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  };

  // Update slider position
  const updateSlider = () => {
    const itemWidth = items[0].offsetWidth + 20; // width + gap
    const translateX = -currentIndex * itemWidth * itemsPerView;
    track.style.transform = `translateX(${translateX}px)`;

    // Update dots
    document.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalSlides - 1;
  };

  // Go to specific slide
  const goToSlide = (index) => {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateSlider();
  };

  // Next slide
  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateSlider();
    }
  };

  // Previous slide
  const prevSlide = () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  };

  // Open modal with certificate
  const openModal = (certFileName) => {
    const isPdf = certFileName.endsWith('.pdf');
    const certPath = `assets/certificate/${certFileName}`;

    if (isPdf) {
      modalImage.style.display = 'none';
      modalPdf.style.display = 'block';
      modalPdf.src = certPath;
    } else {
      modalPdf.style.display = 'none';
      modalImage.style.display = 'block';
      modalImage.src = certPath;
      modalImage.alt = certFileName.replace(/\.[^/.]+$/, '');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalImage.src = '';
      modalPdf.src = '';
    }, 300);
  };

  // Event listeners
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  items.forEach(item => {
    item.addEventListener('click', () => {
      const certFileName = item.getAttribute('data-cert');
      openModal(certFileName);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createDots();
      currentIndex = 0;
      updateSlider();
    }, 250);
  });

  // Initialize
  createDots();
  updateSlider();
};

// Initialize certificate slider when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', certificateSlider);
} else {
  certificateSlider();
}