const jwt = require('jwt-simple');
const secret = process.env.JWT_SECRET || 'test_secret';

module.exports = {
  Order: {
    user: async (order, args, { User }) => {
      return User.findById(order.userId);
    },
    lineItems: async (order, args, { Order, LineItem }) => {
      return LineItem.findAll({ where: { orderId: order.id } });
    },
  },
  LineItem: {
    product: (lineItem, args, { Product }) => {
      return Product.findById(lineItem.productId);
    },
    order: (lineItem, args, { Order }) => {
      return Order.findById(lineItem.orderId);
    },
  },
  User: {
    orders: (user, args, { Order }) => {
      return Order.findAll({ where: { userId: user.id } });
    },
    lineItems: (user, args, { LineItem }) => {
      return LineItem.findAll({ where: { userId: user.id } });
    },
  },
  Query: {
    orders: async (_, args, { Order, LineItem, User }) => {
      await Order.findOrCreate({ where: { status: 'CART' } });
      return Order.findAll({
        include: [{ model: LineItem }, User],
      });
    },
    ordersCount: async (_, args, { Order }) => {
      ords = await Order.findAll();
      return ords.length;
    },
    cartItemsCount: async (_, args, { Order, LineItem }) => {
      const cart = Order.findOne({ where: { status: 'CART' } });
      const cartItems = await LineItem.findAll({ where: { orderId: cart.id } });
      return cartItems.reduce((init, curr) => {
        return init + curr.quantity;
      }, 0);
    },
    order: async (_, { id }, { Order }) => await Order.findById(id),

    products: async (_, args, { Product }) => await Product.findAll(),

    product: async (_, { id }, { Product }) => await Product.findById(id),

    lineItems: async (_, args, { LineItem }) => await LineItem.findAll(),

    users: async (_, args, { User }) => await User.findAll(),
  },

  Mutation: {
    updateOrder: async (_, { id, status }, { Order }) => {
      const _order = await Order.findOne({ where: { id } });
      await _order.update({ status: status });
      return _order;
    },

    deleteOrder: async (_, { id }, { Order }) =>
      await Order.destroy({ where: { id } }),

    reset: async (_, args, { Order, LineItem }) => {
      await Order.destroy({ where: {} });
      await LineItem.destroy({ where: {} });
      return;
    },

    createLineItem: async (
      _,
      { orderId, quantity, productId },
      { LineItem }
    ) => {
      return LineItem.create({ orderId, quantity, productId });
    },

    updateLineItem: async (_, { id, quantity }, { LineItem }) => {
      const _LineItem = await LineItem.findById(id);
      await _LineItem.update({ quantity });
      return _LineItem;
    },

    deleteLineItem: async (_, { id }, { LineItem }) =>
      await LineItem.destroy({ where: { id } }),

    signup: async (_, { name, password }, { User }) => {
      const user = await User.create({ name, password });

      const token = jwt.encode({ id: user.id }, secret);
      return { token, user };
    },
    login: async (_, { name, password }, { User }) => {
      const user = await User.findOne({ where: { name } });
      if (!user) {
        throw new Error('No such user found');
      }
      const valid = await User.findOne({ where: { password } });
      if (!valid) {
        throw new Error('Invalid password');
      }
      const token = jwt.encode({ id: user.id }, secret);
      return { token, user };
    },
  },
};
