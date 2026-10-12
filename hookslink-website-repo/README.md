# Hookslink website

New website for **Hookslink**, The AI-Powered Creative Agency (UK digital marketing agency, Ferryhill).

## Structure

```
index.html            All four pages (Home, About, Services, Contact), switched with #home, #about, #services, #contact
assets/css/style.css  Styles (brand colours, type, layout, responsive)
assets/js/main.js     Page switching, scroll animations, navbar glass effect, globe, menus
assets/img/           Logos, client logos, project screenshots, hero and Earth images
```

## Run locally

Serve the folder (the night-Earth globe needs http/https to load its image):

```
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Before going live

- Connect the contact form and free-audit form to an email service (e.g. Formspree, Netlify Forms, HubSpot).
- Confirm stats, package prices, FAQ answers and the WhatsApp number (07871 780500).
- Replace testimonial and case-study placeholders with real reviews and results.
- Add the remaining client logos (Tam Chicken, SK & Family Transport, Agnes Road, Everstar Maintenance, Wensley).
