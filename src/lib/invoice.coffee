_ = require 'lodash'
async = require 'async'
moment = require 'moment'
require 'twix'
require 'moment-duration-format'
round = require('stround').round
conf = require('freshbooks-cli-config').getConf()

toHours = (duration) ->
  round duration.asHours(), 1

formatDuration = (duration) ->
  duration.format 'HH:mm:ss', trim: false

getDuration = (start, end) ->
  moment(new Date(start)).twix(new Date(end)).asDuration()

getHourlyRate = (project, task, staff) ->
  switch project.bill_method
    when 'task-rate'
      if task.billable == '1' then return task.rate
    when 'project-rate'
      if task.billable == '1' then return project.rate
    when 'staff-rate'
      if task.billable == '1' then return staff.rate
  return 0

exports.toInvoiceLines = (freshbooks, entries, after) ->
  entries = [entries] unless _.isArray(entries)
  lines = []

  sheetConf = conf.get "timetrap:sheets:#{_.first(entries).sheet}"

  project = _.extend new freshbooks.Project(), project_id: sheetConf.project_id
  project.get (err, project) ->
    console.error err if err

    task = _.extend new freshbooks.Task(), task_id: sheetConf.task_id
    task.get (err, task) ->
      console.error err if err
      
      staff = _.extend new freshbooks.Staff()
      staff.current (err, staff) ->
        console.error err if err

        # Consolidate entries with matching notes
        group = []
        _.each entries, (entry) ->
          match = _.findIndex group, (groupedEntry) ->
            groupedEntry.note == entry.note
          if match != -1
            # Add this entry to groupedEntries[match]
            group[match].duration = group[match].duration.add(getDuration(entry.start, entry.end))
          else
            group.push
              note: entry.note
              duration: getDuration entry.start, entry.end
              sheet: entry.sheet

        # Format output as a freshbooks invoice line
        lines = _.map group, (line) ->
          name: task.name
          description: line.note
          unit_cost: getHourlyRate project, task, staff
          quantity: toHours line.duration
          type: 'Item'

        after(err, lines)

exports.formatters =
  json: (line) ->
    JSON.stringify line
