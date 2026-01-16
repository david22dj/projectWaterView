(() => {
    document.addEventListener("DOMContentLoaded", init);

    async function init() {
        const roomName = getRoomFromUrl();
        if (!roomName) return;

        document.getElementById("roomTitle").textContent = roomName;

        const records = await loadRecords();
        const todayRoomRecords = filterTodayByRoom(records, roomName);
        const hourlyData = aggregateByHour(todayRoomRecords);

        renderChart(hourlyData);
    }

    function getRoomFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("room");
    }

    async function loadRecords() {
        const res = await fetch("/api/records");
        if (!res.ok) throw new Error("Chyba pri načítaní záznamov");
        return res.json();
    }

    function filterTodayByRoom(records, roomName) {
        const today = new Date().toISOString().slice(0, 10);

        return records.filter(r =>
            r.cas.startsWith(today) &&
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

    function renderChart(data) {
        const ctx = document.getElementById("hourChart");

        new Chart(ctx, {
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
