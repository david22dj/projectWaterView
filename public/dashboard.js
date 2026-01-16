/*********************************
 *  DASHBOARD – ZÁKLADNÉ ŠTATISTIKY
 *********************************/

// po načítaní stránky
document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
});

async function loadDashboardStats() {
    try {
        const res = await fetch("/api/records");
        if (!res.ok) {
            console.error("Chyba pri načítaní záznamov");
            return;
        }

        const records = await res.json();

        const todayTotal = sumToday(records);
        const weekTotal = sumThisWeek(records);
        const monthTotal = sumThisMonth(records);

        // zapísanie do DOM
        setValue("todayValue", todayTotal);
        setValue("weekValue", weekTotal);
        setValue("monthValue", monthTotal);

    } catch (err) {
        console.error("Chyba dashboardu:", err);
    }
}

/*********************************
 *  POMOCNÉ FUNKCIE
 *********************************/

function setValue(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = `${value.toFixed(1)} L`;
    }
}

/*********************************
 *  VÝPOČTY
 *********************************/

// DNES
function sumToday(records) {
    const now = new Date();
    return records
        .filter(r => isSameDay(new Date(r.cas), now))
        .reduce((sum, r) => sum + Number(r.hodnota), 0);
}

// TENTO TÝŽDEŇ
function sumThisWeek(records) {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);

    return records
        .filter(r => {
            const d = new Date(r.cas);
            return d >= startOfWeek && d <= now;
        })
        .reduce((sum, r) => sum + Number(r.hodnota), 0);
}

// TENTO MESIAC
function sumThisMonth(records) {
    const now = new Date();

    return records
        .filter(r => {
            const d = new Date(r.cas);
            return d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, r) => sum + Number(r.hodnota), 0);
}

/*********************************
 *  DATUMOVÉ POMOCNÉ FUNKCIE
 *********************************/

function isSameDay(d1, d2) {
    return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
}

// začiatok týždňa (pondelok)
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 = nedeľa
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

/*********************************
 *  GRAF – TÝŽDENNÁ SPOTREBA
 *********************************/

async function loadWeeklyChart() {
    try {
        const res = await fetch("/api/records");
        if (!res.ok) return;

        const records = await res.json();

        const dailyTotals = getLast7DaysTotals(records);

        renderWeeklyChart(dailyTotals);

    } catch (err) {
        console.error("Chyba grafu:", err);
    }
}

// zavoláme po načítaní stránky
document.addEventListener("DOMContentLoaded", () => {
    loadWeeklyChart();
});

/*********************************
 *  AGREGÁCIA DÁT
 *********************************/

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
        const recordDate = new Date(r.cas);
        recordDate.setHours(0, 0, 0, 0);

        days.forEach(day => {
            if (recordDate.getTime() === day.date.getTime()) {
                day.total += Number(r.hodnota);
            }
        });
    });

    return days;
}

/*********************************
 *  RENDER GRAFU
 *********************************/

function renderWeeklyChart(data) {
    const ctx = document.getElementById("weeklyChart");
    if (!ctx) return;

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(d => d.label),
            datasets: [{
                label: "Spotreba (L)",
                data: data.map(d => d.total.toFixed(1)),
                backgroundColor: "#0077e4"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => value + " L"
                    }
                }
            }
        }
    });
}

/*********************************
 *  MIESTNOSTI – SPOTREBA DNES
 *********************************/

async function loadRoomsToday() {
    try {
        const res = await fetch("/api/records");
        if (!res.ok) return;

        const records = await res.json();

        const todayRooms = getTodayByRoom(records);
        renderRooms(todayRooms);

    } catch (err) {
        console.error("Chyba miestností:", err);
    }
}

// zavoláme po načítaní stránky
document.addEventListener("DOMContentLoaded", () => {
    loadRoomsToday();
});

/*********************************
 *  AGREGÁCIA PODĽA MIESTNOSTI
 *********************************/

function getTodayByRoom(records) {
    const today = new Date();
    const result = {};

    records.forEach(r => {
        const d = new Date(r.cas);
        if (isSameDay(d, today)) {
            const room = r.miestnost_nazov || "Neznáma miestnosť";
            result[room] = (result[room] || 0) + Number(r.hodnota);
        }
    });

    return result;
}

/*********************************
 *  RENDER MIESTNOSTÍ
 *********************************/

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


