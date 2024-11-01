import { Airport } from "./Airport";

export interface AirportAutocompleteProps {
    onAirportSelect: (airport: Airport | null) => void;
}