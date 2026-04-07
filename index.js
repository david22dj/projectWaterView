/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/

import app from "./src/app.js";

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server beží na porte ${PORT}`);
});