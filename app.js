require ('dotenv').config()
const express = require ("express");
const ConnectDB = require('./DB/Connection');
const app = express();
port = process.env.PORT;
const indexRouter = require ('./modules/index.router')
const schedule = require('node-schedule');
app.use(express.json())
const fs = require ("fs")
const path = require ("path");
const { initIO } = require('./Service/socket');
const userModel = require('./DB/Model/User');
const { createInvoice } = require('./Service/pdf');
const sendEmail = require('./Service/sendEmail');
app.use('/Uploads' , express.static(path.join(__dirname , './Uploads')))

app.use('/api/v1/user' , indexRouter.userRouter)
app.use('/api/v1/product' , indexRouter.productRouter)
app.use('/api/v1/comment' , indexRouter.commentRouter)

schedule.scheduleJob('59 59 11 * * *', function(){
 
const invoice = {
    shipping: {
      name: "John Doe",
      address: "1234 Main Street",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: 94111
    },
    items: [
      {
        product : 1,
        title: "First  Product",
        desc: "product One",
        price: 1000
      },
      {
        product : 2,
        title: "Second  Product",
        desc: "product Two",
        price: 2000
      }
    ],
    productNumber: 8000,
    paid: 0,
    invoice_nr: 1234
  };
  createInvoice(invoice, path.join(__dirname , './Uploads/PDF/invoice.pdf'));
  attachment = fs.readFileSync(path.join(__dirname , './Uploads/PDF/invoice.pdf')).toString("base64"); 
  sendEmail("Mona123@gmail.com" , "<p>open your invoice</p>" ,[
    {
        filename : 'invoice.pdf',
        path : path.join(__dirname , './Uploads/PDF/invoice.pdf')
    }
  ])
})


ConnectDB()

const server = app.listen(port , ()=>{
    console.log(`server is running on port ${port} .......`);
})

const io = initIO(server)

io.on("connection" , (socket)=>{
    console.log(socket.id);
    socket.on("updateSocketID" , async (data)=>{
        await userModel.findByIdAndUpdate(data , {socketID : socket.id})
    })
})

io.on("connection" , (socket)=>{
    console.log(socket.id);
    socket.on("updateCommentSocketID" , async (data)=>{
        console.log({data});
        await userModel.findByIdAndUpdate(data , {socketID : socket.id})
    })
})


