# ImageAtlas

📷 ImageAtlas
ImageAtlas is a photo management system that allows users to search and save images from Unsplash, add tags to images, track search history, and retrieve photos by tags with sorting.

🚀**Features**

- User registration

- Search images via the Unsplash API

- Save images to the database

- Add tags to saved images

- Search images by tags and sort by date saved

- Track and display search history

🛠 **Tech Stack**

- Backend: Node.js, Express.js

- Database: SQLite

- External API: Unsplash API

📌**API Endpoints**

- User Routes

  - POST /api/users - Create a new user

- Photo Routes

  - GET /api/photos/search - Search images using Unsplash API

  - POST /api/photos - Save images to the database

  - POST /api/photos/:photoId/tags - Add a tag to a photo

  - GET /api/photos/tag/search - Search images by tag and sort by date saved

- Search History Routes

  - GET /api/search-history - Track and display search history
