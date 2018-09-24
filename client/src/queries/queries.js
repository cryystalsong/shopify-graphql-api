import {gql} from "apollo-boost";

const getShopsQuery = gql`
    {
        shops{
            name
            id
        }
    }
`;

const getShopQuery = gql`
    query($id: ID){
        Shop(id: $id){
            name
            id
            orders {
                id
                total
            }
            products {
                name
                price
            }
        }
    }`;

const addShopQuery = gql`
    mutation($name: String!){
        addShop(name: $name){
            name
            id
        }
    }
`;


export {getShopsQuery, addShopQuery, getShopQuery};