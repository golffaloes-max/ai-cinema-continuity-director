# AI Cinema Continuity Director

A continuity-first production copilot for AI filmmakers, built with Codex and GPT-5.6.

## Live Demo

[Open AI Cinema Continuity Director](https://ai-cinema-continuity-director.golffaloes.chatgpt.site)

## The Problem

AI filmmakers often generate shots one at a time. This can cause characters, backgrounds, camera direction, actions, and voices to change unexpectedly between shots.

Maintaining continuity manually requires extensive prompting, comparison, regeneration, and production knowledge.

## The Solution

AI Cinema Continuity Director transforms scene information into a structured production pack designed to preserve cinematic continuity.

The filmmaker provides:

- Scene title
- Story intent
- Dialogue or action
- Production bible
- Character, camera, and background constraints

The system produces:

- Shot brief
- Start-pose prompt
- Video-generation prompt
- Voice direction
- Continuity quality-control checklist

## Key Features

- Converts story beats into production-ready shot instructions
- Preserves character, costume, camera, and background continuity
- Establishes a stable start pose before video generation
- Connects dialogue, action, voice, and visual direction
- Provides continuity checks before editing
- Supports reusable production-bible information

## Workflow

1. Break a story into scenes and dramatic beats.
2. Define dialogue, action, characters, camera, and environment.
3. Generate a continuity-aware production pack.
4. Create the approved start pose.
5. Generate and select video takes with matching action and sound.
6. Edit the selected shots with music and sound effects.
7. Run continuity quality control before final delivery.

## Why It Matters

The project treats generative AI as part of a directed filmmaking workflow—not as a one-click replacement for creative work.

Its goal is to help independent creators produce longer and more coherent AI films while retaining human control over storytelling, performance, composition, and editing.

## Built With

- OpenAI Codex
- GPT-5.6
- Prompt engineering
- Structured production workflows
- HTML, CSS, and JavaScript
- OpenAI Sites

## Current Prototype

The public prototype demonstrates the complete user experience and production-pack structure. It currently includes a continuity-rules fallback so the workflow remains testable without exposing private API credentials.

## Creator

Created by an independent AI filmmaker and animation director with experience in storytelling, storyboarding, visual direction, editing, and continuity-focused production.


## Build Week Scope

The continuity method grew from earlier independent filmmaking experiments. During OpenAI Build Week 2026, I used Codex with GPT-5.6 to turn that method into this new working web application, create the structured generation route, build the public interface, test the workflow, prepare the repository, and document the project for judging.

## How Codex Accelerated the Work

Codex served as an engineering and product-development collaborator. It helped:

- Translate my filmmaking workflow into a clear application architecture
- Build and refine the React and TypeScript interface
- Create the structured GPT-5.6 Responses API route
- Design the strict production-pack output schema
- Implement a deterministic fallback for public testing
- Add copying and Markdown-download functions
- Review the repository for exposed credentials
- Prepare documentation and submission materials

Codex reduced the time required to move from a production method to a working public prototype. I reviewed the results and directed the product, interaction, terminology, and continuity logic.

## Key Human Decisions

The creator made the central filmmaking and product decisions:

- Continuity must be established before image or video generation
- Story intent must guide camera and blocking decisions
- Start pose, video action, voice ownership, and QC must remain separate production locks
- Physical action must complete in the correct order before dialogue begins
- Human filmmakers retain control over performance, selection, regeneration, and final editing
- The public demo must remain testable without exposing private API credentials

## GPT-5.6 Integration

The server route at `app/api/generate/route.ts` uses the OpenAI Responses API with the `gpt-5.6` model.

GPT-5.6 receives the scene title, story intent, dialogue/action, and production bible. A strict JSON schema requires it to return:

- Dramatic beat
- Shot brief
- Start-pose prompt
- Video prompt
- Voice direction
- Continuity checklist

The API key is read only from the server-side `OPENAI_API_KEY` environment variable and is never included in client code or committed to this repository.

If no API key is available, the application uses a deterministic continuity-rules fallback so judges can still test the complete interface.

## Local Setup

Requirements:

- Node.js 22.13 or later
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
