(function() {
  var after, conf, data, displayHelp, exec, getFreshbooks, nopt, parsedOptions, path, timetrap;

  path = require('path');

  nopt = require('nopt');

  conf = require('freshbooks-cli-config').getConf();

  exec = require('child_process').exec;

  displayHelp = function() {
    var cmd, manpage;
    manpage = path.join(__dirname, 'man', 'freshbooks-timetrap.1');
    cmd = "man --local-file " + manpage;
    return exec(cmd, function(err, stdout, stderr) {
      process.stdout.write("" + stdout);
      process.stderr.write("" + stderr);
      if (err) {
        return console.error(err);
      }
    });
  };

  getFreshbooks = function() {
    var Freshbooks, base_uri;
    if (conf.get('simulate')) {
      Freshbooks = require('./lib/mock_freshbooks');
    } else {
      Freshbooks = require('freshbooks');
    }
    base_uri = "" + (conf.get('api:url')) + "/" + (conf.get('api:version')) + "/xml-in";
    return new Freshbooks(base_uri, conf.get('api:token'));
  };

  parsedOptions = nopt({
    lines: Boolean,
    data: String,
    help: Boolean
  }, {
    l: ['--lines'],
    h: ['--help']
  }, process.argv, 2);

  if (parsedOptions.help) {
    displayHelp();
  } else if (parsedOptions.lines) {
    timetrap = require('./lib/invoice');
    after = function(err, lines) {
      if (err) {
        console.error(err);
      }
      return console.log(timetrap.formatters.json(lines));
    };
    if (data = parsedOptions.data) {
      timetrap.toInvoiceLines(getFreshbooks(), JSON.parse(data), after);
    } else {
      data = '';
      process.stdin.on('data', function(chunk) {
        return data += chunk;
      });
      process.stdin.on('end', function() {
        return timetrap.toInvoiceLines(getFreshbooks(), JSON.parse(data), after);
      });
    }
  } else {
    displayHelp();
  }

}).call(this);
