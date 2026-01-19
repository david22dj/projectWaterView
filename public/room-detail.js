/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


(() => {
    let chart = null;

    document.addEventListener("DOMContentLoaded", init);

    async function init() {
        const roomName = getRoomFromUrl();
        if (!roomName) return;

        const dateInput = document.getElementById("roomDate");
        const backLink = document.getElementById("backLink");

        const selectedDate = getDateFromUrl() || getToday();

        document.getElementById("roomTitle").textContent = roomName;
        dateInput.value = selectedDate;

        backLink.href = `rooms.html?date=${selectedDate}`;

        await loadAndRender(roomName, selectedDate);

        dateInput.addEventListener("change", async () => {
            const newDate = dateInput.value;
            backLink.href = `rooms.html?date=${newDate}`;
            await loadAndRender(roomName, newDate);
        });
    }

    async function loadAndRender(roomName, date) {
        const records = await loadRecords();
        const filtered = filterByRoomAndDate(records, roomName, date);
        const hourlyData = aggregateByHour(filtered);
        renderChart(hourlyData, date);
    }

    function getRoomFromUrl() {
        return new URLSearchParams(window.location.search).get("room");
    }

    function getDateFromUrl() {
        return new URLSearchParams(window.location.search).get("date");
    }

    function getToday() {
        return new Date().toISOString().slice(0, 10);
    }

    async function loadRecords() {
        const res = await fetch("/api/records");
        if (!res.ok) throw new Error("Chyba pri načítaní záznamov");
        return res.json();
    }

    function filterByRoomAndDate(records, roomName, date) {
        return records.filter(r =>
            r.cas.startsWith(date) &&
            r.miestnost_nazov === roomName
        );
    }

    function aggregateByHour(records) {
        const hours = Array(24).fill(0);

        records.forEach(r => {
            const hour = new Date(r.cas).getHours();
            hours[hour] += Number(r.hodnota);
        });

        return hours;
    }

    function renderChart(data, date) {
        const ctx = document.getElementById("hourChart");

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [{
                    label: "Spotreba (L)",
                    data: data,
                    backgroundColor: "#0077e4"
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Spotreba – ${date}`
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.raw.toFixed(1)} L`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Litrov"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Hodina"
                        }
                    }
                }
            }
        });
    }
})();
