# saillog

Mobile Segel-Logbuch: zeichnet die gefahrene Strecke per GPS auf und verbindet
Logbucheinträge mit dem Track. Jeder Eintrag erscheint als Marker auf der Route –
Tippen zeigt den Eintrag.

## Stack

- **Ionic + Vue 3 + TypeScript** – UI, als native App verpackt
- **Capacitor** – nativer Zugriff (GPS) und Build für iOS/Android
- **Leaflet + OpenStreetMap** – Kartendarstellung (geplant)
- lokale Speicherung zuerst; Spring-Backend optional später

## Entwicklung

```bash
npm install          # Dependencies
ionic serve          # im Browser entwickeln (Live-Reload)
```

### Native (iOS/Android)

```bash
ionic capacitor add ios       # iOS-Projekt anlegen
ionic capacitor run ios       # im Simulator starten
```

## Nächste Schritte

- [ ] Capacitor Geolocation-Plugin für Live-Tracking
- [ ] Leaflet-Karte einbinden, Track als Polyline
- [ ] Logbucheinträge (CRUD) mit Positionsbezug
- [ ] Marker auf dem Track, Tippen öffnet Eintrag
