/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


async function checkAuth() {
    const res = await fetch("/api/auth/me", {
        credentials: "include"
    });

    if (!res.ok) {
        window.location.href = "login.html";
    }
}

checkAuth();

const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("emailInput").value = user.email;

document.getElementById("saveEmailBtn").addEventListener("click", async () => {
    const email = emailInput.value.trim();
    emailError.textContent = "";

    if (!email.includes("@")) {
        emailError.textContent = "Neplatný email.";
        return;
    }

    const res = await fetch("/api/profile/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) {
        emailError.textContent = data.error;
        return;
    }

    user.email = email;
    localStorage.setItem("user", JSON.stringify(user));
    alert("Email zmenený.");
});

document.getElementById("savePasswordBtn").addEventListener("click", async () => {
    const oldP = oldPassword.value;
    const newP = newPassword.value;
    const confirmP = confirmPassword.value;
    passwordError.textContent = "";

    if (newP.length < 4) {
        passwordError.textContent = "Heslo musí mať aspoň 4 znaky.";
        return;
    }

    if (newP !== confirmP) {
        passwordError.textContent = "Heslá sa nezhodujú.";
        return;
    }

    const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            oldPassword: oldP,
            newPassword: newP
        })
    });

    const data = await res.json();
    if (!res.ok) {
        passwordError.textContent = data.error;
        return;
    }

    alert("Heslo zmenené.");
    oldPassword.value = newPassword.value = confirmPassword.value = "";
});


const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            localStorage.removeItem("user");
            window.location.href = "login.html";
        } catch (e) {
            const msg = document.getElementById("logoutMsg");
            if (msg) msg.textContent = "Chyba pri odhlasovaní.";
        }
    });
}
