
import { Trip } from "@/types/Trip"
import {LogbookEntry, LogBookEntry} from "@/types/LogBookEntry"

export const storage = {

    set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null
    },
}

export function addLogbookEntry (logbookEntry: LogbookEntry) {
   const logbookList = storage.get<LogbookEntry[]>("Entrys") ?? [];
   logbookList.push(logbookEntry)
    storage.set("Entrys", logbookList)
}

export function getLogbookEntriesByTripId (tripId: number) {
    const logbookList = storage.get<LogbookEntry[]>("Entrys") ?? [];
    return logbookList.filter(logbookEntry => logbookEntry.tripId === tripId);
}

export function addTrip (trip: Trip) {
   const tripsList =  storage.get<Trip[]>("trips") ?? [];
   tripsList.push(trip)
    storage.set("trips", tripsList)
}

export function getTrips() {
   return storage.get<Trip[]>("trips") ?? [];

}

export function getTripById(id: number) {
    const tripsList = storage.get<Trip[]>("trips") ?? [];
    return tripsList.find(trip => trip.id === id);

}

export function deleteTrip(id: number ) {
    const tripsList = storage.get<Trip[]>("trips") ?? [];
    const filteredTrips = tripsList.filter(trip => trip.id !== id);
    storage.set<Trip[]>("trips", filteredTrips);

}