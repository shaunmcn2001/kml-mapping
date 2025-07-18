# Spatial KML Viewer (React + Leaflet)

A map‑centric React app that lets authenticated users upload KML files and view them on an interactive Leaflet map.  
Inspired by the NSW Spatial Viewer design.

## Quick start

```bash
# 1. install deps
npm install
# 2. run dev server
npm start
# the app expects a backend API url in REACT_APP_API_URL (default /api)
```

Deploy the backend (Flask/FastAPI or Node) on Render, set an environment variable  
`REACT_APP_API_URL` in the Render static site for this frontend.