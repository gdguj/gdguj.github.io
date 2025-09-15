// FAQ
 document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".faq button");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector("svg");

        // Close all other accordions
        document.querySelectorAll(".faq .content").forEach((el) => {
          if (el !== content) {
            el.classList.add("hidden");
            el.previousElementSibling.querySelector("svg").classList.remove("rotate-180");
          }
        });

        // Toggle current one
        if (content) {
          content.classList.toggle("hidden");
          icon.classList.toggle("rotate-180");
        }
      });
    });
  });

// End FAQ