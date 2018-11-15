module.exports = `
type Product {
  id: Int!
  name: String!
  lineItems(filter: String): [LineItem]
}

type LineItem {
  id: Int
  quantity: Int
  productId: Int
  product: Product
  orderId: String
  order: Order
}

type Order {
  id: String!
  lineItems: [LineItem]
  status: String!
  userId: Int
  user: User

}

type User {
  id: String
  name: String
  password: String
  orders: [Order]
  lineItems: [LineItem]
}

type Query {
  orders(filter: String): [Order!]!
  order(id:String!): Order
  products: [Product]
  product(id:Int!): Product
  lineItems(filter: String): [LineItem]
  lineItem(id:Int!): LineItem
  users: [User]
  user(id:String!):User
  ordersCount: Int
  cartItemsCount: Int
}

type AuthPayload {
  token: String
  user: User
}

type Mutation {
  updateOrder(id: String, status: String): Order!
  deleteOrder(id: String): Int

  reset(id: String):Int

  createLineItem(id: Int, quantity: Int, productId: Int, orderId: String): LineItem!
  updateLineItem(id: Int, quantity: Int, inc: Boolean, productId: Int, orderId: String): LineItem!
  deleteLineItem(id: Int): Int

  signup(name:String!, password: String!): AuthPayload
  login(name: String!, password:String!): AuthPayload
}
`;
