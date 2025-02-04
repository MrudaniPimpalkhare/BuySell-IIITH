import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware/authenticateToken.js';
import User from './models/User.js';
import Item from './models/Item.js';
import Order from './models/Order.js';
import chatRoutes from './routes/chatRoutes.js';
import xml2js from 'xml2js';
import { casCallback } from './controllers/casController.js';


dotenv.config();
const app = express();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND, credentials: true }));
app.use(cookieParser());
app.use(chatRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get("/test", (req, res) => {
    res.send("Hello World!");
});

app.get('/api/cas/callback', casCallback);


app.post('/complete-registration', authenticateToken, async (req, res) => {
    const { firstname, surname, age, contact, password } = req.body;

    if (!firstname || !surname || !age || !contact || !password) {
        return res.status(400).send('Missing fields');
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).send('User not found');
        }

        user.firstname = firstname;
        user.surname = surname;
        user.age = age;
        user.contact = contact;
        user.password = await bcrypt.hash(password, bcryptSalt);

        await user.save();
        res.json({ success: true, message: 'Registration completed successfully' });
    } catch (error) {
        console.error('Error completing registration:', error);
        res.status(500).json({ success: false, message: 'Failed to complete registration' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
        return res.status(400).send('Missing fields');
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('not found');
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
        return res.status(400).send("passnotok");
    }

    console.log("passok");

    jwt.sign({ email: user.email, _id: user._id }, jwtSecret, {}, (err, token) => {
        if (err) {
            throw err;
        }
        res.cookie('token', token).json('passok');
    });

});

app.post('/register',async (req, res) => {
    console.log(req.body);
    const { firstname, surname, email, age, contact, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Missing fields');
    }

    const user = await User.findOne({ email });
    if (user) {
        //console.log(user);
        return res.status(400).send('User already exists');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, bcryptSalt);
        const newUser = new User({ firstname, surname, email, age, contact, password: hashedPassword });
        await newUser.save();
        res.json({ "success": true, "message": "User registered successfully" });
    } catch (err) {
        res.json({ "success": false, "message": "User registration failed" });
    }
});

app.get("/profile", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send('User not found');
    }
    res.json(user);
});

app.post('/profile', authenticateToken, async (req, res) => {
    console.log(req.body);
    const { firstname, surname, age, contact, currentPassword, newPassword } = req.body;
    console.log(req.body);
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).send('User not found');
        }

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).send('Current password is required to change password.');
            }
            const validPass = await bcrypt.compare(currentPassword, user.password);
            if (!validPass) {
                return res.status(400).send('Invalid current password');
            }
            user.password = await bcrypt.hash(newPassword, bcryptSalt);
        } else {
            console.log("No password change");
        }

        user.firstname = firstname || user.firstname;
        user.surname = surname || user.surname;
        user.age = age || user.age;
        user.contact = contact || user.contact;

        await user.save();
        console.log(user);
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Profile update failed' });
    }
});

//------------------------ITEMS ROUTES------------------------//

app.get('/my-items', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send('User not found');
    }
    const items = await Item.find({ user_id: user._id }).populate('user_id', 'firstname surname');
    res.json(items);
});

app.post('/items', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send('User not found');
    }
    const { name, price, quantity, category } = req.body;
    if (!name || !price || !quantity || !category) {
        return res.status(400).send('Missing fields');
    }
    if (isNaN(price) || isNaN(quantity)) {
        return res.status(400).send('Price and Quantity must be numbers');
    }

    try {
        const newItem = new Item({
            name,
            price,
            quantity,
            category,
            user_id: user._id
        });

        await newItem.save();
        res.json({ success: true, message: 'Item added successfully' });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ success: false, message: 'Failed to add item' });
    }
});

app.put('/items/:id', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send('User not found');
    }

    const { id } = req.params;
    const { name, price, quantity, category } = req.body;

    if (!name || !price || !quantity || !category) {
        return res.status(400).send('Missing fields');
    }
    if (isNaN(price) || isNaN(quantity)) {
        return res.status(400).send('Price and Quantity must be numbers');
    }

    try {
        const item = await Item.findOne({ _id: id, user_id: user._id });
        if (!item) {
            return res.status(404).send('Item not found');
        }

        item.name = name;
        item.price = price;
        item.quantity = quantity;
        item.category = category;

        await item.save();
        res.json({ success: true, message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ success: false, message: 'Failed to update item' });
    }
});

