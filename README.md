# Logo Generator AI

A small, focused web application that helps developers, startups, and small businesses create clean, minimal PNG logos quickly. Users can describe a logo in plain language, instantly see the result, and refine it through follow-up messages in a chat-like flow.

## Features
- **Session-Based Logo Generation**: Everything is kept localized to an individual generation session. You can send a series of follow-up tweaks to update your generated logo iteratively.
- **Pre-set Assistance**: Select presets like minimal, tech, and dark mode to guide Gemini AI towards optimal generation results.
- **Fast and Local**: Uses SQLite for fast local persistence of generation history. No user accounts are needed.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and configure your `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env.local
   ```
   *To get a Gemini API Key, visit the [Google AI Studio](https://aistudio.google.com/).*

3. **Initialize the Database:**
   We use `better-sqlite3` locally. The schema is stored in `schema.sql`. You can initialize it manually using the sqlite3 command-line interface:
   ```bash
   sqlite3 local.db < schema.sql
   ```
   *(Alternatively, the app initializes missing tables automatically on startup).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.**

## Technical Architecture
- **Framework:** Next.js (App Router)
- **Database:** SQLite (better-sqlite3)
- **AI Integration:** Google Gemini via `@google/genai`
- **Styling:** Tailwind CSS

### How Sessions and Prompts Work
When a user begins a generation:
1. A unique `session_id` is created.
2. The user's input (prompt + presets) is stored in the `prompt_history` table.
3. Over multiple prompts in the same session, Gemini receives the entire accumulated prompt history to preserve visual consistency across refinements.
4. Generated logos are saved in the `public/logos` folder and the paths are stored in the `generated_logos` table.
