📝 Nopparat Web Blog
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
> A personal blog web application where users can read, write, and manage blog posts — with full authentication, categories, and comment support.
🌐 Live Demo: nopparat-webblog.vercel.app
---
✨ Features
📖 Browse and read blog posts with Markdown rendering
✍️ Create, edit, and delete your own posts
💬 Comment on posts
🏷️ Filter posts by category
🔐 User authentication (Sign up / Login / Reset Password)
👤 Profile management with avatar upload
📱 Responsive design
---
🛠️ Tech Stack
Category	Technology
Framework	React 19
Build Tool	Vite 7
Styling	Tailwind CSS v4
UI Components	Radix UI (Tabs, Select, Label)
Routing	React Router DOM v7
HTTP Client	Axios
Auth & Storage	Supabase JS
Markdown	React Markdown
Icons	Lucide React, React Icons
---
📁 Project Structure
```
nopparat-webblog/
├── public/             # Static assets
├── src/                # Application source code
├── docs/               # Documentation
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── components.json     # shadcn/ui config
└── vercel.json         # Vercel deployment config
```
---
🚀 Getting Started
Prerequisites
Node.js `>= 18`
npm `>= 9`
1. Clone the repository
```bash
git clone https://github.com/nopparat-cysit/nopparat-webblog.git
cd nopparat-webblog
```
2. Install dependencies
```bash
npm install
```
3. Configure environment variables
Create a `.env` file at the root of the project:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:4000
```
4. Start the development server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.
---
📜 Available Scripts
Command	Description
`npm run dev`	Start development server with HMR
`npm run build`	Build for production
`npm run preview`	Preview production build locally
`npm run lint`	Run ESLint
---
🌍 Deployment
This project is deployed on Vercel. The `vercel.json` config handles SPA routing (redirect all routes to `index.html`).
---
🔗 Related
	
Backend Repository	nopparat-webblog-backend
Backend API	nopparat-webblog-backend.vercel.app
