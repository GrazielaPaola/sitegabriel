// Variáveis globais
let isLoaded = false;
let matrixCanvas, matrixCtx;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

window.addEventListener('load', function() {
    hideLoader();
});

function initializeApp() {
    setupMatrixBackground();
    setupNavigation();
    setupScrollEffects();
    setupTypingAnimations();
    setupGlitchEffects();
    updateCurrentYear();
}

// Matrix Background Effect
function setupMatrixBackground() {
    matrixCanvas = document.getElementById('matrix-canvas');
    matrixCtx = matrixCanvas.getContext('2d');
    
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);
    
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    let columns;
    let drops = [];
    
    function resizeMatrix() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        columns = matrixCanvas.width / fontSize;
        
        // Reset drops array
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
    }
    
    function drawMatrix() {
        matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        matrixCtx.fillStyle = '#00ff88';
        matrixCtx.font = fontSize + 'px JetBrains Mono';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 35);
}

// Loading Screen
function hideLoader() {
    const loader = document.querySelector('.loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 2000);
    }
    isLoaded = true;
}

// Typing Animation for Loading
function setupTypingAnimations() {
    const loadingText = document.getElementById('loadingText');
    const messages = [
        'Inicializando sistema...',
        'Carregando módulos...',
        'Conectando ao servidor...',
        'Sistema pronto!'
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    
    function typeMessage() {
        if (messageIndex < messages.length) {
            const currentMessage = messages[messageIndex];
            
            if (charIndex < currentMessage.length) {
                loadingText.textContent = currentMessage.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeMessage, 50);
            } else {
                setTimeout(() => {
                    charIndex = 0;
                    messageIndex++;
                    typeMessage();
                }, 800);
            }
        }
    }
    
    typeMessage();
}

// Navegação
function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    // Toggle menu mobile
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Fechar menu ao clicar em link
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
    
    // Smooth scroll
    navLinkItems.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.cyber-nav').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Active navigation
    setupActiveNavigation();
}

function setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

// Efeitos de Scroll
function setupScrollEffects() {
    const nav = document.querySelector('.cyber-nav');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    function handleScroll() {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / documentHeight) * 100;
        
        // Update scroll progress
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
        
        // Nav background effect
        if (nav) {
            if (scrollY > 100) {
                nav.style.background = 'rgba(10, 10, 10, 0.98)';
                nav.style.boxShadow = '0 2px 20px rgba(0, 255, 136, 0.2)';
            } else {
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
                nav.style.boxShadow = 'none';
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate elements
    const animatedElements = document.querySelectorAll('.project-card, .info-card, .about-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Glitch Effects
function setupGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = 'glitch 0.3s ease-in-out';
        });
    });
}

// Terminal Typing Effect
function setupTerminalTyping() {
    const typingElements = document.querySelectorAll('.typing-cursor');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 100);
            }
        }
        
        // Start typing when element is visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeChar, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// Cyber Button Effects
function setupCyberButtons() {
    const cyberBtns = document.querySelectorAll('.cyber-btn');
    
    cyberBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 255, 136, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Project Card Hover Effects
function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add scanning line effect
            const scanLine = document.createElement('div');
            scanLine.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, #00ff88, transparent);
                animation: scan 2s linear infinite;
                pointer-events: none;
            `;
            
            this.appendChild(scanLine);
            
            setTimeout(() => {
                scanLine.remove();
            }, 2000);
        });
    });
    
    // Add scan animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scan {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(300px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Parallax Effect
function setupParallax() {
    const parallaxElements = document.querySelectorAll('.hex-item');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rate = scrolled * -0.5 * (index + 1) * 0.1;
            element.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Sound Effects (Optional)
function setupSoundEffects() {
    // Create audio context for sound effects
    let audioContext;
    
    function createBeep(frequency = 800, duration = 100) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
    
    // Add sound to buttons
    const buttons = document.querySelectorAll('.cyber-btn, .project-link');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // createBeep(1000, 50);
        });
        
        button.addEventListener('click', () => {
            // createBeep(1200, 100);
        });
    });
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + / for help
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            showHelp();
        }
        
        // Arrow keys for navigation
        if (e.altKey) {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        }
    });
}

function showHelp() {
    const helpModal = document.createElement('div');
    helpModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'JetBrains Mono', monospace;
    `;
    
    helpModal.innerHTML = `
        <div style="
            background: #1a1a1a;
            border: 1px solid #00ff88;
            border-radius: 8px;
            padding: 2rem;
            max-width: 500px;
            color: #ffffff;
        ">
            <h3 style="color: #00ff88; margin-bottom: 1rem;">Atalhos do Teclado</h3>
            <p><kbd>Ctrl + /</kbd> - Mostrar esta ajuda</p>
            <p><kbd>Alt + ↑</kbd> - Ir para o topo</p>
            <p><kbd>Alt + ↓</kbd> - Ir para contato</p>
            <p style="margin-top: 1rem; text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: #00ff88; border: none; padding: 0.5rem 1rem; color: #000; border-radius: 4px; cursor: pointer;">
                    Fechar
                </button>
            </p>
        </div>
    `;
    
    document.body.appendChild(helpModal);
    
    helpModal.addEventListener('click', function(e) {
        if (e.target === helpModal) {
            helpModal.remove();
        }
    });
}

// Update current year
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 10);
    };
    
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.1s');
        document.documentElement.style.setProperty('--transition-normal', '0.1s');
        document.documentElement.style.setProperty('--transition-slow', '0.1s');
    }
}

// Initialize everything when page loads
window.addEventListener('load', function() {
    setupTerminalTyping();
    setupCyberButtons();
    setupProjectCards();
    setupParallax();
    setupSoundEffects();
    setupKeyboardShortcuts();
    optimizePerformance();
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        
        konamiCode = [];
    }
});

// Console message for developers
console.log(`
%c
 ██████╗  █████╗ ██████╗ ██████╗ ██╗███████╗██╗         ███╗   ███╗ █████╗ ██████╗ ██╗███╗   ██╗██╗
██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██║         ████╗ ████║██╔══██╗██╔══██╗██║████╗  ██║██║
██║  ███╗███████║██████╔╝██████╔╝██║█████╗  ██║         ██╔████╔██║███████║██████╔╝██║██╔██╗ ██║██║
██║   ██║██╔══██║██╔══██╗██╔══██╗██║██╔══╝  ██║         ██║╚██╔╝██║██╔══██║██╔══██╗██║██║╚██╗██║██║
╚██████╔╝██║  ██║██████╔╝██║  ██║██║███████╗███████╗    ██║ ╚═╝ ██║██║  ██║██║  ██║██║██║ ╚████║██║
 ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝

%cTechHub Portfolio v2.0
%cDesenvolvido para UNIP - ADS
%cTry: Ctrl+/ for shortcuts, Konami code for easter egg
`, 
'color: #00ff88; font-family: monospace;',
'color: #00d4ff; font-size: 16px; font-weight: bold;',
'color: #8b5cf6; font-size: 14px;',
'color: #666; font-size: 12px;'
);

