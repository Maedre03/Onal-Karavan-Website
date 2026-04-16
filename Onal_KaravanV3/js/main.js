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

    // Smart Navbar (Hide on Scroll Down, Show on Scroll Up)
    const header = document.querySelector('.main-header');
    let lastScrollTop = 0;
    const navbarHeight = 80; // Match the CSS height

    if (header) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
                // Scroll Down
                header.classList.add('nav-hidden');
            } else {
                // Scroll Up
                header.classList.remove('nav-hidden');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        });
    }
});
