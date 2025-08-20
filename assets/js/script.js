// Variables globales
let cursor, cursorFollower;
let mouseX = 0,
    mouseY = 0;
let cursorX = 0,
    cursorY = 0;
let currentSlide = 0;
let totalSlides = 4;

// Función para actualizar la fecha automáticamente
function updateDate() {
    const dateElement = document.getElementById("date");
    const currentYear = new Date().getFullYear();
    dateElement.textContent = currentYear;
}
updateDate(); // Llamada inicial para establecer la fecha

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
    // Ocultar loading screen
    setTimeout(() => {
        document.getElementById("loadingScreen").classList.add("hide");
    }, 2000);

    initCursor();
    initScrollAnimations();
    initNavbar();
    initMobileMenu();
    initCounters();
    initSkillBars();
    initContactForm();
    initCarousel();
    initAvatarAnimation();
    initTypewriter();
});

// Animación de escritura para el nombre
function initTypewriter() {
    const heroName = document.getElementById("heroName");
    const text = "Alvaro Ospino";
    heroName.textContent = "";

    setTimeout(() => {
        let i = 0;
        const typeInterval = setInterval(() => {
            heroName.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, 150);
    }, 1000);
}

// Animación del avatar
function initAvatarAnimation() {
    const heroAvatar = document.getElementById("heroAvatar");
    const aboutAvatar = document.getElementById("aboutAvatar");
    const aboutText = document.getElementById("aboutText");
    const statsGrid = document.getElementById("statsGrid");
    let isAnimating = false;
    // Observer para detectar cuando la sección "Sobre mí" entra en vista
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (
                    entry.target.id === "about" &&
                    entry.isIntersecting &&
                    !isAnimating
                ) {
                    isAnimating = true;
                    moveAvatarToAbout();
                    // Animar el texto de la sección "Sobre mí"
                    setTimeout(() => {
                        aboutText.classList.add("animate");
                    }, 500);
                    // Animar las estadísticas
                    setTimeout(() => {
                        const statItems = statsGrid.querySelectorAll(".stat-item");
                        statItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add("animate");
                            }, index * 200);
                        });
                    }, 800);
                }
            });
        },
        { threshold: 0.3 }
    );
    observer.observe(document.getElementById("about"));

    function moveAvatarToAbout() {
        const heroRect = heroAvatar.getBoundingClientRect();
        const aboutRect = aboutAvatar.getBoundingClientRect();

        // Clonar el avatar
        const movingAvatar = heroAvatar.cloneNode(true);
        movingAvatar.classList.add("moving");
        document.body.appendChild(movingAvatar);

        // Posición inicial
        movingAvatar.style.left = heroRect.left + "px";
        movingAvatar.style.top = heroRect.top + "px";

        // Ocultar avatares originales
        heroAvatar.style.opacity = "0.3";

        // Animar movimiento
        setTimeout(() => {
            movingAvatar.style.left = aboutRect.left + 25 + "px";
            movingAvatar.style.top = aboutRect.top + "px";
            movingAvatar.style.transform = "scale(0.8)";
        }, 100);

        // Completar animación
        setTimeout(() => {
            aboutAvatar.classList.add("show");
            movingAvatar.remove();
            heroAvatar.style.opacity = "1";
        }, 1200);
    }
}

// Animación de entrada profesional del avatar en el hero
function initHeroAvatarEntrance() {
    const hero = document.getElementById('hero');
    const avatar = document.getElementById('heroAvatar');

    if (!hero || !avatar) return;

    // Forzar siempre la entrada desde la derecha
    function pickDirection() {
        return 'enter-right';
    }

    function triggerEntrance() {
        // remove any previous classes
        avatar.classList.remove('enter-left','enter-right','enter-bottom','animate-enter');
        const dir = pickDirection();
        avatar.classList.add(dir);

        // force reflow to restart animation
        // eslint-disable-next-line no-unused-expressions
        avatar.offsetWidth;

        // small timeout so we see initial state (helps on mobile)
        setTimeout(() => {
            avatar.classList.add('animate-enter');
        }, 80);
    }

    window.addEventListener('load', triggerEntrance);
    document.addEventListener('DOMContentLoaded', triggerEntrance);
    window.addEventListener('pageshow', (e) => {
        triggerEntrance();
    });

    // Also trigger when hero becomes visible (use IntersectionObserver)
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerEntrance();
            }
        });
    }, { threshold: 0.4 });

    io.observe(hero);

    // Re-evaluate direction on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // if avatar already animated, re-run with new direction
            triggerEntrance();
        }, 200);
    });

    // Disparar inmediatamente si el script se ejecuta después de la carga
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // pequeña demora para asegurar estilos aplicados
        setTimeout(triggerEntrance, 60);
    }
}

// Inicializar la animación de entrada del avatar
initHeroAvatarEntrance();

