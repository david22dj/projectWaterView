// ==========================
// OCHRANA ADMIN STRÁNKY
// ==========================
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.rola !== "admin") {
    window.location.href = "index.html";
}


/****************************************
 *  MODÁLNE OKNO
 ****************************************/
function showModal(html) {
    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");

    modal.innerHTML = `
        <div class="modal-box">
            ${html}
            <button class="modal-close">Zavrieť</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".modal-close").addEventListener("click", () => {
        modal.remove();
    });
}


/****************************************
 *  PREPÍNANIE TABOV
 ****************************************/
const tabs = document.querySelectorAll(".admin-tab");
const content = document.getElementById("adminContent");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelector(".admin-tab.active").classList.remove("active");
        tab.classList.add("active");

        loadAdminSection(tab.dataset.tab);
    });
});

// Načítanie default sekcie
loadAdminSection("users");


/****************************************
 *  HLAVNÁ FUNKCIA PRE ADMIN SEKCIU
 ****************************************/
async function loadAdminSection(type) {

    if (type === "users") {

        content.innerHTML = `
            <div class="admin-box">
                <button class="btn-add" id="addUserBtn">+ Pridať používateľa</button>

                <h2>Správa používateľov</h2>

                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Meno</th>
                            <th>Email</th>
                            <th>Rola</th>
                            <th>Akcie</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody"></tbody>
                </table>
            </div>
        `;

        loadUsers();

        document.getElementById("addUserBtn").addEventListener("click", showAddUserModal);
    }


    if (type === "rooms") {
        content.innerHTML = `
        <div class="admin-box">
            <button class="btn-add" id="addRoomBtn">+ Pridať miestnosť</button>

            <h2>Správa miestností</h2>

            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Názov</th>
                        <th>Akcie</th>
                    </tr>
                </thead>
                <tbody id="roomTableBody"></tbody>
            </table>
        </div>
    `;

        loadRooms();
        document.getElementById("addRoomBtn").addEventListener("click", showAddRoomModal);
    }


    if (type === "measure") {
        content.innerHTML = `
        <div class="admin-box">
            <button class="btn-add" id="addMeasureBtn">+ Pridať miesto merania</button>

            <h2>Správa miest merania</h2>

            <!-- FILTER PODĽA MIESTNOSTI -->
            <select id="roomFilter" class="admin-filter">
                <option value="">-- Všetky miestnosti --</option>
            </select>

            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Názov</th>
                        <th>Miestnosť</th>
                        <th>Akcie</th>
                    </tr>
                </thead>
                <tbody id="measureTableBody"></tbody>
            </table>
        </div>
    `;

        loadRoomsForFilter();

        loadMeasurements();

        document.getElementById("roomFilter").addEventListener("change", () => {
            const roomId = document.getElementById("roomFilter").value;
            loadMeasurements(roomId);
        });

        document.getElementById("addMeasureBtn")
            .addEventListener("click", showAddMeasureModal);
    }



    if (type === "sensors") {
        content.innerHTML = `
        <div class="admin-box">
            <button class="btn-add" id="addSensorBtn">+ Pridať senzor</button>

            <h2>Správa senzorov</h2>

            <!-- FILTER MIESTNOSŤ -->
            <select id="sensorRoomFilter" class="admin-filter">
                <option value="">-- Všetky miestnosti --</option>
            </select>

            <!-- FILTER MIESTO MERANIA -->
            <select id="sensorMeasureFilter" class="admin-filter">
                <option value="">-- Všetky miesta merania --</option>
            </select>

            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Miestnosť</th>
                        <th>Miesto merania</th>
                        <th>Typ</th>
                        <th>Jednotka</th>
                        <th>Popis</th>
                        <th>Akcie</th>
                    </tr>
                </thead>
                <tbody id="sensorTableBody"></tbody>
            </table>
        </div>
    `;

        loadSensorRooms();
        loadSensors();

        document.getElementById("sensorRoomFilter").addEventListener("change", onSensorRoomChange);
        document.getElementById("sensorMeasureFilter").addEventListener("change", () => {
            loadSensors(getSelectedSensorRoom(), getSelectedSensorMeasure());
        });

        document.getElementById("addSensorBtn")
            .addEventListener("click", showAddSensorModal);
    }



    if (type === "records") {
        content.innerHTML = `
        <div class="admin-box">
            <button class="btn-add" id="addRecordBtn">+ Pridať záznam</button>

            <h2>Správa záznamov</h2>

            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Čas</th>
                        <th>Miestnosť</th>
                        <th>Miesto merania</th>
                        <th>Senzor</th>
                        <th>Hodnota</th>
                        <th>Akcie</th>
                    </tr>
                </thead>
                <tbody id="recordTableBody"></tbody>
            </table>
        </div>
    `;

        loadRecords();
        document.getElementById("addRecordBtn").addEventListener("click", showAddRecordModal);
    }

}


/****************************************
 *  READ – Načíta používateľov
 ****************************************/
async function loadUsers() {
    const tbody = document.getElementById("userTableBody");
    const users = await fetch("/api/users").then(r => r.json());

    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.meno}</td>
            <td>${u.email}</td>
            <td>${u.rola}</td>
            <td>
                <span class="table-action" onclick="editUser(${u.id_pouzivatel}, '${u.meno}', '${u.email}', '${u.rola}')">Upraviť</span>
                 | 
                <span class="table-action delete" onclick="deleteUser(${u.id_pouzivatel})">Zmazať</span>
            </td>
        </tr>
    `).join("");
}

