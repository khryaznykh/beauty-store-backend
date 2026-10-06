const { model, Schema } = require("mongoose");

const ReviewSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    rating: {type: Number, required: true},

    headline: {type: String},
    review: {type: String, required: true},
    recommend: {type: String, required: true},
    
    status: {
        type: String,
        enum: ["PENDING", "PUBLISHED", "REJECTED"],
        default: "PENDING"
    },
    editedAt: {
        type: Date,
        default: null
    }
},
{ 
    timestamps: true,
})

module.exports = model('Reviews', ReviewSchema)