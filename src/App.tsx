import React from 'react';
import { useState } from 'react';
import AirportAutocomplete from './components/AirportAutocomplete/AirportAutocomplete'
import MapWithLine from './components/Map/Map';
import { Coordinates } from './types/Coordinates';
import './App.css'

const App: React.FC = () => {
    const [selectedDepartureAirport, setSelectedDepartureAirport] = useState<string>('');
    const [selectedArrivalAirport, setSelectedArrivalAirport] = useState<string>('');
    const [startingCoordinates, setStartingCoordinates] = useState<Coordinates | null>(null);
    const [endingCoordinates, setEndingCoordinates] = useState<Coordinates | null>(null);
    const [totalDistance, setTotalDistance] = useState<string>('')

    const handleDepartureAirportSelect = (airport: any) => {
      setSelectedDepartureAirport(airport.place_id);
    };

    const handleArrivalAirportSelect = (airport: any) => {
      setSelectedArrivalAirport(airport.place_id);
    };

    const handleSubmit = async () => {
    if (!selectedDepartureAirport || !selectedArrivalAirport) {
      alert('Please select both departure and arrival airports.');
      return;
    }

    try {
      // Calculate distance between departure and arrival
      let response = await fetch('/.netlify/functions/calculateDistance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departureAirport: selectedDepartureAirport,
          arrivalAirport: selectedArrivalAirport,
        }),
      });

      if (response.ok) {
        let result = await response.json();
        console.log('Response from backend:', result);
        setTotalDistance(result.distance)
        alert('Data submitted successfully!');
      } else {
        console.error('Failed to submit data');
      }

      // Fetch coordinates of departure airport
      let departureResponse = await fetch(`/.netlify/functions/getCoordinates/${selectedDepartureAirport}`);
      if (departureResponse.ok) {
          let departureData = await departureResponse.json();
          console.log(departureData)
          setStartingCoordinates(departureData)
          console.log('Departure Airport Coordinates:', startingCoordinates);
      } else {
          console.error('Failed to retrieve departure airport coordinates');
      }

      // Fetch coordinates of arrival airport
      let arrivalResponse = await fetch(`/.netlify/functions/getCoordinates/${selectedArrivalAirport}`);
      if (arrivalResponse.ok) {
          let arrivalData = await arrivalResponse.json();
          console.log(arrivalData)
          setEndingCoordinates(arrivalData)
          console.log('Arrival Airport Coordinates:', endingCoordinates);
      } else {
          console.error('Failed to retrieve arrival airport coordinates');
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

   return (
    <div className="main-container">
      <h1>Airport Distance Calculator</h1>
      <div>
        <AirportAutocomplete onAirportSelect={handleDepartureAirportSelect} />
        <AirportAutocomplete onAirportSelect={handleArrivalAirportSelect} />
        <h1>Total Distance: {totalDistance}</h1>
      </div>
      <div>
        <MapWithLine
          pointA={startingCoordinates ? [startingCoordinates.latitude, startingCoordinates.longitude] : undefined}
          pointB={endingCoordinates ? [endingCoordinates.latitude, endingCoordinates.longitude] : undefined}
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
   );
};

export default App;
