/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import sqlite3 from "sqlite3";
import { readFileSync } from "fs";
import { join } from "path";

// cesta k databáze
const dbPath = join(process.cwd(), "data", "database.db");

// otvorenie databázy (ak neexistuje, vytvorí sa)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Chyba pri otváraní databázy:", err.message);
    } else {
        console.log("Databáza otvorená:", dbPath);
    }
});

// načítanie schémy (SQL)
const schemaPath = join(process.cwd(), "sql", "schema.sql");
const schema = readFileSync(schemaPath, "utf-8");

// vykonanie SQL schémy — vytvorenie tabuliek
db.exec(schema, (err) => {
    if (err) {
        console.error("Chyba pri vytváraní tabuliek:", err.message);
    } else {
        console.log("Tabuľky úspešne vytvorené alebo existujú.");
    }
});

// exportujeme db objekt, aby ho mohli používať modely
export default db;
