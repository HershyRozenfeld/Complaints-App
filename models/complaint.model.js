import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['food', 'equipment', 'commands', 'other'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a complaint message'],
        maxlength: [500, 'Complaint message cannot be more than 500 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Complaint', ComplaintSchema);