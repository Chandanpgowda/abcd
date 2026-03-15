const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Optional logs (you can keep or remove)
console.log('adminController.getEvents is', typeof adminController.getEvents);
console.log('adminController.getGallery is', typeof adminController.getGallery);
console.log('adminController.getTeam is', typeof adminController.getTeam);
console.log('adminController.getAnnouncements is', typeof adminController.getAnnouncements);
console.log('adminController.getMessages is', typeof adminController.getMessages);
console.log('adminController.getRegistrations is', typeof adminController.getRegistrations);
console.log('adminController.exportRegistrations is', typeof adminController.exportRegistrations);
console.log('adminController.getAchievements is', typeof adminController.getAchievements);
console.log('adminController.getFaqs is', typeof adminController.getFaqs); // ✅ Added

// All routes below require admin authentication
router.use(isAdmin);

// Dashboard
router.get('/', adminController.getDashboard);
router.get('/stats', adminController.getDashboardStats);

// Event management
router.get('/events', adminController.getEvents);
router.get('/events/new', adminController.addEvent);
router.post('/events', adminController.postEvent);
router.get('/events/edit/:id', adminController.editEvent);
router.post('/events/edit/:id', adminController.updateEvent);
router.post('/events/delete/:id', adminController.deleteEvent);

// Gallery management
router.get('/gallery', adminController.getGallery);
router.get('/gallery/new', adminController.addGalleryImage);
router.post('/gallery', adminController.postGalleryImage);
router.get('/gallery/edit/:id', adminController.editGalleryImage);
router.post('/gallery/edit/:id', adminController.updateGalleryImage);
router.post('/gallery/delete/:id', adminController.deleteGalleryImage);

// Team management
router.get('/team', adminController.getTeam);
router.get('/team/new', adminController.addTeamMember);
router.post('/team', adminController.postTeamMember);
router.get('/team/edit/:id', adminController.editTeamMember);
router.post('/team/edit/:id', adminController.updateTeamMember);
router.post('/team/delete/:id', adminController.deleteTeamMember);

// Announcement management
router.get('/announcements', adminController.getAnnouncements);
router.get('/announcements/new', adminController.addAnnouncement);
router.post('/announcements', adminController.postAnnouncement);
router.get('/announcements/edit/:id', adminController.editAnnouncement);
router.post('/announcements/edit/:id', adminController.updateAnnouncement);
router.post('/announcements/delete/:id', adminController.deleteAnnouncement);

// Message management
router.get('/messages', adminController.getMessages);
router.post('/messages/delete/:id', adminController.deleteMessage);

// Registration management
router.get('/registrations', adminController.getRegistrations);
router.get('/registrations/export', adminController.exportRegistrations);
router.post('/registrations/delete/:id', adminController.deleteRegistration);

// Achievement management
router.get('/achievements', adminController.getAchievements);
router.get('/achievements/new', adminController.addAchievement);
router.post('/achievements', adminController.postAchievement);
router.get('/achievements/edit/:id', adminController.editAchievement);
router.post('/achievements/edit/:id', adminController.updateAchievement);
router.post('/achievements/delete/:id', adminController.deleteAchievement);

// FAQ management (NEW)
router.get('/faqs', adminController.getFaqs);
router.get('/faqs/new', adminController.addFaq);
router.post('/faqs', adminController.postFaq);
router.get('/faqs/edit/:id', adminController.editFaq);
router.post('/faqs/edit/:id', adminController.updateFaq);
router.post('/faqs/delete/:id', adminController.deleteFaq);

module.exports = router;