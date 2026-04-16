require("dotenv").config();

const app = require("./src/app");
const initDB = require("./src/utils/initDB");

const PORT = 5000;

async function start() {
  await initDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
start();
