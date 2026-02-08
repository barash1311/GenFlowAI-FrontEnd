# GeoFlowAI Frontend Implementation Rules

## Role
You are a senior frontend engineer building a production-ready React application for an AI-driven GIS system called GeoFlowAI.

## Tech Stack (Strict)
- Framework: React + Vite
- Language: TypeScript
- Styling: Tailwind CSS
- State management: React hooks only
- Routing: React Router
- No backend integration yet (mock logic allowed)

## Folder Structure
src/
 ├── pages/
 │   ├── Login.tsx
 │   └── Dashboard.tsx
 ├── components/
 │   ├── ProtectedRoute.tsx
 │   ├── Header.tsx
 │   └── QueryPanel.tsx
 ├── services/
 │   └── mockAiService.ts
 ├── utils/
 │   └── auth.ts
 ├── App.tsx
 ├── main.tsx

## Page Requirements

### Authentication Page (/login)
- UI only, no real auth
- Hardcoded credentials:
  - Email: admin@geoflow.ai
  - Password: admin123
- On success → redirect to /dashboard
- On failure → show error message
- Store login state in localStorage

### Dashboard Page (/dashboard)
- Protected route (redirect to /login if not authenticated)
- Layout:
  - Header (project name + logout)
  - Query panel:
    - Textarea for natural language GIS query
    - Example placeholder: “Find all flood-prone regions in Kochi, Kerala”
    - Button: Generate SQL
    - Read-only panel showing:
      - Generated SQL Query
      - Validation status (Pending / Approved / Error)
      - Disabled button: Generate Shapefile (.shp)

## Mock Logic
When user clicks **Generate SQL**:
1. Simulate AI processing (2s delay)
2. Display mock SQL:
   ```sql
   SELECT *
   FROM roads r
   JOIN waterbodies w
   ON ST_DWithin(r.geom, w.geom, 500)
   WHERE r.state = 'Kerala'

Show validation: “AI Council Validation: Approved”
Engineering Rules
Use reusable components
No inline styles
Clean Tailwind utility usage
Proper TypeScript types
Comments only where logic is non-obvious
No unnecessary libraries
Outcome
When I say “create frontend project” or “scaffold GeoFlowAI app”, the agent should:

Create the folder structure above
Generate all files with working React + Vite + Tailwind setup
Implement routing and mock logic
Ensure the app runs with npm run dev

Once saved, make sure your `.continue/config.yaml` includes:

```yaml
rules:
  - .continue/rules/project.md
allowFileEdits: true
autoApplyEdits: true
allowCommands: true