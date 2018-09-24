const graphql = require('graphql');
const Shop = require('../models/shop');
const Order = require('../models/order');
const Product = require('../models/product');
const LineItem = require('../models/lineItem');

//here is where we will define our schema

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql; // grabs GraphQLObjectType variable from graphql -> capitalization matters


const ShopType = new GraphQLObjectType({
    name: 'Shop',
    fields:()=>({ //ESC function
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        orders: {
            type: new GraphQLList(OrderType),
            resolve(parent, args){
                return Order.find({shopID: parent.id});
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
                return Product.find({shopID: parent.id});
            }
        }
    })
});

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields:()=>({
        id: {type: GraphQLID},
        total: {type: GraphQLInt},
        lineItems: {
            type: new GraphQLList(LineItemType),
            resolve(parent, args){
                return LineItem.find({orderID: parent.id});
            }
        },
        shop: {
            type: ShopType,
            resolve(parent, args){
                return Shop.findById(parent.shopID);
            }
        }
    })
});


const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields:()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        shopID: {type: GraphQLID},
        price: {type: GraphQLInt},
        lineItems: {
            type: new GraphQLList(LineItemType),
            resolve(parent, args){
                return LineItem.find({productID: parent.id});
            }
        }

    })
});

const LineItemType = new GraphQLObjectType({
    name: 'LineItem',
    fields:()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        price: {type: GraphQLInt},
        order: {
            type: OrderType,
            resolve(parent, arg){
                return Order.findById(parent.orderID); //parent refers to js schema
            }
        },
        product: {
            type: ProductType,
            resolve(parent, arg){
                return Product.findById(parent.productID);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        Shop:{
            type: ShopType,
            args: {id:{type: GraphQLID}}, //which argument when we're looking for a shop?
            resolve(parent, args){
                return Shop.findById(args.id);
            }
        },
        Order:{
            type: OrderType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args){
                return Order.findById(args.id);
            }
        },
        Product:{
            type: ProductType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args){
                return Product.findById(args.id);
            }
        },
        LineItem:{
            type: LineItemType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args){
                return LineItem.findById(args.id);
            }
        },
        shops: {
            type: new GraphQLList(ShopType),
            resolve(parents, args){
                return Shop.find({});
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parents, args){
                return Product.find({});
            }
        },
        orders: {
            type: new GraphQLList(OrderType),
            resolve(parents, args){
                return Order.find({});
            }
        },
        lineItems: {
            type: new GraphQLList(LineItemType),
            resolve(parents, args){
                return LineItem.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addShop:{
            type: ShopType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let shop = new Shop({ //here Shop type refers to the type defined in the shop.js schema
                    name: args.name
                });
                return shop.save();
            }
        },
        addOrder:{
            type: OrderType,
            args: {
                shopID: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let order = new Order({
                    shopID: args.shopID,
                    total: 0 //order total is 0 when order is created, as line items are added, order total will be updated
                });

                return order.save();
            }
        },
        addProduct:{
            type: ProductType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                price: {type: new GraphQLNonNull(GraphQLInt)},
                shopID: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let product = new Product({
                    name: args.name,
                    price: args.price,
                    shopID: args.shopID
                });
                return product.save();
            }

        },
        addLineItem:{
            type: LineItemType,
            args: {
                productID: {type: new GraphQLNonNull(GraphQLID)},
                orderID: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                Product.findById(args.productID,(err,data)=>{
                    let lineItem = new LineItem({ //here  type refers to the type defined in the .js schema
                        productID: args.productID,
                        orderID: args.orderID,

                        //this maps to the value of the productID that it represents
                        name: data.name,
                        price: data.price
                    });

                    Order.findById(args.orderID, (err,data2)=>{
                        data2.total += lineItem.price;
                        data2.save(); //order total updates as lineitem is added
                        return lineItem.save();
                    });
                });
            }
        },

        //delete shop and its associated orders and products
        deleteShop: {
            type: ShopType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                Shop.findOneAndDelete({_id: args.id},(err)=>{
                    if (err) {console.log(err);}
                    else {
                        Product.deleteMany({shopID: args.id}, (err)=>{
                            if (err) {console.log(err);}
                        });
                        Order.deleteMany({shopID: args.id}, (err)=>{
                            if (err) {console.log(err);}
                        });
                    }
                });
            }
        },
        deleteOrder: {
            type: OrderType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                Order.findOneAndDelete({_id: args.id},()=>{
                    LineItem.deleteMany({orderID: args.id}, (err)=>{
                        if (err) {console.log(err);}
                    });
                });
            }
        },
        //delete product deletes all line items related to product
        deleteProduct: {
            type: ProductType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                Product.findOneAndDelete({_id: args.id},(err)=>{
                    if (err) {console.log(err);}
                    LineItem.deleteMany({productID: args.id}, (err)=>{
                        if (err) {console.log(err);}
                    });
                });
            }
        },
        //deleting line item updates total of order related to line item
        deleteLineItem: {
            type: LineItemType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                LineItem.findOneAndDelete({_id: args.id},(err,data)=>{
                    Order.findOneAndUpdate({_id: data.orderID},{$inc: {total: -(data.price)}})
                    //subtracts order total by lineitem price
                });
            }
        },
        updateShopName: {
            type: ShopType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                Shop.findById(args.id,(err, obj)=>{
                    obj.name = args.name;
                    obj.save();
                });
            }
        },
        updateProduct: {
            type: ProductType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                price: {type: GraphQLInt},
                shopID: {type: GraphQLID}
            },
            resolve(parent, args){
                Product.findById(args.id,(err, obj)=>{
                    obj.name = (args.name)? args.name: obj.name;
                    obj.shopID = (args.shopID)? args.shopID: obj.shopID;
                    //updating product price updates line item related to product, hence updating order total
                    if(args.price) {
                        difference = obj.price - args.price;
                        obj.price = args.price;
                        obj.save();
                        LineItem.updateMany({productID: obj.id},{$inc: {price: -difference}},(err,data)=>{
                            Order.updateMany({_id: data.orderID},{$inc:{total: -difference}});
                        });
                    }
                    obj.save();
                });
            }
        },
        updateLineItemName: {
            type: LineItemType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                LineItem.findById(args.id,(err, obj)=>{
                    obj.name = (args.name)? args.name: obj.name;
                    obj.save();
                });
            }
        }
    }
});

//creating new schema
module.exports = new GraphQLSchema({
        query: RootQuery,
        mutation: Mutation
    }
);