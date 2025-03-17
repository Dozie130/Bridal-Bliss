// Show welcome alert
window.onload = function() {
    alert("Welcome to Bridal Bliss! Explore our stunning wedding dresses.");
};

// Navigation toggle
document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (toggle && navLinks) {
        toggle.addEventListener("click", function() {
            navLinks.style.display = navLinks.style.display === "block" ? "none" : "block";
        });
    }
});

// Function to show the dress list
function showDresses() {
    const dressList = document.getElementById("dress-list");
    dressList.style.display = "grid"; // Show the dress list

    // Clear any existing dresses
    dressList.innerHTML = "";

    // Sample dresses with real images from Unsplash
    const dresses = [
        { name: "A-Line Elegance", price: "$500", description: "A classic A-line dress with lace details.", image: "https://images.unsplash.com/photo-1591370874776-8d1317e855c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
        { name: "Mermaid Glow", price: "$600", description: "A stunning mermaid dress with a long train.", image: "https://images.unsplash.com/photo-1562342899-589e7e0c5c30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
        { name: "Ball Gown Bliss", price: "$700", description: "A fairy-tale ball gown with sparkles.", image: "https://images.unsplash.com/photo-1545424635-5d5f5b5b5b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
        { name: "Princess Dream", price: "$550", description: "A princess-style dress with tulle layers.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
        { name: "Vintage Charm", price: "$450", description: "A vintage-inspired dress with pearl details.", image: "https://images.unsplash.com/photo-1560258018-c82db72991a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" }
    ];

    // Add dresses to the page
    dresses.forEach((dress, index) => {
        const dressCard = document.createElement("div");
        dressCard.className = "dress-card";
        dressCard.innerHTML = `
            <img src="${dress.image}" alt="${dress.name}">
            <div class="dress-card-content">
                <h3>${dress.name}</h3>
                <p>${dress.description}</p>
                <p class="price">${dress.price}</p>
                <button class="like-btn" onclick="toggleLike(${index})">Like</button>
            </div>
        `;
        dressList.appendChild(dressCard);
    });
}

// Function to toggle "Like" button
function toggleLike(index) {
    const likeBtn = document.getElementsByClassName("like-btn")[index];
    likeBtn.classList.toggle("liked");
    if (likeBtn.classList.contains("liked")) {
        likeBtn.textContent = "Liked";
    } else {
        likeBtn.textContent = "Like";
    }
}

// Handle form submission
document.getElementById("quote-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
        const response = await fetch("/.netlify/functions/submit-form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, message }),
        });
        const result = await response.json();
        alert(result.message);
        this.reset();
    } catch (error) {
        alert("There was an error submitting your form. Please try again.");
    }
});
