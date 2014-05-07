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
