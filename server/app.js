const express = require('express');
const graphqlHTTP = require('express-graphql'); // name is just convention for express graphQL; allows express to understand graphQL
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors'); //this allows cross-origin requests so that host 3000 can talk to host 4000 even though they're different servers



//connect to mlab database
mongoose.connect("mongodb://crystal:test123@ds261302.mlab.com:61302/shopify-devchallenge-w2019");
mongoose.connection.once('open',()=>{
    console.log('connected to db!');
});

const app = express(); //invoke express function to create our app

app.use(cors());

// express will understand that we want to interact with graphQL,
// and hand off request to graphqlHTTP since express doesn't actually understand graphQL on its own
app.use('/graphql',graphqlHTTP({
    schema: schema, //this schema defines our graph schema
    graphiql: true,
}));



// app will listen to specific port on our computer
app.listen(4000, ()=> {
    //callback function will fire when port
    //express app is now up and running listening for requests
    console.log('now listening for requests on port 4000');
});


