/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


document.addEventListener("DOMContentLoaded", () => {
    loadInvoices();
});

const table = document.getElementById("invoiceTable");
const errorBox = document.getElementById("invoiceError");

/* ======================
   LOAD
====================== */
async function loadInvoices() {
    table.innerHTML = "<tr><td colspan='3'>Načítavam...</td></tr>";

    try {
        const res = await fetch("/api/faktury", {
            credentials: "include"
        });
        const data = await res.json();

        if (!data.length) {
            table.innerHTML = "<tr><td colspan='3'>Žiadne faktúry</td></tr>";
            return;
        }

        table.innerHTML = data.map(f => `
            <tr>
                <td>${f.povodny_nazov}</td>
                <td>${formatDate(f.datum_uploadu)}</td>
                <td>
                    <a href="/api/faktury/${f.id_faktura}/download" target="_blank">
                        Stiahnuť
                    </a>
                    |
                    <span class="table-action" onclick="deleteInvoice(${f.id_faktura})">
                        Zmazať
                    </span>
                </td>
            </tr>
        `).join("");

    } catch (e) {
        table.innerHTML = "<tr><td colspan='3'>Chyba</td></tr>";
    }
}

/* ======================
   UPLOAD
====================== */
document.getElementById("uploadInvoiceBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("invoiceFile");
    errorBox.textContent = "";

    if (!fileInput.files.length) {
        errorBox.textContent = "Vyberte súbor.";
        return;
    }

    const file = fileInput.files[0];

    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
        errorBox.textContent = "Nepovolený formát.";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        errorBox.textContent = "Max. veľkosť je 5 MB.";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("/api/faktury", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const data = await res.json();
        if (!res.ok) {
            errorBox.textContent = data.error;
            return;
        }

        fileInput.value = "";
        loadInvoices();

    } catch (e) {
        errorBox.textContent = "Chyba pri nahrávaní.";
    }
});

/* ======================
   DELETE
====================== */
async function deleteInvoice(id) {
    if (!confirm("Naozaj zmazať faktúru?")) return;

    await fetch(`/api/faktury/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    loadInvoices();
}

/* ======================
   HELPERS
====================== */
function formatDate(d) {
    return new Date(d).toLocaleDateString("sk-SK");
}
