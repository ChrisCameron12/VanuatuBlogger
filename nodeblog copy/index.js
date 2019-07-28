const expressEdge = require("express-edge");
const express = require("express");
const edge = require("edge.js");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
 
const createPostController = require('./controllers/createPost')
const MainHomePageController = require('./controllers/MainHomePage')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const logoutController = require("./controllers/logout");
const connectFlash = require("connect-flash");
const dashboardController = require('./controllers/dashboard');
const map = require('./controllers/map');
const peopleculture = require('./controllers/peopleculture');
const travel = require('./controllers/travel')
const accomodation = require('./controllers/accomodation')
const blogController = require('./controllers/blog')
const blogList = require('./controllers/homepage')
const allblogs = require('./controllers/allblogs')
const itin = require('./controllers/itin')
const bookings = require('./controllers/bookings')


 
const app = new express();

app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}))
 
mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))


const mongoStore = connectMongo(expressSession);

app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.set('views', __dirname + '/views');
app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});
	
app.use(connectFlash());
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
const storePost = require('./middleware/storePost');
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')
 
 
app.get("/", blogList); // need to change this name and make this page the blog page. User do not have to be logged in to view this page but need to be logged in to make posts and comments 
app.get("/home", MainHomePageController); // this will be the landing page
app.get("/post/:id", getPostController);
app.get("/create/new", auth, createPostController);
app.post("/posts/store", auth, storePost, storePostController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.get("auth/register", redirectIfAuthenticated, createUserController); //changed route from /auth/register to just /register - this fixed problems with svg. look at if this is a viable fix//
app.post("/users/register", redirectIfAuthenticated, storeUserController);
app.get("/auth/logout", redirectIfAuthenticated, logoutController);
app.get("/dashboard", dashboardController);
app.get("/map", map);
app.get("/peopleculture", peopleculture);
app.get("/travel", travel);
app.get("/accomodation", accomodation);
app.get("/blog", blogController);
app.get("/allblogs", allblogs);
app.get("/itineraries", itin);
app.get("/booking", bookings);





 
app.listen(4000, () => {
  console.log("App listening on port 4000");
});