// Carrusel de proyectos con miniaturas
function initCarousel() {
    const projectsCarousel = document.querySelector(".projects-carousel");
    const track = document.getElementById("projectsTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const indicators = document.querySelectorAll(".indicator");
    const thumbnails = document.querySelectorAll(".thumbnail");
    let currentSlide = 0;
    const totalSlides = 3;
    let autoPlayInterval;

    function updateCarousel() {
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;

        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentSlide);
        });

        // Actualizar miniaturas
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle("active", index === currentSlide);
        });

        // Scroll automático horizontal de miniaturas si es necesario (solo dentro del contenedor)
        if (thumbnails[currentSlide]) {
            const thumbnailsContainer = document.getElementById("projectThumbnails");
            const activeThumbnail = thumbnails[currentSlide];

            // Calcular la posición de scroll horizontal dentro del contenedor de miniaturas
            const containerRect = thumbnailsContainer.getBoundingClientRect();
            const thumbnailRect = activeThumbnail.getBoundingClientRect();
            const containerScrollLeft = thumbnailsContainer.scrollLeft;

            // Solo hacer scroll horizontal si la miniatura no está completamente visible
            if (
                thumbnailRect.left < containerRect.left ||
                thumbnailRect.right > containerRect.right
            ) {
                const scrollLeft =
                    containerScrollLeft +
                    (thumbnailRect.left - containerRect.left) -
                    (containerRect.width - thumbnailRect.width) / 2;

                thumbnailsContainer.scrollTo({
                    left: scrollLeft,
                    behavior: "smooth",
                });
            }
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    // Event listeners
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Indicadores clickeables
    indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
            goToSlide(index);
        });
    });

    // Miniaturas clickeables
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener("click", () => {
            goToSlide(index);
        });

        // Efecto hover mejorado
        thumbnail.addEventListener("mouseenter", () => {
            if (!thumbnail.classList.contains("active")) {
                thumbnail.style.transform = "translateY(-2px) scale(1.02)";
            }
        });

        thumbnail.addEventListener("mouseleave", () => {
            if (!thumbnail.classList.contains("active")) {
                thumbnail.style.transform = "";
            }
        });
    });

    // Auto-play functions
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Pausar auto-play en hover
    projectsCarousel.addEventListener("mouseenter", stopAutoPlay);
    projectsCarousel.addEventListener("mouseleave", startAutoPlay);

    // Pausar auto-play cuando se interactúa con miniaturas
    const thumbnailsContainer = document.getElementById("projectThumbnails");
    if (thumbnailsContainer) {
        thumbnailsContainer.addEventListener("mouseenter", stopAutoPlay);
        thumbnailsContainer.addEventListener("mouseleave", startAutoPlay);
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        // Solo si el foco está en el carrusel o sus elementos
        if (document.activeElement.closest(".projects")) {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                prevSlide();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                nextSlide();
            } else if (e.key >= "1" && e.key <= "3") {
                e.preventDefault();
                goToSlide(parseInt(e.key) - 1);
            }
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }

    // Inicializar carrusel
    updateCarousel();

    // Iniciar auto-play al cargar
    startAutoPlay();

    // Intersection Observer para pausar auto-play cuando no está visible
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
        },
        { threshold: 0.5 }
    );

    observer.observe(projectsCarousel);
}
// Cursor personalizado
function initCursor() {
    cursor = document.getElementById("cursor");
    cursorFollower = document.getElementById("cursorFollower");

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.left = cursorX - 10 + "px";
        cursor.style.top = cursorY - 10 + "px";

        cursorFollower.style.left = cursorX - 20 + "px";
        cursorFollower.style.top = cursorY - 20 + "px";

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveElements = document.querySelectorAll(
        "a, button, .project-card, .skill-category, .stat-item"
    );

    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("expand");
            cursorFollower.classList.add("expand");
        });

        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("expand");
            cursorFollower.classList.remove("expand");
        });
    });
}

// Navbar scroll effect y navegación activa
function initNavbar() {
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-item a");
    const sections = document.querySelectorAll("section[id]");

    // Efecto scroll del navbar
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Detectar sección activa
        updateActiveNavLink();
    });

    // Función para actualizar el enlace activo
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                currentSection = sectionId;
            }
        });

        // Actualizar enlaces activos
        navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `#${currentSection}`) {
                link.classList.add("active");
            }
        });

        // Si no hay sección detectada, activar "inicio" por defecto
        if (!currentSection && window.scrollY < 100) {
            navLinks.forEach((link) => {
                if (link.getAttribute("href") === "#hero") {
                    link.classList.add("active");
                }
            });
        }
    }

    // Click en enlaces de navegación
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Efecto de click
            link.classList.add("clicked");
            setTimeout(() => {
                link.classList.remove("clicked");
            }, 400);

            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Smooth scroll a la sección
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                // Cerrar menú móvil si está abierto
                const navMenu = document.querySelector(".nav-menu");
                const menuToggle = document.querySelector(".menu-toggle");
                if (navMenu.classList.contains("active")) {
                    navMenu.classList.remove("active");
                    menuToggle.classList.remove("active");
                    document.body.style.overflow = "auto";
                }

                // Actualizar activo después del scroll
                setTimeout(() => {
                    navLinks.forEach((l) => l.classList.remove("active"));
                    link.classList.add("active");
                }, 100);
            }
        });

        // Efecto hover más sutil
        link.addEventListener("mouseenter", () => {
            if (!link.classList.contains("active")) {
                link.style.transform = "translateY(-1px)";
            }
        });

        link.addEventListener("mouseleave", () => {
            if (!link.classList.contains("active")) {
                link.style.transform = "";
            }
        });
    });

    // Inicializar con el primer enlace activo
    updateActiveNavLink();
}

