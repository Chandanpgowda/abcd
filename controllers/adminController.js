const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Team = require('../models/Team');
const Announcement = require('../models/Announcement');
const Message = require('../models/Message');
const Registration = require('../models/Registration');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ========== ADMIN DASHBOARD ==========
exports.getDashboard = (req, res) => {
  res.render('admin/dashboard', {
    success_msg: req.flash('success'),
    error_msg: req.flash('error')
  });
};

// ========== EVENT MANAGEMENT ==========

// List all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.render('admin/events', {
      events,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not fetch events');
    res.redirect('/admin');
  }
};

// Show add event form
exports.addEvent = (req, res) => {
  res.render('admin/add-event', {
    success_msg: req.flash('success'),
    error_msg: req.flash('error')
  });
};

// Handle event creation with image upload and Google Form link
exports.postEvent = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, description, type, date, googleFormUrl } = req.body;
      const image = req.file ? '/uploads/' + req.file.filename : '';
      
      await Event.create({ 
        title, 
        description, 
        type, 
        date, 
        image, 
        googleFormUrl: googleFormUrl || '' 
      });
      
      req.flash('success', 'Event added successfully');
      res.redirect('/admin/events');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to add event');
      res.redirect('/admin/events/new');
    }
  }
];

// Show edit event form
exports.editEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/admin/events');
    }
    res.render('admin/edit-event', {
      event,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load event');
    res.redirect('/admin/events');
  }
};

// Handle event update
exports.updateEvent = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, description, type, date, googleFormUrl } = req.body;
      const event = await Event.findById(req.params.id);
      if (!event) {
        req.flash('error', 'Event not found');
        return res.redirect('/admin/events');
      }

      event.title = title;
      event.description = description;
      event.type = type;
      event.date = date;
      event.googleFormUrl = googleFormUrl || '';

      if (req.file) {
        event.image = '/uploads/' + req.file.filename;
      }

      await event.save();
      req.flash('success', 'Event updated successfully');
      res.redirect('/admin/events');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to update event');
      res.redirect('/admin/events/edit/' + req.params.id);
    }
  }
];

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    req.flash('success', 'Event deleted');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Delete failed');
  }
  res.redirect('/admin/events');
};

// ========== GALLERY MANAGEMENT ==========

// List all gallery images
exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });
    res.render('admin/gallery', {
      images,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not fetch gallery');
    res.redirect('/admin');
  }
};

// Show add image form
exports.addGalleryImage = (req, res) => {
  res.render('admin/add-gallery', {
    success_msg: req.flash('success'),
    error_msg: req.flash('error')
  });
};

// Handle image upload
exports.postGalleryImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title } = req.body;
      if (!req.file) {
        req.flash('error', 'Please select an image');
        return res.redirect('/admin/gallery/new');
      }
      const image = '/uploads/' + req.file.filename;
      
      await Gallery.create({ title, image });
      
      req.flash('success', 'Image added to gallery');
      res.redirect('/admin/gallery');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to upload image');
      res.redirect('/admin/gallery/new');
    }
  }
];

// Show edit gallery image form
exports.editGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      req.flash('error', 'Image not found');
      return res.redirect('/admin/gallery');
    }
    res.render('admin/edit-gallery', {
      image,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load image');
    res.redirect('/admin/gallery');
  }
};

// Handle gallery image update
exports.updateGalleryImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title } = req.body;
      const galleryImage = await Gallery.findById(req.params.id);
      if (!galleryImage) {
        req.flash('error', 'Image not found');
        return res.redirect('/admin/gallery');
      }

      galleryImage.title = title;

      if (req.file) {
        galleryImage.image = '/uploads/' + req.file.filename;
      }

      await galleryImage.save();
      req.flash('success', 'Gallery image updated successfully');
      res.redirect('/admin/gallery');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to update image');
      res.redirect('/admin/gallery/edit/' + req.params.id);
    }
  }
];

// Delete gallery image
exports.deleteGalleryImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    req.flash('success', 'Image deleted');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Delete failed');
  }
  res.redirect('/admin/gallery');
};

// ========== TEAM MANAGEMENT ==========

