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