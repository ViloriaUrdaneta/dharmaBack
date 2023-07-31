import { connection, models } from "./src/db";
import app from "./src/app";
import { seedUsers } from "./src/env/seeds";

const { User } = models;

connection
  .sync({ force: false })
  .then(() => {
    console.log("database connected");
    app.listen(3001, async () => {
      console.log("App is listening on port 3001!");

      const users = await User.findAll();
      if (users.length < 1) {
        await seedUsers();
      }
    });
  })
  .catch((err) => console.error(err));
