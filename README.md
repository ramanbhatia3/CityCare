# CityCare: Civic Issue Reporting Portal 🏙️

### _Because complaining in WhatsApp groups isn't civic action._

![CityCare Dashboard Banner](https://i.imgur.com/uF22N3G.png)

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## Table of Contents

-   [The Problem](#the-problem-)
-   [Our Solution: CityCare](#our-solution-citycare-)
-   [Key Features](#key-features-)
-   [Tech Stack](#tech-stack-)
-   [Getting Started](#getting-started-)
    -   [Prerequisites](#prerequisites)
    -   [Backend Setup](#backend-setup)
    -   [Frontend Setup](#frontend-setup)
-   [Project Structure](#project-structure-)
-   [Future Scope](#future-scope-)
-   [Author](#author-)

---

## The Problem 🚨

Citizens in many communities face persistent civic problems: potholes, overflowing rubbish bins, broken streetlights, and neglected public spaces. Existing reporting systems are often slow, confusing, or completely unknown to most residents. Government apps exist, but a lack of transparency, accessibility barriers like language, and a missing feedback loop mean that citizens often submit reports into a black hole, leading to frustration and disengagement.

---

## Our Solution: CityCare ✨

**CityCare** is a modern, MERN-stack web application designed to bridge the gap between citizens and civic authorities. It provides a smarter, simpler, and radically transparent solution to civic issue reporting. Our platform empowers citizens to instantly report problems and track their progress live on a public map, fostering a sense of community ownership and accountability.

---

## Key Features 🚀

-   📍 **Geo-Tagged Reporting:** Users can instantly submit issues with photos and precise location data using an interactive Google Map.
-   🗺️ **Public Transparency Map:** A real-time map displaying all open, in-progress, and resolved issues, building community trust.
-   🧑‍💼 **Unified Admin Dashboard:** A dedicated dashboard for authorities to efficiently manage, update, and track all submitted reports.
-   🔑 **Secure OTP Authentication:** Safe and secure user registration and login using one-time passwords sent via email.
-   📊 **Data-Driven Dashboard:** The main overview page features visual charts and stats for a clear, at-a-glance understanding of civic issues.
-   📱 **Fully Responsive Design:** A seamless and modern user experience on both desktop and mobile devices.
-   👤 **Integrated User Profile:** A combined page for users to view their personal details and track the status of all their submitted reports.

---

## Tech Stack 🛠️

### Frontend
* **React 18:** For building a fast, component-based UI.
* **Vite:** As the next-generation frontend tooling for a blazing-fast development experience.
* **Tailwind CSS:** A utility-first CSS framework for rapid, responsive UI design.
* **Axios:** For making asynchronous HTTP requests to the backend API.
* **Recharts:** A composable charting library for data visualization.
* **@react-google-maps/api:** For seamless integration with Google Maps.

### Backend
* **Node.js:** As the JavaScript runtime environment.
* **Express.js:** As the web application framework for building robust APIs.
* **MongoDB:** A NoSQL database for storing user, issue, and comment data.
* **Mongoose:** As the Object Data Modeling (ODM) library for MongoDB.
* **JSON Web Tokens (JWT):** For secure user authentication and authorization.
* **Bcrypt.js:** For hashing user passwords securely.
* **Multer:** For handling `multipart/form-data`, primarily for image uploads.
* **Nodemailer:** For sending emails for OTP verification.

---

## Getting Started 🚀

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or later)
-   npm (Node Package Manager)
-   MongoDB (local instance or a cloud service like MongoDB Atlas)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone _________________________________________________
    cd citycare/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ``` 

3.  **Create a `.env` file** in the `backend` directory and add the following variables:
    ```env
    MONGO_URI="your_mongodb_connection_string"
    JWT_SECRET="your_jwt_secret_key"
    PORT=5000

    # Gmail credentials for Nodemailer (use an App Password)
    EMAIL_USER="your_gmail_address@gmail.com"
    EMAIL_PASS="your_gmail_app_password"
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```
    The backend server will be running on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory** in a new terminal:
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `frontend` directory and add your Google Maps API key:
    ```env
    VITE_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
    ```

4.  **Run the client:**
    ```bash
    npm run dev
    ```
    The React application will be running on `http://localhost:5173`.

---

## Project Structure 📁

The project is organized into two main folders: `frontend` and `backend`.

/citycare
├── /backend
│   ├── /config       # Database connection
│   ├── /controllers  # Logic for handling requests
│   ├── /middleware   # Auth, admin, and file upload middleware
│   ├── /models       # Mongoose schemas
│   ├── /routes       # API route definitions
│   ├── /uploads      # Folder for uploaded images
│   └── server.js     # Main server entry point
│
└── /frontend
├── /src
│   ├── /components # Reusable React components
│   └── App.jsx     # Main app component with routing
├── tailwind.config.js
└── vite.config.js

## Future Scope 🔮

To further enhance CityCare, we plan to implement the following features:

-   **Citizen Feedback Loop:** A post-resolution rating and feedback system to ensure service quality.
-   **Multi-Language Support:** Integrating libraries like `i18next` to make the platform accessible to non-English speakers.
-   **WhatsApp & SMS Integration:** Allowing users to report issues through familiar platforms without needing to visit the website.
-   **Advanced Analytics:** Providing authorities with deeper insights into issue resolution times, category trends, and department performance.

---

## Author ✍️

-   **[PseudoCoders]** 
    Ramandeep Bhatia
    Navtej Singh
    Suman Devi
    Saneha




📝 CityCare: Smart Civic Issue Management Platform
CityCare is a full-stack civic engagement platform built to restore public trust by replacing opaque reporting systems with a unified, transparent, and accountable service. It provides citizens with a real-time view of every issue's status and gives authorities the tools for efficient, measurable management.
🌟 Key Features & Hackathon Innovations:
Feature	Category	Value Proposition
Radical Transparency Map	Accountability	Real-time, color-coded map showing live status (Open, Resolved) of every single issue.
Official Updates Log	Transparency	Authorities post time-stamped updates and photo proofs, creating a public audit trail.
Citizen Feedback Loop	Measurement	Users rate service quality (1-5 stars) upon resolution, providing crucial performance KPIs.
Volunteer Request System	Collaboration	Citizens can proactively offer to resolve issues, activating community participation.
Secure Onboarding (OTP)	Security	Two-Factor Authentication (OTP) ensures report credibility and prevents spam.
Multi-Language UI (i18n)	Inclusivity	Supports seamless switching between English and Hindi.

🛠️ Tech Stack
•	Frontend: React.js (Hooks, Context API), Tailwind CSS, Google Maps API, Axios.
•	Backend: Node.js, Express.js (REST API), JWT Authentication, Bcrypt.
•	Database: MongoDB (Mongoose ODM).
Project Structure:
This project follows a strict separation of concerns (MVC architecture) across the stack.
System Design Graph:
 
CityCare System Architecture:
 
User Interface Diagram:
 
Directory Structure:
Directory	Role	Key Components
backend/controllers	Business Logic	issueController, authController (Handles core logic, validation, and database operations).
backend/middleware	Security & Access	authMiddleware (JWT & RBAC), adminMiddleware, uploadMiddleware.
backend/models	Data Schema	userModel, issueModel (includes nested schemas for updates/comments).
frontend/src/context	Global State	AuthContext.js (Manages user state, token, login/logout).
frontend/src/pages	Views	PublicMapPage, AdminDashboardPage, CitizenAuthPage.
frontend/src/locales	Internationalization	en/translation.json, hi/translation.json.

visual element:
![alt text](<Screenshot 2025-10-16 114919.png>) ![alt text](<Screenshot 2025-10-16 115147.png>) ![alt text](<Screenshot 2025-10-16 115157.png>) ![alt text](<Screenshot 2025-10-16 115205.png>) ![alt text](<Screenshot 2025-10-16 115226.png>) ![alt text](<Screenshot 2025-10-16 115314.png>) ![alt text](<Screenshot 2025-10-16 115329.png>) ![alt text](<Screenshot 2025-10-16 115347.png>) ![alt text](<Screenshot 2025-10-16 115450.png>) ![alt text](<Screenshot 2025-10-16 115529.png>) ![alt text](<Screenshot 2025-10-16 115544.png>) ![alt text](<Screenshot 2025-10-16 115605.png>) ![alt text](<Screenshot 2025-10-16 115631.png>)