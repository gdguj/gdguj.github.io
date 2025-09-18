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
    mobileMenuLinks.forEach(link => {
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

// FAQ with smooth transitions
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".faq button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector("svg");
      const isCurrentlyOpen = content.style.maxHeight && content.style.maxHeight !== "0px";

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