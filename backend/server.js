require("dotenv").config();

const app = require("./src/app");
const initDB = require("./src/utils/initDB");

const PORT = process.env.PORT || 5000; // ✅ FIX

async function start() {
  await initDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
