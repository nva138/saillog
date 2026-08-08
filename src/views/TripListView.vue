<script setup lang="ts">
import { ref, onMounted } from "vue";
import {addTrip, getTrips} from "@/utils/storage";
import type { Trip } from "@/types/Trip";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/vue';

const tripList = ref<Trip[]>([]);

onMounted(() => (
    tripList.value = getTrips()
))

</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Meine Trips</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="tripList.length === 0" class="ion-text-center ion-padding">
        <p>You haven't done any trips so far</p>
      </div>
      <ion-list v-else>
        <ion-item v-for="trip in tripList" :key="trip.id">
          <ion-label>
            {{ trip.name }}
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-button fill="outline" @click="">start trip!</ion-button>
    </ion-content>
  </ion-page>
</template>

<style></style>