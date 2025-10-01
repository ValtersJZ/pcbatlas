// Canvas setup
const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load logo image
const logoImg = new Image();
logoImg.src = 'logo.jpeg';

// Logo particles array
const logos = [];
const maxLogos = 20;

// Logo class
class Logo {
    constructor(x, y, size, vx, vy, rotation, rotationSpeed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.vx = vx;
        this.vy = vy;
        this.rotation = rotation;
        this.rotationSpeed = rotationSpeed;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Update rotation
        this.rotation += this.rotationSpeed;

        // Bounce off edges
        if (this.x < -this.size || this.x > canvas.width + this.size) {
            this.vx *= -1;
        }
        if (this.y < -this.size || this.y > canvas.height + this.size) {
            this.vy *= -1;
        }

        // Update pulse
        this.pulsePhase += 0.02;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Pulsing effect
        const pulse = Math.sin(this.pulsePhase) * 0.1 + 1;
        const currentSize = this.size * pulse;
        
        ctx.globalAlpha = this.opacity;
        ctx.filter = 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))';
        ctx.drawImage(
            logoImg,
            -currentSize / 2,
            -currentSize / 2,
            currentSize,
            currentSize
        );
        ctx.restore();
    }
}

// Create initial logos
function createLogo() {
    if (logos.length < maxLogos) {
        const size = Math.random() * 80 + 40;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        const rotation = Math.random() * Math.PI * 2;
        const rotationSpeed = (Math.random() - 0.5) * 0.02;
        
        logos.push(new Logo(x, y, size, vx, vy, rotation, rotationSpeed));
    }
}

// Animation loop
let animationActive = false;
let lastScrollY = 0;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw all logos
    logos.forEach(logo => {
        logo.update();
        logo.draw();
    });

    requestAnimationFrame(animate);
}

// Start animation when image is loaded
logoImg.onload = () => {
    animate();
};

// Handle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    // Start creating logos when scrolling past hero section
    if (scrollY > heroHeight * 0.3 && !animationActive) {
        animationActive = true;
        
        // Create logos gradually
        let logoCount = 0;
        const interval = setInterval(() => {
            createLogo();
            logoCount++;
            if (logoCount >= maxLogos) {
                clearInterval(interval);
            }
        }, 100);
    }

    // Add velocity based on scroll speed
    const scrollDelta = scrollY - lastScrollY;
    logos.forEach(logo => {
        logo.vx += scrollDelta * 0.01;
        logo.vy += Math.abs(scrollDelta) * 0.01;
        logo.rotationSpeed += scrollDelta * 0.0001;
    });

    lastScrollY = scrollY;

    // Reset velocities after scroll stops
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        logos.forEach(logo => {
            logo.vx *= 0.95;
            logo.vy *= 0.95;
            logo.rotationSpeed *= 0.95;
        });
    }, 150);
});

// Smooth scroll for scroll indicator
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Mouse interaction
canvas.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    logos.forEach(logo => {
        const dx = mouseX - logo.x;
        const dy = mouseY - logo.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
            // Repel logos from mouse
            const force = (200 - distance) / 200;
            logo.vx -= (dx / distance) * force * 0.5;
            logo.vy -= (dy / distance) * force * 0.5;
        }
    });
});

// Click to add logo
canvas.addEventListener('click', (e) => {
    if (logos.length < maxLogos * 2) {
        const size = Math.random() * 80 + 40;
        const vx = (Math.random() - 0.5) * 4;
        const vy = (Math.random() - 0.5) * 4;
        const rotation = Math.random() * Math.PI * 2;
        const rotationSpeed = (Math.random() - 0.5) * 0.04;
        
        logos.push(new Logo(e.clientX, e.clientY, size, vx, vy, rotation, rotationSpeed));
    }
});
