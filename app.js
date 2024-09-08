let express = require('express')
let app = express()

const authRoutes = require('./routers/authRoutes');
const productRoutes = require('./routers/productRout');
const cartRoutes = require('./routers/cartRout');
const checkoutRoutes = require('./routers/checkoutRoute');
const orderRoutes = require('./routers/orderRoute');
const inventoryRoutes = require('./routers/inventoryRoute');


app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

module.exports = app;