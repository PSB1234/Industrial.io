# Industrial.io Backend

This is the backend server for **Industrial.io**, a real-time multiplayer Monopoly-like board game. It handles game logic, room management, and player communication using WebSockets and HTTP APIs.

## Features

- **Real-time Communication**: Powered by Socket.io for instant game updates and chat.
- **Room Management**: Create, join, and manage game rooms.
- **Game Logic**: Centralized game state management for the board game mechanics.
- **Chat System**: In-game chat functionality for players.
- **Type Safety**: Built with TypeScript and Zod for robust data validation.

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Real-time**: [Socket.io](https://socket.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Tooling**: [Biome](https://biomejs.dev/) (Formatter/Linter), [tsx](https://github.com/privatenumber/tsx) (Dev server)

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** (Package manager)
