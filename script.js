// =====================================================
// THEME TOGGLE FUNCTIONALITY
// =====================================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Initialize theme on page load
const initTheme = () => {
  const savedTheme = JSON.parse(sessionStorage.getItem('theme')) || 'dark';
  body.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
};

// Toggle between dark and light mode
themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  sessionStorage.setItem('theme', JSON.stringify(newTheme));
  themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
});

initTheme();

// =====================================================
// HERO SCENE - Main 3D Animation (Top of Page)
// =====================================================
class HeroScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    // Setup Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      55,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    this.setupLights();
    this.createGeometry();
    this.camera.position.z = 8;
    
    this.animate();
    this.handleResize();
  }
  
  // Setup colored lights for the scene
  setupLights() {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    // 🔵 LIGHT 1 - Blue Point Light
    // Change color: 0x3b82f6 (try 0xff0000 for red, 0x00ff00 for green)
    const light1 = new THREE.PointLight(0x3b82f6, 3, 100);
    light1.position.set(5, 5, 5);
    
    // 🟣 LIGHT 2 - Purple Point Light
    // Change color: 0xa78bfa (try 0xffd700 for gold, 0xff00ff for magenta)
    const light2 = new THREE.PointLight(0xa78bfa, 2, 100);
    light2.position.set(-5, -5, 5);
    
    // 🔷 LIGHT 3 - Light Blue Point Light
    // Change color: 0x60a5fa
    const light3 = new THREE.PointLight(0x60a5fa, 2, 100);
    light3.position.set(0, 5, -5);
    
    this.lights = [light1, light2, light3];
    this.scene.add(light1, light2, light3);
  }
  
  // Create all 3D geometries for hero section
  createGeometry() {
    this.geometries = [];
    
    // ==========================================
    // 💎 HERO OBJECT 1: CRYSTALLINE STRUCTURE (Left side)
    // ==========================================
    const createCrystal = () => {
      const group = new THREE.Group();
      
      // 🎨 SPHERE MATERIAL - Rainbow gradient effect
        // HSL Color: Hue (0.6-0.8 = blue to purple range)
        // TO CHANGE: Modify the 0.6 value (0.0=red, 0.3=green, 0.5=cyan, 0.6=blue, 0.8=purple)
        const material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color().setHSL(
            0.75 + Math.random() * 0.2,  // ⭐ CHANGE 0.6 to shift color range
            0.8,                         // Saturation (0.0-1.0)
            0.6                          // Lightness (0.0-1.0)
          ),
          metalness: 0.9,
          roughness: 0.1,
          transparent: true,
          opacity: 0.8
        });
      
      // Central icosahedron shape
      const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.3, 5),
        material
      );
      
      // 🔷 SURROUNDING CRYSTALS - 10 smaller shapes orbiting
      // Each gets a clone of the material
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const oct = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.6, 0),
          material.clone()  // Clone so each can have different properties
        );
        oct.position.set(
          Math.cos(angle) * 2.5,
          Math.sin(angle) * 2.5,
          Math.sin(angle * 2) * 1.5
        );
        group.add(oct);
      }
      
      group.add(ico);
      group.position.set(-3, 0, 0);
      return group;
    };
    
    // ==========================================
    // 🌀 HERO OBJECT 2: TORUS KNOT (Right side)
    // ==========================================
    const createTorusKnot = () => {
      // 🎨 TORUS KNOT MATERIAL - Purple metallic
      // TO CHANGE COLOR: Replace 0xa78bfa
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xa78bfa,           // ⭐ CHANGE THIS for torus knot color
        metalness: 0.95,           // Very metallic
        roughness: 0.05,           // Very shiny
        clearcoat: 1.0,
        reflectivity: 1.0
      });
      
      const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 200, 32, 3, 2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(3, 0, 0);
      return mesh;
    };
    
    // ==========================================
    // ✨ HERO OBJECT 3: SPHERE CLUSTER (Top center)
    // ==========================================
    const createSphereCluster = () => {
      const group = new THREE.Group();
      
      // Creates 20 spheres with random colors
      for (let i = 0; i < 20; i++) {
        const size = Math.random() * 0.4 + 0.2;
        
        // 🎨 SPHERE MATERIAL - Rainbow gradient effect
        // HSL Color: Hue (0.6-0.8 = blue to purple range)
        // TO CHANGE: Modify the 0.6 value (0.0=red, 0.3=green, 0.5=cyan, 0.6=blue, 0.8=purple)
        const material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color().setHSL(
            0.6 + Math.random() * 0.2,  // ⭐ CHANGE 0.6 to shift color range
            0.8,                         // Saturation (0.0-1.0)
            0.6                          // Lightness (0.0-1.0)
          ),
          metalness: 0.9,
          roughness: 0.1,
          transparent: true,
          opacity: 0.8
        });
        
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(size, 32, 32),
          material
        );
        
        const angle = (i / 20) * Math.PI * 2;
        const radius = 1.5 + Math.random() * 1;
        sphere.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2
        );
        
        group.add(sphere);
      }
      
      group.position.set(0, 2, -2);
      return group;
    };
    
    // Add all three objects to the scene
    this.geometries.push(createCrystal());
    this.geometries.push(createTorusKnot());
    this.geometries.push(createSphereCluster());
    
    this.geometries.forEach(geo => this.scene.add(geo));
  }
  
  // Animation loop
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const time = Date.now() * 0.001;
    
    // Rotate all geometries
    this.geometries.forEach((geo, index) => {
      geo.rotation.x += 0.003 * (index + 1);
      geo.rotation.y += 0.005 * (index + 1);
      geo.position.y += Math.sin(time + index) * 0.01;
    });
    
    // Animate lights in a circle
    this.lights.forEach((light, index) => {
      const angle = time * 0.5 + (index * Math.PI * 2 / 3);
      light.position.x = Math.cos(angle) * 6;
      light.position.z = Math.sin(angle) * 6;
    });
    
    this.renderer.render(this.scene, this.camera);
  }
  
  // Handle window resize
  handleResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    });
  }
}

