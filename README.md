# QuoteYourOS

QuoteYourOS is a personal portfolio website built to replicate the classic, nostalgic aesthetic of a Windows XP desktop environment. It serves as a fully interactive OS-in-a-browser where visitors can explore projects, read blog posts, and view contact information by opening and dragging around classic desktop windows.

## 🌟 Features

- **Classic Windows XP UI:** Pixel-perfect aesthetic using `xp.css`.
- **Interactive Desktop:** Draggable desktop icons with grid-snapping.
- **Window Management:** Open, close, minimize, maximize, drag, and resize windows just like a real operating system.
- **Start Menu & Taskbar:** Fully functional taskbar with a live system clock and a classic two-column Start Menu.
- **Boot Sequence:** Nostalgic Windows XP startup screen animation.
- **Right-Click Context Menu:** Custom desktop context menu.

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Vanilla CSS + [XP.css](https://botoxparty.github.io/XP.css/)
- **Window Management:** `react-rnd` (for draggable and resizable windows)

## 📂 Project Structure

The project follows a component-driven React architecture:

```text
d:\Lio\Projects\quoteyouros\
├── public/
│   └── wallpaper.jpg            # The classic "Bliss" desktop background
├── src/
│   ├── components/              # Core OS interface components
│   │   ├── BootScreen.jsx       # Startup animation sequence
│   │   ├── ContextMenu.jsx      # Custom right-click menu
│   │   ├── Desktop.jsx          # Desktop surface and draggable icons
│   │   ├── StartMenu.jsx        # Classic Start Menu overlay
│   │   ├── Taskbar.jsx          # Bottom taskbar with clock and window buttons
│   │   └── Window.jsx           # Reusable draggable/resizable window wrapper
│   │
│   ├── styles/                  # Modular CSS design system
│   │   ├── boot.css             # Boot screen animations
│   │   ├── context-menu.css
│   │   ├── desktop.css
│   │   ├── icons.css            # Desktop icon styling and states
│   │   ├── start-menu.css
│   │   ├── taskbar.css
│   │   └── window.css           # Internal content styles (Notepad, Explorer, etc.)
│   │
│   ├── windows/                 # Content Applications (The actual portfolio content)
│   │   ├── AboutMe.jsx          # Styled as Notepad
│   │   ├── Blog.jsx             # Styled as Internet Explorer
│   │   ├── Contact.jsx          # Styled as Outlook Express
│   │   ├── Projects.jsx         # Styled as Windows Explorer
│   │   ├── Resume.jsx           # Styled as WordPad
│   │   └── registry.js          # Maps application IDs to their React components
│   │
│   ├── App.jsx                  # Main state container (manages open windows & z-index)
│   ├── main.jsx                 # React DOM entry point
│   └── style.css                # Global CSS imports
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
└── vite.config.js               # Vite bundler configuration
```

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed.

### Installation

1. Clone the repository or navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server

To run the project locally with hot-reloading:

```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Building for Production

To create a production-ready build:

```bash
npm run build
```
This will output the optimized static files into the `dist/` directory, ready to be deployed to any static host (like a VPS, Vercel, or Netlify).

## 💡 Architecture Notes
- **State Management:** The `App.jsx` component acts as the central window manager. It holds an array of `windows` in state, tracking their positions, z-indexes, and minimized/maximized states.
- **Window Boundaries:** The `Window.jsx` component wraps the `react-rnd` library, enforcing flex boundaries so that internal scrolling content (like long blog posts or resumes) never spills out of the physical window frame.
- **CSS Minification:** In `vite.config.js`, CSS minification is intentionally disabled. This is because `xp.css` uses some legacy pseudo-element selectors that cause modern CSS minifiers (like lightningcss) to fail during the build process.

## 📝 License
This project is built for personal portfolio use. Feel free to use the structure as inspiration for your own retro sites!
