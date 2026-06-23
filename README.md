# PRITECH Tasks

A polished Expo + React Native task manager built for the PRITECH React Native technical task. The app focuses on clean fundamentals, practical TypeScript, local persistence, and a premium dark UI without unnecessary state-management complexity.

## Features

- Create personal tasks with inline title validation
- View tasks with title, description preview, status, and created date
- Toggle tasks between pending and completed
- Delete tasks with immediate local persistence
- Search tasks by title
- Filter tasks by all, completed, or pending
- Dedicated task details screen
- Required empty states for no tasks, no search results, no completed tasks, and no pending tasks
- Suggested Tasks section powered by JSONPlaceholder
- Custom animated toast feedback for create, update, and delete actions

## Tech Stack

- Expo
- React Native
- TypeScript
- React Navigation native stack
- AsyncStorage
- Functional components and React Hooks

## Setup

```bash
npm install
```

## Running

```bash
npm start
```

Then open the app in Expo Go, an Android emulator, an iOS simulator, or the web preview from the Expo developer tools.

Useful commands:

```bash
npm run android
npm run ios
npm run web
npm run typecheck
```

## Architecture

The source is organized in a simple, assessment-friendly structure:

```text
src/
  components/   Reusable UI pieces such as TaskCard, SearchBar, FilterTabs, EmptyState, PrimaryButton, and Toast
  constants/    Shared colors, spacing, and typography tokens
  navigation/   Stack navigator setup
  screens/      Task List, Add Task, and Task Details screens
  services/     Public API integration for suggested tasks
  storage/      AsyncStorage task loading and saving
  types/        Task and navigation TypeScript types
  utils/        Date formatting and centralized toast helper
```

State is intentionally kept local in `App.tsx` and passed into the stack screens. This keeps the data flow readable while avoiding Redux, Zustand, React Query, or other libraries outside the brief.

## Design System

The app uses a dark premium visual system inspired by focused productivity tools:

- Background: `#0A0A0A`
- Cards: `#141414`
- Surface: `#1C1C1C`
- Borders: `#262626`
- Primary text: `#FAFAFA`
- Secondary text: `#A3A3A3`
- Muted text: `#737373`
- Primary accent: `#3B82F6`
- Success: `#22C55E`
- Danger: `#EF4444`

Spacing and typography live in reusable constants so screens and components stay visually consistent.

## API Integration

Suggested tasks are fetched from:

```text
https://jsonplaceholder.typicode.com/todos?_limit=6
```

The app displays a maximum of six suggested tasks, shows a loading indicator while fetching, and displays a quiet error message if the request fails. Suggested tasks are visually secondary and are kept separate from user-created tasks.

## AsyncStorage

User tasks are loaded once on app start from AsyncStorage and saved after every create, update, or delete action. Invalid or missing stored data safely falls back to an empty task list.

## Screenshots

Add screenshots here after running the app locally:
