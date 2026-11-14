# Joseph Aretola - COS 106 Portfolio

A responsive student portfolio and academic planner created for **COS 106: Introduction to Web Technologies**.

## Student Information

- **Name:** Joseph Aretola
- **Matric number:** 2025/C/SENG/0798
- **Department:** Software Engineering
- **Institution:** Miva Open University
- **Email:** j.aretola6883@miva.edu.ng

## Overview

This project presents Joseph's academic profile, skills, projects, and interests through a responsive multi-page website. It also includes an interactive academic planner and a contact form for sending inquiries by email.

The website demonstrates:

- Semantic HTML5
- Responsive CSS with Flexbox and Grid
- CSS animations and reduced-motion accessibility support
- JavaScript DOM manipulation and event handling
- Form validation
- Local storage for planner tasks
- Audio and video multimedia
- Project filtering

## Pages

| Page | File | Description |
| --- | --- | --- |
| Home | [`pages/index.html`](pages/index.html) | Introduction, profile summary, statistics, and audio introduction |
| About Me | [`pages/about.html`](pages/about.html) | Biography, education, skills, interests, and academic information |
| Projects | [`pages/projects.html`](pages/projects.html) | Project showcase, category filters, and video demonstration |
| Academic Planner | [`pages/planner.html`](pages/planner.html) | Add, search, complete, and delete study tasks |
| Contact | [`pages/contact.html`](pages/contact.html) | Validated contact form for sending inquiries |

## Project Structure

```text
cos106-webtech-portfolio/
├── pages/
│   ├── index.html
│   ├── about.html
│   ├── projects.html
│   ├── planner.html
│   └── contact.html
├── css/
│   └── style.css
├── js/
│   ├── core/
│   │   └── main.js
│   └── pages/
│       ├── contact.js
│       ├── planner.js
│       └── projects.js
├── assets/
│   ├── images/
│   └── media/
└── README.md
```

### JavaScript modules

- `js/core/main.js` contains shared navigation, active-link handling, scroll behavior, and footer updates.
- `js/pages/contact.js` handles validation, the `Other` inquiry option, and FormSubmit requests.
- `js/pages/planner.js` manages planner tasks and saves them in the browser's `localStorage`.
- `js/pages/projects.js` controls project category filtering.

## Main Features

### Responsive design

The layout adapts to desktop, tablet, and mobile screen sizes using CSS Grid, Flexbox, media queries, and a mobile navigation menu.

### Animations

Page entrances, section reveals, cards, profile elements, and skill bars use CSS animations. Users who enable reduced motion in their operating system receive a less animated experience.

### Academic planner

The planner allows users to:

- Add study tasks
- Assign task categories and priorities
- Search tasks
- Filter tasks by status
- Mark tasks as complete
- Delete tasks
- View task statistics

Tasks are stored locally in the browser, so they remain available after refreshing the page on the same device and browser.

### Contact form

The contact form validates required fields, email addresses, phone numbers, and custom inquiry purposes. Submissions are sent through [FormSubmit](https://formsubmit.co/) to `j.aretola6883@miva.edu.ng`.

FormSubmit may require a one-time email confirmation before the first message is delivered. The form must be tested from a hosted site or a local server; opening the HTML files directly is not recommended.

## Run Locally

The project uses only HTML, CSS, JavaScript, and media files. No package installation is required.

### Option 1: Python local server

From the project directory, run:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/pages/index.html
```

Stop the server with `Ctrl+C`.

### Option 2: VS Code Live Server

1. Open the project folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Open `pages/index.html`.
4. Choose **Open with Live Server**.

## Testing Checklist

- Open every page from the navigation menu.
- Confirm images, icons, audio, and video load.
- Test project category filters.
- Add, complete, search, and delete planner tasks.
- Refresh the planner and confirm tasks persist.
- Submit invalid contact form values and confirm validation messages appear.
- Select `Other` under Purpose of Inquiry and enter a custom purpose.
- Submit a valid contact form and confirm the success message is displayed.
- Check the pages on desktop and mobile screen sizes.

## Hosting

This is a static website and can be hosted on GitHub Pages, Netlify, or Vercel.

The included [`vercel.json`](vercel.json) file routes the Vercel root URL to
`pages/index.html`, so the homepage works even though the HTML files are
organized inside the `pages/` folder.

### Vercel

1. Import the project repository into Vercel.
2. Keep the framework preset as **Other**.
3. Leave the build command empty.
4. Leave the output directory empty.
5. Deploy the project.

Open the generated Vercel domain. The root URL should display the homepage.

### GitHub Pages

1. Push the project to a GitHub repository.
2. Open **Settings > Pages**.
3. Select the `main` branch and the root folder.
4. Open the generated site URL followed by `/pages/index.html`.

Because the HTML pages are organized inside `pages/`, the homepage URL is:

```text
https://cos106-webtech-portfolio.vercel.app/
```

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Web Storage API
- FormSubmit AJAX API
- SVG
- WAV audio
- MP4 video

## License

This project is an academic portfolio created for COS 106. Unless otherwise stated, the personal content, photograph, and project materials belong to Joseph Aretola.
