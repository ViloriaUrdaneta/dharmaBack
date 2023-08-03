import { connection, models } from "./src/db";
import { seedUsers } from "./src/env/seeds";
import app from "./src/app";
import http from 'http';
import { Server } from 'socket.io';

const { User } = models;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('Socket its alive!!!!!')
   io.emit('firstEvent', 'hello this is test')
});

connection
  .sync({ force: false })
  .then(() => {
    console.log("database connected");
    server.listen(3001, async () => {
      console.log("App is listening on port 3001!");

      const users = await User.findAll();
      if (users.length < 1) {
        await seedUsers();
      }
    });
  })
  .catch((err) => console.error(err));
