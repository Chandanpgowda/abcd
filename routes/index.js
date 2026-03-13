const express = require('express');
const router = express.Router();
const { 
  getHome, 
  getAbout, 
  getEvents, 
  getGallery, 
  getTeam, 
  getAnnouncements, 
  getContact,
  postContact,
  getRegisterForm,
  postRegistration
} = require('../controllers/publicController');

router.get('/', getHome);
router.get('/about', getAbout);
router.get('/events', getEvents);
router.get('/gallery', getGallery);
router.get('/team', getTeam);
router.get('/announcements', getAnnouncements);
router.get('/contact', getContact);
router.post('/contact', postContact);

// Event registration routes
router.get('/events/register/:id', getRegisterForm);
router.post('/events/register/:id', postRegistration);

module.exports = router;