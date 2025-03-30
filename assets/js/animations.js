// GSAP Animations
const animations = {
    // Text reveal animation
    revealText: (element) => {
        gsap.from(element, {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
    },
    
    // Fade in animation
    fadeIn: (element) => {
        gsap.from(element, {
            duration: 0.8,
            opacity: 0,
            ease: 'power2.out'
        });
    },
    
    // Scale up animation
    scaleUp: (element) => {
        gsap.from(element, {
            duration: 0.6,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)'
        });
    },
    
    // Stagger children animation
    staggerChildren: (parent, children) => {
        gsap.from(children, {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: parent,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    }
};

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Custom cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    let cursorTrails = [];
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isSpinning = false;

    // Create trail elements
    function createTrail() {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        return trail;
    }

    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Update cursor position
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        // Update follower position with slight delay
        setTimeout(() => {
            cursorFollower.style.left = mouseX + 'px';
            cursorFollower.style.top = mouseY + 'px';
        }, 50);

        // Create trail effect
        if (Math.abs(mouseX - lastMouseX) > 5 || Math.abs(mouseY - lastMouseY) > 5) {
            const trail = createTrail();
            trail.style.left = mouseX + 'px';
            trail.style.top = mouseY + 'px';
            cursorTrails.push(trail);

            // Remove old trails
            if (cursorTrails.length > 10) {
                const oldTrail = cursorTrails.shift();
                oldTrail.classList.add('fade-out');
                setTimeout(() => oldTrail.remove(), 300);
            }

            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }
    });

    // Handle click animation
    document.addEventListener('click', () => {
        if (!isSpinning) {
            isSpinning = true;
            cursor.classList.add('spinning');
            cursorFollower.classList.add('spinning');

            // Create extra trail elements on click
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const trail = createTrail();
                    trail.style.left = lastMouseX + 'px';
                    trail.style.top = lastMouseY + 'px';
                    cursorTrails.push(trail);
                }, i * 50);
            }

            // Stop spinning after animation
            setTimeout(() => {
                isSpinning = false;
                cursor.classList.remove('spinning');
                cursorFollower.classList.remove('spinning');
            }, 500);
        }
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-follower-hover');
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-follower-hover');
        });
    });
});

// Section Animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate sections on scroll
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });

    // Animate social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach((link, index) => {
        link.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.2}s`;
    });

    // Animate header logo
    const headerLogo = document.querySelector('.header-logo');
    if (headerLogo) {
        headerLogo.style.animation = 'fadeInDown 1s ease forwards';
    }

    // Animate tagline
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        tagline.style.animation = 'fadeInUp 1s ease forwards 0.5s';
    }

    // Animate navigation items
    const navItems = document.querySelectorAll('.main-nav li');
    navItems.forEach((item, index) => {
        item.style.animation = `fadeInDown 0.5s ease forwards ${index * 0.1}s`;
    });
});

// Hover animations for social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'scale(1.1)';
    });

    link.addEventListener('mouseleave', () => {
        link.style.transform = 'scale(1)';
    });
});

// Smooth scroll for anchor links
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