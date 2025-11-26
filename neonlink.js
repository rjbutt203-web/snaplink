// ========================================
// NEONLINK - CYBERPUNK URL SHORTENER
// Advanced JavaScript with neon effects
// ========================================

// PARTICLE SYSTEM
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.querySelector('.particles-container');
        this.init();
    }

    init() {
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 15) + 's';
        this.container.appendChild(particle);
    }
}

// GRID ANIMATION
class GridAnimation {
    constructor() {
        this.grid = document.querySelector('.grid-background');
    }

    update() {
        // Grid animation runs via CSS
    }
}

// GLITCH EFFECT
class GlitchEffect {
    static apply(element, duration = 200) {
        const originalText = element.textContent;
        const glitchChars = '!<>-_\\/:;?*[]{}~';
        let iterations = 0;
        const maxIterations = duration / 20;

        const glitchInterval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (Math.random() < 0.3) {
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    }
                    return char;
                })
                .join('');

            iterations++;
            if (iterations >= maxIterations) {
                clearInterval(glitchInterval);
                element.textContent = originalText;
            }
        }, 20);
    }
}

// TOAST NOTIFICATIONS
class ToastNotification {
    static show(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `neon-toast show`;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        toast.innerHTML = `
            <span style="font-size: 1.2rem;">${icon}</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// URL SHORTENING - shrtco.de API
class URLShortener {
    static async shorten(longUrl) {
        try {
            // Validate URL
            new URL(longUrl);

            // Using shrtco.de API
            const encodedUrl = encodeURIComponent(longUrl);
            const response = await fetch(
                `https://api.shrtco.de/v2/shorten?url=${encodedUrl}`
            );

            if (!response.ok) {
                throw new Error('API error');
            }

            const data = await response.json();
            
            if (data.ok) {
                return {
                    shortUrl: data.result.short_link,
                    fullUrl: data.result.full_short_link,
                    qrCode: data.result.qr_code
                };
            } else {
                throw new Error(data.error || 'Failed to shorten URL');
            }
        } catch (error) {
            console.error('URL Shortening Error:', error);
            throw new Error('Invalid URL or API error');
        }
    }
}

