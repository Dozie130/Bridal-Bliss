// Show welcome alert
alert("Welcome to Bridal Bliss!");

// Function to show the dress list
function showDresses() {
    const dressList = document.getElementById("dress-list");
    dressList.style.display = "flex"; // Show the dress list

    // Clear any existing dresses
    dressList.innerHTML = "";

    // Sample dresses
    const dresses = [
        { name: "A-Line Elegance", price: "$500", description: "A classic A-line dress with lace details." },
        { name: "Mermaid Glow", price: "$600", description: "A stunning mermaid dress with a long train." },
        { name: "Ball Gown Bliss", price: "$700", description: "A fairy-tale ball gown with sparkles." }
    ];

    // Add dresses to the page
    dresses.forEach(dress => {
        const dressCard = document.createElement("div");
        dressCard.className = "dress-card";
        dressCard.innerHTML = `
            <h4>${dress.name}</h4>
            <p>${dress.description}</p>
            <p><strong>${dress.price}</strong></p>
        `;
        dressList.appendChild(dressCard);
    });
}
