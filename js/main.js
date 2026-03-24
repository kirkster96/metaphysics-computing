document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateIcon('dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun'; // Show sun when in dark mode
            } else {
                themeIcon.className = 'fas fa-moon'; // Show moon when in light mode
            }
        }
    }

    // --- Dynamic Particle Network Background ---
    class ParticleNetwork {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.density = 80; // Target number of particles
            this.connectionDistance = 150;
            this.breezeX = 0.5; // Wind blowing right
            this.breezeY = -0.2; // Slight updraft

            this.init();
            this.animate();

            window.addEventListener('resize', this.init.bind(this));

            // Allow mouse to slightly repel particles
            this.mouse = { x: null, y: null, radius: 150 };
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            });
            window.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }

        init() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.particles = [];

            // Adjust density based on screen size
            const area = this.canvas.width * this.canvas.height;
            const targetParticles = Math.floor((area / 15000) * (this.density / 100));

            for (let i = 0; i < targetParticles; i++) {
                this.particles.push(new Particle(this));
            }
        }

        animate() {
            requestAnimationFrame(this.animate.bind(this));
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].update();
                this.particles[i].draw();

                // Connect particles
                for (let j = i; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.connectionDistance) {
                        const opacity = 1 - (distance / this.connectionDistance);
                        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

                        // Theme responsive line colors
                        if (isDark) {
                            this.ctx.strokeStyle = `rgba(129, 140, 248, ${opacity * 0.5})`; // Indigo
                        } else {
                            this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.5})`; // Indigo
                        }

                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }
        }
    }

    class Particle {
        constructor(network) {
            this.network = network;
            this.x = Math.random() * this.network.canvas.width;
            this.y = Math.random() * this.network.canvas.height;
            // Base inherent velocity
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            // Apply breeze
            this.x += this.vx + this.network.breezeX;
            this.y += this.vy + this.network.breezeY;

            // Repel from mouse
            if (this.network.mouse.x != null) {
                const dx = this.network.mouse.x - this.x;
                const dy = this.network.mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.network.mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (this.network.mouse.radius - distance) / this.network.mouse.radius;
                    this.x -= forceDirectionX * force * 5;
                    this.y -= forceDirectionY * force * 5;
                }
            }

            // Wrap around edges to create continuous flow
            if (this.x > this.network.canvas.width + 50) this.x = -50;
            if (this.x < -50) this.x = this.network.canvas.width + 50;
            if (this.y > this.network.canvas.height + 50) this.y = -50;
            if (this.y < -50) this.y = this.network.canvas.height + 50;
        }

        draw() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            this.network.ctx.fillStyle = isDark ? 'rgba(244, 114, 182, 0.8)' : 'rgba(236, 72, 153, 0.8)'; // Pink vertices
            this.network.ctx.beginPath();
            this.network.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.network.ctx.fill();
        }
    }

    // Initialize Network if canvas exists
    new ParticleNetwork('network-canvas');
});
