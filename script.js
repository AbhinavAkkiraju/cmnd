function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }
    }

    const particles = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('active');
    });
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;

        function updateCount() {
            const count = +counter.innerText;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target + (target === 99 ? '%' : '+');
            }
        }

        updateCount();
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    document.querySelectorAll('.team-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

function openScheduler() {
    const modal = document.getElementById('schedulerModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    const dateInput = document.getElementById('schedDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

function closeScheduler() {
    const modal = document.getElementById('schedulerModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    const modal = document.getElementById('schedulerModal');
    if (event.target === modal) {
        closeScheduler();
    }
}

document.getElementById('schedulerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('schedName').value,
        email: document.getElementById('schedEmail').value,
        phone: document.getElementById('schedPhone').value,
        service: document.getElementById('schedService').value,
        date: document.getElementById('schedDate').value,
        time: document.getElementById('schedTime').value,
        notes: document.getElementById('schedNotes').value
    };

    console.log('Appointment scheduled:', formData);
    
    alert(`Thank you, ${formData.name}! Your appointment has been scheduled for ${formData.date} at ${formData.time}. We'll send a confirmation to ${formData.email}.`);
    
    document.getElementById('schedulerForm').reset();
    closeScheduler();
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    console.log('Contact form submitted:', formData);
    
    alert(`Thank you, ${formData.name}! Your message has been sent. We'll get back to you at ${formData.email} soon.`);
    
    document.getElementById('contactForm').reset();
});

function typeWriter() {
    const text = 'Building the Future';
    const element = document.querySelector('.typing-text');
    if (!element) return;
    
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    
    type();
}

function initParallax() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.service-card, .team-card');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - cardX) * 0.01;
            const deltaY = (e.clientY - cardY) * 0.01;

            card.style.transform = `perspective(1000px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initNavbar();
    initScrollAnimations();
    typeWriter();
    initParallax();
    initAdvancedEffects();
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    revealObserver.observe(section);
});

function createFloatingShapes() {
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'floating-shapes';
    
    for (let i = 1; i <= 4; i++) {
        const shape = document.createElement('div');
        shape.className = `shape shape-${i}`;
        shapesContainer.appendChild(shape);
    }
    
    document.body.appendChild(shapesContainer);
}

function createCodeRain() {
    const codeRain = document.createElement('div');
    codeRain.className = 'code-rain';
    
    const chars = '01{}[]<>/\\|_-=+*&^%$#@!~`;:,."\'`abcdefghijklmnopqrstuvwxyz';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'rain-column';
        column.style.left = `${i * 20}px`;
        column.style.animationDuration = `${Math.random() * 10 + 10}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;
        
        let text = '';
        for (let j = 0; j < 30; j++) {
            text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
        }
        column.innerHTML = text;
        
        codeRain.appendChild(column);
    }
    
    document.body.appendChild(codeRain);
}

function createBinaryBackground() {
    const binaryBg = document.createElement('div');
    binaryBg.className = 'binary-bg';
    
    let binaryText = '';
    for (let i = 0; i < 1000; i++) {
        binaryText += Math.random() > 0.5 ? '1 ' : '0 ';
        if (i % 50 === 0) binaryText += '<br>';
    }
    
    binaryBg.innerHTML = binaryText;
    document.body.appendChild(binaryBg);
}

function createScanline() {
    const scanline = document.createElement('div');
    scanline.className = 'scanline';
    document.body.appendChild(scanline);
}

function addGlitchEffect() {
    const logo = document.querySelector('.logo-text');
    if (logo) {
        logo.setAttribute('data-text', 'cmnd');
        logo.classList.add('glitch');
    }
}

function createCursorTrail() {
    let trail = [];
    const trailLength = 15;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (trail.length > trailLength) {
            trail.shift();
        }
        
        const existing = document.querySelectorAll('.cursor-trail');
        existing.forEach(el => el.remove());
        
        trail.forEach((point, index) => {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: ${4 - (index / trailLength) * 3}px;
                height: ${4 - (index / trailLength) * 3}px;
                background: rgba(255, 255, 255, ${(index / trailLength) * 0.5});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${point.x}px;
                top: ${point.y}px;
                transform: translate(-50%, -50%);
            `;
            document.body.appendChild(dot);
            
            setTimeout(() => dot.remove(), 500);
        });
    });
}

function addTypingCursors() {
    const titles = document.querySelectorAll('.section-title');
    titles.forEach((title, index) => {
        setTimeout(() => {
            const cursor = document.createElement('span');
            cursor.textContent = '|';
            cursor.style.cssText = `
                animation: blink 1s infinite;
                margin-left: 5px;
            `;
            title.appendChild(cursor);
        }, index * 200);
    });
}

function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + (target === 99 ? '%' : '+');
                clearInterval(timer);
            } else {
                const display = Math.floor(current) + Math.floor(Math.random() * 5);
                stat.textContent = display;
            }
        }, 20);
    });
}

function initAdvancedEffects() {
    createFloatingShapes();
    createCodeRain();
    createBinaryBackground();
    createScanline();
    addGlitchEffect();
    createCursorTrail();
}

console.log('%c⚡ cmnd agency', 'color: #ffffff; font-size: 24px; font-weight: bold;');
console.log('%cBuilding digital experiences that matter.', 'color: #a0a0a0; font-size: 14px;');
console.log('%cInterested in joining our team? Email us at careers@cmndagency.com', 'color: #ffffff; font-size: 12px;');

