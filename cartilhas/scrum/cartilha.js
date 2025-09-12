// Variáveis globais
let currentPage = 1;
let totalPages = 7;
let isScrolling = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeCartilha();
});

function initializeCartilha() {
    setupMatrixBackground();
    setupScrollTracking();
    setupProgressIndicator();
    setupIntersectionObserver();
    setupKeyboardNavigation();
    updatePageIndicator();
}

// Matrix Background Effect
function setupMatrixBackground() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const matrixChars = 'SCRUM0123456789ABCDEF';
    const fontSize = 12;
    let columns = canvas.width / fontSize;
    let drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px JetBrains Mono';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 50);
}

// Rastreamento de Scroll
function setupScrollTracking() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
        
        // Update navigation background
        const nav = document.querySelector('.cartilha-nav');
        if (scrollTop > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 255, 136, 0.2)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = 'none';
        }
    }
    
    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(updateScrollProgress, 10);
    });
    
    updateScrollProgress();
}

// Indicador de Progresso
function setupProgressIndicator() {
    const progressFill = document.getElementById('progressFill');
    
    function updateProgress() {
        const progress = (currentPage / totalPages) * 100;
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }
    
    updateProgress();
}

// Intersection Observer para detectar páginas visíveis
function setupIntersectionObserver() {
    const pages = document.querySelectorAll('.cartilha-page');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageNumber = parseInt(entry.target.getAttribute('data-page'));
                if (pageNumber !== currentPage) {
                    currentPage = pageNumber;
                    updatePageIndicator();
                    setupProgressIndicator();
                    
                    // Add visual feedback
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    pages.forEach(page => {
        // Initial animation setup
        page.style.opacity = '0.7';
        page.style.transform = 'translateY(20px)';
        page.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(page);
    });
}

// Atualizar indicador de página
function updatePageIndicator() {
    const currentPageElement = document.getElementById('currentPage');
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
}

// Navegação por teclado
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (isScrolling) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ': // Spacebar
                e.preventDefault();
                scrollToNextPage();
                break;
                
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                scrollToPrevPage();
                break;
                
            case 'Home':
                e.preventDefault();
                scrollToPage(1);
                break;
                
            case 'End':
                e.preventDefault();
                scrollToPage(totalPages);
                break;
                
            case 'Escape':
                window.location.href = '../../index.html';
                break;
        }
    });
}

// Funções de navegação
function scrollToNextPage() {
    if (currentPage < totalPages) {
        scrollToPage(currentPage + 1);
    }
}

function scrollToPrevPage() {
    if (currentPage > 1) {
        scrollToPage(currentPage - 1);
    }
}

function scrollToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages || isScrolling) return;
    
    isScrolling = true;
    const targetPage = document.querySelector(`[data-page="${pageNumber}"]`);
    
    if (targetPage) {
        const navHeight = document.querySelector('.cartilha-nav').offsetHeight;
        const targetPosition = targetPage.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

// Efeitos visuais adicionais
function setupVisualEffects() {
    // Glitch effect on hover
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = 'glitch 0.3s ease-in-out';
        });
    });
    
    // Hover effects for cards
    const cards = document.querySelectorAll('.topic-item, .role-card, .artifact-card, .benefit-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Lazy loading para imagens
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Smooth scroll para links internos
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.cartilha-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Detecção de dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Otimizações para mobile
function setupMobileOptimizations() {
    if (isMobile()) {
        // Reduce animation complexity on mobile
        document.documentElement.style.setProperty('--transition-fast', '0.1s');
        document.documentElement.style.setProperty('--transition-normal', '0.2s');
        document.documentElement.style.setProperty('--transition-slow', '0.3s');
        
        // Disable matrix background on mobile for performance
        const matrixBg = document.querySelector('.matrix-bg');
        if (matrixBg) {
            matrixBg.style.display = 'none';
        }
    }
}

// Controles de acessibilidade
function setupAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--neon-green);
        color: var(--dark-bg);
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        font-family: var(--font-mono);
        font-size: 14px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const main = document.querySelector('.cartilha-container');
    if (main) {
        main.id = 'main';
        main.setAttribute('role', 'main');
    }
}

// Analytics e tracking (opcional)
function setupAnalytics() {
    // Track page views
    function trackPageView(pageNumber) {
        // Implementar tracking se necessário
        console.log(`Página ${pageNumber} visualizada`);
    }
    
    // Track scroll depth
    let maxScrollDepth = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            
            // Track milestones
            if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
                console.log('25% da cartilha lida');
            } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
                console.log('50% da cartilha lida');
            } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
                console.log('75% da cartilha lida');
            } else if (maxScrollDepth >= 100) {
                console.log('Cartilha completamente lida');
            }
        }
    });
}

// Easter egg - Konami code
function setupEasterEgg() {
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
            document.body.style.filter = 'hue-rotate(180deg) saturate(1.5)';
            
            // Show message
            const message = document.createElement('div');
            message.textContent = 'SCRUM MASTER MODE ACTIVATED!';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--neon-green);
                color: var(--dark-bg);
                padding: 2rem;
                border-radius: 8px;
                font-family: var(--font-mono);
                font-size: 1.5rem;
                font-weight: bold;
                z-index: 10000;
                animation: pulse 0.5s ease-in-out;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                document.body.style.filter = 'none';
                message.remove();
            }, 3000);
            
            konamiCode = [];
        }
    });
}

// Inicialização completa quando a página carrega
window.addEventListener('load', function() {
    setupVisualEffects();
    setupLazyLoading();
    setupSmoothScroll();
    setupMobileOptimizations();
    setupAccessibility();
    setupAnalytics();
    setupEasterEgg();
});

// Console message para desenvolvedores
console.log(`
%c
███████╗ ██████╗██████╗ ██╗   ██╗███╗   ███╗
██╔════╝██╔════╝██╔══██╗██║   ██║████╗ ████║
███████╗██║     ██████╔╝██║   ██║██╔████╔██║
╚════██║██║     ██╔══██╗██║   ██║██║╚██╔╝██║
███████║╚██████╗██║  ██║╚██████╔╝██║ ╚═╝ ██║
╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝

%cCartilha Interativa - Scrum
%cNavegação: ↑↓ ou Page Up/Down
%cEscape: Voltar ao início
%cKonami Code: Easter egg
`, 
'color: #00ff88; font-family: monospace;',
'color: #00d4ff; font-size: 16px; font-weight: bold;',
'color: #8b5cf6; font-size: 14px;',
'color: #666; font-size: 12px;',
'color: #666; font-size: 12px;'
);

