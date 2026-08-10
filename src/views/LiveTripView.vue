<script setup lang="ts">
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonAlert} from "@ionic/vue";
import {useRoute} from "vue-router";
import {addLogbookEntry, getLogbookEntriesByTripId, getTripById} from "@/utils/storage";
import {onMounted, ref} from "vue";
import { Geolocation } from '@capacitor/geolocation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const trip = getTripById(Number(route.params.id));
const isAlertOpen = ref(false);
const setAlertOpen = (state: boolean) => {
  isAlertOpen.value = state;}

onMounted(() => {
  const map = L.map("map").setView([48.21, 16.37], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
  setTimeout(() => map.invalidateSize(), 100);
  const logbookEnty = getLogbookEntriesByTripId(Number(route.params.id));
  logbookEnty.forEach((item) => {
    L.marker([item.lat, item.lon]).addTo(map).bindPopup(item.note ?? "");
  })
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

      const position = await Geolocation.getCurrentPosition();
      const newNote =
          {
            id: Date.now(),
            tripId: Number(route.params.id),
            time: new Date().toISOString() ,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            speed: position.coords.speed ?? 0,
            course: position.coords.heading ?? 0,
            note: data.tripNote
          };

      addLogbookEntry(newNote)
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