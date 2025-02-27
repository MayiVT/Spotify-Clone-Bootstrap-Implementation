# Spotify Clone

This project is a Spotify Clone developed as an exam project for the DAW (Web Application Development) course. It aims to recreate the core functionality and design of Spotify's web interface while adhering to specific technical constraints and requirements.

## Project Requirements & Constraints

### Technical Limitations
- No external CSS files allowed
- No JavaScript frameworks permitted
- Bootstrap is the only allowed framework
- All styling must be done using Bootstrap classes and inline styles
- Website must be developed purely in HTML

### Minimum Requirements
1. Website must utilize Bootstrap's grid system
2. Has to contain 5 pages (excluding the main page)
3. Implementation of Bootstrap buttons
4. Integration of FontAwesome icons
5. Proper use of pagination (Rows, Columns)
6. Navigation bars
7. Modal windows with JavaScript functionality
8. Carousel implementation
9. Bootstrap Cards
10. Three Bootstrap elements not covered in class
11. Form that writes data to a text file

## Project Structure

```plaintext
SpotifyClone/
├── assets/
│   ├── audio/
│   ├── components/
│   ├── data/
│   ├── images/
│   ├── js/
│   └── songs/
├── index.html
├── login.html
├── main.html
├── playlist.html
├── register.html
└── server.js
```

## Features
- **User Authentication** : Login and registration system with data persistence
- **Dynamic Content Loading** : Components are loaded dynamically using jQuery
- **Music Player Interface** : Simulated music player with play controls
- **Interactive Elements** : Modal windows, tooltips, and dynamic content updates

## Technologies Used
- HTML5
- Bootstrap 5.3
- jQuery 3.7.1
- Bootstrap Icons
- Node.js (for server-side functionality)

## Pages
1. Index Page : Landing page for non-authenticated users
2. Login Page : User authentication
3. Register Page : New user registration
4. Main Page : Main interface after authentication
5. Playlist Page : Individual playlist view
6. Premium Page : Premium content

## Bootstrap Components Used
### Core Components
- Grid System
- Navigation Bars
- Cards
- Modals
- Buttons
- Forms
### Additional Components
- Tooltips
- Progress Bars
- Range Inputs
- Vertical Rules (VR)

## Setup and Installation
1. Clone the repository
2. Install Node.js dependencies:
```bash
npm install
```
3. Start the server:
```bash
node server.js
```
4. Access the website at http://localhost:3000

## Development Notes
This project was developed with specific educational constraints to demonstrate proficiency in:

- Bootstrap framework usage
- HTML structure and organization
- Component-based development
- Basic server-side operations
- Form handling and data persistence

## Author
- iMayiVT
- Course: DAW (Web Application Development)