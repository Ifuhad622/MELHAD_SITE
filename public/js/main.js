// Selecting all necessary DOM elements
const menuBar = document.querySelector("#menu-bar");
const navbar = document.querySelector(".navbar");
const category = document.querySelectorAll(".category");
const cateImg = document.querySelector("#c-img");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar ul li a");
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

const paymentForm = document.getElementById('paymentForm');
const responseMessage = document.getElementById('responseMessage');

paymentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const name = document.getElementById('name').value.trim();
  const amount = document.getElementById('amount').value.trim();

  if (!email || !name || !amount) {
    responseMessage.textContent = 'Please fill out all fields.';
    responseMessage.style.color = 'red';
    return;
  }

  try {
    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, name, amount })
    });

    const data = await res.json();

    if (res.ok) {
      responseMessage.textContent = data.message;
      responseMessage.style.color = 'green';
      paymentForm.reset();
    } else {
      responseMessage.textContent = data.error || 'Payment failed.';
      responseMessage.style.color = 'red';
    }
  } catch (error) {
    responseMessage.textContent = 'Server error. Try again later.';
    responseMessage.style.color = 'red';
  }
});

document.getElementById('payNowBtn').addEventListener('click', function() {
    MonimeCheckout({
      merchantId: 'spc-k6C85WQ5doSPGG4Cg4RvRNHmGrD', //  Merchant ID
      amount: 50000, // Amount in the smallest currency unit (SLL cents)
      currency: 'SLL',
      reference: 'INV-' + Date.now(), // Unique transaction reference
      customerName: 'Customer Name',
      customerEmail: 'customer@example.com',
      customerPhone: '+232XXXXXXXX',
      description: 'Payment for Printing Services',
      onClose: function() {
        alert('Payment closed.');
      },
      onSuccess: function(response) {
        alert('Payment Successful! Transaction ID: ' + response.transactionId);
        // You can also send the response to your server for verification
      },
      onError: function(error) {
        alert('Payment Failed: ' + error.message);
      }
    });
  });

