(function() {
  var async, conf, formatDuration, getDuration, getHourlyRate, moment, round, toHours, _;

  _ = require('lodash');

  async = require('async');

  moment = require('moment');

  require('twix');

  require('moment-duration-format');

  round = require('stround').round;

  conf = require('freshbooks-cli-config').getConf();

  toHours = function(duration) {
    return round(duration.asHours(), 1);
  };

  formatDuration = function(duration) {
    return duration.format('HH:mm:ss', {
      trim: false
    });
  };

  getDuration = function(start, end) {
    return moment(new Date(start)).twix(new Date(end)).asDuration();
  };

  getHourlyRate = function(project, task, staff) {
    switch (project.bill_method) {
      case 'task-rate':
        if (task.billable === '1') {
          return task.rate;
        }
        break;
      case 'project-rate':
        if (task.billable === '1') {
          return project.rate;
        }
        break;
      case 'staff-rate':
        if (task.billable === '1') {
          return staff.rate;
        }
    }
    return 0;
  };

  exports.toInvoiceLines = function(freshbooks, entries, after) {
    var lines, project, sheetConf;
    if (!_.isArray(entries)) {
      entries = [entries];
    }
    lines = [];
    sheetConf = conf.get("timetrap:sheets:" + (_.first(entries).sheet));
    project = _.extend(new freshbooks.Project(), {
      project_id: sheetConf.project_id
    });
    return project.get(function(err, project) {
      var task;
      if (err) {
        console.error(err);
      }
      task = _.extend(new freshbooks.Task(), {
        task_id: sheetConf.task_id
      });
      return task.get(function(err, task) {
        var staff;
        if (err) {
          console.error(err);
        }
        staff = _.extend(new freshbooks.Staff());
        return staff.current(function(err, staff) {
          var group;
          if (err) {
            console.error(err);
          }
          group = [];
          _.each(entries, function(entry) {
            var match;
            match = _.findIndex(group, function(groupedEntry) {
              return groupedEntry.note === entry.note;
            });
            if (match !== -1) {
              return group[match].duration = group[match].duration.add(getDuration(entry.start, entry.end));
            } else {
              return group.push({
                note: entry.note,
                duration: getDuration(entry.start, entry.end),
                sheet: entry.sheet
              });
            }
          });
          lines = _.map(group, function(line) {
            return {
              name: task.name,
              description: line.note,
              unit_cost: getHourlyRate(project, task, staff),
              quantity: toHours(line.duration),
              type: 'Item'
            };
          });
          return after(err, lines);
        });
      });
    });
  };

  exports.formatters = {
    json: function(line) {
      return JSON.stringify(line);
    }
  };

}).call(this);
