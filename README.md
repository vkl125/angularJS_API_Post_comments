# AngularJS Posts & Comments App

A simple AngularJS application that displays posts and comments with pagination, using a JSON server as a REST API backend.

## Features

- Display posts with pagination (20 posts per page)
- Show comments for each post
- Responsive design with Bootstrap
- REST API integration with JSON server
- Loading states and error handling

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the JSON server:**
   ```bash
   npm start
   ```
   This will start the JSON server on http://localhost:3000

3. **Open the application:**
   Open `index.html` in your web browser

## API Endpoints

- **GET /posts** - Get all posts
- **GET /comments** - Get all comments
- **GET /users** - Get all users

## Project Structure

- `index.html` - Main HTML file with AngularJS app
- `app.js` - AngularJS application logic
- `db.json` - Mock data for JSON server
- `package.json` - Project dependencies and scripts

## Technologies Used

- AngularJS 1.8.2
- Bootstrap 5.1.3
- JSON Server
- REST API