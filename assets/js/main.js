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
    // Initialize sections
    const sections = document.querySelectorAll('.section');
    
    // Show home section by default and ensure it stays visible
    const homeSection = document.querySelector('#home');
    homeSection.classList.add('active');
    homeSection.style.opacity = '1';
    homeSection.style.visibility = 'visible';
    homeSection.style.pointerEvents = 'auto';
    homeSection.style.zIndex = '1';
    
    // Ensure home section content is visible
    const homeContent = homeSection.querySelector('.home-content');
    if (homeContent) {
        homeContent.style.opacity = '1';
        homeContent.style.visibility = 'visible';
    }
    
    // Handle initial hash in URL
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        const targetSection = document.querySelector(`#${initialHash}`);
        if (targetSection) {
            sections.forEach(section => {
                section.classList.remove('active');
                section.style.opacity = '0';
                section.style.visibility = 'hidden';
                section.style.pointerEvents = 'none';
                section.style.zIndex = '0';
            });
            
            targetSection.classList.add('active');
            targetSection.style.opacity = '1';
            targetSection.style.visibility = 'visible';
            targetSection.style.pointerEvents = 'auto';
            targetSection.style.zIndex = '1';
            
            // Ensure section content is visible
            const sectionContent = targetSection.querySelector('.section-content');
            if (sectionContent) {
                sectionContent.style.opacity = '1';
                sectionContent.style.visibility = 'visible';
            }
        }
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.opacity = '0';
            section.style.visibility = 'hidden';
            section.style.pointerEvents = 'none';
            section.style.zIndex = '0';
            
            if (section.id === hash) {
                section.classList.add('active');
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.pointerEvents = 'auto';
                section.style.zIndex = '1';
                
                // Ensure section content is visible
                const sectionContent = section.querySelector('.section-content');
                if (sectionContent) {
                    sectionContent.style.opacity = '1';
                    sectionContent.style.visibility = 'visible';
                }
            }
        });
    });
    
    initThreeJS();
}); 