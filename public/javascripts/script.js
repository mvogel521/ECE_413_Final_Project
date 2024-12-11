document.addEventListener("DOMContentLoaded", function() {
    fetch('../html/navbar.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById("navbar-container").innerHTML = html;
      })
      .catch(err => console.error("Error loading the navbar:", err));
  });
  