<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, IonLabel, IonSegment, IonSegmentButton,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonButtons, IonBackButton
} from '@ionic/vue';
import {useRoute} from "vue-router";
import {
  getTripById,
  getLogbookEntriesByTripId,
  loadTrackPointsForTrip,
  calcTripTime,
  deleteTrip, getTrips, deleteLogbookEntriesById
} from "@/utils/storage";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {LogbookEntry} from "@/types/LogbookEntry";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const trip = getTripById(Number(route.params.id));
const logbookEntries = ref<LogbookEntry[]>([])
const view = ref<'map' | 'list'>('map');
let map: L.Map

const formatTime = (iso: string) =>
    new Date(iso).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

function formatMS() {
  const ms = calcTripTime(Number(route.params.id));

  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000 / 60000));
  const seconds = Math.floor((ms % 60000 / 1000));

  const pad = (num: number) => String(num).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function deleteHandler(id: number) {
  deleteLogbookEntriesById(id);
  logbookEntries.value = getLogbookEntriesByTripId(Number(route.params.id));
}

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

watch(view, (v) => {
  if (v === 'map') {
    setTimeout(() => map.invalidateSize(), 100);
  }
});

</script>

<template>
  <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/home"></ion-back-button>
          </ion-buttons>
          <ion-title>Trip Details</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div v-if="!trip" class="ion-text-center ion-padding">
          <p>Trip not found</p>
        </div>
        <div v-else class="trip-header">
          <h2 class="trip-name">{{ trip?.name }}</h2>
          <p class="trip-date">{{ trip?.eventDate }}</p>
          <p class="trip-stats">{{ formatMS() }} · {{ logbookEntries.length }} entries</p>
          <p class="trip-times">
            <span v-if="trip?.startingTime">Started {{ formatTime(trip.startingTime) }}</span>
            <span v-if="trip?.finishingTime"> · Ended {{ formatTime(trip.finishingTime) }}</span>
          </p>
        </div>
        <ion-segment v-model="view">
          <ion-segment-button value="map"><ion-label>Map</ion-label></ion-segment-button>
          <ion-segment-button value="list"><ion-label>List</ion-label></ion-segment-button>
        </ion-segment>
        <div id="detailMap" v-show="view === 'map'" style="height: 400px"></div>
        <div v-show="view === 'list'">
          <ion-card v-for="entry in logbookEntries" :key="entry.id">
            <ion-card-header>
              <ion-card-subtitle>{{ formatTime(entry.time) }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <p class="note-text">{{ entry.note || "No note" }}</p>
              <p class="note-meta">
                {{ entry.lat.toFixed(4) }}, {{ entry.lon.toFixed(4) }} · {{ entry.speed }} kn · {{ entry.course }}°
              </p>
            </ion-card-content>
            <ion-button fill="outline" @click="deleteHandler(entry.id)">X</ion-button>
          </ion-card>
        </div>
      </ion-content>
  </ion-page>
</template>

<style scoped>
.trip-header {
  padding: 4px 4px 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
}
.trip-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 2px;
  color: var(--ion-text-color);
}
.trip-date {
  font-size: 0.85rem;
  opacity: 0.6;
  margin: 0 0 10px;
}
.trip-stats {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ion-color-primary);
  margin: 0 0 4px;
}
.trip-times {
  font-size: 0.8rem;
  opacity: 0.6;
  margin: 0;
}
.note-text {
  font-size: 1rem;
  margin: 0 0 6px;
  color: var(--ion-text-color);
}
.note-meta {
  font-size: 0.8rem;
  opacity: 0.6;
  margin: 0;
}
</style>