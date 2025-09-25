import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';
import Event from '../models/Events.js';

const router = express.Router();

router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const { title, date, location, description } = req.body;
        if (!title || !date || !location) {
            return res.status(400).json({
                message: 'Title, date, and location are required fields',
            });
        }

        const newEvent = await Event.create({
            title,
            date,
            location,
            description,
            owner: req.user.id,
        });
        return res.status(201).json({ message: 'Event created', newEvent });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating event',
            error: error.message,
        });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const { filter, sort = 'asc' } = req.query;
        let query = { owner: req.user.id };

        if (filter === 'upcoming') {
            query.date = { $gte: new Date() };
        } else if (filter === 'past') {
            query.date = { $lt: new Date() };
        }

        const sortOrder = sort === 'desc' ? -1 : 1;
        const events = await Event.find(query).sort({ date: sortOrder });

        return res.status(200).json({ message: 'Success', events });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Error fetching events', error: error.message });
    }
});

router.get('/share/:token', async (req, res) => {
    const event = await Event.findOne({ shareToken: req.params.token }).select(
        `title date location description`
    );

    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.json(event);
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, location, description } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (
            event.owner.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res
                .status(403)
                .json({ message: 'Not allowed to update this event' });
        }

        if (title) event.title = title;
        if (date) event.date = date;
        if (location) event.location = location;
        if (description) event.description = description;

        await event.save();
        return res.status(200).json({ message: 'Event updated', event });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Error updating event', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (
            event.owner.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res
                .status(403)
                .json({ message: 'Not allowed to delete this event' });
        }

        await Event.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Error deleting event', error: error.message });
    }
});

router.post(
    '/bulk-share',
    authMiddleware,
    requireRole('admin'),
    async (req, res) => {
        try {
            const { eventIds } = req.body;
            if (!Array.isArray(eventIds) || eventIds.length === 0) {
                return res
                    .status(400)
                    .json({ message: 'EventIds array required' });
            }
            const events = await Event.find({ _id: { $in: eventIds } }).select(
                'title date location description shareToken'
            );
            if (events.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No events found for given IDs' });
            }
            const shareLinks = events.map((event) => ({
                id: event._id,
                title: event.title,
                shareUrl: `${process.env.APP_URL}/events/share/${event.shareToken}`,
            }));
            return res
                .status(200)
                .json({ message: 'Bulk share links generated', shareLinks });
        } catch (error) {
            return res.status(500).json({
                message: 'Error generating bulk share links',
                error: error.message,
            });
        }
    }
);
export default router;
