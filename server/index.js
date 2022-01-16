const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

//routes
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const conversationsRoute = require('./routes/conversations');
const messagesRoute = require('./routes/messages');

//connection to DB
mongoose.connect('mongodb://localhost/instagram', () => {
    console.log('connected with mongoDB')
}, e => {console.log(e.message)})

app.use('/images', express.static(path.join(__dirname, 'public/images')))

//using midlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors({
    origin: ['http://localhost:3000' ],
    methods: ['GET', "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(bodyParser.urlencoded({extended:true}))

const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
})

const upload = multer({storage});
app.post('/api/upload', upload.single('file'), (req, res) => {
    try{
        return res.status(200).json("File uploaded succesfully")
    }catch(err){console.log(err)}
})

//session
app.use(session({
    key: 'userId',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24 * 1000 * 30
    }

}))
    

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/conversations', conversationsRoute);
app.use('/api/messages', messagesRoute);

app.listen(3001, () => {
    console.log("Running on port 3001");
})  