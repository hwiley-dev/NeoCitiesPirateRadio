# NeoCities Pirate Radio

8-bit one-world pirate DIY radio site built with static HTML/CSS/JS.

## Stack

1. Vanilla Canvas JavaScript
2. Static files only
3. Neocities free-tier deploy workflow
4. Internet Archive-hosted channel audio
5. Modular `layouts/<layout-id>/` world definitions

## Zero-Cost Workflow

1. Keep this repo local.
2. Host audio files on Internet Archive.
3. Put channel metadata in `channels.json`.
4. Put world data in `layouts/<layout-id>/layout.json` and theme overrides in `layouts/<layout-id>/theme.css`.
5. Run `./deploy.sh` to upload site files to Neocities.

No Node.js build step is required.

## Run Locally

Use a local static server so `layout.json` and `channels.json` can load:

```bash
cd /Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

Keyboard controls:
1. Arrow keys or `WASD` to move avatar
2. `M` toggles audio
3. `X` stops the current track
4. Crossing any edge wraps you to the opposite side of the map

Interaction updates:
1. A title/attract screen now gates entry and can arm audio on start
2. Clicking or tapping any signal row tracks it on the radar without teleporting the player
3. Mobile players can use a D-pad or drag directly on the canvas to steer

Current site panels:
1. Signal Dossier shows the current district, coordinates, audio state, and station credits
2. City Radar shows the whole looping map with station markers and your current position
3. Unlocked Signals keeps quiet zones locked until you actually discover them in-world

Current Bay Loop map notes:
1. The live layout now uses a larger 64x48 peninsula/east-bay silhouette
2. The viewport is widened to 24x18 so the world reads more like a broad overworld map
3. `S` tiles are shallow or waterfront paths that look like water but remain walkable
4. `~` tiles remain deep water and are blocked
5. `H` tiles mark hills or ridgelines and are blocked
6. The renderer adds shoreline accents so the bay contour reads cleaner at a distance

## Layout System

The active layout defaults to `bay-loop`.

Files:
1. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/layouts/bay-loop/layout.json`
2. `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/layouts/bay-loop/theme.css`

You can load a different layout later with a query string such as:

```text
/?layout=bay-loop
```

Current layout contract:
1. `id`, `name`, `themeHref`
2. `viewport.width`, `viewport.height`
3. `spawn.x`, `spawn.y`
4. `blockedTiles`
5. `map[]`
6. `copy.tag`, `copy.title`, `copy.subtitle`, `copy.help`
7. `districts[]`
8. `trafficLanes[]`
9. optional `palette`

Map rows may contain spaces for readability. The runtime strips spaces before validation.
Supported map tiles:
1. `.` roads or walkable land
2. `P` plazas or special walkable landmarks
3. `S` shallow or waterfront walkable tiles
4. `=` bridges or causeways
5. `B` blocked dense structures
6. `H` blocked hills or ridgelines
7. `~` blocked deep water

## Channel Contract

All channels are defined in `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/channels.json`.

Each channel must include:
1. `id`, `name`, `tileX`, `tileY`, `color`, `desc`
2. either `audio: null` for a quiet zone or an `audio` object with:
3. `audio.primaryUrl`
4. `audio.fallbackUrl`
5. `audio.license`
6. `audio.attribution`
7. `audio.durationSec`

If manifest loading fails, the game falls back to silent channel mode and logs diagnostics in the Transmission Log panel.

## Internet Archive Naming Convention

Use this pattern to keep updates predictable:
1. IA item: `neocities-pirate-radio-<channel-id>`
2. OGG: `<channel-id>-v<version>.ogg`
3. MP3 fallback: `<channel-id>-v<version>.mp3`

Example:
1. `neocities-pirate-radio-dock`
2. `dock-v1.ogg`
3. `dock-v1.mp3`

## Update Protocol

1. Upload new versioned audio files to Internet Archive.
2. Update `channels.json` URLs to the new filenames.
3. Update `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/ATTRIBUTION.md`.
4. Run `./deploy.sh --check-audio`.
5. Run `./deploy.sh`.

## Deploy

Recommended one-time setup uses a Neocities API key instead of your account password.

Generate a key from the Neocities API:

```bash
curl -u "your_site_name:your_neocities_password" https://neocities.org/api/key
```

Then export the key for future deploys:

```bash
export NEOCITIES_API_KEY="your_api_key"
```

Dry run:

```bash
./deploy.sh --dry-run
```

Audio URL check only:

```bash
./deploy.sh deploy-audio-check
```

Audio check + deploy:

```bash
./deploy.sh --check-audio
```

Password-based auth still works if needed:

```bash
./deploy.sh --username your_site_name --password your_neocities_password
```

## Licenses

1. Code: MIT (`LICENSE`)
2. Media policy: `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/MEDIA_LICENSE.md`
3. Attribution records: `/Users/hunterwiley/Code-Projects/NeoCitiesPirateRadio/ATTRIBUTION.md`
