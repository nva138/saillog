<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, IonList, IonItem, IonLabel,
} from '@ionic/vue';
import {useRoute} from "vue-router";
import {getTripById, getLogbookEntriesByTripId, loadTrackPointsForTrip} from "@/utils/storage";
import {onMounted, onUnmounted, ref} from "vue";
import {LogbookEntry} from "@/types/LogbookEntry";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const trip = getTripById(Number(route.params.id));
const logbookEntries = ref<LogbookEntry[]>([])
let map: L.Map

onMounted(() => {
      map = L.map("detailMap").setView([48.21, 16.37], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
      setTimeout(() => map.invalidateSize(), 100);
  logbookEntries.value = getLogbookEntriesByTripId(Number(route.params.id));
  const points = loadTrackPointsForTrip(Number(route.params.id));
  logbookEntries.value.forEach(e =>
      L.marker([e.lat, e.lon]).addTo(map).bindPopup(e.note ?? "")
  );
  L.polyline(points.map(p => [p.lat, p.lon])).addTo(map);


    }
);

onUnmounted(() => {
  map.remove();
});

</script>

<template>
  <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Trip Details</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div v-if="!trip" class="ion-text-center ion-padding">
          <p>Trip not found</p>
        </div>
        <ion-list v-else>
          <ion-item>
            <ion-label>
              {{ trip?.name }}
              {{trip?.eventDate}}
              {{trip?.startingTime}}
              {{trip?.finishingTime}}
            </ion-label>
          </ion-item>
        </ion-list>
        <div id="detailMap" style="height: 400px"></div>
        <ion-list>
          <ion-item v-for="entry in logbookEntries" :key="entry.id">
            <ion-label>{{ entry.note }} {{ entry.time }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
  </ion-page>
</template>