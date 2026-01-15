import express from "express";
const router = express.Router();

router.post("/test-pico", (req, res) => {
    const { litres, timestamp, sensor_id } = req.body;

    const msg = {
        litres,
        timestamp,
        sensor_id,
        receivedAt: new Date().toISOString()
    };

    req.app.get("setLastMessage")(msg);

    console.log("PICO:", msg);
    res.json({ status: "OK" });
});

router.get("/test-pico", (req, res) => {
    res.json(req.app.get("getLastMessage")());
});


export default router;
