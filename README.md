# 📚 SIAKAD API - Student Information System (Node.js + MySQL)

This project is a simple backend Student Information System (SIAKAD) built with **Node.js**, **Express**, and **MySQL**, implementing features like authentication with **JWT**, input validation with **express-validator**, and standard RESTful APIs with error handling.

## 🚀 Features

- ✅ Student CRUD (Create, Read, Update, Soft Delete)
- ✅ Register & Login with hashed passwords using **bcrypt**
- ✅ JWT Token authentication and protected route (`/profile`)
- ✅ Input validation using **express-validator**
- ✅ Error handling (400, 404, 500) with clear messages
- ✅ Pagination on `/items` endpoint

## 📂 Folder Structure

```
siakad-api/
├── config/
│   └── db.js              # MySQL DB connection
├── auth.js                # Authentication routes and middleware
├── app.js                 # Main Express app
├── README.md              # Project documentation
```

## 🔧 Setup & Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/nnafisaaa/siakad-api.git
cd siakad-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set DB config

Edit `config/db.js` with your local MySQL credentials.

### 4. Run the app

```bash
node app.js
```

Server runs on `http://localhost:3000`

## 🧪 API Documentation (Postman)

### Auth

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/auth/register` | Register user     |
| POST   | `/auth/login`    | Login & get token |
| GET    | `/profile`       | Get profile (JWT) |

### Students

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/get-student`        | Get all students    |
| GET    | `/get-student-by-id`  | Get student by ID   |
| POST   | `/update-student`     | Update student      |
| DELETE | `/delete-student/:id` | Soft delete student |

### Pagination

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | `/items`           | Paginated items list |
|        | `?page=1&limit=10` | Example query        |

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MySQL**
* **bcrypt**
* **jsonwebtoken**
* **express-validator**

## 🔐 How to use JWT

1. Register or login to get token.
2. Use `Authorization: Bearer <token>` in header for protected routes like `/profile`.

## ✅ Commit Convention

```bash
feat(talent-growth): add student CRUD and auth features
```

https://drive.google.com/drive/folders/1bhdE5vjYoAXzOhwJflfENnhfcnU-0Ej8?usp=drive_link

