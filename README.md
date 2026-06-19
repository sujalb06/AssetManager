# 🏢 Asset Management System

A complete full-stack web application built to streamline the tracking, assignment, and maintenance of organizational assets like laptops, monitors, and other equipment. 

### 🚀 Live Links
* **Frontend (Live)**: [https://asset-manager-ten-dun.vercel.app/]
* **Backend API**: [https://assetmanager-utjo.onrender.com]

---

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (DOM Manipulation)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Deployment:** Vercel (Frontend) & Render (Backend)

---

## ✨ Key Features
* **Dashboard Overview:** Real-time statistics of total, assigned, available, and in-repair assets.
* **Asset Lifecycle Management:** Create, view, update, and delete (CRUD) organizational assets.
* **Employee Assignments:** Assign available assets to employees and track active usage.
* **Maintenance Logs:** Move broken assets to maintenance and restore them to the available pool upon resolution.
* **Dynamic Dropdowns:** Business logic that prevents assigning assets that are already in use or under maintenance.

---

## 💻 Local Setup Instructions

**1. Clone the repository:**
\`\`\`bash
git clone https://github.com/sujalb06/AssetManager.git
\`\`\`

**2. Backend Setup:**
\`\`\`bash
cd backend
npm install
node server.js
\`\`\`
*(Note: You will need to create a `.env` file in the backend directory with your `MONGO_URI` and `PORT=5000`)*

**3. Frontend Setup:**
Open the `frontend/index.html` file using Live Server in VS Code.

---

## 👨‍💻 Author
**Sujal Bekariya** [Sujal Bekariya] | [sujalb06]