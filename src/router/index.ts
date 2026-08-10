import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TripListView from "@/views/TripListView.vue";
import TripDetailsView from "@/views/TripDetailsView.vue";
import LiveTripView from "@/views/LiveTripView.vue";


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: TripListView
  },
    {
        path: `/tripDetails/:id`,
        name: "TripDetails",
        component: TripDetailsView
    },

    {
        path: '/liveTrip/:id',
        name: 'LiveTrip',
        component: LiveTripView
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
