document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // --- Fade-in sections ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));

    // --- Contact form alert ---
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        alert('Thank you! Your message has been sent.');
        contactForm.reset();
    });

    // --- Carousel ---
    const track = document.querySelector('.carousel-track');
    let slides = Array.from(track.children);
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;
    let slideWidth = slides[0].getBoundingClientRect().width;

    // Clone slides for infinite loop
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length-1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    track.appendChild(firstClone);
    track.prepend(lastClone);
    slides = Array.from(track.children);
    currentIndex = 1;
    moveToSlide(currentIndex, false);

    // Dots
    slides.filter(s => !s.classList.contains('clone')).forEach((_, i) => {
        const dot = document.createElement('button');
        if(i===0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
        dot.addEventListener('click', () => {
            currentIndex = i + 1;
            moveToSlide(currentIndex);
        });
    });
    const dots = Array.from(dotsContainer.children);

    function moveToSlide(index, withTransition=true){
        slideWidth = slides[0].getBoundingClientRect().width;
        currentIndex = index;
        track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }

    function updateDots() {
        const realIndex = currentIndex - 1;
        dots.forEach(dot => dot.classList.remove('active'));
        if(realIndex < 0) dots[dots.length-1].classList.add('active');
        else if(realIndex >= dots.length) dots[0].classList.add('active');
        else dots[realIndex].classList.add('active');
    }

    track.addEventListener('transitionend', () => {
        if(slides[currentIndex].classList.contains('clone')){
            track.style.transition = 'none';
            currentIndex = currentIndex===0 ? slides.length-2 : 1;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
    });

    nextButton.addEventListener('click', () => moveToSlide(currentIndex+1));
    prevButton.addEventListener('click', () => moveToSlide(currentIndex-1));

    let autoSlide = setInterval(() => moveToSlide(currentIndex+1), 5000);

    // --- EN/TR Language Switcher ---
    const translations = {
        "en": {
            "nav-home":"Home","nav-about":"About","nav-services":"Services","nav-process":"Process",
            "nav-testimonials":"Testimonials","nav-gallery":"Gallery","nav-contact":"Contact",
            "hero-title":"Custom Caravan Builds & Repairs",
            "hero-text":"Your trusted partner for caravan conversions, repairs, and custom builds.",
            "hero-btn-contact":"Get in Touch","hero-btn-gallery":"View Projects",
            "cta-title":"Ready to Start Your Caravan Project?","cta-text":"Contact us today and let's build something amazing.",
            "cta-btn":"Contact Us","contact-title":"Contact Us","contact-name":"Your Name",
            "contact-email":"Your Email","contact-message":"Your Message","contact-btn":"Send Message"
        },
        "tr": {
            "nav-home":"Anasayfa","nav-about":"Hakkımızda","nav-services":"Hizmetler","nav-process":"Süreç",
            "nav-testimonials":"Müşteri Yorumları","nav-gallery":"Galeri","nav-contact":"İletişim",
            "hero-title":"Özel Karavan Yapımları ve Onarımları",
            "hero-text":"Karavan dönüşümleri, onarımları ve özel yapımlar için güvenilir ortağınız.",
            "hero-btn-contact":"İletişime Geç","hero-btn-gallery":"Projeleri Görüntüle",
            "cta-title":"Karavan Projenize Başlamaya Hazır mısınız?","cta-text":"Bugün bizimle iletişime geçin ve harika bir şey inşa edelim.",
            "cta-btn":"İletişime Geç","contact-title":"İletişim","contact-name":"Adınız",
            "contact-email":"Email Adresiniz","contact-message":"Mesajınız","contact-btn":"Gönder"
        }
    };

    let currentLang = 'tr'; // default language

    // Function to switch language
    function setLanguage(lang){
        currentLang = lang;

        // Update all elements with class .translate
        document.querySelectorAll('.translate').forEach(el => {
            const key = el.getAttribute('data-key');
            const text = translations[lang][key];
            if(!text) return;

            if(el.tagName === "INPUT" || el.tagName === "TEXTAREA"){
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });

        const langToggleBtn = document.querySelector('.lang-toggle');

        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'tr' ? 'en' : 'tr';
            setLanguage(currentLang);
        });
    }

    // Set initial language
    setLanguage(currentLang);

    // --- Testimonial slider ---
    const testimonials = document.querySelectorAll('.testimonial-box');
    let testimonialIndex = 0;

    function showTestimonial(index){
        testimonials.forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });
    }

    showTestimonial(testimonialIndex);

    setInterval(() => {
        testimonialIndex = (testimonialIndex + 1) % testimonials.length;
        showTestimonial(testimonialIndex);
    }, 5000);
});
