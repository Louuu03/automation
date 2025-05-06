# Automation Webhook Integration

This project automates the transfer and synchronization of time tracking and task data between Rize, ClickUp, and Motion via webhooks.

## Features

- **Rize to Motion:** Automatically creates, updates, or deletes Motion tasks based on Rize time entries and session events. Duration is calculated from Rize session data.
- **ClickUp to Motion:** Creates Motion tasks from ClickUp automation webhook events, mapping ClickUp status and details to Motion. Duration is set to 5 minutes per task (customize as needed).
- **Express Webhook Server:** Listens for incoming webhooks on `/webhook/rize` and `/webhook/clickup` endpoints.

## How It Works

- **Rize Webhooks:**
  - Receives time entry and session events from Rize.
  - Cleans and transforms the data, calculates duration, determines client, and syncs with Motion.
  - Supports create, update, and delete operations for Motion tasks.
- **ClickUp Webhooks:**
  - Receives task updates from ClickUp.
  - Maps ClickUp status and task details to Motion and creates a corresponding Motion task.

## Setup

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```
2. **Configure your environment variables** in `.env`:
   ```env
   RIZE_API_KEY=your_rize_api_key
   MOTION_API_KEY=your_motion_api_key
   CLICKUP_API_KEY=your_clickup_api_key
   ```
3. **Start the webhook server:**
   ```bash
   npm start
   ```
   By default, the server listens on port `4000` (or as defined in `PORT`).

## API Endpoints

- `POST /webhook/rize` — Receives and processes Rize webhook events.
- `POST /webhook/clickup` — Receives and processes ClickUp webhook events.

## Project Structure

- `index.ts` — Express server and webhook endpoints.
- `rizeToMotion.ts` — Logic for transforming and syncing Rize data to Motion.
- `clickupToMotion.ts` — Logic for transforming and syncing ClickUp data to Motion.
- `.env` — API keys and secrets (not committed).

## Dependencies
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [TypeScript](https://www.typescriptlang.org/)