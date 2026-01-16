(() => {
    document.addEventListener("DOMContentLoaded", init);

    async function init() {
        try {
            const records = await loadRecords();
            const todayRecords = filterToday(records);
            const roomsData = aggregateRooms(todayRecords);
            renderRooms(roomsData);
        } catch (err) {
            console.error("Chyba pri načítaní miestností:", err);
        }
    }

    async function loadRecords() {
        const res = await fetch("/api/records");
        if (!res.ok) throw new Error("Nepodarilo sa načítať záznamy");
        return res.json();
    }

    function filterToday(records) {
        const today = new Date().toISOString().slice(0, 10);
        return records.filter(r => r.cas.startsWith(today));
    }

    function aggregateRooms(records) {
        const rooms = {};

        records.forEach(r => {
            const room = r.miestnost_nazov;
            const place = r.meranie_nazov;
            const value = Number(r.hodnota);

            if (!rooms[room]) {
                rooms[room] = {
                    total: 0,
                    places: {}
                };
            }

            rooms[room].total += value;

            if (!rooms[room].places[place]) {
                rooms[room].places[place] = 0;
            }

            rooms[room].places[place] += value;
        });

        return rooms;
    }

    function renderRooms(rooms) {
        const container = document.getElementById("roomsContainer");
        if (!container) return;

        container.innerHTML = "";

        Object.entries(rooms).forEach(([roomName, data]) => {
            const card = document.createElement("div");
            card.className = "room-card";
            card.style.cursor = "pointer";

            card.innerHTML = `
                <h3>${roomName}</h3>
                <p class="room-value">${data.total.toFixed(1)} L dnes</p>
                <div class="room-places">
                    ${renderPlaces(data.places)}
                </div>
            `;

            card.addEventListener("click", () => {
                window.location.href = `room-detail.html?room=${encodeURIComponent(roomName)}`;
            });

            container.appendChild(card);
        });
    }

    function renderPlaces(places) {
        return Object.entries(places)
            .map(([name, value]) => `
                <div class="room-place">
                    <span>${name}</span>
                    <span>${value.toFixed(1)} L</span>
                </div>
            `)
            .join("");
    }
})();
