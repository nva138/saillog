<script setup lang="ts">
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonAlert} from "@ionic/vue";
import {useRoute} from "vue-router";
import {addLogbookEntry, getLogbookEntriesByTripId, getTripById} from "@/utils/storage";
import {ref} from "vue";

const route = useRoute();
const trip = getTripById(Number(route.params.id));
const isAlertOpen = ref(false);
const setAlertOpen = (state: boolean) => {
  isAlertOpen.value = state;}


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
    handler: (data: {tripNote: string}) => {
      if(!data.tripNote || data.tripNote.trim() === "") {
        return false;
      }
      const newNote =
          {
            id: Date.now(),
            tripId: Number(route.params.id),
            time: new Date().toISOString() ,
            lat: 0,
            lon: 0,
            speed: 0,
            course: 0,
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