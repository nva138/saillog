<script setup lang="ts">
import { ref, onMounted } from "vue";
import {addTrip, getTrips, deleteTrip} from "@/utils/storage";
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
import {useRoute, useRouter} from "vue-router";

const router = useRouter();

const tripList = ref<Trip[]>([]);
const isAlertOpen = ref(false);
const setAlertOpen = (state: boolean) => {
  isAlertOpen.value = state;
}

const alertInput = [
  {
    name: "tripName",
    type: "text" as const,
    placeholder: "Trip name"
  }
];

const alertButton = [
    {
      text: "Cancel",
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
      navigateToLiveTrip(newTrip.id)
    }
  }
];

function deleteHandler(id: number) {
deleteTrip(id);
tripList.value = getTrips()
}

const navigateToTripDetails = (tripId: number) => {
  router.push(`/tripDetails/${tripId}`);
}

const navigateToLiveTrip = (tripId: number) => {
  router.push(`/liveTrip/${tripId}`);
}



onMounted(() => (
    tripList.value = getTrips()
))

</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Trips</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="tripList.length === 0" class="ion-text-center ion-padding">
        <p>No trips recorded yet.</p>
      </div>
      <ion-list v-else>
        <ion-item button v-for="trip in tripList" :key="trip.id" @click="navigateToTripDetails(trip.id)">
          <ion-label>
            {{ trip.name }}
          </ion-label>
          <ion-button fill="outline" @click.stop="deleteHandler(trip.id)">X</ion-button>
        </ion-item>
      </ion-list>
      <ion-button fill="outline" @click="setAlertOpen(true)">Start trip</ion-button>
      <ion-alert
          :is-open="isAlertOpen"
          header="Start a new trip"
          sub-header="Where are you headed?"
          :inputs="alertInput"
          :buttons="alertButton"
          @didDismiss="setAlertOpen(false)"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>
