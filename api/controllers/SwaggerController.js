var fs = require('fs');
var path = require('path');

module.exports = {

  getSwaggerFile: function(req,res) {
    var swag = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'swagger.json'), 'utf8'));
    return res.json(swag);
  }
}
