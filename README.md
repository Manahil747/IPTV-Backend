# IPTV-Backend

A robust IPTV Backend system that allows users to navigate genres, view series and seasons, and explore episodes through a well-structured API system.

## 👩‍💻 Developed By:  
[**Manahil Altaf**](https://github.com/Manahil747)


## 📌 Project Overview

This backend project is built using the **MVC Architecture** and is designed to support a frontend IPTV platform. It includes dynamic relationships between models like `users`, `streams`, `episodes`, `seasons`, `series`, and `genres`. Each API is created to serve nested data structures using MongoDB Aggregation Framework.


## 🚀 Key Features

- JWT Authentication
- Google Social Login
- Multer for file uploads
- Search, Filter & Pagination
- Nested APIs using MongoDB Aggregation
- RESTful API design
- MVC Pattern Structure


## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **Mongoose (MongoDB)**
- **JWT**
- **Multer**
- **Postman (API Testing)**
- 

## 📁 Folder Structure

iptv-backend/
│
├── config/
│ └── db.js
├── controllers/
│ └── (Episode, Genre, Series, Stream, File, User, Season, GenreSeries controllers)
├── middlewares/
│ └── auth.js
├── models/
│ └── (User, Stream, Episode, Season, File, Series, GenreSeries, Genre models)
├── routes/
│ └── (UserAuth, Stream, Episode, Season, File, Series, GenreSeries, Genre, Auth routes)
├── utils/
│ └── helperFunctions.js
├── uploads/
│ └── (for multer uploads)
├── index.js
├── .env
├── package.json
└── README.md


---

## Important API Endpoints

```http
GET /users/:id/streams/episode
➤ Get episodes of all streams of a user by user id

GET /streams/:id/episode/season/series
➤ Get the series of a season of an episode of a stream by stream id

GET /streams/:id/episode/season/series/genre
➤ Get the genre of a series of a season of an episode of a stream by stream id

GET /seasons/:id/episodes
➤ Get all episodes of a season by season id

GET /genres/:id/series/seasons
➤ Get all seasons of all series of a genre by genre id


## Authentication
1. JWT-based login & registration
2. Google OAuth2 Login (Social Login)



🧪  How to Test the APIs
Use Postman to test endpoints:
1. Clone the repo.
2. Run npm install
3. Set up .env file (DB URI, JWT secret, etc.)
4. Start server:

             node index.js
             
Use Postman to send requests to endpoints.

