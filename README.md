# LiveOps

LiveOps is a real-time cloud-native monitoring dashboard for a full-stack application. It shows the health of a React frontend, an Express backend, MongoDB connectivity, service latency, request count, uptime, and live event logs.

Think of it like a small control room for an application: instead of repeatedly checking terminal commands or logs, the dashboard shows system status visually and updates automatically.

## Features

- Real-time dashboard updates using Server-Sent Events
- Live backend health monitoring
- MongoDB connection status through Mongoose
- API latency, request count, uptime, CPU, and memory-style metrics
- Interactive service cards and tabs
- Docker Compose setup for frontend, backend, and MongoDB
- Kubernetes manifest files for deployment practice
- Modern animated React UI

## Tech Stack

- React
- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker
- Docker Compose
- Kubernetes YAML manifests

## Project Structure

```text
LiveOps/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   └── Dockerfile
├── k8s/
│   ├── backend-deployment.yml
│   ├── backend-service.yml
│   ├── frontend-deployment.yml
│   ├── frontend-service.yml
│   ├── mongodb-deployment.yml
│   └── mongodb-service.yml
├── docker-compose.yml
└── README.md
```

## How It Works

1. The React frontend opens in the browser.
2. The frontend asks the backend for system health data.
3. The backend checks its own status and MongoDB connection status.
4. The backend sends live updates every 2 seconds through `/events`.
5. The frontend updates the dashboard without refreshing the page.

In simple words: LiveOps is like a live scorecard, but instead of cricket scores, it shows application health.

## Backend API

### Health Check

```text
GET /health
```

Returns a JSON snapshot:

```json
{
  "service": "backend-api",
  "backend": "online",
  "database": "connected",
  "latency": 42,
  "cpuLoad": 40,
  "memoryLoad": 55,
  "requests": 12,
  "uptimeSeconds": 120
}
```

### Real-Time Events

```text
GET /events
```

Streams fresh health data every 2 seconds using Server-Sent Events.

## Run Locally Without Docker

Open one terminal for the backend:

```powershell
cd D:\tierthree\backend
$env:PORT="5000"
$env:MONGO_URI="mongodb://localhost:27017/testdb"
npm start
```

Open a second terminal for the frontend:

```powershell
cd D:\tierthree\frontend
$env:PORT="3000"
$env:REACT_APP_API_URL="http://localhost:5000"
npm start
```

Then open:

```text
http://localhost:3000
```

Backend health endpoint:

```text
http://localhost:5000/health
```

## Run With Docker Compose

Make sure Docker Desktop is running, then run:

```powershell
cd D:\tierthree
docker compose up --build
```

Open:

```text
http://localhost:3000
```

Stop the containers:

```powershell
docker compose down
```

## Proving It Is Real-Time

Open the dashboard and watch these values:

- API latency
- Requests observed
- Backend uptime
- CPU load
- Memory load
- Live logs

They update automatically without refreshing the page.

You can also open:

```text
http://localhost:5000/health
```

Refresh that endpoint manually and compare the changing values with the dashboard. The dashboard receives similar updates automatically from:

```text
http://localhost:5000/events
```

## Real-World Example

Imagine an e-commerce app.

- The frontend is where users browse products.
- The backend handles login, carts, orders, and payments.
- MongoDB stores product and order data.
- Docker/Kubernetes help run the services in containers.

If the backend becomes slow or the database disconnects, users may not be able to place orders. LiveOps helps developers quickly see what part of the system is healthy or broken.

## Interview Explanation

LiveOps is a real-time monitoring dashboard for a full-stack cloud-native application. The React frontend listens to a live event stream from the Express backend using Server-Sent Events. The backend checks MongoDB through Mongoose and sends fresh health snapshots every two seconds. This lets the dashboard update service status, latency, request count, uptime, and logs without refreshing the page.

## Notes

- If MongoDB is not running or not reachable, the dashboard will show the database as `disconnected`.
- If Docker is not running, use the local `npm start` method instead.
- If the browser shows an old UI, hard refresh with `Ctrl + Shift + R`.
