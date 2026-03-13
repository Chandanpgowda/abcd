const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const { 
  getDashboard, 
  // Event management
  getEvents, 
  addEvent, 
  postEvent, 
  deleteEvent,
  editEvent,
  updateEvent,
  // Gallery management
  getGallery,
  addGalleryImage,
  postGalleryImage,
  editGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  // Team management
  getTeam,
  addTeamMember,
  postTeamMember,
  editTeamMember,
  updateTeamMember,
  deleteTeamMember,
  // Announcement management
  getAnnouncements,
  addAnnouncement,
  postAnnouncement,
  editAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  // Message management
  getMessages,
  deleteMessage,
  // Registration management
  getRegistrations,
  deleteRegistration,
  exportRegistrations   // ✅ Added
} = require('../controllers/adminController');

// All routes below require admin authentication
router.use(isAdmin);

// Admin dashboard
router.get('/', getDashboard);

// Team management
router.get('/team', getTeam);
router.get('/team/new', addTeamMember);
router.post('/team', postTeamMember);
router.get('/team/edit/:id', editTeamMember);
router.post('/team/edit/:id', updateTeamMember);
router.post('/team/delete/:id', deleteTeamMember);

// Event management
router.get('/events', getEvents);
router.get('/events/new', addEvent);
router.post('/events', postEvent);
router.get('/events/edit/:id', editEvent);
router.post('/events/edit/:id', updateEvent);
router.post('/events/delete/:id', deleteEvent);

// Gallery management
router.get('/gallery', getGallery);
router.get('/gallery/new', addGalleryImage);
router.post('/gallery', postGalleryImage);
router.get('/gallery/edit/:id', editGalleryImage);
router.post('/gallery/edit/:id', updateGalleryImage);
router.post('/gallery/delete/:id', deleteGalleryImage);

// Announcement management
router.get('/announcements', getAnnouncements);
router.get('/announcements/new', addAnnouncement);
router.post('/announcements', postAnnouncement);
router.get('/announcements/edit/:id', editAnnouncement);
router.post('/announcements/edit/:id', updateAnnouncement);
router.post('/announcements/delete/:id', deleteAnnouncement);

// Message management
router.get('/messages', getMessages);
router.post('/messages/delete/:id', deleteMessage);

// Registration management
router.get('/registrations', getRegistrations);
router.get('/registrations/export', exportRegistrations);   // ✅ Added
router.post('/registrations/delete/:id', deleteRegistration);

module.exports = router;