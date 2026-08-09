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
  IonLabel,
  IonAlert,
  IonButton
} from '@ionic/vue';

const tripList = ref<Trip[]>([]);
const isAlertOpen = ref(false);
const setAlertOpen = (state: boolean) => {
  isAlertOpen.value = state;
}

const alertInput = [
  {
    name: "tripName",
    type: "text" as const,
    placeholder: "Trip in Italy"
  }
];

const alertButton = [
    {
      text: "cancel",
      role:"cancel"
},
  {
    text: "Start",
    handler: (data: {tripName: string}) => {
      if(!data.tripName || data.tripName.trim() === "") {
        return false;
      }
      const newTrip =
          {
            id: Date.now(),
            name: data.tripName,
            eventDate: new Date().toLocaleDateString('de-DE'),
            startingTime: new Date().toLocaleString('de-DE'),
          };
      addTrip(newTrip);
      tripList.value = getTrips();
    }
  }
];



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
      <ion-button fill="outline" @click="setAlertOpen(true)">start trip!</ion-button>

      <ion-alert
          :is-open="isAlertOpen"
          header="Neuen Trip starten"
          sub-header="Wohin geht die Reise?"
          :inputs="alertInput"
          :buttons="alertButton"
          @didDismiss="setAlertOpen(false)"
      ></ion-alert>

    </ion-content>
  </ion-page>
</template>

<style></style>