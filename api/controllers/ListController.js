module.exports = {

  all: function(req,res) {
    var instituteId = req.param('instituteId');

    List.find( { where: { institute: instituteId } } ).exec(function(err, lists) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      console.log('lists: ',lists);
      return res.send(lists);
    });

  },

  create: function(req,res) {
    var params = {
      name: req.param('name'),
      institute: req.param('instituteId')
    };
    console.log('params: ',params);
    List.create(params).fetch().exec(function(err, list) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      req.file('reportTypes').upload({
        adapter: require('skipper-csv'),
        csvOptions: {delimiter: ',', columns: true},
        rowHandler: function(row, fd){
          console.log(row);
          ReportType.create({name: row['Report_Names'], list: list.id}).exec(function(err,reporttype){
            return;
          });
        },
        maxBytes: 10000000
      },function whenDone(err, uploadedFiles) {
        if (err) {
          return res.serverError(err);
        }

        // If no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0){
          return res.badRequest('No file was uploaded');
        }

        //parse and create report type fields for the list

        return res.send(list);
      });
    });
  },

  getReportTypes: function(req,res) {
    console.log('in get report types');
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    ReportType.find( { where: { list: listId } } ).exec(function(err, reportTypes){
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(reportTypes);
    });
  },

  uploadReportTypes: function(req,res) {
    req.file('report_types').upload({
      adapter: require('skipper-csv'),
      // csvOptions: {delimiter: ',', columns: true},
      rowHandler: function(row, fd){
        console.log(fd, row);
        console.log('IN HERE');
      },
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    },function whenDone(err, uploadedFiles) {
      if (err) {
        return res.serverError(err);
      }
      console.log('uploadedFiles: ',uploadedFiles);
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      //parse and create report type fields for the list


    });
  }
}