app.get('/items/:id', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        console.log("User not found");
        return res.status(400).send('User not found');
    }
    const item = await Item.findOne({ _id: req.params.id }).populate('user_id', 'firstname surname');
    if (!item) {
        console.log("Item not found");
        return res.status(404).send('Item not found');
    }
    console.log(item);
    res.json(item);
});

app.delete('/items/:id', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send('User not found');
    }
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, user_id: user._id });
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch {
        return res.status(500).send('Failed to delete item');
    }
});

app.get('/items', authenticateToken, async (req, res) => {
    try {
        const items = await Item.find({
          user_id: { $ne: req.user._id },
          quantity: { $gte: 1 }
        }).populate('user_id', 'firstname surname');
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch items' });
    }
});

//------------------------CART ROUTES------------------------//

app.post('/cart/add', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send('User not found');
    }

    const { itemId, quantity } = req.body;
    if (!itemId || !quantity) {
        return res.status(400).send('Missing fields');
    }

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).send('Item not found');
        }

        const cartItem = user.cart.find(cartItem => cartItem.item.toString() === itemId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ item: itemId, quantity });
        }

        await user.save();
        res.json({ success: true, message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ success: false, message: 'Failed to add item to cart' });
    }
});

app.put('/cart/update', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send('User not found');
    }

    const { itemId, quantity } = req.body;
    if (!itemId || !quantity) {
        return res.status(400).send('Missing fields');
    }

    try {
        const cartItem = user.cart.find(cartItem => cartItem.item.toString() === itemId);
        if (!cartItem) {
            return res.status(404).send('Item not found in cart');
        }

        // make sure quantity does not exceed item stock
        const item = await Item.findById(itemId);
        if (quantity > item.quantity) {
            return res.status(500).json({ success: false, message: 'Quantity exceeds available quantity' });
        }
        cartItem.quantity = quantity;
        await user.save();
        return res.json({ success: true, message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ success: false, message: 'Failed to update cart' });
    }
});

app.delete('/cart/remove/:itemId', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send('User not found');
    }

    try {
        user.cart = user.cart.filter(cartItem => cartItem.item.toString() !== req.params.itemId);
        await user.save();
        res.json({ success: true, message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
    }
});

app.get('/cart', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.item');
    if (!user) {
        return res.status(400).send('User not found');
    }

    res.json(user.cart);
});

//------------------------RATING ROUTES------------------------//

app.post('/items/:id/rate', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send('User not found');
    }

    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).send('Invalid rating');
    }

    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send('Item not found');
        }

        const existingRating = item.ratings.find(r => r.user.toString() === user._id.toString());
        if (existingRating) {
            existingRating.rating = rating;
        } else {
            item.ratings.push({ user: user._id, rating });
        }
        await item.save();
        // the sellers rating is the average of all ratings of all the items sold by the seller
        const seller = await User.findById(item.user_id);
        const sellerItems = await Item.find({ user_id: seller._id });
        let totalRatings = 0;    
        let totalReviews = 0;
        sellerItems.forEach(item => {
            item.ratings.forEach(rating => {
                totalRatings += rating.rating;
                totalReviews++;
            });
        });
        seller.averageRating = totalReviews === 0 ? 0 : totalRatings / totalReviews;
        await seller.save();

        res.json({ success: true, message: 'Item rated successfully' });
    } catch (error) {
        console.error('Error rating item:', error);
        res.status(500).json({ success: false, message: 'Failed to rate item' });
    }
});


//------------------------ORDER ROUTES------------------------//
app.post('/order', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.item');
    if (!user) {
        return res.status(400).send('User not found');
    }
    if(user.cart.length === 0) {
        return res.status(400).send('Cart is empty');
    }
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const hashedOtp = await bcrypt.hash(otp, bcryptSalt);
    const totalPrice = user.cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
    const orderitems = user.cart.map(cartItem => ({
        item: cartItem.item._id,
        quantity: cartItem.quantity,
        seller: cartItem.item.user_id
    }));

    const newOrder = new Order({
        buyer: user._id,
        items: orderitems,
        totalPrice,
        otp: hashedOtp
    });

    try {
        await newOrder.save();
        user.cart = [];
        await user.save();
        res.json({ success: true, message: 'Order placed successfully', otp });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Failed to place order' });
    }
}); 

