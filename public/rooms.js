/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


(() => {
    document.addEventListener("DOMContentLoaded", init);

    async function init() {
        try {
            const dateInput = document.getElementById("roomsDate");

            const today = new Date().toISOString().slice(0, 10);
            const selectedDate = getDateFromUrl() || today;

            dateInput.value = selectedDate;

            const [rooms, measurements, records] = await Promise.all([
                fetch("/api/rooms").then(r => r.json()),
                fetch("/api/measurements").then(r => r.json()),
                fetch("/api/records").then(r => r.json())
            ]);

            renderForDate(selectedDate, rooms, measurements, records);

            dateInput.addEventListener("change", () => {
                const newDate = dateInput.value;
                updateUrlDate(newDate);
                renderForDate(newDate, rooms, measurements, records);
            });

        } catch (err) {
            console.error("Chyba pri načítaní miestností:", err);
        }
    }

    function renderForDate(date, rooms, measurements, records) {
        const filteredRecords = records.filter(r => r.cas.startsWith(date));

        const roomsData = buildEmptyStructure(rooms, measurements);
        fillWithRecords(roomsData, filteredRecords);

        renderRooms(roomsData, date);
    }

    function buildEmptyStructure(rooms, measurements) {
        const data = {};

        rooms.forEach(room => {
            data[room.nazov] = {
                total: 0,
                places: {}
            };

            measurements
                .filter(m => m.id_miestnost === room.id_miestnost)
                .forEach(m => {
                    data[room.nazov].places[m.nazov] = 0;
                });
        });

        return data;
    }

    function fillWithRecords(structure, records) {
        records.forEach(r => {
            const room = r.miestnost_nazov;
            const place = r.meranie_nazov;
            const value = Number(r.hodnota);

            if (structure[room]) {
                structure[room].total += value;
                if (structure[room].places[place] !== undefined) {
                    structure[room].places[place] += value;
                }
            }
        });
    }

    function renderRooms(rooms, date) {
        const container = document.getElementById("roomsContainer");
        if (!container) return;

        container.innerHTML = "";

        Object.entries(rooms).forEach(([roomName, data]) => {
            const card = document.createElement("div");
            card.className = "room-card";
            card.style.cursor = "pointer";

            card.innerHTML = `
                <h3>${roomName}</h3>
                <p class="room-value">${data.total.toFixed(1)} L</p>
                <div class="room-places">
                    ${renderPlaces(data.places)}
                </div>
            `;

            card.addEventListener("click", () => {
                window.location.href =
                    `room-detail.html?room=${encodeURIComponent(roomName)}&date=${date}`;
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

    function getDateFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("date");
    }

    function updateUrlDate(date) {
        const url = new URL(window.location);
        url.searchParams.set("date", date);
        window.history.replaceState({}, "", url);
    }
})();
