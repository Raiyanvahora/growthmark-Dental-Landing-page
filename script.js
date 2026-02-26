// ===== STICKY HEADER =====
var header = document.getElementById('header');

window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

// ===== MOBILE MENU =====
var mobileToggle = document.getElementById('mobile-toggle');
var nav = document.getElementById('nav');

function closeMenu() {
    mobileToggle.classList.remove('active');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
}

function openMenu() {
    mobileToggle.classList.add('active');
    nav.classList.add('open');
    document.body.classList.add('menu-open');
}

mobileToggle.addEventListener('click', function () {
    if (nav.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
        closeMenu();
    });
});

// Close menu on outside tap
document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
        closeMenu();
    }
});

// Close menu on resize to desktop
window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && nav.classList.contains('open')) {
        closeMenu();
    }
});

// ===== SCROLL REVEAL =====
function revealOnScroll() {
    var reveals = document.querySelectorAll('.reveal');

    reveals.forEach(function (el) {
        var windowHeight = window.innerHeight;
        var revealTop = el.getBoundingClientRect().top;
        var revealPoint = 100;

        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('DOMContentLoaded', revealOnScroll);

// ===== COUNTER ANIMATION =====
var countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;

    var counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    var firstCounter = counters[0];
    var rect = firstCounter.getBoundingClientRect();

    if (rect.top < window.innerHeight - 80) {
        countersAnimated = true;

        counters.forEach(function (counter) {
            var target = parseInt(counter.getAttribute('data-target'));
            var suffix = counter.getAttribute('data-suffix') || '';
            var duration = 1500;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(eased * target);
                counter.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target + suffix;
                }
            }

            requestAnimationFrame(step);
        });
    }
}

window.addEventListener('scroll', animateCounters, { passive: true });

// ===== GROWTH CHART ANIMATION =====
var chartAnimated = false;

function animateGrowthChart() {
    if (chartAnimated) return;

    var line = document.querySelector('.growth-line');
    var area = document.querySelector('.growth-area');
    if (!line) return;

    var rect = line.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
        chartAnimated = true;
        line.classList.add('animate');
        if (area) area.classList.add('animate');
    }
}

window.addEventListener('scroll', animateGrowthChart, { passive: true });

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(function (button) {
    button.addEventListener('click', function () {
        var item = this.parentElement;
        var isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item').forEach(function (faq) {
            faq.classList.remove('open');
            faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Open clicked if it was closed
        if (!isOpen) {
            item.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== FORM VALIDATION & SUBMISSION =====
var contactForm = document.getElementById('contact-form');
var formSuccess = document.getElementById('form-success');
var toast = document.getElementById('toast');

function showToast() {
    toast.classList.add('show');
    setTimeout(function () {
        toast.classList.remove('show');
    }, 4000);
}

function validateField(input, errorId, message) {
    var errorEl = document.getElementById(errorId);
    var value = input.value.trim();

    if (!value) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = message;
        return false;
    }

    // Phone validation: at least 10 digits
    if (input.type === 'tel') {
        var digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
            input.classList.add('error');
            if (errorEl) errorEl.textContent = 'Enter a valid phone number (10+ digits)';
            return false;
        }
    }

    input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
    return true;
}

// Clear errors on input
document.querySelectorAll('.contact-form input[required]').forEach(function (input) {
    input.addEventListener('input', function () {
        this.classList.remove('error');
        var errorEl = document.getElementById(this.id + '-error');
        if (errorEl) errorEl.textContent = '';
    });
});

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var clinicName = document.getElementById('clinic-name');
    var doctorName = document.getElementById('doctor-name');
    var phone = document.getElementById('phone');
    var city = document.getElementById('city');

    var v1 = validateField(clinicName, 'clinic-name-error', 'Clinic name is required');
    var v2 = validateField(doctorName, 'doctor-name-error', 'Doctor name is required');
    var v3 = validateField(phone, 'phone-error', 'Phone number is required');
    var v4 = validateField(city, 'city-error', 'City is required');

    if (!v1 || !v2 || !v3 || !v4) {
        // Focus first error
        var firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
    }

    // Success
    contactForm.style.display = 'none';
    formSuccess.classList.add('visible');
    showToast();

    // Scroll to form section top
    var contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== FLOATING BUTTONS =====
var whatsappFloat = document.getElementById('whatsapp-float');
var callFloat = document.getElementById('call-float');

function toggleFloatingButtons() {
    if (window.scrollY > 400) {
        whatsappFloat.classList.add('visible');
        if (callFloat) callFloat.classList.add('visible');
    } else {
        whatsappFloat.classList.remove('visible');
        if (callFloat) callFloat.classList.remove('visible');
    }
}

window.addEventListener('scroll', toggleFloatingButtons, { passive: true });
window.addEventListener('DOMContentLoaded', toggleFloatingButtons);
