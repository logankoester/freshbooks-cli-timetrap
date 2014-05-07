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
