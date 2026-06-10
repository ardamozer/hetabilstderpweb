/**
 * Class representing the Hero Slider section.
 */
class HeroSlider {
    constructor(sliderSelector, slideSelector, dotSelector, intervalTime = 5500) {
        this.slider = document.querySelector(sliderSelector);
        this.slides = document.querySelectorAll(slideSelector);
        this.dots = document.querySelectorAll(dotSelector);
        this.intervalTime = intervalTime;
        this.currentIndex = 0;
        this.timer = null;

        if (this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.i, 10);
                if (!isNaN(index)) {
                    this.goTo(index);
                    this.resetInterval();
                }
            });
        });
        this.startAutoplay();
    }

    goTo(index) {
        if (index < 0 || index >= this.slides.length) return;
        this.slides[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');
        this.currentIndex = index;
        this.slides[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goTo(nextIndex);
    }

    startAutoplay() {
        this.timer = setInterval(() => this.next(), this.intervalTime);
    }

    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    resetInterval() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

/**
 * Class representing the module tabs navigation.
 */
class ModuleTabs {
    constructor(tabSelector, panelPrefix) {
        this.tabs = document.querySelectorAll(tabSelector);
        this.panelPrefix = panelPrefix;

        if (this.tabs.length > 0) {
            this.init();
        }
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.activateTab(tab));
        });
    }

    activateTab(selectedTab) {
        this.tabs.forEach(t => t.classList.remove('active'));
        selectedTab.classList.add('active');

        const panelId = this.panelPrefix + selectedTab.dataset.p;
        const activePanel = document.getElementById(panelId);

        const panels = activePanel?.parentElement?.querySelectorAll('.m-panel');
        if (panels) {
            panels.forEach(p => p.classList.remove('active'));
        }

        if (activePanel) {
            activePanel.classList.add('active');
        }
    }
}

/**
 * Class representing the back-to-top button functionality.
 */
class ScrollToTop {
    constructor(buttonId, threshold = 400) {
        this.button = document.getElementById(buttonId);
        this.threshold = threshold;

        if (this.button) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    handleScroll() {
        this.button.classList.toggle('vis', window.scrollY > this.threshold);
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Class representing the Mobile Navigation Menu.
 */
class MobileMenu {
    constructor(menuId, buttonId, closeId) {
        this.menu = document.getElementById(menuId);
        this.toggleButton = document.getElementById(buttonId);
        this.closeButton = document.getElementById(closeId);

        if (this.menu && this.toggleButton) {
            this.init();
        }
    }

    init() {
        this.toggleButton.addEventListener('click', () => this.open());
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }

        const links = this.menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }

    open() {
        this.menu.classList.add('open');
    }

    close() {
        this.menu.classList.remove('open');
    }
}

/**
 * Class representing the fullscreen Screen Slider with thumbnail navigation.
 */
class ScreenSlider {
    constructor(config) {
        this.slides = config.slides;         // array of { tabLabel, title, tag }
        this.slidesEl = document.getElementById(config.slidesElId);
        this.thumbsEl = document.getElementById(config.thumbsElId);
        this.prevBtn = document.getElementById(config.prevBtnId);
        this.nextBtn = document.getElementById(config.nextBtnId);
        this.tabLabel = document.getElementById(config.tabLabelId);
        this.counter = document.getElementById(config.counterId);
        this.capTitle = document.getElementById(config.capTitleId);
        this.capTag = document.getElementById(config.capTagId);
        this.current = 0;
        this.isInitial = true;

        if (this.slidesEl && this.thumbsEl) {
            this.init();
        }
    }

    init() {
        // Thumbnail clicks
        this.thumbsEl.querySelectorAll('.sc-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const idx = parseInt(thumb.dataset.idx, 10);
                if (!isNaN(idx)) this.goTo(idx);
            });
        });

        // Arrow buttons
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        this.updateUI();
    }

    goTo(index) {
        if (index < 0 || index >= this.slides.length) return;
        this.current = index;
        this.updateUI();
    }

    prev() {
        this.goTo((this.current - 1 + this.slides.length) % this.slides.length);
    }

    next() {
        this.goTo((this.current + 1) % this.slides.length);
    }

    updateUI() {
        const total = this.slides.length;
        const idx = this.current;
        const slide = this.slides[idx];

        // Translate the slides strip
        this.slidesEl.style.transform = `translateX(-${idx * 100}%)`;

        // Update active thumbnail
        this.thumbsEl.querySelectorAll('.sc-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === idx);
        });

        // Scroll active thumb into view
        const activeThumb = this.thumbsEl.querySelector('.sc-thumb.active');
        if (activeThumb && !this.isInitial) {
            activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
        this.isInitial = false;

        // Update metadata labels
        if (this.tabLabel) this.tabLabel.textContent = slide.tabLabel;
        if (this.counter) this.counter.textContent = `${idx + 1} / ${total}`;
        if (this.capTitle) this.capTitle.textContent = slide.title;
        if (this.capTag) this.capTag.textContent = slide.tag;
    }
}

/**
 * Main Application Coordinator class.
 */
class App {
    static init() {
        new HeroSlider('#heroSlider', '.slide', '.s-dot');
        new ModuleTabs('.m-tab', 'mp-');
        new ScrollToTop('scrollTop');
        new MobileMenu('mobileNav', 'mobBtn', 'mnClose');
        new ScreenSlider({
            slidesElId: 'scSlides',
            thumbsElId: 'scThumbs',
            prevBtnId: 'scPrev',
            nextBtnId: 'scNext',
            tabLabelId: 'scTabLabel',
            counterId: 'scCounter',
            capTitleId: 'scCapTitle',
            capTagId: 'scCapTag',
            slides: [
                { tabLabel: 'KULLANICI_SEPETLERI', title: 'Kullanıcı Sepet Yönetimi', tag: 'Sepet & Stok' },
                { tabLabel: 'INDIRIM_GRUBU', title: 'İndirim Grubu Tanımlama', tag: 'Tanımlamalar' },
                { tabLabel: 'RANDEVU_TAKIP', title: 'Randevu Takip Sistemi', tag: 'Takip' },
                { tabLabel: 'IS_EMRI_DUZENLEME', title: 'İş Emri Düzenleme & Rota Yönetimi', tag: 'İş Emri' },
                { tabLabel: 'URUN_KARTI', title: 'Ürün Kartı – Koli & Flesko', tag: 'Ürün Tanımı' },
                { tabLabel: 'GOSTERGE_PANELI', title: 'Gösterge Paneli & Satış Analizi', tag: 'Dashboard' },
                { tabLabel: 'DEPO_YONETIMI', title: 'Depo Yönetimi', tag: 'Depo & Lojistik' },
                { tabLabel: 'SIPARISLER', title: 'Sipariş Takibi & Yönetimi', tag: 'Sipariş' },
            ]
        });
    }
}

// Initialize application when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', App.init);
