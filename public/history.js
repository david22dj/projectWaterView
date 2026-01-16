const dateInput = document.getElementById("historyDate");
const tbody = document.getElementById("historyTableBody");

// dnešný dátum ako default
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

// načítanie dát pri štarte
loadHistory(today);

// zmena dátumu
dateInput.addEventListener("change", () => {
    loadHistory(dateInput.value);
});

async function loadHistory(date) {
    tbody.innerHTML = "<tr><td colspan='5'>Načítavam...</td></tr>";

    try {
        const res = await fetch(`/api/records?date=${date}`);
        const data = await res.json();

        if (!data.length) {
            tbody.innerHTML = "<tr><td colspan='5'>Žiadne záznamy</td></tr>";
            return;
        }

        tbody.innerHTML = data.map(z => `
            <tr>
                <td>${formatTime(z.cas)}</td>
                <td>${z.miestnost_nazov}</td>
                <td>${z.meranie_nazov}</td>
                <td>${z.sensor_typ}</td>
                <td>${Number(z.hodnota).toFixed(2)}</td>
            </tr>
        `).join("");

    } catch (err) {
        console.error(err);
        tbody.innerHTML = "<tr><td colspan='5'>Chyba pri načítaní dát</td></tr>";
    }
}

function formatTime(sqlDate) {
    const d = new Date(sqlDate);
    return d.toLocaleTimeString("sk-SK", {
        hour: "2-digit",
        minute: "2-digit"
    });
}
