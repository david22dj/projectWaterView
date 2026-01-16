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
        body: JSON.stringify({ id: user.id_pouzivatel, email })
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
        body: JSON.stringify({
            id: user.id_pouzivatel,
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
