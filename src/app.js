/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import express from "express";
import db from "./db.js";
import PouzivatelRoutes from "./routes/PouzivatelRoutes.js";
import MiestnostRoutes from "./routes/MiestnostRoutes.js";
import MiestoMeraniaRoutes from "./routes/MiestoMeraniaRoutes.js";
import SensorRoutes from "./routes/SensorRoutes.js";
import ZaznamRoutes from "./routes/ZaznamRoutes.js";

import ProfileRoutes from "./routes/ProfileRoutes.js";
import session from "express-session";
import AuthRoutes from "./routes/AuthRoutes.js";
import FakturaRoutes from "./routes/FakturaRoutes.js";


const app = express();

app.use(express.json());

app.use(session({
    secret: "waterview-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    }
}));


//toto je pico w
let lastMessage = null;

app.set("setLastMessage", (msg) => {
    lastMessage = msg;
});

app.set("getLastMessage", () => lastMessage);


app.get("/", (req, res) => {
    res.send("Backend beží...");
});


app.use("/api", PouzivatelRoutes);
app.use("/api", MiestnostRoutes);
app.use("/api", MiestoMeraniaRoutes);
app.use("/api", SensorRoutes);
app.use("/api", ZaznamRoutes);
app.use("/api", AuthRoutes);
app.use("/api", ProfileRoutes);
app.use("/api", FakturaRoutes);
app.use(express.static("public"));


export default app;
