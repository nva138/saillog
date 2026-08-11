<script setup lang="ts">
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonAlert} from "@ionic/vue";
import {useRoute} from "vue-router";
import {addLogbookEntry, getLogbookEntriesByTripId, getTripById, saveTrackPoints, loadTrackPointsForTrip} from "@/utils/storage";
import {onMounted, onUnmounted, ref} from "vue";
import { Geolocation } from '@capacitor/geolocation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrackPoint } from "@/types/TrackPoint";

const route = useRoute();
const trip = getTripById(Number(route.params.id));
const isAlertOpen = ref(false);
const trackPoints = ref<TrackPoint[]>([])
const setAlertOpen = (state: boolean) => {
  isAlertOpen.value = state;}
let watchId: string;
let map: L.Map;

onMounted(() => {
  map = L.map("map").setView([48.21, 16.37], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
  setTimeout(() => map.invalidateSize(), 100);
  const logbookEnty = getLogbookEntriesByTripId(Number(route.params.id));
  logbookEnty.forEach((item) => {
    L.marker([item.lat, item.lon]).addTo(map).bindPopup(item.note ?? "");
  })

  const line = L.polyline([]).addTo(map);
  trackPoints.value = loadTrackPointsForTrip(Number(route.params.id));
  line.setLatLngs(trackPoints.value.map(p => [p.lat, p.lon]))
  let centered = false;
  Geolocation.watchPosition({}, (position) => {
    if (position) {
      const point = {
        id: Date.now(),
        tripId: Number(route.params.id),
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        time: new Date().toISOString()
      };
      if (!centered) {
        map.setView([point.lat, point.lon], 20);
        centered = true;
      }
      trackPoints.value.push(point);
      line.setLatLngs(trackPoints.value.map(p => [p.lat, p.lon]));
      saveTrackPoints(point);
    }
  }).then(id => watchId = id);
})

onUnmounted(() => {
  Geolocation.clearWatch({ id: watchId });
  map.remove();
})

  const alertInput = [
    {
      name: "tripNote",
      type: "text" as const,
      placeholder: "Add a new Note!"
    }
  ];

const alertButton = [
  {
    text: "cancel",
    role: "cancel"
  },
  {
    text: "add Logbook entry",
    handler: async (data: {tripNote: string}) => {
      if(!data.tripNote || data.tripNote.trim() === "") {
        return false;
      }

      const position = trackPoints.value[trackPoints.value.length - 1];
      if (!position) return false;
      const newNote =
          {
            id: Date.now(),
            tripId: Number(route.params.id),
            time: new Date().toISOString() ,
            lat: position.lat,
            lon: position.lon,
            speed: 0,
            course: 0,
            note: data.tripNote
          };

      addLogbookEntry(newNote);

    }
  }
];


</script>
<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-title>LiveTrip </ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div id="map" style="height: 400px"></div>
    <ion-button fill="outline" @click="setAlertOpen(true)">Add new note!</ion-button>
    <ion-alert
        :is-open="isAlertOpen"
        header="Add Note"
        sub-header="Add new note"
        :inputs="alertInput"
        :buttons="alertButton"
        @didDismiss="setAlertOpen(false)"
    ></ion-alert>
  </ion-content>
</ion-page>
</template>