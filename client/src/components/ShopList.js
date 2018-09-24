import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {getShopsQuery} from "../queries/queries";
import ShopDetails from "./ShopDetails";

class ShopList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
    }

    displayShops() {
        var data = this.props.data;
        if (data.loading) {
            return ("loading...")
        } else {
            return data.shops.map(shop => {
                return (
                    // { } is how we output data in react
                    <li key={shop.id} onClick={(e)=>{this.setState({selected: shop.id})}}>{shop.name}</li>
                )
            });//map goes through array and give access to individual array
        }
    }

    render() {
        return (
            <div>
                <ul id="shop-list">
                    {this.displayShops()}
                </ul>

                <ShopDetails shopID={this.state.selected}/>
                {/*bookID is the prop passed to ShopDetails*/}

                {/*<select><option value={this.displayShops()}>*/}
                {/*{this.displayShops()}*/}
                {/*</option></select>*/}

            </div>

        );
    }
}

export default graphql(getShopsQuery)(ShopList); //use graphql to bind query to component ShopList, stored info in props
