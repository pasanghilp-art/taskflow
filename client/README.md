# TaskFlow 🗂️

A full-stack project management app inspired by Trello/Jira — built with React, Node.js, Express, and PostgreSQL.

![TaskFlow Dashboard](https://i.imgur.com/placeholder.png)

## 🌐 Live Demo

🔗 **[taskflow-alpha-beige.vercel.app](https://taskflow-alpha-beige.vercel.app)**

> Note: Backend is hosted on Render's free tier — first request may take ~30 seconds to wake up.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with access tokens and HTTP-only refresh cookies
- 🏢 **Workspaces** — Create and manage multiple workspaces
- 📋 **Kanban Boards** — Visual boards with To Do / In Progress / Done columns
- ✅ **Task Management** — Create, delete, and move tasks between columns
- 🎯 **Priority Levels** — Set Low / Medium / High priority on any task with one click
- 🛡️ **Protected Routes** — Auth-gated pages on the frontend
- 💾 **Persistent Data** — All data saved in PostgreSQL database

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Zustand | Global state management |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| Vite | Build tool |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js | Runtime |
| Express | Web framework |
| Prisma ORM | Database access |
| PostgreSQL | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Socket.io | Real-time support |

### DevOps
| Tech | Purpose |
|------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Neon | Cloud PostgreSQL |
| GitHub | Version control |

---

## 🗄️ Database Schema

```
User ──< WorkspaceMember >── Workspace
                                 │
                               Board
                                 │
                              Column
                                 │
                              Task
```

- **User** — Auth credentials and profile
- **Workspace** — Top-level container with members
- **Board** — Belongs to a workspace, contains columns
- **Column** — Ordered list within a board (To Do, In Progress, Done)
- **Task** — Cards with title, priority, assignee, due date

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL installed locally

### 1. Clone the repo
```bash
git clone https://github.com/pasanghilp-art/taskflow.git
cd taskflow
```

### 2. Set up the server
```bash
cd server
npm install
```

Create `server/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskflow"
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
CLIENT_URL="http://localhost:5173"
PORT=5000
```

Run database migrations:
```bash
npx prisma migrate dev
```

Start the server:
```bash
npm run dev
```

### 3. Set up the client
```bash
cd ../client
npm install
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
taskflow/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       └── store/          # Zustand state
│
└── server/                 # Node.js backend
    ├── prisma/             # Schema & migrations
    └── src/
        ├── controllers/    # Route handlers
        ├── middleware/      # Auth middleware
        ├── routes/         # Express routes
        └── index.js        # Entry point
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |

### Workspaces
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces` | Get user's workspaces |
| POST | `/api/workspaces` | Create workspace |

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards/:workspaceId` | Get boards in workspace |
| POST | `/api/boards` | Create board |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

---

## 👤 Author

**Pasang Tamang**
- GitHub: [@pasanghilp-art](https://github.com/pasanghilp-art)

---

## 📄 License

MIT License — feel free to use this project as inspiration for your own!