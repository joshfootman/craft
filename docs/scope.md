# Craft — Scope

## Purpose

Craft is a personal interaction lab.

Its job is simple: give me a place to study, build, and compare UI ideas so I become a better design engineer. This is not a product, not a startup, and not an app with a business model. It is a working environment for deliberate practice.

Agents should treat the project that way. The point is to make it easy to create, refine, and review small front-end studies with strong attention to motion, typography, layout, interaction detail, and overall feel.

## What This App Is

Craft is a collection of isolated UI studies presented inside a lightweight browsing shell.

Each study should feel like a focused experiment or reference build:

- a motion study
- a layout or navigation study
- a component recreation
- a typography or interaction exercise
- a 3D or visual exploration when useful

The app exists to support those studies, not to compete with them. The surrounding interface should stay quiet, useful, and secondary.

## Core Intent

The project should help with three things:

- capturing UI ideas worth studying
- implementing them as isolated, revisitable studies
- browsing the collection in a way that makes patterns, progress, and craft legible over time

The collection should gradually become both a practice ground and a record of growth.

## Product Shape

At a high level, the app should provide:

- a way to browse all studies
- a way to open a single study directly
- enough metadata to organize and search the collection
- a lightweight shell around each study for navigation and framing

The exact implementation can change. The important thing is the shape of the experience, not the current file structure or framework details.

## Study Principles

Each study should be:

- isolated from the others
- easy to add without touching many unrelated files
- self-contained in its behavior and presentation
- viewable on its own
- identifiable by a small set of descriptive metadata

Each study is a deliberate exercise, not filler content. Prefer fewer stronger studies over a large pile of shallow ones.

## Shell Principles

The shell should help me inspect and navigate studies without becoming the main event.

The shell should generally provide:

- navigation between studies
- clear labeling of the active study
- basic search or discovery support
- responsive framing so studies can be inspected in different viewport contexts
- attribution or inspiration links when relevant

The shell should remain visually restrained. It should support the work, not decorate it.

## Constraints

- minimal chrome around the studies
- no unnecessary product features
- no backend dependency unless a study truly needs one
- no social layer, auth, accounts, or content system as part of the core app
- no complexity added just to make the app feel more like a startup product

If a decision makes the app better for practicing UI craft, it is probably in scope. If it makes the app feel more like generic software product scaffolding, it is probably out of scope.

## Guidance For Agents

When working in this repo:

- optimize for clarity, speed of experimentation, and quality of interaction work
- preserve the idea that studies are the primary artifact
- prefer solutions that make adding and evolving studies easier
- avoid coupling the project too tightly to temporary implementation details
- avoid adding heavyweight product features unless explicitly asked

When unsure, bias toward decisions that make Craft a better personal lab for studying interface design and front-end execution.
