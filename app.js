var express = require('express')
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    credentials: true
  },
});
var path = require('path')
app.use('/assets', express.static(path.join(__dirname + '/client/assets')))

app.get('/', (req, res) => {
  let htmlFile = path.join(__dirname + '/client/index.html')
  console.log(htmlFile);
  res.sendFile(htmlFile);

});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('updatePos', (data) => {
    console.log('-------------update pos', socket.id)
    socket.broadcast.emit('broadcastPost', data)

  })
});


app.post('/msg', () => {
  console.log('---------emit')
  io.emit('message', "yuhuuuu")
})


http.listen(3000, () => {
  console.log('listening on *:3000');
});