app.get('/orders/pending', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id, isCompleted: false }).populate('items.item').populate('items.seller');
        // remove all orders that have no items
        res.json(orders);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending orders' });
    }
});

app.get('/orders/completed', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id, isCompleted: true }).populate('items.item').populate('items.seller');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching completed orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch completed orders' });
    }
});

app.get('/orders/sold', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ 'items.seller': req.user._id, isCompleted: true })
            .populate('items.item')
            .populate('buyer', 'firstname surname')
            .populate('items.seller', 'firstname surname'); // Ensure buyer details are populated

        // Filter out items that do not belong to the current user
        const filteredOrders = orders.map(order => {
            order.items = order.items.filter(item => item.seller._id.toString() === req.user._id.toString());
            return order;
        });


        res.json(filteredOrders);
    } catch (error) {
        console.error('Error fetching sold orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sold orders' });
    }
});


app.post('/order/regenerate-otp/:orderId', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).send('You are not authorized to regenerate OTP for this order');
        }
        // check each item in the order to ensure it is still available
        for (const orderItem of order.items) {
            const item = await Item.findById(orderItem.item);
            if (!item || item.quantity < orderItem.quantity) {
                console.log('Item not available:');
                // remove that item from the order
                order.items = order.items.filter(o => o.item.toString() !== item._id.toString());
            }
        }
        
        // Save the updated order
        await order.save();
        
        // if the number of items in the order is now 0, delete the order
        if (order.items.length === 0) {
            await Order.findByIdAndDelete(order._id);
            return res.json({ success: false, message: 'Order removed as all items are no longer available' });
        } else {
            return res.status(400).json({ success: false, message: 'One or more items in the order are no longer available, these have been removed from the order' });
        }
        

        // generate a random 6-digit OTP, using random function from 100000 to 999999

        const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
        const hashedOtp = await bcrypt.hash(otp, bcryptSalt);
        order.otp = hashedOtp;
        await order.save();
        res.json({ success: true, message: 'OTP regenerated successfully', otp });
    } catch (error) {
        console.error('Error regenerating OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to regenerate OTP' });
    }
});


app.post('/order/complete/:orderId', authenticateToken, async (req, res) => {
    try {
        const { otp } = req.body;
        const order = await Order.findById(req.params.orderId).populate('items.item');

        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Verify OTP
        const isOtpValid = await bcrypt.compare(otp, order.otp);
        if (!isOtpValid) {
            return res.status(400).send('Invalid OTP');
        }

        // Mark items as checked for the seller
        order.items.forEach(async (item) => {
            if (item.seller.toString() === req.user._id.toString()) {
                item.ischecked = true;
                // Update the quantity of the item
                console.log(item.item.quantity)
                console.log(item.quantity);
                item.item.quantity -= item.quantity;
                await item.item.save();
            }
        });

        // Check if all items are checked
        const allItemsChecked = order.items.every(item => item.ischecked);
        if (allItemsChecked) {
            order.isCompleted = true;
        }

        await order.save();
        res.json({ success: true, message: 'Order completed successfully' });
    } catch (error) {
        console.error('Error completing order:', error);
        res.status(500).json({ success: false, message: 'Failed to complete order' });
    }
});

app.get('/deliver-items', authenticateToken, async (req, res) => {
    // get orders where the logged in user is the seller of at least one item and the order is not completed
    try {
        const orders = await Order.find({ 'items.seller': req.user._id, isCompleted: false }).populate('items.item').populate('buyer', 'firstname surname');
        const filteredOrders = orders.map(order => {
            order.items = order.items.filter(item => item.seller.toString() === req.user._id.toString());
            return order;
        });
        res.json(filteredOrders);
    } catch (error) {
        console.error('Error fetching deliver items:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch deliver items' });
    }
});

// give a logout endpoint

app.post('/logout', (req, res) => {
    res.clearCookie('token').send('Logged out successfully');
});

app.listen(4000, () => console.log('Server running on port 4000'));