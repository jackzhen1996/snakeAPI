import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import {Server} from 'socket.io';
const io = new Server(server);
const port = 3001;
// dev port is 3001, prod is 3000

// const players: Array<String> = [];

interface Data {
  data: any,
  roomId: string
};

interface HostAndRoomId {
  host: string,
  roomId: string,
  players: string[]
};

interface GuestAndRoomId {
  guest: string,
  roomId: string
};

interface Obj {
  [key:string]: HostAndRoomId
};

let roomIds: Obj = {};

app.set('port', process.env.PORT || 3001);

io.on('connection', (socket:any)=>{
  console.log( `${socket.id} connected`);
  // console.log(`rooms: ${JSON.stringify(roomIds)}`)
  socket.on('disconnect', ()=>{

    // find the room that the host is in and remove that room
    for (const key in roomIds) {
      if (roomIds[key].host === socket.id) {
        delete roomIds[key];
        io.emit('hostLeft', true);
        console.log('host left');
        // console.log(roomIds);
        break;
      }
    }
    console.log(`${socket.id} disconnected`);
  });

  // creating room and automatically join
  socket.on('createRoom', (data: HostAndRoomId)=>{
    console.log(data);
    socket.join(data.roomId);
    roomIds[data.roomId] = {...data, players:[data.host]};
    io.to(data.roomId).emit('playerList', JSON.stringify(roomIds[data.roomId].players));
    io.to(data.roomId).emit('roomId', data.roomId);
  });

  // check if theres a request to join a room
  // check if that room exits, join the room and increment player count
  socket.on('joinRoom',(data: GuestAndRoomId)=>{
    if (roomIds[data.roomId] && roomIds[data.roomId].players.length <= 1) {
      socket.join(data.roomId);
      roomIds[data.roomId].players.push(data.guest);
      // console.log(roomIds[data.roomId])
      // send the play array and see who is player 1 or player 2
      io.to(data.roomId).emit('playerList', JSON.stringify(roomIds[data.roomId].players));
      io.to(data.roomId).emit('roomId', data.roomId);
      socket.to(data.roomId).emit('youAreP2', true);
    } else {
      if (!roomIds[data.roomId]) {
        io.to(data.roomId).emit('error', "This room doesn't exist");
      } else {
        io.to(data.roomId).emit('error', "The room is full");
      }
    }

  });

  // emit player 1 name to everyone
  socket.on('p1Name', (name:Data)=>{
    io.in(name.roomId).emit('p1Name', name.data);
  });

  // emit player 2 name to everyone
  socket.on('p2Name', (name:Data)=>{
    io.in(name.roomId).emit('p2Name', name.data);
  });

  // emit player 1 ready
  socket.on('p1Ready', (ready:Data)=>{
    console.log(ready)
    io.in(ready.roomId).emit('p1Ready', ready.data);
  });
  // emit player 2 ready
  socket.on('p2Ready', (ready:Data)=>{
    console.log(ready)
    io.in(ready.roomId).emit('p2Ready', ready.data);
  });

  // emit start game
  socket.on('start', (start:Data)=>{
    console.log(start)
    io.in(start.roomId).emit('start', start.data);
  });

  // emit player 1 position
  socket.on('p1Dir', (dir:Data)=>{
    io.in(dir.roomId).emit('p1Dir', dir.data);
  });
  // emit player 2 position
  socket.on('p2Dir', (dir:Data)=>{
    io.in(dir.roomId).emit('p2Dir', dir.data);
  });
  // emit food location
  socket.on('food', (pos:Data)=>{
    io.in(pos.roomId).emit('food', pos.data);
  });

  // emit game over
  socket.on('over', (over:Data)=>{
    io.in(over.roomId).emit('over', over.data);
  });

  socket.on('p1Color',(color:Data)=>{
    io.in(color.roomId).emit('p1Color',color.data);
  });

  socket.on('p2Color',(color:Data)=>{
    io.in(color.roomId).emit('p2Color',color.data);
  });

  socket.on('score1', (score:Data)=>{
    io.in(score.roomId).emit('score1', score.data);
  });

  socket.on('score2', (score:Data)=>{
    io.in(score.roomId).emit('score2', score.data);
  });

  socket.on('p1Pos', (pos:Data)=>{
    io.in(pos.roomId).emit('p1Pos');
  });

  socket.on('p2Pos', (pos:Data)=>{
    io.in(pos.roomId).emit('p2Pos');
  });
});


server.listen(app.get('port'), () => {
  console.log(`Snake server running on ${port}`)
})