// List all team members
exports.getTeam = async (req, res) => {
  try {
    const members = await Team.find().sort({ order: 1 });
    res.render('admin/team', {
      members,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not fetch team members');
    res.redirect('/admin');
  }
};

// Show add member form
exports.addTeamMember = (req, res) => {
  res.render('admin/add-team', {
    success_msg: req.flash('success'),
    error_msg: req.flash('error')
  });
};

// Handle member creation with photo upload
exports.postTeamMember = [
  upload.single('photo'),
  async (req, res) => {
    try {
      const { name, role, linkedin, github, order } = req.body;
      const photo = req.file ? '/uploads/' + req.file.filename : '';
      
      await Team.create({
        name,
        role,
        photo,
        linkedin: linkedin || '',
        github: github || '',
        order: order || 0
      });
      
      req.flash('success', 'Team member added');
      res.redirect('/admin/team');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to add member');
      res.redirect('/admin/team/new');
    }
  }
];

// Show edit team member form
exports.editTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      req.flash('error', 'Team member not found');
      return res.redirect('/admin/team');
    }
    res.render('admin/edit-team', {
      member,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load team member');
    res.redirect('/admin/team');
  }
};

// Handle team member update
exports.updateTeamMember = [
  upload.single('photo'),
  async (req, res) => {
    try {
      const { name, role, linkedin, github, order } = req.body;
      const member = await Team.findById(req.params.id);
      if (!member) {
        req.flash('error', 'Team member not found');
        return res.redirect('/admin/team');
      }

      member.name = name;
      member.role = role;
      member.linkedin = linkedin || '';
      member.github = github || '';
      member.order = order || 0;

      if (req.file) {
        member.photo = '/uploads/' + req.file.filename;
      }

      await member.save();
      req.flash('success', 'Team member updated successfully');
      res.redirect('/admin/team');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to update team member');
      res.redirect('/admin/team/edit/' + req.params.id);
    }
  }
];

// Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    req.flash('success', 'Member deleted');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Delete failed');
  }
  res.redirect('/admin/team');
};

// ========== ANNOUNCEMENTS MANAGEMENT ==========

// List all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.render('admin/announcements', {
      announcements,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not fetch announcements');
    res.redirect('/admin');
  }
};

// Show add announcement form
exports.addAnnouncement = (req, res) => {
  res.render('admin/add-announcement', {
    success_msg: req.flash('success'),
    error_msg: req.flash('error')
  });
};

// Handle announcement creation
exports.postAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    await Announcement.create({ title, content });
    req.flash('success', 'Announcement added');
    res.redirect('/admin/announcements');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add announcement');
    res.redirect('/admin/announcements/new');
  }
};

// Show edit announcement form
exports.editAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      req.flash('error', 'Announcement not found');
      return res.redirect('/admin/announcements');
    }
    res.render('admin/edit-announcement', {
      announcement,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load announcement');
    res.redirect('/admin/announcements');
  }
};

// Handle announcement update
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      req.flash('error', 'Announcement not found');
      return res.redirect('/admin/announcements');
    }

    announcement.title = title;
    announcement.content = content;

    await announcement.save();
    req.flash('success', 'Announcement updated successfully');
    res.redirect('/admin/announcements');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update announcement');
    res.redirect('/admin/announcements/edit/' + req.params.id);
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    req.flash('success', 'Announcement deleted');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Delete failed');
  }
  res.redirect('/admin/announcements');
};

// ========== MESSAGE MANAGEMENT ==========

// List all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.render('admin/messages', {
      messages,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not fetch messages');
    res.redirect('/admin');
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    req.flash('success', 'Message deleted');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Delete failed');
  }
  res.redirect('/admin/messages');
};

// ========== REGISTRATION MANAGEMENT ==========

// List all registrations (with event details populated)
exports.getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('eventId')
      .sort({ registeredAt: -1 });
    res.render('admin/registrations', {
      registrations,
      success_msg: req.flash('success'),
      error_msg: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not fetch registrations');
    res.redirect('/admin');
  }
};

// Delete a registration
exports.deleteRegistration = async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    req.flash('success', 'Registration deleted');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Delete failed');
  }
  res.redirect('/admin/registrations');
};

// ========== EXPORT REGISTRATIONS ==========

// Export registrations as CSV
exports.exportRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('eventId')
      .sort({ registeredAt: -1 });

    const fields = ['Event', 'Name', 'Email', 'Phone', 'Registered On'];
    const csvRows = [];
    csvRows.push(fields.join(','));

    registrations.forEach(reg => {
      const eventTitle = reg.eventId ? reg.eventId.title : 'Deleted Event';
      const name = reg.name.replace(/,/g, ' ');
      const email = reg.email;
      const phone = reg.phone;
      const date = new Date(reg.registeredAt).toLocaleString();
      const row = [eventTitle, name, email, phone, date].map(field => `"${field}"`).join(',');
      csvRows.push(row);
    });

    const csvString = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
    res.send(csvString);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not export registrations');
    res.redirect('/admin/registrations');
  }
};