/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import bcrypt from "bcrypt";
import db from "../db.js";

async function seed() {
    const adminPassword = await bcrypt.hash("david", 10);
    const userPassword = await bcrypt.hash("martin", 10);

    db.run(
        `INSERT INTO Pouzivatel (meno, email, heslo, rola)
         VALUES (?, ?, ?, ?)`,
        ["david", "daviddjjurik@gmail.com", adminPassword, "admin"],
        () => console.log("Admin vytvorený")
    );

    db.run(
        `INSERT INTO Pouzivatel (meno, email, heslo, rola)
         VALUES (?, ?, ?, ?)`,
        ["martin", "matdadcol@gmail.com", userPassword, "user"],
        () => console.log("User vytvorený")
    );
}

seed();
