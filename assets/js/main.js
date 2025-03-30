// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .wheel-item');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        cursorFollower.classList.add('hovering');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        cursorFollower.classList.remove('hovering');
    });
});

// Section Management
const sections = document.querySelectorAll('.section');
let currentSection = 'home';

function switchSection(sectionId) {
    if (sectionId === currentSection) return;
    
    const currentSectionElement = document.getElementById(currentSection);
    const newSectionElement = document.getElementById(sectionId);
    
    currentSectionElement.classList.remove('active');
    currentSectionElement.classList.add('exiting');
    
    setTimeout(() => {
        currentSectionElement.classList.remove('exiting');
        newSectionElement.classList.add('active');
        newSectionElement.classList.add('entering');
        
        setTimeout(() => {
            newSectionElement.classList.remove('entering');
        }, 500);
        
        currentSection = sectionId;
    }, 500);
}

// Scroll Progress Indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.transform = `scaleX(${progress / 100})`;
});

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

// Initialize GSAP Animations
gsap.from('.wheel-item', {
    duration: 1,
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)'
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section > *').forEach(element => {
    observer.observe(element);
});

// Handle Wheel Navigation
document.querySelectorAll('.wheel-item').forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.dataset.section;
        switchSection(sectionId);
    });
});

// Initialize Three.js Background (if needed)
let scene, camera, renderer;
function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Add particles or other 3D elements here
    
    camera.position.z = 5;
    
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
    animate();
}

// Handle Window Resize
window.addEventListener('resize', () => {
    if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Initialize the site
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
}); 