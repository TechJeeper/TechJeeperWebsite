class HexagonBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.hexagons = [];
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        document.body.insertBefore(this.renderer.domElement, document.body.firstChild);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '-1';

        // Position camera
        this.camera.position.z = 15;

        // Create hexagon grid
        const geometry = new THREE.CircleGeometry(0.5, 6);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x2A2A2A, // Dark grey color
            transparent: true,
            opacity: 0.4
        });

        // Calculate number of rows and columns to fill screen plus overflow
        const aspectRatio = window.innerWidth / window.innerHeight;
        const rows = Math.ceil(40 * (1/aspectRatio)); // Increased number of rows
        const cols = 50; // Increased number of columns
        const spacing = 0.85; // Increased spacing

        for (let i = -2; i < rows + 2; i++) { // Added padding rows
            for (let j = -2; j < cols + 2; j++) { // Added padding columns
                const hex = new THREE.Mesh(geometry, material.clone());
                
                // Position hexagons in a grid with offset for every other row
                hex.position.x = j * spacing * 1.7 - (cols * spacing) / 2;
                hex.position.y = i * spacing * 1.5 - (rows * spacing) / 2;
                if (i % 2) hex.position.x += spacing * 0.85;

                this.scene.add(hex);
                this.hexagons.push(hex);
            }
        }

        // Add event listeners
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation
        this.animate();
    }

    onMouseMove(event) {
        // Convert mouse position to normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Animate hexagons
        this.hexagons.forEach(hex => {
            // Reset hexagon properties
            hex.material.opacity = 0.4;
            hex.rotation.z += 0.001;
            hex.scale.setScalar(1);

            // Calculate distance from mouse
            const distance = Math.sqrt(
                Math.pow(this.mouse.x * 15 - hex.position.x, 2) +
                Math.pow(this.mouse.y * 8 - hex.position.y, 2)
            );

            // Animate hexagons near mouse
            if (distance < 4) {
                const intensity = 1 - (distance / 4);
                hex.material.opacity = 0.6 + (intensity * 0.4);
                hex.scale.setScalar(1 + (intensity * 0.3));
                hex.rotation.z += 0.02 * intensity;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HexagonBackground();
}); 