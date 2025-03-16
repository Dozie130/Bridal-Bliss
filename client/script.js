// Show welcome alert
window.onload = function() {
    alert("Welcome to Bridal Bliss! Explore our stunning wedding dresses.");
};

// Function to show the dress list
function showDresses() {
    const dressList = document.getElementById("dress-list");
    dressList.style.display = "grid"; // Show the dress list

    // Clear any existing dresses
    dressList.innerHTML = "";

    // Sample dresses with images (using placeholder URLs)
    const dresses = [
        { name: "A-Line Elegance", price: "$500", description: "A classic A-line dress with lace details.", image: "https://via.placeholder.com/250x300.png?text=A-Line+Elegance" },
        { name: "Mermaid Glow", price: "$600", description: "A stunning mermaid dress with a long train.", image: "https://via.placeholder.com/250x300.png?text=Mermaid+Glow" },
        { name: "Ball Gown Bliss", price: "$700", description: "A fairy-tale ball gown with sparkles.", image: "https://via.placeholder.com/250x300.png?text=Ball+Gown+Bliss" },
        { name: "Princess Dream", price: "$550", description: "A princess-style dress with tulle layers.", image: "https://via.placeholder.com/250x300.png?text=Princess+Dream" },
        { name: "Vintage Charm", price: "$450", description: "A vintage-inspired dress with pearl details.", image: "https://via.placeholder.com/250x300.png?text=Vintage+Charm" }
    ];

    // Add dresses to the page
    dresses.forEach(dress => {
        const dressCard = document.createElement("div");
        dressCard.className = "dress-card";
        dressCard.innerHTML = `
            <img src="${dress.image}" alt="${dress.name}">
            <div class="dress-card-content">
                <h3>${dress.name}</h3>
                <p>${dress.description}</p>
                <p class="price">${dress.price}</p>
            </div>
        `;
        dressList.appendChild(dressCard);
    });
}
