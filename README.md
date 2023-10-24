# Apskrift

Apskrift is a typing practice tool. Choose a gamemode and write as quickly as possible to get a high WPM. In the future, you will be able to link your GitHub and save your stats to see your improvement over time.

## Features

- [ ] Word limit
- [ ] Time limit
- [ ] Custom inputs
- [ ] Multiplayer (typeracer inspired)

## Project structure

Apskrift is separated into two directories, [`frontend`](./frontend) and [`backend`](./backend).

The backend handles accounts and stats, the frontend contains the website and game.

## Dependency philosophy

- In the frontend, I have decided to only rely on node and dotenv, the rest is pure HTML, CSS and TS.
- The backend has not been started yet, but due to account safety, more dependencies will exist since I do not want to put your data at risk (this includes db, auth and password handling).

## Conventions

- 4 spaces
- prettier formatter with double quotes
- prefer functions over function variables
- naming
  - classes: PascalCase
  - files: kebab-case, should be short and without `-` if possible
  - variables: camelCase
  - directories: kebab-case
