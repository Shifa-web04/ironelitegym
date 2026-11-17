/* ============================================
   IRON ELITE FITNESS — SCRIPT
   ============================================ */

/* ---------- 1. LOADING SCREEN ---------- */
// Hide the loader once the whole page (including images) has finished loading.
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.classList.add('loaded');
});

/* ---------- 2. NAVBAR: solid background on scroll ---------- */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll);
handleNavbarScroll(); // run once on load in case the page is already scrolled

/* ---------- 3. MOBILE HAMBURGER MENU ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);

  // Animate the three bars into an X using inline transforms
  const bars = hamburger.querySelectorAll('span');
  if (isOpen) {
    bars[0].style.transform = 'translateY(7.5px) rotate(45deg)';
    bars[1].style.opacity = '0';
    bars[2].style.transform = 'translateY(-7.5px) rotate(-45deg)';
  } else {
    bars[0].style.transform = '';
    bars[1].style.opacity = '1';
    bars[2].style.transform = '';
  }
});

// Close the mobile menu automatically when a link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(bar => {
      bar.style.transform = '';
      bar.style.opacity = '1';
    });
  });
});

/* ---------- 4. SCROLL REVEAL ANIMATIONS ---------- */
// IntersectionObserver watches every element with the .reveal class.
// When an element scrolls into the viewport, we add .visible to trigger
// the CSS transition (defined in style.css), then stop observing it —
// we only want the reveal to happen once, not every time it scrolls by.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15 // fire when 15% of the element is visible
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- 5. ANIMATED STAT COUNTERS ---------- */
// Counts each stat number up from 0 to its data-target value, but only
// once the stats section actually scrolls into view (no point animating
// numbers the user hasn't scrolled to yet).
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800; // total animation time in ms
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    // ease-out curve so the count starts fast and settles smoothly
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString();
    }
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

/* ---------- 6. TESTIMONIAL SLIDER ---------- */
const track = document.getElementById('testimonialTrack');
const slides = track.querySelectorAll('.testimonial-slide');
const dotsContainer = document.getElementById('testimonialDots');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');

let currentSlide = 0;

// Build one dot button per slide dynamically, so this scales
// automatically if more testimonials are added to the HTML later.
slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('button');

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length; // wraps around both directions
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentSlide].classList.add('active');
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Auto-advance every 6 seconds, pausing while the user hovers the slider
let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 6000);
const sliderEl = document.querySelector('.testimonial-slider');
sliderEl.addEventListener('mouseenter', () => clearInterval(autoSlide));
sliderEl.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 6000);
});

/* ---------- 7. FAQ ACCORDION ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close every other open FAQ item first, so only one is expanded
    // at a time — a standard accordion behavior.
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      // maxHeight is set to the answer's actual content height so the
      // CSS max-height transition has a real target to animate toward
      // (you can't transition to "auto" directly in CSS).
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ---------- 8. BUTTON RIPPLE EFFECT ---------- */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);

    ripple.className = 'ripple-span';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    this.appendChild(ripple);
    // Clean up the ripple element after its animation finishes so the
    // DOM doesn't accumulate leftover spans on repeated clicks.
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ---------- 9. BACK TO TOP BUTTON ---------- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 600);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
