# CLAUDE.md

This file provides guidance to AI agents like [Claude Code](claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `bun i` - Install dependencies
- `bun dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun start` - Start production server

### Linting & Formatting
- `bun run lint` - Lint and auto-fix with Biome
- `bun run format` - Format code with Biome
- `bun run check` - Run Biome checks without fixes

### Storybook
- `bun run storybook` - Start Storybook on port 6006
- `bun run build-storybook` - Build Storybook

## Architecture Overview

This is a Next.js video browser application that showcases a collection of videos with subtitles and additional resources. The app supports multiple video platforms (YouTube, Vimeo, direct video files) and provides a unified video player experience.

### Key Components

**State Management**
- `PlayerStateProvider` - Central state management for video playback, playlist, and slider
- Context-based state sharing across components
- Manages video selection, playback state, and slider reference

**Video System**
- `VideoPlayer` - Main video player component using [Vidstack Player](https://vidstack.io/docs/player/)
- Supports multiple video sources (YouTube, Vimeo, direct MP4)
- Handles subtitles with automatic language detection from filename patterns
- Auto-destroys external players (YouTube/Vimeo) on component unmount

**UI Components**
- `VideoGallery` - Main gallery view with drawer-based video selection
- `VideoSlider` - Vertical slider for video navigation
- `Drawer` - Slide-out panel component for video selection
- Chakra UI for styling and layout

### Video Platform Support

The app automatically detects video platform from URL patterns:
- YouTube: URLs containing "youtu"
- Vimeo: URLs containing "vimeo.com"  
- Direct video: All other URLs (MP4, etc.)

### Subtitle System

Subtitles follow naming convention: `filename.{lang}.{format}`
- Supported formats: SRT, VTT
- Language codes mapped to display names in `languages.json`
- First subtitle track is set as default

### Data Structure

Videos are defined in `src/app/videos.json` with schema validation via Valibot:
- Each video has metadata (title, description, duration)
- Supports thumbnails, posters, and subtitles
- Resource links for additional materials
- Schema validation ensures URL validity

### File Organization

- `src/components/videos/` - Video-related components
- `src/components/base/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions and validation
- `public/` - Static assets including video files and subtitles

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: Bun for package management and development
- **UI Library**: Chakra UI v3
- **Video Player**: Vidstack Player (with React integration)
- **Validation**: Valibot for schema validation
- **Styling**: CSS-in-JS (style attributes) with Chakra UI + custom CSS for non React elements
- **Linting**: Biome (replaces ESLint + Prettier)

### Additional configuration and best practices

- Format code according to the specs inside `.editorconfig` or run `bun format` after edition (respect usage of TABS for indentation)
