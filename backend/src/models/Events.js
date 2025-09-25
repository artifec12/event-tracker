import mongoose from 'mongoose';
import crypto from 'crypto';

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        description: { type: String },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        shareToken: { type: String, unique: true },
    },
    { timestamps: true }
);

eventSchema.pre('save', function (next) {
    if (!this.shareToken) {
        this.shareToken = crypto.randomBytes(16).toString('hex');
    }
    next();
});

export default mongoose.model('Event', eventSchema);

// {
//   "title": "React Workshop",
//   "date": "2025-10-15T14:30:00.000Z",
//   "location": "Zoom Online",
//   "description": "A hands-on workshop covering React hooks, state, and context API."
// }