// Initialize hero scene
new HeroScene('hero-canvas');

// =====================================================
// PROJECT CARD SCENES - Small 3D previews in projects
// =====================================================
class ProjectScene {
  constructor(canvasId, shapeType) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    this.createShape(shapeType);
    this.setupLights();
    this.camera.position.z = 4;
    
    this.animate();
  }
  
  createShape(type) {
    let geometry;
    
    // Choose geometry based on type
    switch(type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.2, 64, 64);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
        break;
    }
    
    // 🎨 PROJECT CARD MATERIAL - Blue metallic
    // TO CHANGE COLOR: Replace 0x3b82f6
    // This color applies to ALL project card shapes
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,           // ⭐ CHANGE THIS for project cards color
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1.0
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }
  
  setupLights() {
    const light1 = new THREE.PointLight(0xffffff, 1.5);
    light1.position.set(3, 3, 3);
    
    const light2 = new THREE.PointLight(0xa78bfa, 1);
    light2.position.set(-3, -3, 3);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    
    this.scene.add(light1, light2, ambientLight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize project scenes (3 cards)
// 📦 Project 1: Cube shape
new ProjectScene('project1-canvas', 'cube');
// 🔮 Project 2: Sphere shape
new ProjectScene('project2-canvas', 'sphere');
// 🍩 Project 3: Torus shape
new ProjectScene('project3-canvas', 'torus');

// =====================================================
// INTERACTIVE 3D MODEL VIEWERS - Bottom section
// These are the 3 large interactive models you can rotate
// =====================================================
class InteractiveViewer {
  constructor(canvasId, modelType) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      50
    );
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    this.modelType = modelType;
    this.rotation = { x: 0, y: 0 };
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.autoRotate = true;
    
    this.createModel();
    this.setupLights();
    this.setupInteraction();
    this.camera.position.z = 5;
    
    this.animate();
  }
  
  createModel() {
    switch(this.modelType) {
      case 1:
        this.createCrystallineStructure();
        break;
      case 2:
        this.createMorphingTopology();
        break;
      case 3:
        this.createParametricDesign();
        break;
    }
  }
  
  // ==========================================
  // 💎 INTERACTIVE MODEL 1: CRYSTALLINE STRUCTURE
  // "Geometric Design" - First interactive viewer
  // ==========================================
  createCrystallineStructure() {
    this.group = new THREE.Group();
    
    // 🎨 MAIN CRYSTAL - Center piece (Blue)
    // TO CHANGE COLOR: Replace 0x3b82f6
    const mainCrystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,           // ⭐ CHANGE THIS for main crystal
        metalness: 0.95,           // Very metallic
        roughness: 0.05,           // Very shiny
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.9
      })
    );
    
    // 🎨 SATELLITE CRYSTALS - 6 orbiting pieces (Purple)
    // TO CHANGE COLOR: Replace 0xa78bfa
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const satellite = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.6, 1),
        new THREE.MeshPhysicalMaterial({
          color: 0xa78bfa,         // ⭐ CHANGE THIS for satellites
          metalness: 0.95,
          roughness: 0.05,
          transparent: true,
          opacity: 0.8
        })
      );
      
      satellite.position.set(
        Math.cos(angle) * 2.5,
        Math.sin(angle) * 2.5,
        Math.sin(angle * 2) * 1
      );
      
      this.group.add(satellite);
    }
    
    this.group.add(mainCrystal);
    this.scene.add(this.group);
    this.model = this.group;
  }
  
  // ==========================================
  // 🌀 INTERACTIVE MODEL 2: MORPHING TOPOLOGY
  // "Abstract Form" - Second interactive viewer
  // ==========================================
  createMorphingTopology() {
    // 🎨 TORUS KNOT MATERIAL - Light Blue
    // TO CHANGE COLOR: Replace 0x60a5fa
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32, 2, 3);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,             // ⭐ CHANGE THIS for torus knot
      metalness: 0.95,
      roughness: 0.05,
      clearcoat: 1.0,
      reflectivity: 1.0,
      envMapIntensity: 1.0
    });
    
    this.model = new THREE.Mesh(geometry, material);
    this.scene.add(this.model);
  }
  
  // ==========================================
  // 🏗️ INTERACTIVE MODEL 3: PARAMETRIC DESIGN
  // "Modern Structure" - Third interactive viewer
  // ==========================================
  createParametricDesign() {
    this.group = new THREE.Group();
    
    // Create spiral structure with 8 levels
    const numLevels = 8;
    for (let i = 0; i < numLevels; i++) {
      const level = new THREE.Group();
      const numElements = 6;
      
      for (let j = 0; j < numElements; j++) {
        const angle = (j / numElements) * Math.PI * 2 + (i * 0.5);
        const radius = 1.5 - (i * 0.15);
        
        // 🎨 PARAMETRIC ELEMENTS - Color gradient (Blue to Cyan)
        // Color changes from bottom to top using HSL
        // TO CHANGE: Modify 0.55 (starting hue) and 0.15 (hue range)
        // 0.0=red, 0.3=green, 0.5=cyan, 0.6=blue, 0.8=purple
        const element = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 0.8, 32),
          new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(
              0.55 + (i / numLevels) * 0.15,  // ⭐ CHANGE 0.55 for different color
              0.8,                             // Saturation
              0.6                              // Lightness
            ),
            metalness: 0.95,
            roughness: 0.05
          })
        );
        
        element.position.set(
          Math.cos(angle) * radius,
          i * 0.3 - 1.2,
          Math.sin(angle) * radius
        );
        element.rotation.y = angle;
        
        level.add(element);
      }
      
      this.group.add(level);
    }
    
    this.scene.add(this.group);
    this.model = this.group;
  }
  
  // Setup lights for interactive viewers
  setupLights() {
    const light1 = new THREE.PointLight(0xffffff, 2);
    light1.position.set(5, 5, 5);
    
    const light2 = new THREE.PointLight(0xa78bfa, 1.5);
    light2.position.set(-5, -5, 5);
    
    const light3 = new THREE.PointLight(0x3b82f6, 1);
    light3.position.set(0, 5, -5);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    
    this.scene.add(light1, light2, light3, ambientLight);
  }
  
  // Setup mouse/touch interaction
  setupInteraction() {
    // Mouse drag to rotate
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.offsetX - this.previousMousePosition.x;
        const deltaY = e.offsetY - this.previousMousePosition.y;
        this.rotation.y += deltaX * 0.01;
        this.rotation.x += deltaY * 0.01;
        this.previousMousePosition = { x: e.offsetX, y: e.offsetY };
      }
    });
    
    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });
    
    // Mouse wheel to zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.position.z += e.deltaY * 0.01;
      this.camera.position.z = Math.max(3, Math.min(10, this.camera.position.z));
    }, { passive: false });
    
    // Touch support for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.previousMousePosition = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        };
      }
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const deltaX = x - this.previousMousePosition.x;
        const deltaY = y - this.previousMousePosition.y;
        this.rotation.y += deltaX * 0.01;
        this.rotation.x += deltaY * 0.01;
        this.previousMousePosition = { x, y };
      }
    });
    
    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    });
  }
  
  // Animation loop
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Auto-rotate when not dragging
    if (this.autoRotate && !this.isDragging) {
      this.rotation.y += 0.003;
    }
    
    this.model.rotation.x = this.rotation.x;
    this.model.rotation.y = this.rotation.y;
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize all 3 interactive viewers
new ModelViewer('model-1', 'cat_box_meme.glb', 'loading-1');
new ModelViewer('model-2', 'lego_batman_minifigure.glb', 'loading-2');
new ModelViewer('model-3', 'your-third-model.glb', 'loading-3');

