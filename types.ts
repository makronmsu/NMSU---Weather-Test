
export interface WeatherStation {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  currentTemp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  highTemp: number;
  lowTemp: number;
  dewPoint: number;
  peakGust: number;
  solarRad: number;
  soilTemp: number;
  lastUpdated: string;
  trends: {
    time: string;
    temp: number;
    wind: number;
  }[];
}

export enum MeasurementType {
  TEMPERATURE = 'Temperature',
  WIND_SPEED = 'Wind Speed',
}
