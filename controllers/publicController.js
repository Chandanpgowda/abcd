const emailHelper = require('../utils/email');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Team = require('../models/Team');
const Announcement = require('../models/Announcement');
const Message = require('../models/Message');
const Registration = require('../models/Registration');
const Achievement = require('../models/Achievement');
const Faq = require('../models/Faq');

// Home page
exports.getHome = async (req, res) => {
  try {
    const latestEvents = await Event.find({ type: 'upcoming' }).sort({ date: 1 }).limit(3);
    res.render('pages/index', {
      latestEvents,
      title: 'Home',
      metaDescription: 'TechSpark – the heartbeat of tech at Navkis College of Engineering. Code, build, compete, and innovate.',
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      ogImage: '/logo.png'
    });
  } catch (err) {
    console.error('Home page error:', err);
    res.render('pages/index', { 
      latestEvents: [], 
      title: 'Home' 
    });
  }
};

// About page
exports.getAbout = (req, res) => {
  res.render('pages/about', {
    title: 'About Us',
    metaDescription: 'Learn about TechSpark – our mission, vision, founding, activities, and why you should join.',
    currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
    ogImage: '/logo.png'
  });
};

// Events page
exports.getEvents = async (req, res) => {
  try {
    const upcoming = await Event.find({ type: 'upcoming' }).sort({ date: 1 });
    const past = await Event.find({ type: 'past' }).sort({ date: -1 });
    res.render('pages/events', {
      upcoming,
      past,
      title: 'Events',
      metaDescription: 'Check out upcoming and past events organized by TechSpark – coding competitions, robotics, gaming tournaments and more.',
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      ogImage: '/logo.png'
    });
  } catch (err) {
    console.error('Events page error:', err);
    res.render('pages/events', { 
      upcoming: [], 
      past: [], 
      title: 'Events' 
    });
  }
};

// Gallery page
exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });
    res.render('pages/gallery', {
      images,
      title: 'Gallery',
      metaDescription: 'Browse photos and moments from TechSpark events and activities.',
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      ogImage: images.length > 0 ? images[0].image : '/logo.png'
    });
  } catch (err) {
    console.error('Gallery page error:', err);
    res.render('pages/gallery', { 
      images: [], 
      title: 'Gallery' 
    });
  }
};

// Team page
exports.getTeam = async (req, res) => {
  try {
    const members = await Team.find().sort({ order: 1 });
    res.render('pages/team', {
      members,
      title: 'Our Team',
      metaDescription: 'Meet the passionate team behind TechSpark – coordinators, leads, and core members.',
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      ogImage: '/logo.png'
    });
  } catch (err) {
    console.error('Team page error:', err);
    res.render('pages/team', { 
      members: [], 
      title: 'Our Team' 
    });
  }
};

// Announcements page
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.render('pages/announcements', {
      announcements,
      title: 'Announcements',
      metaDescription: 'Stay updated with the latest news, hackathons, workshops, and announcements from TechSpark.',
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      ogImage: '/logo.png'
    });
  } catch (err) {
    console.error('Announcements page error:', err);
    res.render('pages/announcements', { 
      announcements: [], 
      title: 'Announcements' 
    });
  }
};

// Achievements page
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, date: -1 });
    const featuredAchievements = achievements.filter(a => a.featured);
    res.render('pages/achievements', {
      achievements,
      featuredAchievements,
      title: 'Achievements',
      metaDescription: 'Explore TechSpark’s awards, competition wins, workshops, and testimonials.',
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      ogImage: achievements.length > 0 && achievements[0].image ? achievements[0].image : '/logo.png'
    });
  } catch (err) {
    console.error('Achievements page error:', err);
    res.render('pages/achievements', { 
      achievements: [], 
      featuredAchievements: [], 
      title: 'Achievements' 
    });
  }
};

// FAQ page
exports.getFaq = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, category: 1 });
    const grouped = {};
    faqs.forEach(faq => {
      if (!grouped[faq.category]) grouped[faq.category] = [];
      grouped[faq.category].push(faq);
    });
    res.render('pages/faq', {
      grouped,
      title: 'FAQ',
      metaDescription: 'Frequently asked questions about TechSpark – membership, events, and how to join.',
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      ogImage: '/logo.png'
    });
  } catch (err) {
    console.error('FAQ page error:', err);
    res.render('pages/faq', { 
      grouped: {}, 
      title: 'FAQ' 
    });
  }
};

// Contact page
exports.getContact = (req, res) => {
  res.render('pages/contact', {
    success_msg: req.flash('success'),
    error_msg: req.flash('error'),
    title: 'Contact Us',
    metaDescription: 'Get in touch with TechSpark. Email, Instagram, and contact form.',
    currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
    ogImage: '/logo.png'
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

    const newMessage = await Message.create({ name, email, subject, message });
    
    await emailHelper.sendContactNotification({
      name,
      email,
      subject,
      message,
      createdAt: newMessage.createdAt || new Date()
    });

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
      success_msg: req.flash('success'),
      title: 'Register for ' + event.title,
      metaDescription: `Register for ${event.title} – ${event.description.substring(0,150)}`,
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      ogImage: event.image || '/logo.png',
      noindex: true // prevent search engines from indexing registration pages
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

    const existing = await Registration.findOne({ eventId, email });
    if (existing) {
      req.flash('error', 'You have already registered for this event');
      return res.redirect(`/events/register/${eventId}`);
    }

    const registration = await Registration.create({ eventId, name, email, phone });

    await emailHelper.sendRegistrationNotification({
      name,
      email,
      phone,
      registeredAt: registration.registeredAt || new Date()
    }, event);

    req.flash('success', 'Registration successful! We will contact you soon.');
    res.redirect('/events');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect(`/events/register/${req.params.id}`);
  }
};