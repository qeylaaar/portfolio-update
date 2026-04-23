document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Typing Effect ---
  const txtElement = [
    "Software Engineer",
    "Backend Developer",
    "Junior Web Programmer",
  ];
  let count = 0;
  let txtIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = txtElement[count];
    const typingText = document.querySelector(".typing");
    if (!typingText) return;

    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, txtIndex--);
    } else {
      typingText.textContent = currentWord.substring(0, txtIndex++);
    }

    let speed = isDeleting ? 80 : 150;
    if (!isDeleting && txtIndex === currentWord.length + 1) {
      isDeleting = true;
      speed = 2000;
    } else if (isDeleting && txtIndex === 0) {
      isDeleting = false;
      count = (count + 1) % txtElement.length;
    }
    setTimeout(type, speed);
  }
  type();

  // --- 2. Universal Filter Function ---
  function applyFilter(buttonsSelector, cardsSelector) {
    const buttons = document.querySelectorAll(buttonsSelector);
    const cards = document.querySelectorAll(cardsSelector);

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        cards.forEach((card) => {
          const category = card.getAttribute("data-category");

          if (filter === "all" || filter === category) {
            card.classList.remove("hidden");
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1) translateY(0)";
            }, 10);
          } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.95) translateY(10px)";
            setTimeout(() => {
              card.classList.add("hidden");
            }, 300);
          }
        });
      });
    });
  }

  // Inisialisasi Filter
  applyFilter(".filter-btn", ".skill-item");
  applyFilter(".filter-btn-exp", ".exp-card");

  // --- 3. Fade-in on Scroll (Observer) ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

  // --- 4. Back to Top Logic ---
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // --- 5. Mobile Menu Logic ---
  const menuToggle = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links li a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (navLinks.classList.contains("active")) {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
          menuToggle.classList.remove("active");
          navLinks.classList.remove("active");
        }
      }
    });
  }

  // --- 6. Contact Form with SweetAlert2 & Formspree ---
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = contactForm.querySelector(".btn-send");
      const originalText = button.innerHTML;

      // Loading state
      button.innerHTML = 'Mengirim... <i class="fas fa-spinner fa-spin"></i>';
      button.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          // Sukses pake SweetAlert2
          Swal.fire({
            icon: "success",
            title: "Pesan Terkirim!",
            text: "Terima kasih sudah menghubungi, Alva akan segera membalas pesanmu.",
            background: "#0f172a",
            color: "#fff",
            confirmButtonColor: "#007bff",
            iconColor: "#007bff",
          });
          contactForm.reset();
        } else {
          throw new Error("Gagal mengirim");
        }
      } catch (error) {
        // Error pake SweetAlert2
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Waduh, ada masalah pas ngirim. Coba lagi nanti ya!",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#ff4d4d",
        });
      } finally {
        button.innerHTML = originalText;
        button.disabled = false;
      }
    });
  }
});