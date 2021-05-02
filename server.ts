import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import {Server} from 'socket.io';
const io = new Server(server);
const port = 3000;

app.set('port', process.env.PORT || 3000);

io.on('connection', (socket:any)=>{
  console.log( `${socket.id} connected`);
  socket.on('disconnect', ()=>{
    console.log('user disconnected')
  });

  // emit player 1 name to everyone
  socket.on('p1Name', (name:string)=>{
    io.emit('p1Name', name);
  });

  // emit player 2 name to everyone
  socket.on('p2Name', (name:string)=>{
    io.emit('p2Name', name);
  });

  // emit player 1 ready
  socket.on('p1Ready', (ready:boolean)=>{
    console.log(`p1 is ${ready}`)
    io.emit('p1Ready', ready);
  });
  // emit player 2 ready
  socket.on('p2Ready', (ready:boolean)=>{
    console.log(`p2 is ${ready}`)
    io.emit('p2Ready', ready);
  });

  // emit start game
  socket.on('start', (start:boolean)=>{
    console.log(`start game!`)
    io.emit('start', start);
  });

  // emit player 1 position
  socket.on('p1Dir', (dir:string)=>{
    io.emit('p1Dir', dir);
  });
  // emit player 2 position
  socket.on('p2Dir', (dir:string)=>{
    io.emit('p2Dir', dir);
  });
  // emit food location
  socket.on('food', (pos:string)=>{
    console.log('pos is ' + pos )
    io.emit('food', pos);
  });

  // emit game over
  socket.on('over', (over:boolean)=>{
    io.emit('over', over);
  });

  socket.on('p1Color',(color:string)=>{
    io.emit('p1Color',color);
  });

  socket.on('p2Color',(color:string)=>{
    io.emit('p2Color',color);
  });

  socket.on('score1', (score:number)=>{
    console.log('score 1 ' + score)
    io.emit('score1', score);
  });

  socket.on('score2', (score:number)=>{
    console.log('score 2 ' + score)
    io.emit('score2', score);
  });
});


server.listen(app.get('port'), () => {
  console.log(`Snake server running on ${port}`)
})