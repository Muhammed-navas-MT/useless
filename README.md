<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# Who Moved My Stuff? 🕵️


## Basic Details
### Team Name: detector


### Team Members
- Team Lead: Muahmmed Navas = Brototype

### Project Description
Upload a BEFORE and AFTER photo of your desk/room, and our AI "Digital Forensic Investigation Unit" detects every object that moved, went missing, or mysteriously appeared — then writes you a dead-serious criminal investigation report about it.

### The Problem (that doesn't exist)
Someone touched your stuff on your desk and you have no proof, no witnesses, and no closure. The justice system does not care that your stapler is 4cm to the left of where you left it.

### The Solution (that nobody asked for)
We built a full forensic pipeline: YOLO object detection compares your BEFORE/AFTER photos, calculates exactly what moved/vanished/appeared, and hands the evidence to an AI investigator (powered by Groq) who writes a hilariously overserious case report — complete with a case number, suspicion level, and an absurd recommendation.

## Technical Details
### Technologies/Components Used
For Software:
- **Languages:** TypeScript, Python
- **Frameworks:** React + Vite (frontend), Express (backend), FastAPI (cv-service)
- **Libraries:** Tailwind CSS, Axios, Multer, Ultralytics YOLOv8, OpenCV, Groq SDK
- **Tools:** Docker, Render, Railway, Vercel

### Implementation
For Software:

# Installation

Clone the repo, then set up all three services:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# CV Service
cd ../cv-service
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

Create a `.env` file in `backend/` with:
```
PORT=5000
CV_SERVICE_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key
LLM_MODEL=openai/gpt-oss-20b
MOVEMENT_THRESHOLD=50
```

Create a `.env` file in `frontend/` with:
```
VITE_API_URL=http://localhost:5000
```

# Run

```bash
# CV Service (Python, port 8000)
cd cv-service
uvicorn app.main:app --reload

# Backend (Node/Express, port 5000)
cd backend
npm run dev

# Frontend (React/Vite, port 5173)
cd frontend
npm run dev
```

### Project Documentation
For Software:

# Screenshots (Add at least 3)
I have added images in assets folder

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