// =====================================================
// LIGHTBOX - Full screen image viewer
// =====================================================
const modelCards = document.querySelectorAll('.model-card');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

// Click on model card to open lightbox
modelCards.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

// Click lightbox to close
lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto';
});

// Press Escape to close lightbox
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.style.display === 'flex') {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// =====================================================
// CONTACT FORM
// =====================================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Show success message
  const button = contactForm.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.textContent = 'Message Sent! ✓';
  button.style.background = '#10b981';
  
  // Reset after 3 seconds
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = '';
    contactForm.reset();
  }, 3000);
});

// =====================================================
// SMOOTH SCROLL - For navigation links
// =====================================================
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

// =====================================================
// 🎨 COLOR REFERENCE GUIDE
// =====================================================
/*
QUICK COLOR CODES (Replace the hex values in materials above):

BLUES:
0x3b82f6 - Bright Blue (default)
0x60a5fa - Sky Blue
0x2563eb - Dark Blue
0x0ea5e9 - Cyan Blue

PURPLES:
0xa78bfa - Light Purple (default)
0x8b5cf6 - Medium Purple
0x7c3aed - Dark Purple
0xc084fc - Bright Purple

PINKS:
0xec4899 - Hot Pink
0xf472b6 - Light Pink
0xfb7185 - Rose Pink

GREENS:
0x10b981 - Emerald
0x22c55e - Green
0x84cc16 - Lime Green
0x34d399 - Mint

ORANGES/REDS:
0xf59e0b - Amber
0xfbbf24 - Yellow
0xef4444 - Red
0xf97316 - Orange

METALLICS:
0xffffff - White/Silver
0xffd700 - Gold
0xb87333 - Copper
0xc0c0c0 - Chrome

MATERIAL PROPERTIES:
metalness: 0.0 (matte) to 1.0 (full metal)
roughness: 0.0 (mirror) to 1.0 (rough)
clearcoat: 0.0 (none) to 1.0 (glossy coating)
opacity: 0.0 (invisible) to 1.0 (solid)
*/