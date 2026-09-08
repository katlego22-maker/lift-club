// Switch tabs between Passenger (Seek) and Driver (Offer)
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active-content');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Active Live-Verified Trips Board Database (Manage these manually for your beta testers)
let mockTripsDatabase = [
    { from: "Soweto", to: "Pretoria", via: "Midrand, Centurion", time: "Tomorrow at 06:15", seats: 3, price: 120, phone: "27712345678" },
    { from: "Zeerust", to: "Rustenburg", via: "Swartruggens", time: "Friday at 14:00", seats: 4, price: 150, phone: "27823456789" },
    { from: "Soweto", to: "Pretoria", via: "Woodmead", time: "Today at 17:30", seats: 1, price: 110, phone: "27634567890" }
];

// Execute Search Simulation for Commuters
function handleSearch(event) {
    event.preventDefault();
    const fromInput = document.getElementById('searchFrom').value.toLowerCase().trim();
    const toInput = document.getElementById('searchTo').value.toLowerCase().trim();
    const resultsGrid = document.getElementById('resultsGrid');
    
    resultsGrid.innerHTML = ""; // Wipe historic cards
    
    // Scan array indexes for valid geographic strings
    let matches = mockTripsDatabase.filter(trip => 
        (trip.from.toLowerCase().includes(fromInput) || trip.via.toLowerCase().includes(fromInput)) &&
        (trip.to.toLowerCase().includes(toInput) || trip.via.toLowerCase().includes(toInput))
    );

    if(matches.length === 0) {
        resultsGrid.innerHTML = '<div class="trip-card" style="text-align:center; color:gray;">No matching trips found for this route yet.</div>';
    } else {
        matches.forEach(trip => {
            let cleanPhone = trip.phone.replace(/[^0-9]/g, ''); 
            
            // Structured URL string using direct concatenations to ensure absolute cross-browser mobile app launching
            let whatsappUrl = "https://wa.me/" + cleanPhone + "?text=Hi, I want to book a seat for your trip from " + encodeURIComponent(trip.from) + " to " + encodeURIComponent(trip.to) + " via LiftClubSA";
            
            resultsGrid.innerHTML += 
                '<div class="trip-card">' +
                    '<div class="trip-header">' +
                        '<div class="trip-route">' + trip.from + ' ➔ ' + trip.to + '</div>' +
                        '<div class="trip-price">R' + trip.price + '</div>' +
                    '</div>' +
                    '<div class="trip-details">' +
                        '<p>📅 <strong>Time:</strong> ' + trip.time + '</p>' +
                        '<p>💺 <strong>Seats left:</strong> ' + trip.seats + '</p>' +
                        (trip.via ? '<span class="via-tag">🚗 Via: ' + trip.via + '</span>' : '') +
                    '</div>' +
                    '<a href="' + whatsappUrl + '" target="_blank" class="btn-whatsapp">💬 Book Seat via WhatsApp</a>' +
                '</div>';
        });
    }
    document.getElementById('searchResultsSection').classList.remove('hidden');
}

// Execute Trip Publisher - Intercepts details and pushes them straight to your WhatsApp line for moderation
function handleOffer(event) {
    event.preventDefault();
    
    // Your exact sanitized international admin configuration account 
    const adminWhatsAppNumber = "27710102379"; 
    
    const fromLocation = document.getElementById('offerFrom').value.trim();
    const toLocation = document.getElementById('offerTo').value.trim();
    const viaRoute = document.getElementById('offerRoute').value.trim();
    const dateTime = new Date(document.getElementById('offerDate').value).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' });
    const seatsAvailable = document.getElementById('offerSeats').value;
    const pricePerSeat = document.getElementById('offerPrice').value;
    const driverPhone = document.getElementById('driverWhatsApp').value.replace(/\s+/g, '');

    // Formats a clean notification report structure directly for you to copy/paste 
    let verificationText = "Hi Admin, I want to publish a ride on LiftClubSA:\n\n" +
                           "📍 From: " + fromLocation + "\n" +
                           "🏁 To: " + toLocation + "\n" +
                           "🚗 Via: " + (viaRoute ? viaRoute : "Direct") + "\n" +
                           "📅 Date/Time: " + dateTime + "\n" +
                           "💺 Seats: " + seatsAvailable + "\n" +
                           "💰 Price: R" + pricePerSeat + "\n" +
                           "📞 My Phone: " + driverPhone + "\n\n" +
                           "Please verify and post my ride live on the directory!";

    let adminUrl = "https://wa.me/" + adminWhatsAppNumber + "?text=" + encodeURIComponent(verificationText);
    
    alert("🔒 Anti-Fraud Security Check:\n\nTo keep our network safe from fake rides, your details will now be forwarded to our admin via WhatsApp for quick profile verification. Your trip will go live on the site immediately after verification!");
    
    // Open chat line directly into your inbox channel
    window.open(adminUrl, '_blank');
    document.getElementById('offerForm').reset();
}