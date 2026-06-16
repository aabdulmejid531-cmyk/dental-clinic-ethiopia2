# Dental Clinic Ethiopia

A comprehensive dental clinic management system for Ethiopia, featuring:

## Features

### Backend API (Node.js/TypeScript)
- RESTful API for managing patients, doctors, and appointments
- AI-powered symptom checker and treatment planner
- Authentication with JWT tokens
- Role-based access control (patient, doctor, admin)
- Real-time appointment scheduling
- Medical record management
- AI chat assistant for dental queries

### Frontend (React/TypeScript)
- Modern React application with TypeScript
- Responsive design with Tailwind CSS
- Zustand state management
- React Query for data fetching
- Internationalization (i18n)
- Theme switching (light/dark mode)
- Real-time notifications
- Protected routes and authentication

### Database
- PostgreSQL with Supabase
- Comprehensive schema for dental clinic operations
- AI chat sessions and messages
- Medical records and appointments

## Technology Stack

### Backend
- Node.js
- Express.js
- TypeScript
- Supabase (PostgreSQL)
- OpenAI/Gemini AI
- JWT Authentication
- Winston Logging

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Query
- i18next
- Framer Motion

## Project Structure

```
dental-clinic-ethiopia/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── routes/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── store/
│   │   └── index.css
│   ├── package.json
│   └── tsconfig.json
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env (backend)
├── .env (frontend)
└── README.md
```

## Installation

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies: `npm install`
4. Create a `.env` file with your environment variables
5. Run the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Create a `.env` file with your environment variables
4. Run the development server: `npm run dev`

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: JWT secret key
- `ALLOWED_ORIGINS`: Allowed origins for CORS
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `OPENAI_API_KEY`: OpenAI API key
- `GEMINI_API_KEY`: Gemini API key

### Frontend (.env)
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_API_URL`: API base URL

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user
- `POST /api/auth/logout`: Logout user
- `GET /api/auth/me`: Get current user

### Appointments
- `POST /api/appointments`: Create appointment
- `GET /api/appointments`: Get user appointments
- `GET /api/appointments/:id`: Get specific appointment
- `PATCH /api/appointments/:id/status`: Update appointment status

### AI Features
- `POST /api/ai/chat`: AI chat with patient
- `POST /api/ai/symptom-check`: AI symptom checker
- `POST /api/ai/treatment-plan`: Generate treatment plan
- `GET /api/ai/sessions/:patientId`: Get AI chat sessions
- `GET /api/ai/messages/:sessionId`: Get AI chat messages

### Patients
- `GET /api/patients`: Get patient profile
- `PATCH /api/patients/:id`: Update patient profile
- `GET /api/patients/:id/medical-records`: Get patient medical records

### Doctors
- `GET /api/doctors`: Get doctor profile
- `GET /api/doctors/appointments/today`: Get today's appointments
- `GET /api/doctors/patients`: Get list of patients

## Development

### Backend
```bash
# Development mode with auto-restart
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

The project includes comprehensive API routes and frontend components. To test the application:

1. Start the backend server
2. Start the frontend development server
3. Navigate to `http://localhost:5173`
4. Test authentication, appointment booking, and AI features

## Deployment

### Vercel Deployment
1. Push the code to GitHub
2. Connect the repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy both frontend and backend (or use Vercel Functions for backend)

### Docker Deployment
Create Dockerfiles for both backend and frontend and deploy to a container platform.

## License

MIT License
