# SimpliServers Community Discord bot

Code for [SimpliServers community Discord server](https://simpliservers.com/out/discord).

## Running

```bash
npm install
```

```bash
npm start
```

## Docker

### Building

```bash
docker build -t community-bot .
```

### Running with docker

```bash
docker run \
  -v $(PWD)/config.yml:/app/config.yml \
  --env-file .env \
  community-bot
```

### Running with docker compose

```yml
version: '3.9'

services:
  community-bot:
    build: .
    env_file: .env
    volumes:
      - config.yml:/app/config.yml
    container_name: community-bot
```

## To-Do

- [x] Moderation commands

  - [x] Ban
  - [x] Softban
  - [x] Kick
  - [x] Warn system
  - [x] Mute
  - [x] User info
  - [x] Clear messages

- [x] Radio

  - Plays playlist from YT. Mutes when no one is in VC.
    Admin can set playlist.

- [x] Shortcut system

- [x] Logging system

  - Logs all messages

- [x] Translator

  - [x] Must specify **from** language

- [x] Ticket system

  - [x] Add users to ticket
  - [x] Remove users from ticket
  - [x] Rename ticket

- [ ] Leveling system

- [x] Suggestions system

- [x] Other misc commands

  - [x] Coinflip
  - [x] Memes (from Reddit)
  - [x] Random number
  - [x] Reaction roles
  - [x] Message embedder (bot can send embedded messages via your commands)
