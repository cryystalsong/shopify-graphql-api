import React, { Component } from 'react';
import {graphql,compose} from 'react-apollo';
import {addShopQuery, getShopsQuery} from "../queries/queries";

class AddShop extends Component {

    constructor(props){
        super(props);
        this.state={
            name: ""
        }
    }

    submitForm(e){
        //prevent default action of refreshing?
        e.preventDefault();
        this.props.addShopQuery({
            variables: {
                name: this.state.name
            },
            refetchQueries: [{query: getShopsQuery}] //this refreshes the query everytime this func is called
        });
    }

    render() {
        return (
            <form id="add-shop" onSubmit={this.submitForm.bind(this)}>

                <div className="field">
                    <label>Shop name:</label>
                    <input type="text" onChange={(e)=>this.setState({name: e.target.value})}/>
                </div>

                <button>add shop</button>

            </form>
        );
    }
}

export default compose(
    graphql(addShopQuery,{name: "addShopQuery"})
)(AddShop); //use graphql to bind query to component ShopList, stored info in props
