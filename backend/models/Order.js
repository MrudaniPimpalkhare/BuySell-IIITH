import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const OrderSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
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
            seller: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            ischecked: {
                type: Boolean,
                default: false
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'Total price cannot be negative.']
    },
    otp: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// pre hook that deletes when numver of items is zero
// OrderSchema.pre('save', async function(next) {
//     if (this.items.length === 0) {
//         await this.delete();
//     }
//     next();
// });

// Pre-save hook to hash OTP
// OrderSchema.pre('save', async function(next) {
//     if (this.isModified('otp')) {
//         const salt = await bcrypt.genSalt(10);
//         this.otp = await bcrypt.hash(this.otp, salt);
//     }
//     next();
// });

export default mongoose.model('Order', OrderSchema);