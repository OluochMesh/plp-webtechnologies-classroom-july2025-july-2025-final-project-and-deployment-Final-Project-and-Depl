// Image Carousel for Homepage
class ImageCarousel {
    constructor(container) {
        this.container = container;
        this.images = container.querySelectorAll('img');
        this.currentIndex = 0;
        this.totalImages = this.images.length;
        
        if (this.totalImages === 0) return;
        
        this.init();
        this.startAutoplay();
    }
    
    init() {
        // Set initial state
        this.images.forEach((img, index) => {
            img.classList.remove('active', 'prev', 'next');
            if (index === this.currentIndex) {
                img.classList.add('active');
            } else if (index === this.getPrevIndex()) {
                img.classList.add('prev');
            } else if (index === this.getNextIndex()) {
                img.classList.add('next');
            }
        });
        
        // Add navigation indicators
        this.createIndicators();
        
        // Add touch/swipe support
        this.addTouchSupport();
        
        // Add keyboard navigation
        this.addKeyboardSupport();
    }
    
    createIndicators() {
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'carousel-indicators';
        indicatorContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
        `;
        
        for (let i = 0; i < this.totalImages; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: rgba(255,255,255,0.5);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            if (i === this.currentIndex) {
                indicator.style.background = 'white';
                indicator.style.transform = 'scale(1.2)';
            }
            
            indicator.addEventListener('click', () => this.goToSlide(i));
            indicatorContainer.appendChild(indicator);
        }
        
        this.container.appendChild(indicatorContainer);
        this.indicators = indicatorContainer.querySelectorAll('.carousel-indicator');
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });
        
        // Mouse drag support
        let isDragging = false;
        
        this.container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            this.container.style.cursor = 'grabbing';
        });
        
        this.container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        this.container.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            endX = e.clientX;
            endY = e.clientY;
            this.container.style.cursor = 'grab';
            this.handleSwipe(startX, startY, endX, endY);
        });
        
        this.container.addEventListener('mouseleave', () => {
            isDragging = false;
            this.container.style.cursor = 'grab';
        });
    }
    
    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        }
    }
    
    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    getPrevIndex() {
        return this.currentIndex === 0 ? this.totalImages - 1 : this.currentIndex - 1;
    }
    
    getNextIndex() {
        return this.currentIndex === this.totalImages - 1 ? 0 : this.currentIndex + 1;
    }
    
    updateClasses() {
        this.images.forEach((img, index) => {
            img.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentIndex) {
                img.classList.add('active');
            } else if (index === this.getPrevIndex()) {
                img.classList.add('prev');
            } else if (index === this.getNextIndex()) {
                img.classList.add('next');
            }
        });
        
        // Update indicators
        if (this.indicators) {
            this.indicators.forEach((indicator, index) => {
                if (index === this.currentIndex) {
                    indicator.style.background = 'white';
                    indicator.style.transform = 'scale(1.2)';
                } else {
                    indicator.style.background = 'rgba(255,255,255,0.5)';
                    indicator.style.transform = 'scale(1)';
                }
            });
        }
    }
    
    nextSlide() {
        this.currentIndex = this.getNextIndex();
        this.updateClasses();
        this.resetAutoplay();
    }
    
    prevSlide() {
        this.currentIndex = this.getPrevIndex();
        this.updateClasses();
        this.resetAutoplay();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateClasses();
        this.resetAutoplay();
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// Gallery Lightbox
class GalleryLightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.closeBtn = document.querySelector('.lightbox .close');
        
        if (!this.lightbox) return;
        
        this.init();
    }
    
    init() {
        // Add click listeners to gallery items
        const galleryItems = document.querySelectorAll('.gallery-item img');
        galleryItems.forEach(img => {
            img.addEventListener('click', () => this.openLightbox(img));
        });
        
        // Close lightbox listeners
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
        });
    }
    
    openLightbox(img) {
        this.lightboxImg.src = img.src;
        this.lightboxImg.alt = img.alt;
        this.lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Smooth Scrolling for Navigation
class SmoothNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        const links = document.querySelectorAll('nav a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Form Enhancement
class FormEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => this.enhanceForm(form));
    }
}
