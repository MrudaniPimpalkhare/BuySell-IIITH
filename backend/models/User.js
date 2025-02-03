import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const UserSchema = new Schema({
    firstname: String,
    surname: String,
    email: {
        type: String,
        unique: true,
        // the email must be an IIIT email address, the end must be iiit.ac.in        
        required: true
    },
    age: Number,
    contact: Number,
    password: String,
    cart: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: 'Item',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: [1, 'Quantity cannot be less than 1.']
            },
        }
    ],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('User', UserSchema);