const root = document.documentElement;
const progress = document.querySelector(".scroll-progress");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const year = document.querySelector("#year");
const printButton = document.querySelector("#print-page");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const savedTheme = localStorage.getItem("ka-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function loadEnhancementStyles() {
  if (document.querySelector('link[href="enhancements.css"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "enhancements.css";
  document.head.append(link);
}

function addMeta(name, content, attribute = "name") {
  if (!content) return;
  const selector = `meta[${attribute}="${name}"]`;
  let meta = document.head.querySelector(selector);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, name);
    document.head.append(meta);
  }
  meta.setAttribute("content", content);
}

function addHeadEnhancements() {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = "https://pasha800.github.io/";

  addMeta("author", "Kaka Ahmad Yusuf");
  addMeta("robots", "index, follow, max-image-preview:large");
  addMeta("og:url", "https://pasha800.github.io/", "property");
  addMeta("twitter:card", "summary_large_image");
  addMeta("twitter:title", "Kaka Ahmad Yusuf | IT, Network & Systems Professional");
  addMeta("twitter:description", "IT support, networking, CCTV, Microsoft 365, systems administration, and web/software development portfolio.");
  addMeta("twitter:image", "https://pasha800.github.io/hero-tech.png");
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("ka-theme", theme);
  updateThemeControl(theme);
}

function updateThemeControl(theme = root.dataset.theme) {
  if (!themeToggle) return;
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  themeToggle.setAttribute("aria-label", label);
  themeToggle.setAttribute("title", label);
}

function closeNavigation() {
  if (!navToggle) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("nav-open");
}

function updateProgress() {
  if (!progress) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progress.style.width = `${Math.min(percent, 100)}%`;
}

function scrollToTarget(target) {
  const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 14;
  window.scrollTo({ top: Math.max(top, 0), behavior: reducedMotion ? "auto" : "smooth" });
}

function improveImages() {
  document.querySelectorAll("img").forEach((image) => {
    image.decoding = "async";
    if (image.classList.contains("hero-image")) {
      image.loading = "eager";
      image.fetchPriority = "high";
      return;
    }
    image.loading = "lazy";
  });
}

function buildTrustStrip() {
  const roleStrip = document.querySelector(".role-strip");
  if (!roleStrip || document.querySelector(".trust-strip")) return;

  const strip = document.createElement("section");
  strip.className = "trust-strip";
  strip.setAttribute("aria-label", "Service highlights");
  strip.innerHTML = `
    <div class="trust-strip-inner">
      <div><strong>Field-ready</strong><span>On-site network, CCTV, and computer support</span></div>
      <div><strong>Office-ready</strong><span>Microsoft 365, reports, documentation, and user help</span></div>
      <div><strong>Project-ready</strong><span>Websites, workflow tools, databases, and maintenance</span></div>
    </div>
  `;
  roleStrip.insertAdjacentElement("afterend", strip);
}

function buildFloatingActions() {
  if (document.querySelector(".floating-actions")) return;
  const wrapper = document.createElement("div");
  wrapper.className = "floating-actions";
  wrapper.setAttribute("aria-label", "Quick actions");
  wrapper.innerHTML = `
    <a class="floating-action" href="https://wa.me/9647514705065" target="_blank" rel="noreferrer" aria-label="Message Kaka Ahmad Yusuf on WhatsApp">WhatsApp</a>
    <button class="floating-action" type="button" aria-label="Back to top">Top</button>
  `;
  const topButton = wrapper.querySelector("button");
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
  document.body.append(wrapper);
}

function setupActiveNavigation() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function setActive(id) {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (!sections.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.15, 0.35, 0.6] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", link.getAttribute("href"));
      scrollToTarget(target);
      closeNavigation();
      setActive(target.id);
    });
  });
}

function setupTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      const panelId = button.dataset.tab;
      const tabList = button.closest("[role='tablist']");
      const buttons = tabList ? Array.from(tabList.querySelectorAll(".tab-button")) : Array.from(document.querySelectorAll(".tab-button"));

      buttons.forEach((tab) => {
        tab.setAttribute("aria-selected", String(tab === button));
        tab.tabIndex = tab === button ? 0 : -1;
      });
      document.querySelectorAll(".skill-panel").forEach((panel) => {
        panel.hidden = panel.id !== panelId;
      });
    });

    button.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      const tabs = Array.from(button.closest("[role='tablist']")?.querySelectorAll(".tab-button") || []);
      const current = tabs.indexOf(button);
      let next = current;
      if (event.key === "ArrowLeft") next = current <= 0 ? tabs.length - 1 : current - 1;
      if (event.key === "ArrowRight") next = current >= tabs.length - 1 ? 0 : current + 1;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      event.preventDefault();
      tabs[next]?.focus();
      tabs[next]?.click();
    });
  });
}

function setupCertificationFilters() {
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      document.querySelectorAll(".filter-button").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      document.querySelectorAll("[data-cert]").forEach((card) => {
        const visible = filter === "all" || card.dataset.cert === filter;
        card.hidden = !visible;
        card.classList.toggle("is-filtered-in", visible);
      });
    });
  });
}

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (reducedMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }
}

function setupContactForm() {
  if (!form || !formStatus) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please complete all fields.";
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    formStatus.textContent = "Opening your email app. If it does not open, use the direct email link above.";
    window.location.href = `mailto:pasha3.11.1990@gmail.com?subject=${subject}&body=${body}`;
  });
}

loadEnhancementStyles();
addHeadEnhancements();
setTheme(savedTheme || preferredTheme);
improveImages();
buildTrustStrip();
buildFloatingActions();

if (year) {
  year.textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
  if (!window.location.hash) return;
  const target = document.getElementById(window.location.hash.slice(1));
  if (target) {
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    scrollToTarget(target);
    root.style.scrollBehavior = previousScrollBehavior;
    updateProgress();
  }
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    document.body.classList.toggle("nav-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) return;
    if (event.target.closest(".nav-shell")) return;
    closeNavigation();
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

setupActiveNavigation();
setupTabs();
setupCertificationFilters();
setupRevealAnimations();
setupContactForm();

if (printButton) {
  printButton.addEventListener("click", () => window.print());
}
