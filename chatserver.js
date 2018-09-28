var static=require("node-static");
var file=new(static.Server)();
var mysocket;
var express = require('express');
app=express();

var options = {
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('domain.crt')
};

var server     = require('https').createServer(options,function(req,res){file.serve(req,res);}),
    io         = require('socket.io')(server),
    logger     = require('winston'),
	  host 	   = "mydomain.com",
    port       = 8000;
    
mysocket=io.on('connection', function (socket){
socket.on('join', function (message) {
      userRooms[message.id]=message.user;
      socket.join(message);
      });
      
  socket.on('leave', function (message) {
		socket.leave(message);
    });
	
  socket.on('redisping',function (message) {
        socket.to(message.imei).emit("updloc",JSON.stringify(message));
    });
    
    socket.on('broadcast', function (message) {
        io.sockets.emit("broadcast", message);
    });
    
    socket.on('disconnect', function () {
		socket.leave(userRooms[socket.id]);
		socket.leave("room");
        logger.info('SocketIO : Received ' + nb + ' messages');
        logger.info('SocketIO > Disconnected socket ' + socket.id);
    });
	
});

server.listen(port);
