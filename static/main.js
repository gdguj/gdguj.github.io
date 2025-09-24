// Header
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = mobileMenuToggle.querySelector("svg");

  if (mobileMenuToggle && mobileMenu) {
    let isExpanded = false;

    // Calculate the full height of the menu when expanded
    const getMenuHeight = () => {
      const nav = mobileMenu.querySelector("nav");
      return nav.scrollHeight + "px";
    };

    // Toggle mobile menu with Bootstrap-style collapse
    mobileMenuToggle.addEventListener("click", () => {
      if (isExpanded) {
        // Collapse menu
        mobileMenu.style.maxHeight = "0px";
        hamburgerIcon.style.transform = "rotate(0deg)";
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        isExpanded = false;
      } else {
        // Expand menu
        mobileMenu.style.maxHeight = getMenuHeight();
        hamburgerIcon.style.transform = "rotate(90deg)";
        mobileMenuToggle.setAttribute("aria-expanded", "true");
        isExpanded = true;
      }
    });

    // Close menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll("a");
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.style.maxHeight = "0px";
        hamburgerIcon.style.transform = "rotate(0deg)";
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        isExpanded = false;
      });
    });

    // Optional: Close menu when window is resized to desktop size
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && isExpanded) {
        mobileMenu.style.maxHeight = "0px";
        hamburgerIcon.style.transform = "rotate(0deg)";
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        isExpanded = false;
      }
    });
  }
});
// End Head

// CountDown
function updateCountdown() {
  // التاريخ المستهدف: 20 سبتمبر
  const targetDate = new Date("Oct 11, 2025 00:00:00").getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML = "انتهى الوقت 🎉";
    return;
  }

  // حساب الأيام والساعات والدقائق والثواني
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // تحديث القيم في HTML
  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0"
  );
  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0"
  );
}
// End Countdown

// FAQ with smooth transitions
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".faq button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector("svg");
      const isCurrentlyOpen =
        content.style.maxHeight && content.style.maxHeight !== "0px";

      // Close all other accordions first
      document.querySelectorAll(".faq .content").forEach((el) => {
        if (el !== content) {
          el.style.maxHeight = "0px";
          const otherIcon = el.previousElementSibling.querySelector("svg");
          if (otherIcon) {
            otherIcon.style.transform = "rotate(0deg)";
          }
        }
      });

      // Toggle current accordion
      if (content) {
        if (isCurrentlyOpen) {
          // Close current accordion
          content.style.maxHeight = "0px";
          icon.style.transform = "rotate(0deg)";
        } else {
          // Open current accordion
          const contentHeight = content.scrollHeight + "px";
          content.style.maxHeight = contentHeight;
          icon.style.transform = "rotate(180deg)";
        }
      }
    });
  });
});

// End FAQ

// Smooth scroll helpers (handle hash links and scrolling to anchors)
(function () {
  function scrollToHash(hash, smooth = true) {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector("header");
    const headerOffset = header ? header.offsetHeight + 12 : 80;
    const top =
      el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  }

  window.addEventListener("load", function () {
    if (location.hash) {
      setTimeout(function () {
        scrollToHash(location.hash, true);
      }, 50);
    }
  });

  document.addEventListener(
    "click",
    function (e) {
      const a = e.target.closest && e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) {
        e.preventDefault();
        history.pushState(null, "", href);
        scrollToHash(href, true);
      } else if (href.indexOf("index.html#") !== -1) {
        const current = location.pathname.split("/").pop() || "index.html";
        if (current === "" || current === "index.html") {
          e.preventDefault();
          const hash = "#" + href.split("#")[1];
          history.pushState(null, "", hash);
          scrollToHash(hash, true);
        }
      }
    },
    false
  );
})();
