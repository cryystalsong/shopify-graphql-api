import React, { Component } from 'react';
import {graphql,compose} from 'react-apollo';
import {getShopQuery} from "../queries/queries";


//prop of shopID passed to this class
class ShopDetails extends Component {

    displayShopDetails(){
        const {Shop} = this.props.getShopQuery;
        if (Shop) {
            return(
                <div>
                    <h2>{Shop.name}</h2>
                    <ul>
                        {Shop.orders.map(order=>{
                            return (
                                <div>
                                    {/*<li>{order.id}</li>*/}
                                    <li key={order.id}>{order.id} Order Total: ${order.total}</li>
                                </div>)
                        })}
                    </ul>
                </div>
            )
        }
    }

    render() {
        return (
            <div id="shop-details">
                {this.displayShopDetails()}
            </div>
        );
    }
}

export default
compose(
    graphql(getShopQuery,{
        name: "getShopQuery",
        options: (props)=> {
            return {
                variables: {
                    id: props.shopID
                }
            }
        }})
)(ShopDetails); //use graphql to bind query to component ShopList, stored info in props
