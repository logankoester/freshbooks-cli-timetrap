path = require 'path'
nopt = require 'nopt'
conf = require('freshbooks-cli-config').getConf()
exec = require('child_process').exec

displayHelp = ->
  manpage = path.join(__dirname, 'man', 'freshbooks-timetrap.1')
  cmd = "man --local-file #{manpage}"
  exec cmd, (err, stdout, stderr) ->
    process.stdout.write "#{stdout}"
    process.stderr.write "#{stderr}"
    console.error err if err

getFreshbooks = ->
  if conf.get 'simulate'
    Freshbooks = require './lib/mock_freshbooks'
  else
    Freshbooks = require 'freshbooks'
  base_uri = "#{conf.get('api:url')}/#{conf.get('api:version')}/xml-in"
  return new Freshbooks base_uri, conf.get('api:token')

parsedOptions = nopt
  lines: Boolean
  data: String
  help: Boolean
,
  l: ['--lines']
  h: ['--help']
, process.argv, 2

if parsedOptions.help
  displayHelp()

else if parsedOptions.lines

  timetrap = require './lib/invoice'

  after = (err, lines) ->
    console.error err if err
    console.log timetrap.formatters.json(lines)

  if data = parsedOptions.data
    timetrap.toInvoiceLines getFreshbooks(), JSON.parse(data), after
  else
    data = ''
    process.stdin.on 'data', (chunk) -> data += chunk
    process.stdin.on 'end', ->
      timetrap.toInvoiceLines getFreshbooks(), JSON.parse(data), after

else
  displayHelp()
