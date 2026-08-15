# saillog

A mobile sailing logbook. It records the sailed route via GPS and ties log entries
to the track, so every note shows up as a marker on the map where it was written.

## Features

- Record a live GPS track, drawn as a route on the map in real time
- Add log entries during a trip, each pinned to its GPS position
- Trip list with create and delete
- Trip detail view with a map/list toggle, total duration and entry count
- Delete individual log entries
- Graceful handling when location access is denied
- Local-first: all data is stored on the device, no backend or account needed

## Tech stack

- **Ionic + Vue 3 + TypeScript** for the UI
- **Capacitor** for native device access (GPS) and iOS/Android builds
- **Leaflet + OpenStreetMap** for the maps
- **localStorage** for persistence

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in the browser.

### Running on a device

```bash
npm run build
npx cap add ios        # or: npx cap add android
npx cap run ios        # or: npx cap run android
```

## Notes

The app is local-first by design: trips, track points and log entries live in the
browser's localStorage. There is no server, which keeps it fully usable offline on
the water.

Built as a solo project.
