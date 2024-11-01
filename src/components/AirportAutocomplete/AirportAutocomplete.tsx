import React, { useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { Airport } from '../../types/Airport';
import { AirportAutocompleteProps } from '../../types/AirportAutocompleteProps';

const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({ onAirportSelect }) => {
  const [options, setOptions] = useState<Airport[]>([]);
  
  const fetchAirports = async (inputValue: string) => {
    if (!inputValue) return;

    try {
      let response = await axios.get('/.netlify/functions/autocomplete', {
      // let response = await axios.get('http://localhost:5001/api/autocomplete', {
        params: {
          input: inputValue,
        }
      });
      setOptions(response.data.predictions);
    } catch (error) {
      console.error('Error fetching airport data:', error);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.description} 
      onChange={(_, newValue) => {
        onAirportSelect(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        fetchAirports(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search for an Airport" variant="outlined" />
      )}
    />
  );
};

export default AirportAutocomplete;
