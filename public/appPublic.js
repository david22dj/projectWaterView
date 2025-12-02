document.getElementById("loginForm").addEventListener("submit", async (e) => {
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
});