/****************************************
 *  READ – Načíta miestnosti
 ****************************************/
async function loadRooms() {
    const tbody = document.getElementById("roomTableBody");
    const rooms = await fetch("/api/rooms").then(r => r.json());

    tbody.innerHTML = rooms.map(r => `
        <tr>
            <td>${r.nazov}</td>
            <td>
                <span class="table-action" onclick="editRoom(${r.id_miestnost}, '${r.nazov}')">Upraviť</span>
                 | 
                <span class="table-action delete" onclick="deleteRoom(${r.id_miestnost})">Zmazať</span>
            </td>
        </tr>
    `).join("");
}


/****************************************
 *  READ – Načíta miesta merania
 ****************************************/
async function loadMeasurements(roomId = "") {
    const url = roomId
        ? `/api/measurements?roomId=${roomId}`
        : `/api/measurements`;

    const tbody = document.getElementById("measureTableBody");
    const data = await fetch(url).then(r => r.json());

    tbody.innerHTML = data.map(m => `
        <tr>
            <td>${m.nazov}</td>
            <td>${m.miestnost_nazov}</td>
            <td>
                <span class="table-action" onclick="editMeasure(${m.id_meranie}, '${m.nazov}', ${m.id_miestnost})">Upraviť</span>
                 | 
                <span class="table-action delete" onclick="deleteMeasure(${m.id_meranie})">Zmazať</span>
            </td>
        </tr>
    `).join("");
}

async function loadRoomsForFilter() {
    const select = document.getElementById("roomFilter");
    const rooms = await fetch("/api/rooms").then(r => r.json());

    select.innerHTML = `
        <option value="">-- Všetky miestnosti --</option>
        ${rooms.map(r => `<option value="${r.id_miestnost}">${r.nazov}</option>`).join("")}
    `;
}

function getSelectedRoomId() {
    const select = document.getElementById("roomFilter");
    return select ? select.value : "";
}


/****************************************
 *  READ – Načíta senzory
 ****************************************/
