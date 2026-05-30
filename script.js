const root = document.documentElement;
const progress = document.querySelector(".scroll-progress");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const year = document.querySelector("#year");
const printButton = document.querySelector("#print-page");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

const savedTheme = localStorage.getItem("ka-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("ka-theme", theme);
}

setTheme(savedTheme || preferredTheme);

if (year) {
  year.textContent = new Date().getFullYear();
}

function updateProgress() {
  if (!progress) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progress.style.width = `${Math.min(percent, 100)}%`;
}

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
    if (event.target.closest("a")) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
      document.body.classList.remove("nav-open");
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    const panelId = button.dataset.tab;
    const tabList = button.closest("[role='tablist']");
    const buttons = tabList ? tabList.querySelectorAll(".tab-button") : document.querySelectorAll(".tab-button");

    buttons.forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
    document.querySelectorAll(".skill-panel").forEach((panel) => {
      panel.hidden = panel.id !== panelId;
    });
  });
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });

    document.querySelectorAll("[data-cert]").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.cert !== filter;
    });
  });
});

const revealElements = document.querySelectorAll(".reveal");

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

if (printButton) {
  printButton.addEventListener("click", () => window.print());
}

if (form && formStatus) {
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
