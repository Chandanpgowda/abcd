const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Team = require('../models/Team');
const Announcement = require('../models/Announcement');
const Message = require('../models/Message');
const Registration = require('../models/Registration'); // ✅ Added for event registration

// Home page – show latest upcoming events
exports.getHome = async (req, res) => {
  try {
    const latestEvents = await Event.find({ type: 'upcoming' }).sort({ date: 1 }).limit(3);
    res.render('pages/index', { latestEvents });
  } catch (err) {
    console.error('Home page error:', err);
    res.render('pages/index', { latestEvents: [] });
  }
};

// About page
exports.getAbout = (req, res) => {
  res.render('pages/about');
};

// Events page – show upcoming and past events
exports.getEvents = async (req, res) => {
  try {
    const upcoming = await Event.find({ type: 'upcoming' }).sort({ date: 1 });
    const past = await Event.find({ type: 'past' }).sort({ date: -1 });
    res.render('pages/events', { upcoming, past });
  } catch (err) {
    console.error('Events page error:', err);
    res.render('pages/events', { upcoming: [], past: [] });
  }
};

// Gallery page – show all images
exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });
    res.render('pages/gallery', { images });
  } catch (err) {
    console.error('Gallery page error:', err);
    res.render('pages/gallery', { images: [] });
  }
};

// Team page – show all members
exports.getTeam = async (req, res) => {
  try {
    const members = await Team.find().sort({ order: 1 });
    res.render('pages/team', { members });
  } catch (err) {
    console.error('Team page error:', err);
    res.render('pages/team', { members: [] });
  }
};

// Announcements page – show all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.render('pages/announcements', { announcements });
  } catch (err) {
    console.error('Announcements page error:', err);
    res.render('pages/announcements', { announcements: [] });
  }
};

// Contact page – show form
exports.getContact = (req, res) => {
  res.render('pages/contact', {
    success_msg: req.flash('success'),
    error_msg: req.flash('error')
  });
};

// Handle contact form submission
exports.postContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      req.flash('error', 'All fields are required');
      return res.redirect('/contact');
    }

    await Message.create({ name, email, subject, message });
    
    req.flash('success', 'Your message has been sent successfully!');
    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/contact');
  }
};

// ========== EVENT REGISTRATION ==========

// Show registration form for a specific event
exports.getRegisterForm = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/events');
    }
    if (event.type !== 'upcoming') {
      req.flash('error', 'Registration is only open for upcoming events');
      return res.redirect('/events');
    }
    res.render('pages/register', { 
      event, 
      error_msg: req.flash('error'), 
      success_msg: req.flash('success') 
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/events');
  }
};

// Handle registration submission
exports.postRegistration = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const eventId = req.params.id;

    if (!name || !email || !phone) {
      req.flash('error', 'All fields are required');
      return res.redirect(`/events/register/${eventId}`);
    }

    const event = await Event.findById(eventId);
    if (!event || event.type !== 'upcoming') {
      req.flash('error', 'This event is not available for registration');
      return res.redirect('/events');
    }

    // Prevent duplicate registration (same email for same event)
    const existing = await Registration.findOne({ eventId, email });
    if (existing) {
      req.flash('error', 'You have already registered for this event');
      return res.redirect(`/events/register/${eventId}`);
    }

    await Registration.create({ eventId, name, email, phone });

    req.flash('success', 'Registration successful! We will contact you soon.');
    res.redirect('/events');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect(`/events/register/${req.params.id}`);
  }
};