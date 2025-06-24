// Selecting all necessary DOM elements
const menuBar = document.querySelector("#menu-bar");
const navbar = document.querySelector(".navbar");
const category = document.querySelectorAll(".category");
const cateImg = document.querySelector("#c-img");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar ul li a");
const moreButton = document.querySelector("#more-button");
const moreContent = document.querySelector("#more-content");
const successMessage = document.getElementById("success-message");
const contactForm = document.getElementById("contact-form");

// Utility function to show/hide messages
const showMessage = (message, type = "success") => {
  successMessage.style.display = "block";
  successMessage.textContent = message;
  successMessage.style.color = type === "success" ? "green" : "red";

  // Hide the message after 5 seconds
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 5000);
};

// Event listener for toggle menu
if (menuBar) {
  menuBar.addEventListener("click", () => {
    menuBar.classList.toggle("fa-times");
    menuBar.classList.toggle("active");
    navbar.classList.toggle("active");
  });
}

// Scroll event
document.addEventListener("scroll", () => {
  if (menuBar) {
    menuBar.classList.remove("fa-times", "active");
    navbar.classList.remove("active");
  }

  // Connect with nav link
  connectSecWithNavLink();
});

// Controlling menu image
category.forEach((element) => {
  element.addEventListener("click", () => {
    category.forEach((ele) => ele.classList.remove("active"));

    let values = element.value;
    element.classList.add("active");
    cateImg.src = `./images/menu-${values}.jpg`;
  });
});

// Handling scroll event and marking nav item
const connectSecWithNavLink = () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;

    if (pageYOffset >= sectionTop - 60) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    let linkAttribute = link.getAttribute("href");
    link.classList.remove("active");

    if (linkAttribute === `#${current}`) {
      link.classList.add("active");
    }
  });
};

// Handle the form submission
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Disable the submit button while sending the request
    const submitButton = e.target.querySelector("button");
    submitButton.disabled = true;

    // Collect form data
    const formData = new FormData(this);
    
    // Get CSRF token from the form (make sure it's included as a hidden input in the form)
    const csrfToken = document.querySelector('input[name="_csrf"]').value;

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      _csrf: csrfToken // Include CSRF token in the data
    };

    try {
      // Send the form data to the backend API using Axios
      const response = await axios.post("http://localhost:5000/api/forms/submit", data);

      // Display success message
      showMessage(response.data.message || "Message sent successfully!", "success");

      // Reset form
      this.reset();

      // Popup confirmation
      alert("Thank you! Your message has been sent successfully.");

      // Redirect to another page after the form submission
      setTimeout(() => {
        window.location.href = "thank_you.html"; // Change to your desired URL
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error:", error);

      // Display error message
      showMessage(
        error.response?.data?.error || "Error sending message. Please try again.",
        "error"
      );
    } finally {
      // Re-enable the submit button after the request is complete
      submitButton.disabled = false;
    }
  });
}

// Event listener for "More" button toggle
if (moreButton) {
  moreButton.addEventListener("click", () => {
    moreContent.classList.toggle("active");
    moreButton.textContent = moreContent.classList.contains("active")
      ? "Show Less"
      : "Show More";
  });
}

(function ($) {
  "use strict";
  
  // Dropdown on mouse hover
  $(document).ready(function () {
      function toggleNavbarMethod() {
          if ($(window).width() > 992) {
              $('.navbar .dropdown').on('mouseover', function () {
                  $('.dropdown-toggle', this).trigger('click');
              }).on('mouseout', function () {
                  $('.dropdown-toggle', this).trigger('click').blur();
              });
          } else {
              $('.navbar .dropdown').off('mouseover').off('mouseout');
          }
      }
      toggleNavbarMethod();
      $(window).resize(toggleNavbarMethod);
  });
  
  // Back to top button
  if ($('.back-to-top').length) {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $('.back-to-top').fadeIn('slow');
      } else {
        $('.back-to-top').fadeOut('slow');
      }
    });

    $('.back-to-top').click(function () {
      $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
      return false;
    });
  }

  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 2000
  });

  // Modal Video
  $(document).ready(function () {
      var $videoSrc;
      $('.btn-play').click(function () {
          $videoSrc = $(this).data("src");
      });

      $('#videoModal').on('shown.bs.modal', function () {
          $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
      });

      $('#videoModal').on('hide.bs.modal', function () {
          $("#video").attr('src', $videoSrc);
      });
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
      center: true,
      autoplay: true,
      smartSpeed: 1500,
      margin: 30,
      dots: true,
      loop: true,
      responsive: {
          0: {
              items: 1
          },
          576: {
              items: 1
          },
          768: {
              items: 2
          },
          992: {
              items: 3
          }
      }
  });
  
})(jQuery);