// QR CODE GENERATION
class QRCodeGenerator {
    static getCode(url, size = 200) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    }

    static getQRWithLogo(url) {
        // Enhanced QR with neon styling
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&bgcolor=000000&color=00F2EA`;
    }
}

// CLICK COUNTER SIMULATION
class ClickCounter {
    constructor() {
        this.clicks = Math.floor(Math.random() * 10000) + 100;
        this.isAnimating = false;
    }

    increment() {
        if (!this.isAnimating) {
            this.clicks += 1;
            this.animate();
        }
    }

    animate() {
        this.isAnimating = true;
        const element = document.querySelector('.click-number');
        if (element) {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'counterGlow 1s ease-in-out infinite';
            }, 10);
        }
    }

    autoIncrement(interval = 5000) {
        setInterval(() => {
            this.increment();
            this.updateDisplay();
        }, interval);
    }

    updateDisplay() {
        const element = document.querySelector('.click-number');
        if (element) {
            element.textContent = this.clicks.toLocaleString();
        }
    }
}

// MAIN APP CONTROLLER
class NeonLinkApp {
    constructor() {
        this.state = {
            currentUrl: '',
            shortUrl: '',
            qrCode: '',
            isLoading: false
        };

        this.clickCounter = new ClickCounter();
        this.particles = new ParticleSystem();
        this.grid = new GridAnimation();

        this.init();
    }

    init() {
        this.setupElements();
        this.attachEventListeners();
        this.setupAnimations();
        this.clickCounter.autoIncrement(5000);
    }

    setupElements() {
        this.heroSection = document.querySelector('.hero');
        this.resultSection = document.querySelector('.result-section');
        this.inputField = document.querySelector('.neon-input');
        this.shortenBtn = document.querySelector('.btn-shorten');
        this.floatingLabel = document.querySelector('.floating-label');
    }

    attachEventListeners() {
        // Shorten button
        this.shortenBtn.addEventListener('click', () => this.handleShorten());

        // Enter key
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleShorten();
        });

        // Input focus
        this.inputField.addEventListener('focus', () => {
            this.floatingLabel.style.top = '-8px';
            this.floatingLabel.style.color = '#00F2EA';
        });

        this.inputField.addEventListener('blur', () => {
            if (!this.inputField.value) {
                this.floatingLabel.style.top = '50%';
                this.floatingLabel.style.color = '#a0a0a0';
            }
        });

        // Copy button
        const copyBtn = document.querySelector('.btn-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyToClipboard());
        }

        // Another button
        const anotherBtn = document.querySelector('.neon-border-btn');
        if (anotherBtn) {
            anotherBtn.addEventListener('click', () => this.resetForm());
        }

        // Social sharing
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-whatsapp')) {
                this.shareWhatsApp();
            }
            if (e.target.closest('.btn-twitter')) {
                this.shareTwitter();
            }
            if (e.target.closest('.btn-share')) {
                this.shareGeneric();
            }
            if (e.target.closest('.btn-download')) {
                this.downloadQR();
            }
            if (e.target.closest('.btn-close')) {
                this.resetForm();
            }
        });
    }

    async handleShorten() {
        const url = this.inputField.value.trim();

        if (!url) {
            ToastNotification.show('Please enter a valid URL', 'error');
            GlitchEffect.apply(this.inputField, 300);
            return;
        }

        // Validate URL format
        if (!this.isValidUrl(url)) {
            ToastNotification.show('Please enter a valid URL (include http:// or https://)', 'error');
            return;
        }

        this.state.isLoading = true;
        this.shortenBtn.textContent = 'Shortening...';
        this.shortenBtn.disabled = true;

        try {
            const result = await URLShortener.shorten(url);
            
            this.state.currentUrl = url;
            this.state.shortUrl = result.fullUrl;
            this.state.qrCode = result.qr_code || QRCodeGenerator.getQRWithLogo(result.fullUrl);

            // Show result
            this.showResult();
            ToastNotification.show('URL shortened successfully! 🚀', 'success');

        } catch (error) {
            ToastNotification.show(error.message, 'error');
            console.error('Error:', error);
        } finally {
            this.state.isLoading = false;
            this.shortenBtn.textContent = 'Shorten Now';
            this.shortenBtn.disabled = false;
        }
    }

    isValidUrl(string) {
        try {
            // Add protocol if missing
            const urlString = string.startsWith('http://') || string.startsWith('https://')
                ? string
                : 'https://' + string;
            new URL(urlString);
            return true;
        } catch (_) {
            return false;
        }
    }

    showResult() {
        // Hide hero, show result
        this.heroSection.style.display = 'none';
        this.resultSection.style.display = 'flex';

        // Update result card
        const shortLinkBox = document.querySelector('.short-link-box');
        const qrImage = document.querySelector('.qr-image');
        const clickNumber = document.querySelector('.click-number');

        shortLinkBox.textContent = this.state.shortUrl.replace('https://', '');
        qrImage.src = this.state.qrCode;
        clickNumber.textContent = this.clickCounter.clicks.toLocaleString();

        // Trigger animations
        this.clickCounter.animate();
        GlitchEffect.apply(document.querySelector('.result-header h2'), 100);
    }

    copyToClipboard() {
        const copyBtn = document.querySelector('.btn-copy');
        
        navigator.clipboard.writeText(this.state.shortUrl).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied!';
            copyBtn.classList.add('copied');
            
            GlitchEffect.apply(copyBtn, 150);

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);

            ToastNotification.show('Copied to clipboard! 📋', 'success');
        }).catch(() => {
            ToastNotification.show('Failed to copy', 'error');
        });
    }

    shareWhatsApp() {
        const text = `Check out this shortened link! ${this.state.shortUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank', 'width=500,height=600');
        ToastNotification.show('Opening WhatsApp... 💬', 'success');
    }

    shareTwitter() {
        const text = `Just shortened my URL with NeonLink! ${this.state.shortUrl} 🚀`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank', 'width=500,height=600');
        ToastNotification.show('Opening Twitter... 𝕏', 'success');
    }

    shareGeneric() {
        if (navigator.share) {
            navigator.share({
                title: 'NeonLink',
                text: `Check out my shortened URL: ${this.state.shortUrl}`,
                url: this.state.shortUrl
            }).catch(err => console.log('Share error:', err));
        } else {
            this.copyToClipboard();
        }
    }

    downloadQR() {
        const link = document.createElement('a');
        link.href = this.state.qrCode;
        link.download = 'neonlink-qr.png';
        link.click();
        ToastNotification.show('QR code downloaded! 📥', 'success');
    }

    resetForm() {
        this.inputField.value = '';
        this.inputField.blur();
        this.heroSection.style.display = 'flex';
        this.resultSection.style.display = 'none';
        
        this.state.currentUrl = '';
        this.state.shortUrl = '';
        this.state.qrCode = '';
    }

    setupAnimations() {
        // Neon text glitch animation
        const neonTexts = document.querySelectorAll('.neon-text');
        neonTexts.forEach(text => {
            text.addEventListener('mouseenter', () => {
                GlitchEffect.apply(text, 100);
            });
        });

        // Feature cards 3D tilt
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });

        // Input field animations
        this.inputField.addEventListener('input', () => {
            if (this.inputField.value) {
                this.floatingLabel.style.display = 'none';
            } else {
                this.floatingLabel.style.display = 'block';
            }
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// CONFETTI ANIMATION
class NeonConfetti {
    static burst(x = window.innerWidth / 2, y = window.innerHeight / 2) {
        // Fallback if canvas-confetti not available
        const confetti = window.confetti;
        if (!confetti) return;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
            colors: ['#8B00FF', '#00F2EA', '#FF00FF', '#FF006E'],
            gravity: 0.8
        });
    }
}

// KEYBOARD SHORTCUTS
class KeyboardShortcuts {
    static init() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K or Cmd+K: Focus input
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.querySelector('.neon-input').focus();
            }

            // Escape: Reset form
            if (e.key === 'Escape') {
                const app = window.neonLinkApp;
                if (app) app.resetForm();
            }
        });
    }
}

// PERFORMANCE OPTIMIZATION
class PerformanceOptimizer {
    static optimizeAnimations() {
        // Use requestAnimationFrame for smooth animations
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    PerformanceOptimizer.updateVisibleElements();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    static updateVisibleElements() {
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('in-view');
            }
        });
    }
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Create app instance
    window.neonLinkApp = new NeonLinkApp();

    // Setup keyboard shortcuts
    KeyboardShortcuts.init();

    // Optimize animations
    PerformanceOptimizer.optimizeAnimations();

    // Welcome confetti (optional)
    if (localStorage.getItem('firstVisit') !== 'false') {
        setTimeout(() => {
            NeonConfetti.burst(window.innerWidth / 2, window.innerHeight / 4);
        }, 500);
        localStorage.setItem('firstVisit', 'false');
    }

    console.log('%cNeonLink Ready 🚀', 'color: #00F2EA; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00F2EA;');
});

// EXPORT FOR TESTING
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { URLShortener, NeonLinkApp, ToastNotification };
}
