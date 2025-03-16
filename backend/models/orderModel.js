import mongoose from "mongoose";

function generateRandomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: { 
        type: Array, 
        required: true
    },
    amount: { 
        type: Number, 
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: "Felvettük rendelésed"
    },
    note: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: () => new Date(),
        required: true
    },
    payment: {
        type: Boolean,
        default: false
    },
    randomCode: {
        type: String,
        required: true,
        unique: true,
        default: generateRandomCode
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add a virtual field for formatted date
orderSchema.virtual('formattedDate').get(function() {
    if (!this.date) return '';
    
    try {
        return this.date.toLocaleString('hu-HU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return '';
    }
});

// Ensure unique randomCode
orderSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('randomCode')) {
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isUnique && attempts < maxAttempts) {
            const existingOrder = await mongoose.models.order.findOne({ randomCode: this.randomCode });
            if (!existingOrder) {
                isUnique = true;
            } else {
                this.randomCode = generateRandomCode();
                attempts++;
            }
        }

        if (!isUnique) {
            return next(new Error('Unable to generate unique random code after multiple attempts'));
        }
    }
    next();
});

// Add index for randomCode
orderSchema.index({ randomCode: 1 }, { unique: true });

// Check if the model already exists before creating a new one
const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
