/*********************************
 *  DASHBOARD – INIT
 *********************************/
document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
    loadWeeklyChart();
    loadRoomsToday();
});

/*********************************
 *  DASHBOARD – ŠTATISTIKY
 *********************************/
async function loadDashboardStats() {
    try {
        const res = await fetch("/api/records");
        if (!res.ok) throw new Error();

        const records = await res.json();

        setValue("todayValue", sumToday(records));
        setValue("weekValue", sumThisWeek(records));
        setValue("monthValue", sumThisMonth(records));

    } catch {
        setValue("todayValue", 0);
        setValue("weekValue", 0);
        setValue("monthValue", 0);
    }
}

function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = `${value.toFixed(1)} L`;
}

/*********************************
 *  VÝPOČTY
 *********************************/
function sumToday(records) {
    const now = new Date();
    return records
        .filter(r => isSameDay(new Date(r.cas), now))
        .reduce((s, r) => s + Number(r.hodnota), 0);
}

function sumThisWeek(records) {
    const now = new Date();
    const start = getStartOfWeek(now);

    return records
        .filter(r => {
            const d = new Date(r.cas);
            return d >= start && d <= now;
        })
        .reduce((s, r) => s + Number(r.hodnota), 0);
}

function sumThisMonth(records) {
    const now = new Date();

    return records
        .filter(r => {
            const d = new Date(r.cas);
            return d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear();
        })
        .reduce((s, r) => s + Number(r.hodnota), 0);
}

/*********************************
 *  DATUMY
 *********************************/
function isSameDay(d1, d2) {
    return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

/*********************************
 *  GRAF – TÝŽDEŇ
 *********************************/
async function loadWeeklyChart() {
    try {
        const res = await fetch("/api/records");
        if (!res.ok) throw new Error();

        const records = await res.json();
        const data = getLast7DaysTotals(records);
        renderWeeklyChart(data);

    } catch {
        renderWeeklyChart(getEmptyWeek());
    }
}

function getLast7DaysTotals(records) {
    const days = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);

        days.push({
            label: d.toLocaleDateString("sk-SK", { weekday: "short" }),
            date: d,
            total: 0
        });
    }

    records.forEach(r => {
        const rd = new Date(r.cas);
        rd.setHours(0, 0, 0, 0);

        days.forEach(day => {
            if (day.date.getTime() === rd.getTime()) {
                day.total += Number(r.hodnota);
            }
        });
    });

    return days;
}

function getEmptyWeek() {
    return Array.from({ length: 7 }, (_, i) => ({
        label: new Date(Date.now() - (6 - i) * 86400000)
            .toLocaleDateString("sk-SK", { weekday: "short" }),
        total: 0
    }));
}

function renderWeeklyChart(data) {
    const ctx = document.getElementById("weeklyChart");
    if (!ctx) return;

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(d => d.label),
            datasets: [{
                data: data.map(d => d.total.toFixed(1)),
                backgroundColor: "#0077e4"
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => v + " L" }
                }
            }
        }
    });
}

/*********************************
 *  MIESTNOSTI – DNES
 *********************************/
async function loadRoomsToday() {
    try {
        const [rooms, measurements, records] = await Promise.all([
            fetch("/api/rooms").then(r => r.json()),
            fetch("/api/measurements").then(r => r.json()),
            fetch("/api/records").then(r => r.json())
        ]);

        const todayRecords = records.filter(r =>
            isSameDay(new Date(r.cas), new Date())
        );

        const structure = {};

        rooms.forEach(room => {
            structure[room.nazov] = 0;
        });

        todayRecords.forEach(r => {
            if (structure[r.miestnost_nazov] !== undefined) {
                structure[r.miestnost_nazov] += Number(r.hodnota);
            }
        });

        renderRooms(structure);

    } catch (err) {
        console.error("Chyba miestností:", err);
    }
}

function renderRooms(data) {
    const container = document.getElementById("roomsGrid");
    if (!container) return;

    container.innerHTML = "";

    Object.entries(data).forEach(([room, value]) => {
        const card = document.createElement("div");
        card.className = "room-card";

        card.innerHTML = `
            <h3>${room}</h3>
            <p class="room-value">${value.toFixed(1)} L dnes</p>
        `;

        container.appendChild(card);
    });
}

