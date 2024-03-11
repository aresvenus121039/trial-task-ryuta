# Dex Dapp using Uniswap v3

## Overview
This project is a decentralized exchange (Dex) Dapp built using Uniswap v3. Users can login, view a list of tokens, and swap tokens seamlessly.

## Core Technologies
- Front-end:
  - React
  - Next.js
  - Tailwind CSS
  - TypeScript
  - Shadcn
  - Rainbowkit
- Database:
  - Superbase
- Authentication:
  - AuthJS (Next-Auth)
- ORM:
  - Prisma / Drizzle
- API:
  - Uniswap V3

## Getting Started
1. Clone this repository.
2. Install dependencies: `npm install`.
3. Set up your environment variables:
   - Create a `.env.local` file in the root directory.
   - Add environment variables as specified in `.env.example`.
4. Start the development server: `npm run dev`.
5. Access the app at `http://localhost:3000`.

## Database Schema
### Users Table
This table stores user information, including email, password, and address.

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL
);

Milestones
#M1: Database Schema
Duration: 1 day
Task: Design and implement the database schema using Prisma or Drizzle.
#M2: User Authentication
Duration: 1 day
Task: Implement user authentication using Next-Auth with email and password.
#M3: Explore Page
Duration: 2 days
Task: Allow users to see a list of tokens with pagination, filtering, and robust API management.
#M4: Dex
Duration: 3 days
Task: Implement a Dex similar to Uniswap with wallet connection, token swapping, gas fee display, loader for pending transactions, success messages, support for multiple chains, and quote refreshing every 15 seconds.
Code of Conduct
Follow the project milestones closely and update the team after reaching each milestone.
Use open-source code responsibly and document any external code integration.
Maintain professionalism in all interactions and submissions.
Communication
Stay proactive in communication through the designated Slack channel.
Reach out for help if encountering challenges during the project.