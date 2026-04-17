// Main JavaScript file for Önal Karavan website

document.addEventListener('DOMContentLoaded', () => {
    console.log("Önal Karavan website logic loaded.");
    
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const backdrop = document.querySelector('.menu-backdrop');
    const closeBtn = document.querySelector('.menu-close');
    
    function toggleMenu() {
        const isActive = mainNav.classList.contains('active');
        if (isActive) {
            mainNav.classList.remove('active');
            backdrop.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        } else {
            mainNav.classList.add('active');
            backdrop.classList.add('active');
            menuBtn.setAttribute('aria-expanded', 'true');
        }
    }

    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', toggleMenu);
        if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
        if (backdrop) backdrop.addEventListener('click', toggleMenu);
    }
    
    // Auto Image Slider (Before/After)
    const sliderContainer = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('#before-after-slider .slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        
        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            if(dots.length > 0) dots[currentSlide].classList.remove('active');
            
            currentSlide = (index + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            if(dots.length > 0) dots[currentSlide].classList.add('active');
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        function startSlide() {
            slideInterval = setInterval(nextSlide, 3500); // 3.5 seconds
        }

        function pauseSlide() {
            clearInterval(slideInterval);
        }

        if(nextBtn) nextBtn.addEventListener('click', () => { pauseSlide(); nextSlide(); startSlide(); });
        if(prevBtn) prevBtn.addEventListener('click', () => { pauseSlide(); prevSlide(); startSlide(); });
        
        if(dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    pauseSlide();
                    goToSlide(index);
                    startSlide();
                });
            });
        }
        
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', pauseSlide);
            sliderContainer.addEventListener('mouseleave', startSlide);
        }
        
        startSlide();
    }
    
    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    let currentlyOpenHeader = null;
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Close the previously open accordion if it's not the clicked one
            if (currentlyOpenHeader && currentlyOpenHeader !== header) {
                currentlyOpenHeader.setAttribute('aria-expanded', 'false');
                if (currentlyOpenHeader.nextElementSibling) {
                    currentlyOpenHeader.nextElementSibling.style.maxHeight = null;
                }
            }
            
            // Toggle current accordion
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                if (content) content.style.maxHeight = null;
                currentlyOpenHeader = null;
            } else {
                header.setAttribute('aria-expanded', 'true');
                if (content) content.style.maxHeight = content.scrollHeight + "px";
                currentlyOpenHeader = header;
            }
        });
    });
    
    // Deep Linking for Social Media Icons on Mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobileDevice) {
        const socialLinks = document.querySelectorAll('.social-icons a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const label = link.getAttribute('aria-label');
                let appUrl = '';
                const webUrl = link.href;

                if (label === 'Instagram') {
                    appUrl = 'instagram://user?username=onalkaravan';
                } else if (label === 'Facebook') {
                    appUrl = 'fb://profile/100069736762715';
                } else if (label === 'TikTok') {
                    appUrl = 'tiktok://user?screen_name=onalkaravan';
                } else if (label === 'YouTube') {
                    // Universal attempt for YouTube
                    appUrl = navigator.userAgent.match(/Android/i) 
                        ? 'vnd.youtube://www.youtube.com/@önalkaravan'
                        : 'youtube://www.youtube.com/@önalkaravan';
                }

                if (appUrl) {
                    e.preventDefault();
                    
                    // Fallback timeout if app fails to open
                    const fallbackTimeout = setTimeout(() => {
                        if (!document.hidden) {
                            window.location.href = webUrl;
                        }
                    }, 1000);
                    
                    // If the app successfully opens, the document gets hidden
                    document.addEventListener('visibilitychange', () => {
                        if (document.hidden) {
                            clearTimeout(fallbackTimeout);
                        }
                    }, { once: true });

                    // Attempt to open the app
                    window.location.href = appUrl;
                }
            });
        });
    }

    // Smart Navbar (Hide on Scroll Down, Show on Scroll Up, Toggle blurred background)
    const header = document.querySelector('.main-header');
    let lastScrollTop = 0;
    const navbarHeight = 80;

    if (header) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add or remove blurred background
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
                // Scroll Down
                header.classList.add('nav-hidden');
            } else {
                // Scroll Up
                header.classList.remove('nav-hidden');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    // Testimonials Carousel Logic — Infinite Auto-Play
    const testimGrid = document.getElementById('testim-grid');
    const testimPrev = document.getElementById('testim-prev');
    const testimNext = document.getElementById('testim-next');

    if (testimGrid && testimPrev && testimNext) {
        const originalCards = Array.from(testimGrid.querySelectorAll('.review-card'));
        const totalOriginal = originalCards.length;

        // Clone all cards and append them for seamless looping
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            testimGrid.appendChild(clone);
        });

        const allCards = testimGrid.querySelectorAll('.review-card');
        let testimIndex = 0;
        let testimAutoInterval;

        function getCardsPerView() {
            return window.innerWidth <= 768 ? 1 : 3;
        }

        function updateTestimCarousel(animate) {
            const cardsPerView = getCardsPerView();
            const gap = 32; // 2rem = 32px
            const card = allCards[0];
            const cardWidth = card.offsetWidth + gap;
            const offset = -testimIndex * cardWidth;

            if (animate === false) {
                testimGrid.style.transition = 'none';
            } else {
                testimGrid.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            testimGrid.style.transform = `translateX(${offset}px)`;
        }

        function nextTestim() {
            testimIndex++;
            updateTestimCarousel(true);

            // When we've scrolled past all originals, jump back seamlessly
            if (testimIndex >= totalOriginal) {
                setTimeout(() => {
                    testimIndex = 0;
                    updateTestimCarousel(false);
                }, 620); // Wait for transition to finish
            }
        }

        function prevTestim() {
            if (testimIndex <= 0) {
                // Jump to the cloned set end instantly, then animate back
                testimIndex = totalOriginal;
                updateTestimCarousel(false);
                // Force reflow so the browser registers the instant jump
                testimGrid.offsetHeight; // eslint-disable-line no-unused-expressions
                testimIndex = totalOriginal - 1;
                updateTestimCarousel(true);
            } else {
                testimIndex--;
                updateTestimCarousel(true);
            }
        }

        function startTestimAuto() {
            stopTestimAuto();
            testimAutoInterval = setInterval(nextTestim, 4000);
        }

        function stopTestimAuto() {
            clearInterval(testimAutoInterval);
        }

        testimNext.addEventListener('click', () => {
            stopTestimAuto();
            nextTestim();
            startTestimAuto();
        });

        testimPrev.addEventListener('click', () => {
            stopTestimAuto();
            prevTestim();
            startTestimAuto();
        });

        // Pause on hover
        const carouselWrapper = testimGrid.closest('.reviews-carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', stopTestimAuto);
            carouselWrapper.addEventListener('mouseleave', startTestimAuto);
        }

        // Recalculate on resize
        window.addEventListener('resize', () => updateTestimCarousel(false));

        // Initialize
        updateTestimCarousel(false);
        startTestimAuto();
    }
});
