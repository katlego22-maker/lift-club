// Switch tabs between Passenger (Seek) and Driver (Offer)
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active-content');
    event.currentTarget.classList.add('active');
}

// Temporary Mock Database Data for testing UI behavior
let mockTripsDatabase = [
    { from: "Soweto", to: "Pretoria", via: "Midrand, Centurion", time: "Tomorrow at 06:15", seats: 3, price: 120, phone: "27712345678" },
    { from: "Zeerust", to: "Rustenburg", via: "Swartruggens", time: "Friday at 14:00", seats: 4, price: 150, phone: "27823456789" },
    { from: "Soweto", to: "Pretoria", via: "Woodmead", time: "Today at 17:30", seats: 1, price: 110, phone: "27634567890" }
];

// Execute Search Simulation
function handleSearch(event) {
    event.preventDefault();
    const fromInput = document.getElementById('searchFrom').value.toLowerCase().trim();
    const toInput = document.getElementById('searchTo').value.toLowerCase().trim();
    const resultsGrid = document.getElementById('resultsGrid');
    
    resultsGrid.innerHTML = ""; // Clear old visual cards
    
    // Filter rows looking through starting points, destinations, or highway towns
    let matches = mockTripsDatabase.filter(trip => 
        (trip.from.toLowerCase().includes(fromInput) || trip.via.toLowerCase().includes(fromInput)) &&
        (trip.to.toLowerCase().includes(toInput) || trip.via.toLowerCase().includes(toInput))
    );

    if(matches.length === 0) {
        resultsGrid.innerHTML = '<div class="trip-card" style="text-align:center; color:gray;">No matching trips found for this route yet.</div>';
    } else {
        matches.forEach(trip => {
            // Clean up any stray spaces, symbols, or formatting errors from the phone number
            let cleanPhone = trip.phone.replace(/[^0-9]/g, ''); 
            
            // Build the WhatsApp message link safely using standard string addition
            let whatsappUrl = "https://wa.me" + cleanPhone + "?text=Hi, I want to book a seat for your trip from " + encodeURIComponent(trip.from) + " to " + encodeURIComponent(trip.to) + " via LiftClubSA";
            
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

// Execute Trip Publisher Simulation
function handleOffer(event) {
    event.preventDefault();
    
    // Clean up input phone text, remove spaces, and format standard 071... to 2771... international string
    let inputPhone = document.getElementById('driverWhatsApp').value.replace(/\s+/g, '');
    if (inputPhone.startsWith('0')) {
        inputPhone = '27' + inputPhone.slice(1);
    }
    
    // Format input into database simulation array
    let newTrip = {
        from: document.getElementById('offerFrom').value.trim(),
        to: document.getElementById('offerTo').value.trim(),
        via: document.getElementById('offerRoute').value.trim(),
        time: new Date(document.getElementById('offerDate').value).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' }),
        seats: document.getElementById('offerSeats').value,
        price: document.getElementById('offerPrice').value,
        phone: inputPhone
    };

    // Push into fake database
    mockTripsDatabase.unshift(newTrip);
    
    alert("🚀 Trip published successfully! Switch over to 'Find a Ride' and search your route to see your card list live.");
    document.getElementById('offerForm').reset();
    switchTab('seek-tab');
}