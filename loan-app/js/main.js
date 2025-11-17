// Initialize Three.js for 3D background
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Add floating shapes
    const shapes = [];
    const shapeCount = 15;
    const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0)
    ];
    
    // Materials with different colors and properties
    const materials = [
        new THREE.MeshPhongMaterial({
            color: 0x4f46e5,
            shininess: 50,
            transparent: true,
            opacity: 0.6,
            wireframe: false
        }),
        new THREE.MeshPhongMaterial({
            color: 0x7c3aed,
            shininess: 50,
            transparent: true,
            opacity: 0.6,
            wireframe: false
        }),
        new THREE.MeshPhongMaterial({
            color: 0x8b5cf6,
            shininess: 50,
            transparent: true,
            opacity: 0.6,
            wireframe: false
        })
    ];
    
    // Create shapes
    for (let i = 0; i < shapeCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)].clone();
        const shape = new THREE.Mesh(geometry, material);
        
        // Random position
        shape.position.x = (Math.random() - 0.5) * 30;
        shape.position.y = (Math.random() - 0.5) * 20;
        shape.position.z = (Math.random() - 0.5) * 30;
        
        // Random size
        const size = Math.random() * 1.5 + 0.5;
        shape.scale.set(size, size, size);
        
        // Random rotation
        shape.rotation.x = Math.random() * Math.PI;
        shape.rotation.y = Math.random() * Math.PI;
        
        // Random rotation speed
        shape.rotationSpeed = {
            x: Math.random() * 0.01 - 0.005,
            y: Math.random() * 0.01 - 0.005,
            z: Math.random() * 0.01 - 0.005
        };
        
        // Random movement
        shape.movement = {
            x: (Math.random() - 0.5) * 0.002,
            y: (Math.random() - 0.5) * 0.002,
            z: (Math.random() - 0.5) * 0.002
        };
        
        shapes.push(shape);
        scene.add(shape);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);
    
    // Camera position
    camera.position.z = 15;
    
    // Mouse move effect
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Animate shapes
        shapes.forEach((shape, index) => {
            // Rotation
            shape.rotation.x += shape.rotationSpeed.x;
            shape.rotation.y += shape.rotationSpeed.y;
            shape.rotation.z += shape.rotationSpeed.z;
            
            // Floating movement
            shape.position.x += shape.movement.x;
            shape.position.y += shape.movement.y;
            shape.position.z += shape.movement.z;
            
            // Bounce off edges
            if (Math.abs(shape.position.x) > 25) shape.movement.x *= -1;
            if (Math.abs(shape.position.y) > 15) shape.movement.y *= -1;
            if (Math.abs(shape.position.z) > 25) shape.movement.z *= -1;
            
            // Mouse interaction
            if (Math.abs(mouseX) > 0.1 || Math.abs(mouseY) > 0.1) {
                const distance = Math.sqrt(
                    Math.pow(shape.position.x - mouseX * 10, 2) +
                    Math.pow(shape.position.y - mouseY * 10, 2)
                );
                
                if (distance < 5) {
                    const dx = (shape.position.x - mouseX * 10) * 0.01;
                    const dy = (shape.position.y - mouseY * 10) * 0.01;
                    
                    shape.position.x += dx;
                    shape.position.y += dy;
                }
            }
        });
        
        // Camera movement based on mouse position
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.01;
        camera.position.y += (mouseY * 3 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const menuContent = document.getElementById('mobile-menu-content');
    const button = document.getElementById('mobile-menu-button');
    const menuIcon = button?.querySelector('.menu-icon');
    const closeIcon = button?.querySelector('.close-icon');

    if (!menu || !button) return;

    // Toggle menu visibility
    const isOpening = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    
    // Toggle menu animation
    if (isOpening) {
        // Show menu
        menuContent.classList.remove('-translate-y-full');
        menuContent.classList.add('translate-y-0');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
        // Hide menu
        menuContent.classList.remove('translate-y-0');
        menuContent.classList.add('-translate-y-full');
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    // Toggle menu icons
    if (menuIcon && closeIcon) {
        menuIcon.classList.toggle('hidden', isOpening);
        closeIcon.classList.toggle('hidden', !isOpening);
    }

    // Update aria attributes
    button.setAttribute('aria-expanded', String(isOpening));
    menu.setAttribute('aria-hidden', String(!isOpening));

    // Close menu when pressing Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    };

    if (isOpening) {
        document.addEventListener('keydown', handleEscape);
    } else {
        document.removeEventListener('keydown', handleEscape);
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(`${inputId}-icon`);
    
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Handle form submissions
function handleFormSubmission(formId, callback) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loading"></div> Processing...';
            
            // Simulate API call
            setTimeout(() => {
                if (typeof callback === 'function') {
                    callback(form);
                }
                
                // Reset form
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }, 1500);
        });
    }
}

// Animate elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate-fade-in');
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D background
    initThreeJS();
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('mobile-menu');
        const button = document.getElementById('mobile-menu-button');
        
        if (menu && button && !menu.contains(e.target) && !button.contains(e.target)) {
            // Ensure both Tailwind hidden and custom active states are cleared
            menu.classList.add('hidden');
            menu.classList.remove('active');
            button.classList.remove('active');
            button.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            button.innerHTML = '<i class="fas fa-bars text-2xl" aria-hidden="true"></i><span class="sr-only">Open menu</span>';
        }
    });
    
    // Handle form submissions
    handleFormSubmission('login-form', function() {
        // Handle login form submission
        window.location.href = 'dashboard.html';
    });
    
    handleFormSubmission('register-form', function() {
        // Handle registration form submission
        window.location.href = 'verify-otp.html';
    });
    
    // Add scroll event for animations
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial check for elements in viewport
    animateOnScroll();
    
    // Add smooth scroll to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const menu = document.getElementById('mobile-menu');
                const button = document.getElementById('mobile-menu-button');

                if (menu && !menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                    menu.classList.remove('active');
                    if (button) {
                        button.classList.remove('active');
                        button.setAttribute('aria-expanded', 'false');
                        button.innerHTML = '<i class="fas fa-bars text-2xl" aria-hidden="true"></i><span class="sr-only">Open menu</span>';
                    }
                    if (menu) menu.setAttribute('aria-hidden', 'true');
                }
            }
        });
    });
    
    // Add active class to current nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || 
            (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('text-indigo-600', 'font-semibold');
        }
    });
    
    // Add scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1 hidden';
    scrollToTopBtn.id = 'scroll-to-top';
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.remove('hidden');
        } else {
            scrollToTopBtn.classList.add('hidden');
        }
    });
    
    // Scroll to top on click
    document.getElementById('scroll-to-top')?.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect to cards
    document.querySelectorAll('.card-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
            
            // Add shadow based on mouse position
            const shadowX = (x - centerX) / 20;
            const shadowY = (y - centerY) / 20;
            
            card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.15)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
});
