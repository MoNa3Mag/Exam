const nodeoutlook =  require ("nodejs-nodemailer-outlook")

function sendEmail(dest , message , attachment){
try {
  if (!attachment) {
    attachment = []
  }
  nodeoutlook.sendEmail({
    auth: {
        user: process.env.senderEmail,
        pass: process.env.senderPassword
    },
    from: process.env.senderEmail,
    to: dest,
    subject: 'Hey you, awesome!',
    html: message,
    attachment : attachment,

    text: 'This is text version!',
    onError: (e) => console.log({e}),
    onSuccess: (i) => console.log({i})
});
} catch (error) {
          res.status(500).json({message:'email error'})
          console.log(error);
}
  }
  
  
  
  module.exports = sendEmail