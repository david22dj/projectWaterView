import express from "express";
import testRoutes from "./routes/testRoutes.js";
import db from "./db.js";
import PouzivatelRoutes from "./routes/PouzivatelRoutes.js";
import MiestnostRoutes from "./routes/MiestnostRoutes.js";
import MiestoMeraniaRoutes from "./routes/MiestoMeraniaRoutes.js";
import SensorRoutes from "./routes/SensorRoutes.js";
import ZaznamRoutes from "./routes/ZaznamRoutes.js";



const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend beží...");
});

app.use("/api", testRoutes);
app.use("/api", PouzivatelRoutes);
app.use("/api", MiestnostRoutes);
app.use("/api", MiestoMeraniaRoutes);
app.use("/api", SensorRoutes);
app.use("/api", ZaznamRoutes);
app.use(express.static("public"));



export default app;