async function loadSensors(roomId = "", measureId = "") {
    let url = "/api/sensors";

    if (measureId) {
        url += `?measureId=${measureId}`;
    } else if (roomId) {
        url += `?roomId=${roomId}`;
    }

    const tbody = document.getElementById("sensorTableBody");
    const data = await fetch(url).then(r => r.json());

    tbody.innerHTML = data.map(s => `
        <tr>
            <td>${s.miestnost_nazov}</td>
            <td>${s.meranie_nazov}</td>
            <td>${s.typ}</td>
            <td>${s.jednotka}</td>
            <td>${s.popis ?? ""}</td>
            <td>
                <span class="table-action" onclick="editSensor(${s.id_sensor}, ${s.id_meranie}, '${s.typ}', '${s.jednotka}', '${(s.popis ?? "").replace(/'/g, "\\'")}')">Upraviť</span>
                 |
                <span class="table-action delete" onclick="deleteSensor(${s.id_sensor})">Zmazať</span>
            </td>
        </tr>
    `).join("");
}

async function loadSensorRooms() {
    const select = document.getElementById("sensorRoomFilter");
    const rooms = await fetch("/api/rooms").then(r => r.json());

    select.innerHTML = `
        <option value="">-- Všetky miestnosti --</option>
        ${rooms.map(r => `<option value="${r.id_miestnost}">${r.nazov}</option>`).join("")}
    `;
}

async function onSensorRoomChange() {
    const roomId = getSelectedSensorRoom();

    const measureSelect = document.getElementById("sensorMeasureFilter");

    if (!roomId) {
        measureSelect.innerHTML = `<option value="">-- Všetky miesta merania --</option>`;
        loadSensors();
        return;
    }

    const measures = await fetch(`/api/measurements?roomId=${roomId}`).then(r => r.json());

    measureSelect.innerHTML = `
        <option value="">-- Všetky miesta merania --</option>
        ${measures.map(m => `<option value="${m.id_meranie}">${m.nazov}</option>`).join("")}
    `;

    loadSensors(roomId);
}

function getSelectedSensorRoom() {
    const el = document.getElementById("sensorRoomFilter");
    return el ? el.value : "";
}

function getSelectedSensorMeasure() {
    const el = document.getElementById("sensorMeasureFilter");
    return el ? el.value : "";
}



/****************************************
 *  READ – Načíta záznamy
 ****************************************/
async function loadRecords() {
    const tbody = document.getElementById("recordTableBody");
    const data = await fetch("/api/records").then(r => r.json());

    tbody.innerHTML = data.map(z => `
        <tr>
            <td>${z.cas}</td>
            <td>${z.miestnost_nazov}</td>
            <td>${z.meranie_nazov}</td>
            <td>${z.sensor_typ} (${z.jednotka})</td>
            <td>${z.hodnota}</td>
            <td>
                <span class="table-action delete" onclick="deleteRecord(${z.id_zaznam})">
                    Zmazať
                </span>
            </td>
        </tr>
    `).join("");
}



/****************************************
 *  CREATE – MODÁLNE OKNO "PRIDAŤ POUŽÍVATEĽA"
 ****************************************/
function showAddUserModal() {
    showModal(`
        <h3>Pridať používateľa</h3>

        <div class="error-box" id="createUserError"></div>

        <input id="newMeno" placeholder="Meno">
        <input id="newEmail" placeholder="Email">
        <input id="newHeslo" placeholder="Heslo" type="password">

        <select id="newRola">
            <option value="admin">Admin</option>
            <option value="user">Používateľ</option>
        </select>

        <button id="createUserBtn" class="btn-add">Vytvoriť</button>
    `);

    // klik na vytvoriť
    document.getElementById("createUserBtn").addEventListener("click", createUser);
}


/****************************************
 *  CREATE – VALIDÁCIA + ODOŠLANIE
 ****************************************/