function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-item a");

    // Toggle del menú móvil
    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navMenu.classList.toggle("active");

        // Prevenir scroll del body cuando el menú está abierto
        if (navMenu.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    // Cerrar menú con tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });
}

// Animaciones de scroll
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                    // Activar contadores cuando la sección about es visible
                    if (entry.target.id === "about") {
                        initCounters();
                    }
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        }
    );

    // Observar todas las secciones reveal
    document.querySelectorAll(".reveal").forEach((el) => {
        observer.observe(el);
    });

    // Observar skill categories con delay
    document.querySelectorAll(".skill-category").forEach((category, index) => {
        setTimeout(() => {
            observer.observe(category);
        }, index * 100);
    });
}

// Contadores animados
function initCounters() {
    const statsContainer = document.getElementById("statsGrid");
    if (!statsContainer) return;

    let hasAnimated = false;

    function animateValue(el, start, end, duration) {
        const range = end - start;
        if (range === 0) {
            el.textContent = end;
            return;
        }
        const minInterval = 16; // ~60fps
        const steps = Math.max(Math.ceil(duration / minInterval), 1);
        const stepTime = duration / steps;
        let currentStep = 0;
        const stepAmount = range / steps;

        const run = () => {
            currentStep++;
            const value = start + stepAmount * currentStep;
            if ((stepAmount > 0 && value >= end) || (stepAmount < 0 && value <= end) || currentStep >= steps) {
                el.textContent = end;
            } else {
                el.textContent = Math.ceil(value);
                setTimeout(run, stepTime);
            }
        };

        // arrancar la animación
        el.textContent = start;
        setTimeout(run, stepTime);
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
                const statNumbers = entry.target.querySelectorAll(".stat-number");
                statNumbers.forEach((counter, index) => {
                    const target = parseInt(counter.getAttribute("data-target"), 10) || 0;
                    const current = parseInt(counter.textContent, 10) || 0;
                    // delay por cada contador para efecto escalonado
                    setTimeout(() => {
                        animateValue(counter, current, target, 1500);
                    }, index * 200);
                });
                hasAnimated = true;
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(statsContainer);
}

// Barras de habilidades
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll(".skill-progress");
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const level = bar.getAttribute("data-level");
                        bar.style.width = level + "%";
                    }, index * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll(".skill-category").forEach((category) => {
        observer.observe(category);
    });
}

// Formulario de contacto
function initContactForm() {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = "<span>Enviando...</span> <span>⏳</span>";
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification(
                "¡Gracias por tu mensaje! Por ahora, los correos no se están enviando, pero te contactaré pronto. 💌",
                "error"
            );
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = "";
                form.reset();
            }, 2000);
        }, 2000);
    });
}

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("light-theme");
    showNotification(
        "¡Lo siento! El modo claro aún no está implementado. 😔",
        "error"
    );
    this.textContent = document.body.classList.contains("light-theme")
        ? "☀️"
        : "🌙";
});

// Parallax efecto para formas de fondo
window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll(".shape");

    shapes.forEach((shape, index) => {
        const speed = 0.5 + index * 0.2;
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1
            }deg)`;
    });
});

// Animaciones de contacto
const contactObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate");
            }
        });
    },
    { threshold: 0.2 }
);

document.querySelectorAll(".contact-info, .contact-form").forEach((el) => {
    contactObserver.observe(el);
});

// Seguimiento del cursor
let ticking = false;

function updateCursor(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!ticking) {
        requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
}

document.addEventListener("mousemove", updateCursor);

// Lazy loading de elementos
const lazyElements = document.querySelectorAll(
    ".project-card, .skill-category"
);

const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            lazyObserver.unobserve(entry.target);
        }
    });
});

lazyElements.forEach((el) => {
    lazyObserver.observe(el);
});

// Teclado navigation para carrusel
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarouselDisplay();
    } else if (e.key === "ArrowRight") {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarouselDisplay();
    }
});

function updateCarouselDisplay() {
    const track = document.getElementById("projectsTrack");
    const translateX = -currentSlide * 100;
    track.style.transform = `translateX(${translateX}%)`;

    const indicators = document.querySelectorAll(".indicator");
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentSlide);
    });
}

// Smooth scroll mejorado
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// Sistema de notificaciones
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === "success" ? "var(--gradient-3)" : "var(--gradient-2)"
        };
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
                box-shadow: var(--shadow-xl);
            `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// CSS para animaciones de notificación
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(notificationStyles);

// Optimización de scroll
let isScrolling = false;
window.addEventListener("scroll", () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Preloader para imágenes
function preloadImages() {
    const imageUrls = [];
    imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
}

preloadImages();
