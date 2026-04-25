const translations = {
  en: {
    darkMode: "Dark",
    lightMode: "Light",
    englishBtn: "English",
    frenchBtn: "French",
  },
  fr: {
    darkMode: "Sombre",
    lightMode: "Clair",
    englishBtn: "Anglais",
    frenchBtn: "Français",
  },
};

let currentLanguage = localStorage.getItem("language") || "en";
let isDarkMode = localStorage.getItem("darkMode") === "true";

function initializeSettings() {
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    updateThemeButton();
  }

  setLanguage(currentLanguage);
}

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const langToggle = document.getElementById("langToggle");
  const menuToggle = document.getElementById("menuToggle");
  const headerContainer = document.querySelector(".header-container");

  function closeMobileMenu() {
    if (!headerContainer || !menuToggle) {
      return;
    }

    headerContainer.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.title = "Open menu";
  }

  if (menuToggle && headerContainer) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = headerContainer.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.title = isOpen ? "Close menu" : "Open menu";
      this.blur();
    });
  }

  document.addEventListener("click", function (e) {
    if (headerContainer && headerContainer.classList.contains("menu-open")) {
      if (!headerContainer.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDarkMode);
      updateThemeButton();
      this.blur();
    });
  }

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      currentLanguage = currentLanguage === "en" ? "fr" : "en";
      localStorage.setItem("language", currentLanguage);
      setLanguage(currentLanguage);
      updateThemeButton();
      updateLanguageButton();
      this.blur();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: "smooth",
        });
        closeMobileMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("[id]");
    const navLinks = document.querySelectorAll(".navbar a");

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").slice(1) === current) {
        link.classList.add("active");
      }
    });
  });

  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });

  const lastUpdatedElement = document.getElementById("lastUpdated");
  if (lastUpdatedElement) {
    const today = new Date();
    const options = { year: "numeric", month: "short" };
    const formattedDate = today.toLocaleDateString("en-US", options);
    lastUpdatedElement.textContent = `Last updated: ${formattedDate}`;
  }

  initializeSettings();
});

function updateThemeButton() {
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    const icon = themeBtn.querySelector("i");
    if (isDarkMode) {
      icon.className = "fa-solid fa-sun";
      themeBtn.title = translations[currentLanguage]["lightMode"];
    } else {
      icon.className = "fa-solid fa-moon";
      themeBtn.title = translations[currentLanguage]["darkMode"];
    }
  }
}

function updateLanguageButton() {
  const langBtn = document.getElementById("langToggle");
  if (langBtn) {
    langBtn.title =
      currentLanguage === "en"
        ? translations[currentLanguage]["frenchBtn"]
        : translations[currentLanguage]["englishBtn"];
  }
}

function setLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-en][data-fr]").forEach((element) => {
    const text = element.getAttribute(`data-${lang}`);
    if (text) {
      element.innerHTML = text;
    }
  });

  updateLanguageButton();
}
