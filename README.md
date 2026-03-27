# Real-Time Collaborative Document Editor

## Overview
The Real-Time Collaborative Document Editor is a full-stack web application that allows multiple users to create, edit, and manage documents simultaneously. The application provides real-time synchronization of content across multiple browser tabs or users, similar to platforms like Google Docs. It is designed to demonstrate modern web development concepts such as real-time communication, REST APIs, authentication, and database integration.

## Features
- User authentication (Login and Register)
- Create and manage multiple documents
- Real-time collaborative editing using WebSockets
- Rich text editor powered by React Quill
- Automatic saving of document content to the database
- Multi-tab synchronization (changes reflect instantly)
- Simple and intuitive user interface

## Tech Stack
### Frontend:
- React.js
- React Quill (Rich Text Editor)
- Socket.IO Client

### Backend:
- Flask (Python)
- Flask-SocketIO for real-time communication
- Flask-CORS for cross-origin requests

### Database:
- PostgreSQL (via SQLAlchemy ORM)

## How It Works
Users can register and log in to the application. After logging in, they can view a list of their documents and select any document to edit. When a document is opened, the client joins a specific Socket.IO room associated with that document. Any changes made in the editor are sent to the server in real time and broadcast to all connected clients in the same room. This ensures that multiple users or tabs see updates instantly.

The backend also saves the document content to the PostgreSQL database, ensuring persistence even after refreshing or reopening the application.

## Installation and Setup

### Backend Setup:
1. Navigate to the server folder:
   cd server
2. Install dependencies:
   pip install -r requirements.txt
3. Run the Flask server:
   python app.py

### Frontend Setup:
1. Navigate to the client folder:
   cd client
2. Install dependencies:
   npm install
3. Start the React app:
   npm start

The frontend will run on http://localhost:3000 and the backend on http://127.0.0.1:5001.

## Project Structure
- server/: Contains Flask backend, database models, and API routes
- client/: Contains React frontend and components
- components/: Includes Editor and Login components
- api.js: Handles API calls between frontend and backend

## Future Improvements
- Add document sharing between users
- Implement user presence (show active users)
- Add version history for documents
- Improve UI/UX with better styling
- Add role-based permissions

## Conclusion
This project demonstrates a practical implementation of a real-time collaborative system using modern web technologies. It highlights the integration of frontend and backend systems, real-time communication, and database persistence, making it a strong foundation for building scalable collaborative applications.
