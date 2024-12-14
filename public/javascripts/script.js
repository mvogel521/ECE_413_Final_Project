document.addEventListener("DOMContentLoaded", function() {
    fetch('../html/navbar.html')
      .then(response => response.text())
      .then(html => {
        const element = document.createElement("div");
        element.innerHTML = html;
        document.getElementById("navbar-container").appendChild(element);
      })
      .catch(err => console.error("Error loading the navbar:", err));
  });
  
