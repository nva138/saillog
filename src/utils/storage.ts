
import { Trip } from "@/types/Trip"

export const storage = {

    set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null
    },
}

export function addTrip (trip: Trip) {
   const tripsList =  storage.get<Trip[]>("trips") ?? [];
   tripsList.push(trip)
    storage.set("trips", tripsList)
}

export function getTrips() {
   return storage.get<Trip[]>("trips") ?? [];

}

export function deleteTrip(id: number ) {
    const tripsList = storage.get<Trip[]>("trips") ?? [];
    const filteredTrips = tripsList.filter(trip => trip.id !== id);
    storage.set<Trip[]>("trips", filteredTrips);

}