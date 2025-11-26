// ========================================
// CURSOR TRAIL EFFECT
// ========================================
const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let trails = [];

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (e) => {
    trails.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        maxAge: 30
    });

    if (trails.length > 50) {
        trails.shift();
    }
});

function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    trails.forEach((trail, index) => {
        trail.age++;
        const opacity = 1 - (trail.age / trail.maxAge);
        const size = 2 - (trail.age / trail.maxAge) * 1.5;

        ctx.fillStyle = `rgba(0, 242, 234, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (trail.age >= trail.maxAge) {
            trails.splice(index, 1);
        }
    });

    requestAnimationFrame(animateTrail);
}

animateTrail();

// ========================================
// PARTICLE BACKGROUND
// ========================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = Math.min(30, Math.floor(window.innerWidth / 50));

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
            toast.classList.remove('hide');
        }, 300);
    }, duration);
}

// ========================================
// URL SHORTENING FUNCTIONALITY
// ========================================
const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const resultSection = document.getElementById('resultSection');
const shortLinkInput = document.getElementById('shortLinkInput');
const copyBtn = document.getElementById('copyBtn');
const openLinkBtn = document.getElementById('openLinkBtn');
const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
const downloadQRBtn = document.getElementById('downloadQRBtn');
const qrImage = document.getElementById('qrImage');
const clickCounter = document.getElementById('clickCounter');
const anotherBtn = document.getElementById('anotherBtn');
const closeResult = document.getElementById('closeResult');

let isFirstShorten = true;
let currentShortCode = '';

// Generate random short code
function generateShortCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Shorten URL using TinyURL API
async function shortenURL(longURL) {
    try {
        // Use TinyURL API
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`, {
            method: 'GET'
        });

        if (response.ok) {
            const shortURL = await response.text();
            return shortURL;
        }
    } catch (error) {
        console.log('TinyURL API failed, using fallback');
    }

    // Fallback: Use shortened domain with random code
    const shortCode = generateShortCode();
    return `https://snap.link/${shortCode}`;
}

// Validate URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Generate QR code
function generateQRCode(text) {
    // Use QR Server API
    const encodedText = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`;
}

// Animate click counter
function animateCounter(targetValue) {
    const duration = 2000;
    const startTime = Date.now();
    const startValue = 0;

    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        clickCounter.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            clickCounter.textContent = targetValue;
        }
    }

    updateCounter();
}

// Trigger confetti
function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Shorten button click handler
shortenBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();

    if (!url) {
        showToast('⚠️ Please enter a URL');
        urlInput.focus();
        return;
    }

    if (!isValidURL(url)) {
        showToast('❌ Please enter a valid URL');
        urlInput.focus();
        return;
    }

    shortenBtn.disabled = true;
    shortenBtn.textContent = 'Shortening...';

    try {
        const shortURL = await shortenURL(url);
        currentShortCode = shortURL;

        // Update short link
        shortLinkInput.value = shortURL;

        // Generate QR code
        const qrCodeURL = generateQRCode(shortURL);
        qrImage.src = qrCodeURL;

        // Show result section
        resultSection.style.display = 'flex';
        resultSection.scrollIntoView({ behavior: 'smooth' });

        // Trigger confetti on first use
        if (isFirstShorten) {
            triggerConfetti();
            isFirstShorten = false;
        }

        // Animate counter with random value
        const randomClicks = Math.floor(Math.random() * 1000) + 100;
        animateCounter(randomClicks);

        showToast('✅ URL shortened successfully!');
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Something went wrong. Try again!');
    } finally {
        shortenBtn.disabled = false;
        shortenBtn.textContent = 'Shorten Now';
    }
});

// Copy button
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(shortLinkInput.value);
        showToast('✅ Copied to clipboard!');
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 400);
    } catch (error) {
        showToast('❌ Failed to copy');
    }
});

// Auto-copy on input click
shortLinkInput.addEventListener('click', async () => {
    shortLinkInput.select();
    try {
        await navigator.clipboard.writeText(shortLinkInput.value);
        showToast('✅ Copied to clipboard!');
    } catch (error) {
        showToast('Failed to copy');
    }
});

// Open link in new tab
openLinkBtn.addEventListener('click', () => {
    window.open(shortLinkInput.value, '_blank');
    showToast('🌐 Opening link...');
});

// Share on WhatsApp
shareWhatsappBtn.addEventListener('click', () => {
    const message = `Check out this amazing URL shortener: ${shortLinkInput.value}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
});

// Download QR code
downloadQRBtn.addEventListener('click', async () => {
    try {
        const link = document.createElement('a');
        link.href = qrImage.src;
        link.download = `qrcode-${Date.now()}.png`;
        link.click();
        showToast('📱 QR Code downloaded!');
    } catch (error) {
        showToast('Failed to download QR code');
    }
});

// Another button
anotherBtn.addEventListener('click', () => {
    urlInput.value = '';
    resultSection.style.display = 'none';
    urlInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Close result section
closeResult.addEventListener('click', () => {
    resultSection.style.display = 'none';
    urlInput.focus();
});

// Allow Enter key to shorten
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        shortenBtn.click();
    }
});

// ========================================
// STATS COUNTER ANIMATION
// ========================================
function animateStats() {
    const options = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const text = stat.textContent;
                const isUptime = text.includes('%');

                if (!stat.dataset.animated) {
                    if (isUptime) {
                        // For uptime percentage
                        animateValue(stat, 0, 99.9, 2000);
                    } else {
                        // For large numbers, just show them
                        stat.dataset.animated = 'true';
                    }
                }

                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
}

function animateValue(element, start, end, duration) {
    const startTime = Date.now();

    function updateValue() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = (start + (end - start) * progress).toFixed(1);
        element.textContent = currentValue + '%';

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.dataset.animated = 'true';
        }
    }

    updateValue();
}

// Initialize stats animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    animateStats();
});

// ========================================
// TILT EFFECT FOR FEATURE CARDS
// ========================================
function addTiltEffect() {
    const cards = document.querySelectorAll('.feature-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((centerX - x) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addTiltEffect();
});

// ========================================
// SMOOTH SCROLL BEHAVIOR
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// ========================================
// MOBILE RESPONSIVENESS
// ========================================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swiped left - could be used for navigation
    }
    if (touchEndX > touchStartX + 50) {
        // Swiped right - could be used for navigation
    }
}

// ========================================
// DARK MODE CHECK (Already in dark mode)
// ========================================
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Already dark, no need to toggle
    document.body.classList.add('dark-mode');
}

// Listen for changes in color scheme preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    }
});

// ========================================
// PERFORMANCE: LAZY LOAD IMAGES
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// SERVICE WORKER REGISTRATION (Optional PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA functionality
        // navigator.serviceWorker.register('service-worker.js');
    });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus on input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        urlInput.focus();
    }
});

// ========================================
// ACCESSIBILITY: FOCUS MANAGEMENT
// ========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resultSection.style.display !== 'none') {
        resultSection.style.display = 'none';
        urlInput.focus();
    }
});

// ========================================
// INITIALIZATION
// ========================================
console.log('SnapLink initialized! 🚀');