async function createUser() {
    const meno = newMeno.value.trim();
    const email = newEmail.value.trim();
    const heslo = newHeslo.value.trim();
    const rola = newRola.value;
    const errorBox = document.getElementById("createUserError");

    errorBox.textContent = "";

    // --------- VALIDÁCIA ---------
    if (!meno) {
        errorBox.textContent = "Zadajte meno.";
        return;
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
        errorBox.textContent = "Zadajte platný email.";
        return;
    }
    if (!heslo || heslo.length < 4) {
        errorBox.textContent = "Heslo musí mať aspoň 4 znaky.";
        return;
    }

    // --------- ODOŠLANIE NA BACKEND ---------
    const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meno, email, heslo, rola })
    });

    const data = await res.json();

    if (!res.ok) {
        // Toto chytí UNIQUE email chybu
        errorBox.textContent = data.error || "Chyba pri ukladaní používateľa.";
        return;
    }

    // --------- ÚSPECH ---------
    document.querySelector(".modal-overlay").remove();
    loadUsers();
}


/****************************************
 *  UPDATE – MODÁLNE OKNO "UPRAVIŤ POUŽÍVATEĽA"
 ****************************************/
function editUser(id, meno, email, rola) {
    showModal(`
        <h3>Upraviť používateľa</h3>

        <div class="error-box" id="editUserError"></div>

        <input id="editMeno" value="${meno}">
        <input id="editEmail" value="${email}">

        <select id="editRola">
            <option value="admin" ${rola === "admin" ? "selected" : ""}>Admin</option>
            <option value="user" ${rola === "user" ? "selected" : ""}>Používateľ</option>
        </select>

        <button id="saveUserBtn" class="btn-add">Uložiť</button>
    `);

    document.getElementById("saveUserBtn").addEventListener("click", async () => {
        const newName = editMeno.value.trim();
        const newEmail = editEmail.value.trim();
        const newRole = editRola.value;
        const errorBox = document.getElementById("editUserError");

        errorBox.textContent = "";

        if (!newName) {
            errorBox.textContent = "Zadajte meno.";
            return;
        }
        if (!newEmail.includes("@")) {
            errorBox.textContent = "Zadajte platný email.";
            return;
        }

        const res = await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                meno: newName,
                email: newEmail,
                rola: newRole
            })
        });

        const data = await res.json();

        if (!res.ok) {
            errorBox.textContent = data.error || "Chyba pri úprave používateľa.";
            return;
        }

        document.querySelector(".modal-overlay").remove();
        loadUsers();
    });
}


/****************************************
 *  DELETE – ZMAZAŤ POUŽÍVATEĽA
 ****************************************/
async function deleteUser(id) {
    if (!confirm("Naozaj chcete zmazať používateľa?")) return;

    await fetch(`/api/users/${id}`, {
        method: "DELETE"
    });

    loadUsers();
}

/****************************************
 *  CREATE – MODÁLNE OKNO "PRIDAŤ MIESTNOSŤ"
 ****************************************/
function showAddRoomModal() {
    showModal(`
        <h3>Pridať miestnosť</h3>

        <div class="error-box" id="createRoomError"></div>

        <input id="newRoomName" placeholder="Názov miestnosti">

        <button id="createRoomBtn" class="btn-add">Vytvoriť</button>
    `);

    document.getElementById("createRoomBtn").addEventListener("click", createRoom);
}


async function createRoom() {
    const nazov = newRoomName.value.trim();
    const errorBox = document.getElementById("createRoomError");

    errorBox.textContent = "";

    if (!nazov) {
        errorBox.textContent = "Zadajte názov miestnosti.";
        return;
    }

    const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nazov })
    });

    const data = await res.json();

    if (!res.ok) {
        errorBox.textContent = data.error || "Chyba pri vytváraní miestnosti.";
        return;
    }

    document.querySelector(".modal-overlay").remove();
    loadRooms();
}

/****************************************
 *  UPDATE – UPRAVIŤ MIESTNOSŤ
 ****************************************/
