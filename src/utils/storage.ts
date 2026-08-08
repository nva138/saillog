
import { Trip } from "@/tyes/Trip.ts"

export const storage = {

    set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null
    },
}