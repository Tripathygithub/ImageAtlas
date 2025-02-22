# ImageAtlas

## 📌 Overview
**ImageAtlas** is a photo management system that allows users to:
- ✅ Search and save images from **Unsplash**
- ✅ Add tags to saved images
- ✅ Retrieve photos by tags with sorting
- ✅ Track and display search history
- ✅ Manage users with authentication

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **External API:** Unsplash API

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/ImageAtlas.git
cd ImageAtlas
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a **.env** file and configure:
```env
PORT=5000
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
DATABASE_URL=your_database_url
```

### 4️⃣ Start the Server
```sh
npm start
```

## 📌 API Endpoints

### 👤 User Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users` | Create a new user |

### 📷 Photo Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/photos/search` | Search images using Unsplash API |
| `POST` | `/api/photos` | Save images to the database |
| `POST` | `/api/photos/:photoId/tags` | Add a tag to a photo |
| `GET` | `/api/photos/tag/search` | Search images by tag and sort by date saved |

### 📜 Search History Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search-history` | Track and display search history |

## 🚀 Future Enhancements
- [ ] Implement user authentication & roles
- [ ] Add image categorization features
- [ ] Improve search functionality with filters


