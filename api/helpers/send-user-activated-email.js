

module.exports = {

  friendlyName: 'Send User Activated Email',
  description: 'Inform the user that their account has been activated via email',

  inputs: {
    user: {
      type: 'ref',
      description: 'User object',
      required: true
    },
    activate: {
      type: 'boolean',
      description: 'User activated or deactivated',
      required: true
    }
  },

  fn: function(inputs, exits) {

    const nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'no.reply.mapper@gmail.com',
        pass: 'techftw1'
      }
    });

    if (inputs.activate) {

      var mailOptions = {
        from: 'no.reply.mapper@gmail.com', // sender address
        to: inputs.user.email, // list of receivers
        subject: 'Account activated on HDAP Report Type Mapper', // Subject line
        html: '<p>Your account has now been activated on the HDAP Report Type Mapper. You may now login.</p>'// plain text body
      };

    } else {

      var mailOptions = {
        from: 'no.reply.mapper@gmail.com', // sender address
        to: inputs.user.email, // list of receivers
        subject: 'Account deactivated on HDAP Report Type Mapper', // Subject line
        html: '<p>Your account has now been deactivated on the HDAP Report Type Mapper.</p>'// plain text body
      };

    }

    transporter.sendMail(mailOptions, function (err, info) {
       if (err) {
         return exits.error(err);
       } else {
         return exits.success(info);
       }
    });
    // async.map(inputs.lists, function(list, mapCb) {
    //   async.map(inputs.tags, function(tag, mapCb2) {
    //     var tagObj = Object.assign({}, tag, { list: list.id, origin: 'Global' } );
    //     Tag.create(tagObj).exec(function(err, tag) {
    //       if (err) return mapCb2(err);
    //       return mapCb2(null, tag);
    //     });
    //   }, function(err, suc) {
    //     if (err) {
    //       return mapCb(err);
    //     }
    //     return mapCb(null, suc);
    //   });
    // }, function(err, suc) {
    //   if (err) {
    //     return exits.error(err);
    //   }
    //   return exits.success(suc);
    // });
  }
}
