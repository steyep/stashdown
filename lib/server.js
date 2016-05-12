define([
  'fs',
  'ejs',
  'express',
  'module',
  'path',
  'body-parser',
  'http'
], function(fs, ejs, express, module, path, parser, http) {

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

    'start': function(file) {
      var file = file || null;
      
      if (file) {
        try {
          this.file = file;
          file = fs.readFileSync(file);
        } catch (e) {
          console.log('Unable to read "' + file + '"');
        }
      } else {
        file = 'Enter text...';
      }
      
      var that = this;
      
      app.route('/')
        .get(function(req, res) {  
          res.render('pad', { pad: file });
        })
        .post(function(req, res) {  
          fs.writeFile(that.file, req.body.md, function(err, data){
            if (err) throw err;
            res.sendStatus(200);
            //res.redirect('/');
          });
        });

      app.get('/close', function(req, res) {
        var response = res;
        that.stop(function(res){
          if (!res) return
          response.sendStatus(200);
        });
      });

      this.server = http.createServer(app);
      this.server.listen(port);
      console.log('listening on port ' + port);
    },

    'stop': function(callback) {
      this.server.close();
      callback(true);
    }
  };
  return server;
});