import mongoose from "mongoose";
import { Schema } from "mongoose";

const ItemSchema = new Schema({
    name: String,
    price: Number,
    quantity: Number,
    // add category which can be one out of the following: 'Electronics', 'Clothing', 'Furniture', 'Books', 'Other'
    category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Furniture', 'Books','Food' ,'Other'],
        default: 'Other',
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ratings: [
        {
            user:{
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            rating:{
                type: Number,
                default: 2.5,
                min: [1, 'Rating cannot be less than 1.'],
                max: [5, 'Rating cannot be more than 5.']
            }
        }
    ]
    
});

export default mongoose.model("Item", ItemSchema);