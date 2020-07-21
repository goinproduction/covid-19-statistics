import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  useEffect(() => {
    // handle countries list
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }
          ));

          setCountries(countries)
        })
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  }

  return (
    <div className="app">
      <div className="app__left">
        {/* Header  */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Toàn cầu
            </MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* InfoBoxes - Cases */}
          <InfoBox title="Số lượng ca nhiễm" case={100} total={2000} />
          {/* InfoBoxes - Recovery */}
          <InfoBox title="Hồi phục" case={200} total={3000} />
          {/* InfoBoxes - Deaths*/}
          <InfoBox title="Tử vong" case={300} total={4000} />
        </div>
        
        {/* Maps */}
        <div className="app__map">
          <Map />
        </div>
      </div>
    <Card className="app__right">
      <CardContent>
        <h3>Số ca nhiễm theo quốc gia</h3>
        {/* Table */}

        <h3>Tổng số ca mới</h3>
        {/* Graph */}
      </CardContent>
    </Card>
    </div>
  );
}

export default App;
