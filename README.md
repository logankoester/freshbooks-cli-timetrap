# freshbooks-cli-timetrap 
[![Build Status](https://secure.travis-ci.org/logankoester/freshbooks-cli-timetrap.png?branch=master)](http://travis-ci.org/logankoester/freshbooks-cli-timetrap)

> Integrates the freshbooks-cli tools with timetrap time tracking

## Overview

[freshbooks-cli](https://github.com/logankoester/freshbooks-cli) is a
command-line interface to the [FreshBooks](http://freshbooks.com/) API.

[timetrap](https://github.com/samg/timetrap) is a simple command line
timetracker written in Ruby that can export JSON-formatted time entry data.

`freshbooks-cli-timetrap` implements the `timetrap` subcommand for
[freshbooks-cli](https://github.com/logankoester/freshbooks-cli).

Simply pipe your timetrap data to this subcommand to adapt your timesheet
entries for use within freshbooks.

Before you use this tool you need to map some timetrap sheets to the associated
freshbooks projects and tasks.

    # Install timetrap
    $ gem install timetrap

    # Switch to a new sheet (creating it unless it exists)
    $ t sheet myproject
    
    # Record some entries
    $ t in "doing one thing"; t out
    $ t in "doing another"; t out

    # On your FreshBooks account, create a new Project and Task, and note
    # the ID of each.

    # Map your new timesheet to your new freshbooks project/task.
    $ freshbooks config -k timetrap:sheets:myproject:project_id -v <your project id>
    $ freshbooks config -k timetrap:sheets:myproject:task_id -v <your task id>

All done!


## Usage

    --lines, -l - Convert timetrap entries to JSON-formatted invoice lines

    --data JSON - Time entry data for --create

    --help, -h - Display this message

See http://developers.freshbooks.com/docs/invoices/#invoice.lines.add for more information.


## Examples

    # Converting timetrap entries into invoice line items
    $ timetrap display -s saturday -e friday -f json | freshbooks timetrap --lines
    [
      {
        "name":"Some task",
        "description":"Did some work",
        "unit_cost":"150",
        "quantity":"3.2",
        "type":"Item"
      },
      {
        "name":"Some task",
        "description":"Did some other work",
        "unit_cost":"150",
        "quantity":"0.0",
        "type":"Item"
      },
      {
        "name":"Some task",
        "description":"Did some different work",
        "unit_cost":"150",
        "quantity":"0.5",
        "type":"Item"
      }
    ]


## Contributing

The test suite is implemented with
[nodeunit](https://github.com/caolan/nodeunit) and
[nixt](https://github.com/vesln/nixt).

To rebuild & run the tests

    $ git clone https://github.com/logankoester/freshbooks-cli-timetrap.git
    $ cd freshbooks-cli-timetrap
    $ npm install
    $ grunt test

You can use `grunt watch` to automatically rebuild and run the test suite when
files are changed.

Use `npm link` from the project directory to tell `freshbooks-cli` to use
your modified `freshbooks-cli-timetrap` during development.

To contribute back, fork the repo and open a pull request with your changes.


## License

Copyright (c) 2014 Logan Koester
Licensed under the MIT license.


