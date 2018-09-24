import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo'; //react-apollo binds apollo to react so react understands apollo; provider injects the data to app

//imported components
import ShopList from './components/ShopList';
import AddShop from './components/AddShop';

//apollo client setup
const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql' //now apollo knows we will be making requests to this end point
});

class App extends Component {
    render() {
        return (
            // takes data from apollo and injects in into our app
            <ApolloProvider client={client}>
                <div id="main">
                    <h1>Shopify Shop!</h1>
                    <ShopList/>
                    <AddShop/>
                </div>
            </ApolloProvider>
        );
    }
}

export default App;

//kubernets is container system? for replicating servers and take a lot of load?
//good cloud got kubernets server