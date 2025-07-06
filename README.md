# 🖥️ HomeOS — Futuristic Browser-Based Operating System

**HomeOS** is a lightweight, futuristic, Linux-inspired web-based operating system that runs entirely in your browser.  
Built using React, Tailwind CSS, and a modular app architecture, it simulates the feel of a desktop OS with draggable apps, a taskbar, and more — no installation required.

🌐 **Live Demo**: [https://rainbow-squirrel-b35704.netlify.app](https://rainbow-squirrel-b35704.netlify.app)

---

## 🚀 Features

- 🔲 **Taskbar & App Management**  
  Minimize, close, and drag windows with smooth animations

- 🗂️ **File Manager (Linux-inspired)**  
  Create, delete, and manage files across Home/Desktop/Videos/Music etc.

- 📝 **Notepad App**  
  Create and save text files directly to your desktop

- 🧮 **Calculator App**  
  Includes working `=` button with clean UI

- 🌐 **Browser with Internet Access**  
  Search and browse within the HomeOS interface

- 🎨 **Custom Wallpapers**  
  Set your own background directly from the desktop

- ⚙️ **Settings Panel**  
  Change themes, manage system UI, and more (with transparent Linux-style look)

- 🗑️ **Trash Bin**  
  Right-click and delete files or folders, just like on a real OS

- 💻 **Terminal with Commands**  
  Execute built-in commands inside a terminal-style window

- 🪟 **Resizable, Movable, Multi-App Support**  
  Launch and use multiple apps simultaneously

---

## 🛠️ Built With

- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- Custom window manager (no OS APIs!)

---

## 📂 Folder Structure

homeos/
├── src/
│ ├── apps/ # Built-in apps (Notepad, FileManager, etc.)
│ ├── components/ # WindowManager, Taskbar, AppIcons, etc.
│ └── main.jsx # Entry point
├── public/
├── dist/ # Production build output
├── index.html
├── vite.config.js
└── README.md

yaml
Copy
Edit


---

## 📦 Installation (for local development)

```bash
git clone https://github.com/Adilahmed03/HomeOS.git
cd HomeOS
npm install
npm run dev

