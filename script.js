/* NEONLINK - Enhanced JavaScript with Real APIs */
const CONFIG = {
    API_ENDPOINT: 'https://shrtco.de/api/v2/shorten',
    QR_ENDPOINT: 'https://api.qrserver.com/v1/create-qr-code/',
};

let currentShortLink = '';
let clickCount = 0;

const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const resultOverlay = document.getElementById('resultOverlay');
const shortLinkInput = document.getElementById('shortLinkInput');
const copyBtn = document.getElementById('copyBtn');
const copyMainBtn = document.getElementById('copyMainBtn');
const qrBtn = document.getElementById('qrBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
const twitterBtn = document.getElementById('twitterBtn');
const qrDisplay = document.getElementById('qrDisplay');
const qrImage = document.getElementById('qrImage');
const clickCounter = document.getElementById('clickCounter');
const toast = document.getElementById('toast');
const resultClose = document.getElementById('closeResult');

shortenBtn.addEventListener('click', handleShorten);
urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleShorten(); });
resultClose.addEventListener('click', closeResultCard);
copyMainBtn.addEventListener('click', () => copyToClipboard(currentShortLink));
copyBtn.addEventListener('click', () => copyToClipboard(currentShortLink));
qrBtn.addEventListener('click', toggleQRDisplay);
whatsappBtn.addEventListener('click', shareWhatsApp);
twitterBtn.addEventListener('click', shareTwitter);

async function handleShorten() {
    const url = urlInput.value.trim();
    if (!url) { showToast('Please enter a URL', 'error'); return; }
    if (!isValidURL(url)) { showToast('Please enter a valid URL', 'error'); return; }
    
    shortenBtn.disabled = true;
    shortenBtn.textContent = 'Shortening...';
    
    try {
        const response = await fetch(CONFIG.API_ENDPOINT + '?url=' + encodeURIComponent(url));
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        
        if (data.ok) {
            currentShortLink = data.result.short_url;
            shortLinkInput.value = currentShortLink;
            clickCount = 0;
            updateClickCounter();
            generateQRCode(currentShortLink);
            showResultCard();
            triggerConfetti();
            showToast('? Link shortened!', 'success');
            urlInput.value = '';
            simulateClicks();
        }
    } catch (error) {
        showToast('Error shortening URL', 'error');
    } finally {
        shortenBtn.disabled = false;
        shortenBtn.textContent = 'Shorten Now';
    }
}

function generateQRCode(url) {
    qrImage.src = CONFIG.QR_ENDPOINT + '?size=200x200&data=' + encodeURIComponent(url);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('? Copied!', 'success');
    }).catch(() => showToast('Failed to copy', 'error'));
}

function toggleQRDisplay() {
    qrDisplay.classList.toggle('show');
}

function shareWhatsApp() {
    const msg = 'Check this out: ' + currentShortLink;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

function shareTwitter() {
    const msg = 'Just shortened a URL with NeonLink! ?? ' + currentShortLink + ' #NeonLink';
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(msg), '_blank');
}

function simulateClicks() {
    setInterval(() => {
        if (resultOverlay.classList.contains('show')) {
            clickCount++;
            updateClickCounter();
            fireAnimation();
        }
    }, 5000);
}

function updateClickCounter() {
    clickCounter.textContent = clickCount;
    clickCounter.style.animation = 'pulse 0.5s ease-out';
}

function fireAnimation() {
    const fire = document.querySelector('.counter-fire');
    fire.style.animation = 'fireFlicker 0.3s ease-out';
}

function showResultCard() {
    resultOverlay.classList.add('show');
    qrDisplay.classList.remove('show');
}

function closeResultCard() {
    resultOverlay.classList.remove('show');
}

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'neon-toast ' + type + ' show';
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function isValidURL(string) {
    try { new URL(string); return true; } catch (_) { return false; }
}

function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B00FF', '#00F2EA', '#FF00FF', '#FFFFFF']
        });
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        this.createParticles();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 1.5 + 0.5
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = this.canvas.width;
            if (p.y < 0) p.y = this.canvas.height;
            this.ctx.fillStyle = 'rgba(0, 242, 234, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
    resultOverlay.addEventListener('click', (e) => {
        if (e.target === resultOverlay) closeResultCard();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resultOverlay.classList.contains('show')) closeResultCard();
    });
    urlInput.focus();
});
