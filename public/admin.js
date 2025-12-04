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
        content.innerHTML = `<h2>Miestnosti – spracujeme v ďalšom kroku</h2>`;
    }

    if (type === "measure") {
        content.innerHTML = `<h2>Miesta merania – spracujeme v ďalšom kroku</h2>`;
    }

    if (type === "sensors") {
        content.innerHTML = `<h2>Senzory – spracujeme v ďalšom kroku</h2>`;
    }

    if (type === "records") {
        content.innerHTML = `<h2>Záznamy – spracujeme v ďalšom kroku</h2>`;
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
