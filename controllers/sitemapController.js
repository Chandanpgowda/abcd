const Event = require('../models/Event');
// If you have other dynamic pages (like achievement details, announcement details), import them here

exports.getSitemap = async (req, res) => {
  // Use your live domain here – change if different
  const baseUrl = 'https://techspark-club.onrender.com';

  // List of static pages (adjust if any page is missing)
  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/events', changefreq: 'daily', priority: 0.9 },
    { url: '/gallery', changefreq: 'weekly', priority: 0.7 },
    { url: '/team', changefreq: 'monthly', priority: 0.7 },
    { url: '/announcements', changefreq: 'daily', priority: 0.8 },
    { url: '/achievements', changefreq: 'monthly', priority: 0.7 },
    { url: '/faq', changefreq: 'monthly', priority: 0.6 },
    { url: '/contact', changefreq: 'yearly', priority: 0.5 }
  ];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  staticPages.forEach(page => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Optional: Add dynamic pages (e.g., individual event pages) if you have them
  // Example for event detail pages – uncomment if you have a route like /events/:id
  /*
  const events = await Event.find().select('_id updatedAt');
  events.forEach(event => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/events/${event._id}</loc>\n`;
    sitemap += `    <lastmod>${event.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.6</priority>\n`;
    sitemap += `  </url>\n`;
  });
  */

  sitemap += '</urlset>';

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
};