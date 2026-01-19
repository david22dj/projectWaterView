/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


// ==========================
// SKRYŤ ADMIN ODKAZ V NAVIGÁCII
// ==========================
const navUser = JSON.parse(localStorage.getItem("user"));

if (navUser && navUser.rola !== "admin") {
    const adminNavItem = document.getElementById("adminNav");
    if (adminNavItem) adminNavItem.style.display = "none";
}

/*********************************
 *  LOGIN FORM HANDLING
 *********************************/
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorBox = document.getElementById("loginError");

        // klientská validácia
        if (!email.includes("@")) {
            errorBox.textContent = "Zadajte platný email.";
            return;
        }
        if (password.length < 4) {
            errorBox.textContent = "Heslo musí mať aspoň 4 znaky.";
            return;
        }

        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, heslo: password })
            });

            const data = await res.json();

            if (!res.ok) {
                errorBox.textContent = data.error || "Nesprávne prihlasovacie údaje.";
                return;
            }

            // uloženie info o užívateľovi
            localStorage.setItem("user", JSON.stringify(data));

            // redirect na hlavnú stránku
            window.location.href = "index.html";

        } catch (error) {
            console.error("Chyba pri pripájaní:", error);
            errorBox.textContent = "Chyba spojenia so serverom.";
        }
    });
}

/*********************************
 *  MOBILE HAMBURGER MENU
 *********************************/
const hamburgerBtn = document.getElementById("hamburgerBtn");
const topnavMenu = document.getElementById("topnavMenu");

if (hamburgerBtn && topnavMenu) {
    hamburgerBtn.addEventListener("click", () => {
        topnavMenu.classList.toggle("open");
    });
}

async function requireLogin() {
    const isLoginPage = window.location.pathname.endsWith("login.html") || document.getElementById("loginForm");
    if (isLoginPage) return;

    try {
        const res = await fetch("/api/auth/me", { credentials: "include" });

        if (!res.ok) {
            localStorage.removeItem("user");
            window.location.href = "login.html";
            return;
        }

        const user = await res.json();
        localStorage.setItem("user", JSON.stringify(user));

        const adminNavItem = document.getElementById("adminNav");
        if (adminNavItem && user.rola !== "admin") adminNavItem.style.display = "none";

        const isAdminPage = window.location.pathname.endsWith("admin.html");
        if (isAdminPage && user.rola !== "admin") {
            window.location.href = "index.html";
        }

    } catch (e) {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    }
}

requireLogin();
