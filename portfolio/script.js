const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

function closeMenu() {
  if (!menuToggle || !navMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu.classList.toggle("is-open", !isOpen);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  window.matchMedia("(min-width: 681px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const contactEmail = "kaviyasulochana234@gmail.com";

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const senderEmail = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${senderEmail}\n\n${message}`);

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    formStatus.textContent = "Your email app should open with the message ready to review and send.";
  });
}

const yearElement = document.querySelector("#current-year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollTopButton = document.querySelector(".scroll-top");
const sections = Array.from(document.querySelectorAll("main > section[id]"));

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");

  const revealTargets = document.querySelectorAll(
    "#about, #career, #skills, #ai-skills, #projects, #certifications, #resume, #contact, .project-card, .credential-card"
  );
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  });

  document.querySelector("#home")?.classList.add("hero-enter");
}

if (sections.length && "IntersectionObserver" in window) {
  const navLinks = new Map(
    Array.from(document.querySelectorAll(".nav-menu a[href^='#']"))
      .map((link) => [link.hash.slice(1), link])
  );
  const visibleSections = new Map();
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleSections.set(entry.target.id, entry.intersectionRatio);
      } else {
        visibleSections.delete(entry.target.id);
      }
    });

    const activeSection = Array.from(visibleSections.entries())
      .sort((first, second) => second[1] - first[1])[0]?.[0];

    navLinks.forEach((link, id) => {
      if (id === activeSection) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, { threshold: [0.08, 0.25, 0.5], rootMargin: "-15% 0px -55% 0px" });

  sections.forEach((section) => activeSectionObserver.observe(section));
}

if (scrollTopButton) {
  const updateScrollTopButton = () => {
    scrollTopButton.classList.toggle("is-visible", window.scrollY > 420);
  };

  window.addEventListener("scroll", updateScrollTopButton, { passive: true });
  updateScrollTopButton();
  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}
