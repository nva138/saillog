<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, IonList, IonItem, IonLabel,
} from '@ionic/vue';
import {useRoute} from "vue-router";
import { getTripById } from "@/utils/storage";

const route = useRoute();
const trip = getTripById(Number(route.params.id));
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
      </ion-content>
  </ion-page>
</template>