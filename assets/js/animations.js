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

// ScrollTrigger Animations
gsap.registerPlugin(ScrollTrigger);

// Animate sections on scroll
document.querySelectorAll('.section').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Parallax effect for background elements
document.querySelectorAll('.parallax').forEach(element => {
    const speed = element.dataset.speed || 0.5;
    
    gsap.to(element, {
        y: () => -window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});

// Three.js Particle System
function createParticleSystem() {
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xFF6B6B,
            transparent: true,
            opacity: 0.6
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );
        
        particles.push(particle);
        scene.add(particle);
    }
    
    return particles;
}

// Animate particles
function animateParticles(particles) {
    particles.forEach(particle => {
        particle.position.add(particle.velocity);
        
        // Bounce off boundaries
        if (Math.abs(particle.position.x) > 5) particle.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 5) particle.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 5) particle.velocity.z *= -1;
    });
}

// Mouse move effect for 3D elements
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    
    gsap.to(scene.rotation, {
        y: mouseX * 0.1,
        x: mouseY * 0.1,
        duration: 0.5
    });
});

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Create particle system
    const particles = createParticleSystem();
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        animateParticles(particles);
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Initialize section animations
    document.querySelectorAll('.section').forEach(section => {
        const title = section.querySelector('h1, h2');
        const content = section.querySelector('.section-content');
        
        if (title) animations.revealText(title);
        if (content) animations.staggerChildren(section, content.children);
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 70
                },
                ease: 'power3.inOut'
            });
        }
    });
}); 