

module.exports = {

  friendlyName: 'Send Admins Registration Email',
  description: 'Inform the admins when a new user has registered via email',

  inputs: {
    user: {
      type: 'ref',
      description: 'User object',
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

    var mailOptions = {
      from: 'no.reply.mapper@gmail.com', // sender address
      to: ['trey.schneider@gtri.gatech.edu'],
      subject: inputs.user.firstName+' '+inputs.user.lastName+' has registered for mapper', // Subject line
      html: '<p>Please review and grant them access to report type mapper if appropriate.</p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
       if (err) {
         return exits.error(err);
       } else {
         return exits.success(info);
       }
    });
  }
}
