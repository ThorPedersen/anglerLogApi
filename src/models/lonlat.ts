    export interface Coord {
        lat: number;
        lon: number;
    }

    export interface Main {
        temp: number;
        pressure: number;
        humidity: number;
        temp_min: number;
        temp_max: number;
    }

    export interface Wind {
        speed: number;
        deg: number;
    }

    export interface Sys {
        country: string;
    }

    export interface Clouds {
        all: number;
    }

    export interface Weather {
        id: number;
        main: string;
        description: string;
        icon: string;
    }

    export interface List {
        id: number;
        name: string;
        coord: Coord;
        main: Main;
        dt: number;
        wind: Wind;
        sys: Sys;
        rain?: any;
        snow?: any;
        clouds: Clouds;
        weather: Weather[];
    }

    export class LonLatObject {
        message: string;
        cod: string;
        count: number;
        list: List[];
    }