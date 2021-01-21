// Initialize cost packages that I will be using
const express = require('express')
const app = express()
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

var cookieParser = require('cookie-parser');
var Filter = require('bad-words');
filter = new Filter();

// view engine setup, dependancie 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware, code recieved from nodemailer documentation
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// setup cookie functionality
app.use(cookieParser());

// Validate Email function uses regex to make sure email is valid
function validateEmail(email) {
    validEmail = /^[a-z\d-_]+\@[a-z\d-]+(\.[a-z]{2,8}){1,2}$/
    return validEmail.test(email.toLowerCase());
}

// Post request called when submiuting form in contact me page
app.post('/contact', function(req, res) {
    // If statementns to check for empty fields
    if(req.body.name == "" || req.body.email == "" || req.body.subject == "") { 
        console.log('Email not sent due to missing field');

    // check for valid email
    } else if(!(validateEmail(req.body.email))) {
        console.log('Email not sent due to invalid Email');

    // check name and subject strings for profanity
    } else if(filter.isProfane(req.body.name)) {
        console.log('Email not sent due to profanity in name');
    } else if(filter.isProfane(req.body.subject)) {
        console.log('Email not sent due to profanity in message');
    
    // check the spam cookie
    } else if(req.cookies['contact'] == 'true') {
        console.log('Email not sent due to excessive requests');
    
    } else {
        //setup the html of the page that will be sent in the email
        const message = `
        <p>You have a new Message from your website</p>
        <h2>Contact Details</h2>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <h2>Message</h2>
        <p>${req.body.subject}</p>
        `;

        // make a structure for the email that is to be sent
        let mailOption = {
            from: 'niceTry@gmail.com',
            to: 'itssahil6@gmail.com',
            subject: 'New Message from Website',
            html: message
        };

        // code form nodemailer documentation to create a transport 
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'niceTry@gmail.com',
                pass: 'youThought'
            }
        });
        
        // code from nodemailer documentation to send the email
        // if a error occurs it logs it
        transporter.sendMail(mailOption, function(err, data){
            if(err){
                console.log('error', err);
            } else {
                console.log('email sent');
            }
        });

        // reserts the spam cookie once a email is sent 
        res.cookie("contact", "true", {maxAge : 300000});
        console.log("Contact Message sent to Email");
    }

    // set status to 204, meaning stay on the same page after post request
    console.log(req.cookies);
    res.status(204).send()
});

// code recieved from node doceumentation to setup a local runtime envionement on port 3000
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