function editRoom(id, nazov) {
    showModal(`
        <h3>Upraviť miestnosť</h3>

        <div class="error-box" id="editRoomError"></div>

        <input id="editRoomName" value="${nazov}">

        <button id="saveRoomBtn" class="btn-add">Uložiť</button>
    `);

    document.getElementById("saveRoomBtn").addEventListener("click", async () => {
        const newName = editRoomName.value.trim();
        const errorBox = document.getElementById("editRoomError");

        errorBox.textContent = "";

        if (!newName) {
            errorBox.textContent = "Zadajte názov miestnosti.";
            return;
        }

        const res = await fetch(`/api/rooms/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nazov: newName })
        });

        const data = await res.json();

        if (!res.ok) {
            errorBox.textContent = data.error || "Chyba pri úprave miestnosti.";
            return;
        }

        document.querySelector(".modal-overlay").remove();
        loadRooms();
    });
}

/****************************************
 *  DELETE – ZMAZAŤ MIESTNOSŤ
 ****************************************/
async function deleteRoom(id) {
    if (!confirm("Naozaj chcete zmazať miestnosť?")) return;

    await fetch(`/api/rooms/${id}`, {
        method: "DELETE"
    });

    loadRooms();
}

/****************************************
 *  CREATE – MODÁLNE OKNO "PRIDAŤ MIESTO MERANIA"
 ****************************************/
async function showAddMeasureModal() {

    // načítame miestnosti pre select
    const rooms = await fetch("/api/rooms").then(r => r.json());

    showModal(`
        <h3>Pridať miesto merania</h3>

        <div class="error-box" id="createMeasureError"></div>

        <input id="newMeasureName" placeholder="Názov miesta merania">

        <select id="newMeasureRoom">
            <option value="">-- Vyber miestnosť --</option>
            ${rooms.map(r => `<option value="${r.id_miestnost}">${r.nazov}</option>`).join("")}
        </select>

        <button id="createMeasureBtn" class="btn-add">Vytvoriť</button>
    `);

    document.getElementById("createMeasureBtn")
        .addEventListener("click", createMeasurement);
}

async function createMeasurement() {
    const nazov = newMeasureName.value.trim();
    const id_miestnost = newMeasureRoom.value;
    const errorBox = document.getElementById("createMeasureError");

    errorBox.textContent = "";

    if (!nazov) {
        errorBox.textContent = "Zadajte názov miesta merania.";
        return;
    }

    if (!id_miestnost) {
        errorBox.textContent = "Vyberte miestnosť.";
        return;
    }

    const res = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nazov, id_miestnost })
    });

    const data = await res.json();

    if (!res.ok) {
        errorBox.textContent = data.error || "Chyba pri vytváraní miesta merania.";
        return;
    }

    document.querySelector(".modal-overlay").remove();
    loadMeasurements(getSelectedRoomId());
}

/****************************************
 *  UPDATE – UPRAVIŤ MIESTO MERANIA
 ****************************************/
async function editMeasure(id, nazov, roomId) {

    const rooms = await fetch("/api/rooms").then(r => r.json());

    showModal(`
        <h3>Upraviť miesto merania</h3>

        <div class="error-box" id="editMeasureError"></div>

        <input id="editMeasureName" value="${nazov}">

        <select id="editMeasureRoom">
            ${rooms.map(r => `
                <option value="${r.id_miestnost}" ${r.id_miestnost === roomId ? "selected" : ""}>
                    ${r.nazov}
                </option>
            `).join("")}
        </select>

        <button id="saveMeasureBtn" class="btn-add">Uložiť</button>
    `);

    document.getElementById("saveMeasureBtn").addEventListener("click", async () => {
        const newName = editMeasureName.value.trim();
        const newRoom = editMeasureRoom.value;
        const errorBox = document.getElementById("editMeasureError");

        errorBox.textContent = "";

        if (!newName) {
            errorBox.textContent = "Zadajte názov miesta merania.";
            return;
        }

        const res = await fetch(`/api/measurements/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nazov: newName,
                id_miestnost: newRoom
            })
        });

        const data = await res.json();

        if (!res.ok) {
            errorBox.textContent = data.error || "Chyba pri úprave miesta merania.";
            return;
        }

        document.querySelector(".modal-overlay").remove();
        loadMeasurements(getSelectedRoomId());
    });
}


