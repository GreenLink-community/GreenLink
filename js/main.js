/* =============================================================
   GreenLink Static Site JavaScript
   Handles mobile navigation, scroll-reveal animations,
   sticky header state, and the animated trash tracker vessel.
   ============================================================= */

(function () {
  "use strict";

  // Wait for DOM to be ready
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  // Check for reduced motion preference
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Mobile navigation
  function initMobileNav() {
    const toggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (!toggle || !mobileNav) return;

    toggle.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close mobile menu when a link is clicked
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Sticky header shadow on scroll
  function initStickyHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    function updateHeader() {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  // Scroll reveal animations
  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (prefersReducedMotion()) {
      reveals.forEach(function (el) {
        el.classList.add("revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Five pillars scroll reveal with stagger
  function initPillarReveal() {
    const pillars = document.querySelectorAll(".pillar-item");
    if (!pillars.length) return;

    if (prefersReducedMotion()) {
      pillars.forEach(function (pillar) {
        pillar.classList.add("revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger reveal by index
            const index = Array.from(pillars).indexOf(entry.target);
            setTimeout(function () {
              entry.target.classList.add("revealed");
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
    );

    pillars.forEach(function (pillar) {
      observer.observe(pillar);
    });
  }

  // Animated trash tracker vessel and counter
  function initTracker() {
    const vessel = document.querySelector(".tracker-vessel");
    if (!vessel) return;

    const water = vessel.querySelector(".vessel-water");
    const numberEl = vessel.querySelector(".vessel-number");
    const goalEl = vessel.querySelector(".vessel-goal");

    // trackerData is loaded from tracker-data.js before this file
    const data = window.trackerData || {
      totalPounds: 0,
      goalPounds: 5000,
      cleanupsHeld: 0,
      volunteerHours: 0,
      lastUpdated: "",
      lastCleanupLocation: ""
    };

    const total = Number(data.totalPounds) || 0;
    const goal = Number(data.goalPounds) || 5000;
    const fillPercentage = Math.min((total / goal) * 100, 100);

    // Update goal text
    if (goalEl) {
      goalEl.textContent = "Goal: " + goal.toLocaleString() + " lbs";
    }

    // Update other stat fields if they exist
    const cleanupsEl = document.querySelector("[data-tracker='cleanupsHeld']");
    const hoursEl = document.querySelector("[data-tracker='volunteerHours']");
    const updatedEl = document.querySelector("[data-tracker='lastUpdated']");
    const locationEl = document.querySelector("[data-tracker='lastCleanupLocation']");

    if (cleanupsEl) cleanupsEl.textContent = (data.cleanupsHeld || 0).toLocaleString();
    if (hoursEl) hoursEl.textContent = (data.volunteerHours || 0).toLocaleString();
    if (updatedEl) updatedEl.textContent = data.lastUpdated || "";
    if (locationEl) locationEl.textContent = data.lastCleanupLocation || "";

    // Update hero stats if present
    const heroPounds = document.querySelector("[data-hero='pounds']");
    const heroCleanups = document.querySelector("[data-hero='cleanups']");
    if (heroPounds) heroPounds.textContent = total.toLocaleString();
    if (heroCleanups) heroCleanups.textContent = (data.cleanupsHeld || 0).toLocaleString();

    function animateCounter() {
      if (!numberEl) return;

      if (prefersReducedMotion()) {
        numberEl.textContent = total.toLocaleString();
        return;
      }

      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(total * eased);

        numberEl.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    function animateFill() {
      if (!water) return;

      if (prefersReducedMotion()) {
        water.style.height = fillPercentage + "%";
        return;
      }

      // Reset to 0 then animate to target
      water.style.height = "0%";
      // Force reflow
      water.getBoundingClientRect();

      setTimeout(function () {
        water.style.height = fillPercentage + "%";
      }, 100);
    }

    // Use IntersectionObserver to trigger once when vessel is visible
    const vesselObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateFill();
            animateCounter();
            vesselObserver.unobserve(vessel);
          }
        });
      },
      { threshold: 0.35 }
    );

    vesselObserver.observe(vessel);
  }

  // Contact form: build mailto message
  function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = form.querySelector("#name")?.value?.trim() || "";
      const email = form.querySelector("#email")?.value?.trim() || "";
      const topic = form.querySelector("#topic")?.value || "";
      const message = form.querySelector("#message")?.value?.trim() || "";

      if (!name || !email || !message) {
        alert("Please fill out all required fields.");
        return;
      }

      const subject = "GreenLink Contact: " + topic;
      const body = "Name: " + name + "\n" +
                   "Email: " + email + "\n" +
                   "Topic: " + topic + "\n\n" +
                   "Message:\n" + message;

      window.location.href = "mailto:hello@greenlink-volunteers.org" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  // Footer year
  function updateFooterYear() {
    const yearEl = document.querySelector(".footer-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear().toString();
    }
  }

  // Initialize everything
  ready(function () {
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initPillarReveal();
    initTracker();
    initContactForm();
    updateFooterYear();
  });
})();
