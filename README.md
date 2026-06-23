# PRITECH Tasks

A polished Expo + React Native task manager built for the PRITECH React Native technical assessment.  
The project demonstrates clean architecture, reusable components, local persistence, and a modern dark UI using TypeScript.

## Features

- Create personal tasks with inline validation
- View task list with title, description preview, status, and creation date
- Toggle tasks between pending and completed
- Delete tasks with immediate local persistence
- Search tasks by title
- Filter tasks (All / Completed / Pending)
- Dedicated task details screen
- Empty states for all key scenarios
- Suggested tasks fetched from JSONPlaceholder API
- Custom animated toast notifications

## Tech Stack

- Expo
- React Native
- TypeScript
- React Navigation (Native Stack)
- AsyncStorage
- React Hooks

## Prerequisites

- Node.js (LTS recommended)
- Expo Go app (Android or iOS)
- OR Android Studio / Xcode for emulator

## Setup

npm install

npx expo start

## Running the App

After starting the project:

- Scan QR code with Expo Go
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web

## First Run

- App starts with empty task list
- Suggested tasks are fetched from API
- Users can immediately create and manage tasks
- Data is stored locally using AsyncStorage

## Architecture

src/
  components/   Reusable UI components
  constants/    Design system values
  navigation/   Navigation setup
  screens/      App screens
  services/     API calls
  storage/      AsyncStorage logic
  types/        TypeScript types
  utils/        Helper functions

State is managed in App.tsx and passed down through props.

## Design System

Background: #0A0A0A  
Card: #141414  
Surface: #1C1C1C  
Border: #262626  
Primary Text: #FAFAFA  
Secondary Text: #A3A3A3  
Muted Text: #737373  
Primary Accent: #3B82F6  
Success: #22C55E  
Danger: #EF4444  

## API

https://jsonplaceholder.typicode.com/todos?_limit=6

- Max 6 suggested tasks
- Loading state included
- Error fallback handled
- Separate from user tasks

## AsyncStorage

- Loads tasks on app start
- Saves automatically on create, update, delete
- Falls back to empty state if corrupted or missing

## Screenshots


## Notes

- Built with Expo Managed Workflow
- No backend required
- Fully offline-capable after initial fetch
- Focused on simplicity and clean structure