/****************************************
 *  DELETE – ZMAZAŤ MIESTO MERANIA
 ****************************************/
async function deleteMeasure(id) {
    if (!confirm("Naozaj chcete zmazať miesto merania?")) return;

    await fetch(`/api/measurements/${id}`, {
        method: "DELETE"
    });

    loadMeasurements(getSelectedRoomId());
}


/****************************************
 *  CREATE – MODÁLNE OKNO "PRIDAŤ SENZOR"
 ****************************************/
async function showAddSensorModal() {
    const roomSelect = document.getElementById("sensorRoomFilter");
    const measureSelect = document.getElementById("sensorMeasureFilter");

    const selectedRoom = roomSelect ? roomSelect.value : "";
    const selectedMeasure = measureSelect ? measureSelect.value : "";

    let url = "/api/measurements";

// ak je vybrané konkrétne miesto merania → IBA TO
    if (selectedMeasure) {
        url = `/api/measurements?measureId=${selectedMeasure}`;
    }
// inak ak je vybraná miestnosť → IBA JEJ MIESTA
    else if (selectedRoom) {
        url = `/api/measurements?roomId=${selectedRoom}`;
    }

    const measures = await fetch(url).then(r => r.json());

    showModal(`
        <h3>Pridať senzor</h3>

        <div class="error-box" id="createSensorError"></div>

        <select id="newSensorMeasure">
            <option value="">-- Vyber miesto merania --</option>
            ${measures.map(m => `<option value="${m.id_meranie}">${m.nazov} (${m.miestnost_nazov})</option>`).join("")}
        </select>

        <input id="newSensorType" placeholder="Typ (napr. prietok)">
        <input id="newSensorUnit" placeholder="Jednotka (napr. l)">
        <input id="newSensorDesc" placeholder="Popis (voliteľné)">

        <button id="createSensorBtn" class="btn-add">Vytvoriť</button>
    `);

    document.getElementById("createSensorBtn").addEventListener("click", createSensor);
}


async function createSensor() {
    const id_meranie = newSensorMeasure.value;
    const typ = newSensorType.value.trim();
    const jednotka = newSensorUnit.value.trim();
    const popis = newSensorDesc.value.trim();
    const errorBox = document.getElementById("createSensorError");

    errorBox.textContent = "";

    if (!id_meranie) {
        errorBox.textContent = "Vyberte miesto merania.";
        return;
    }
    if (!typ) {
        errorBox.textContent = "Zadajte typ senzora.";
        return;
    }
    if (!jednotka) {
        errorBox.textContent = "Zadajte jednotku.";
        return;
    }

    const res = await fetch("/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_meranie, typ, jednotka, popis })
    });

    const data = await res.json();

    if (!res.ok) {
        errorBox.textContent = data.error || "Chyba pri vytváraní senzora.";
        return;
    }

    document.querySelector(".modal-overlay").remove();
    loadSensors(
        getSelectedSensorRoom(),
        getSelectedSensorMeasure()
    );
}


/****************************************
 *  UPDATE – UPRAVIŤ SENZOR
 ****************************************/
async function editSensor(id, id_meranie, typ, jednotka, popis) {
    const measures = await fetch("/api/measurements").then(r => r.json());

    showModal(`
        <h3>Upraviť senzor</h3>

        <div class="error-box" id="editSensorError"></div>

        <select id="editSensorMeasure">
            ${measures.map(m => `
                <option value="${m.id_meranie}" ${m.id_meranie === id_meranie ? "selected" : ""}>
                    ${m.nazov} (${m.miestnost_nazov})
                </option>
            `).join("")}
        </select>

        <input id="editSensorType" value="${typ}">
        <input id="editSensorUnit" value="${jednotka}">
        <input id="editSensorDesc" value="${popis ?? ""}">

        <button id="saveSensorBtn" class="btn-add">Uložiť</button>
    `);

    document.getElementById("saveSensorBtn").addEventListener("click", async () => {
        const newMer = editSensorMeasure.value;
        const newType = editSensorType.value.trim();
        const newUnit = editSensorUnit.value.trim();
        const newDesc = editSensorDesc.value.trim();
        const errorBox = document.getElementById("editSensorError");

        errorBox.textContent = "";

        if (!newMer) { errorBox.textContent = "Vyberte miesto merania."; return; }
        if (!newType) { errorBox.textContent = "Zadajte typ senzora."; return; }
        if (!newUnit) { errorBox.textContent = "Zadajte jednotku."; return; }

        const res = await fetch(`/api/sensors/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_meranie: newMer, typ: newType, jednotka: newUnit, popis: newDesc })
        });

        const data = await res.json();

        if (!res.ok) {
            errorBox.textContent = data.error || "Chyba pri úprave senzora.";
            return;
        }

        document.querySelector(".modal-overlay").remove();
        loadSensors(
            getSelectedSensorRoom(),
            getSelectedSensorMeasure()
        );
    });
}


/****************************************
 *  DELETE – ZMAZAŤ SENZOR
 ****************************************/
async function deleteSensor(id) {
    if (!confirm("Naozaj chcete zmazať senzor?")) return;

    await fetch(`/api/sensors/${id}`, {
        method: "DELETE"
    });

    loadSensors(
        getSelectedSensorRoom(),
        getSelectedSensorMeasure()
    );
}

/****************************************
 *  CREATE – MODÁLNE OKNO "PRIDAŤ ZÁZNAM"
 ****************************************/
async function showAddRecordModal() {

    const sensors = await fetch("/api/sensors").then(r => r.json());

    showModal(`
        <h3>Pridať záznam</h3>

        <div class="error-box" id="createRecordError"></div>

        <select id="newRecordSensor">
            <option value="">-- Vyber senzor --</option>
            ${sensors.map(s => `
                <option value="${s.id_sensor}">
                    ${s.meranie_nazov} – ${s.typ} (${s.jednotka})
                </option>
            `).join("")}
        </select>

        <input id="newRecordValue" type="number" step="0.01" placeholder="Hodnota">
        <input id="newRecordTime" type="datetime-local">

        <button id="createRecordBtn" class="btn-add">Vytvoriť</button>
    `);

    document.getElementById("createRecordBtn")
        .addEventListener("click", createRecord);
}


async function createRecord() {
    const id_sensor = newRecordSensor.value;
    const hodnota = newRecordValue.value;
    const cas = newRecordTime.value;
    const errorBox = document.getElementById("createRecordError");

    errorBox.textContent = "";

    if (!id_sensor) {
        errorBox.textContent = "Vyberte senzor.";
        return;
    }

    if (hodnota === "" || isNaN(hodnota)) {
        errorBox.textContent = "Zadajte číselnú hodnotu.";
        return;
    }

    if (!cas) {
        errorBox.textContent = "Zadajte čas záznamu.";
        return;
    }

    // datetime-local → SQL DATETIME
    const sqlTime = cas.replace("T", " ");

    const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_sensor,
            hodnota,
            cas: sqlTime
        })
    });

    const data = await res.json();

    if (!res.ok) {
        errorBox.textContent = data.error || "Chyba pri vytváraní záznamu.";
        return;
    }

    document.querySelector(".modal-overlay").remove();
    loadRecords();
}


/****************************************
 *  DELETE – ZMAZAŤ ZÁZNAM
 ****************************************/
async function deleteRecord(id) {
    if (!confirm("Naozaj chcete zmazať záznam?")) return;

    await fetch(`/api/records/${id}`, {
        method: "DELETE"
    });

    loadRecords();
}
