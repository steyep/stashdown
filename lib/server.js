define([
  'fs',
  'ejs',
  'express',
  'module',
  'path',
  'body-parser',
  'open'
], function(fs, ejs, express, module, path, parser, open) {

  var app = express();
  var dir = module.config().dir;

  // public folder to store assets
  var public = path.join(dir, 'public');
  var views = path.join(dir, 'views');

  // set the view engine to ejs
  app.set('view engine', 'ejs');
  app.set('views', views);
  app.use(express.static(public));
  app.use(parser.json());
  var port = process.env.PORT || 8000;

  var server = {
   
    file: null,
    server: null,
    sockets: [],

    'start': function(file) {
      
      var file = file || null;

      if (file) {
        try {
          this.file = file;
          file = fs.readFileSync(file);
        } catch (e) {
          console.log('Unable to read "' + this.file + '"');
        }
      } else {
        file = 'Enter text...';
      }
      
      var that = this;
      
      app.route('/')
        .get(function(req, res) {  
          res.render('pad', { 
            pad: file,
            save: !!that.file  
          });
        })
        .post(function(req, res) {  
          fs.writeFile(that.file, req.body.md, function(err, data){
            if (err) throw err;
            res.sendStatus(200);
            //res.redirect('/');
          });
        });

      app.get('/close', function(req, res) {
        // Close browser window
        res.end();
        // Kill server
        that.stop();
      });

      this.server = app.listen(port);
      
      this.server.on('connection', function(socket) {
        that.sockets.push(socket);
        
        socket.once('close', function() {
          that.sockets.shift();
        });

        socket.setTimeout(4000);
      });

      console.log('Listening on port ' + port);
      
      open('http://localhost:' + port);
    },

    'stop': function(req, callback) {
      this.server.close(function(){
        console.log('Server closed');
      });

      this.sockets.forEach(function(socket, socketID) {
        socket.destroy();
      });
    }
  };
  
  return server;
});