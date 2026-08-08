export interface LogbookEntry {
    id: number
    tripId: number
    time: string
    lat: number
    lon: number
    speed: number
    course: number
    note?: string
}