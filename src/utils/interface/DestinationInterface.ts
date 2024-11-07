export interface Destination {
  locationId: number;
  locationName: string;
  locationImage: string;
}

export interface DestinationProps {
  locationName: string;
  locationImage: string;
}

export interface Row {
  status: string;
  message: string;
  data: Destination[];
}

export interface DestinationFilter {
  locationName: string;
}
