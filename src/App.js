import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData} from './util';
import LineGraph from './LineGraph';
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tabledata, setTableData] = useState([]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

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

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries)
        })
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {

        setCountry(countryCode);
        // Lấy toàn bộ data của quốc gia đó
        setCountryInfo(data);
      })
  }
  // debug: console.log(countryInfo);
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
          <InfoBox title="Số lượng ca nhiễm" cases={countryInfo.todayCases} total={countryInfo.cases} />
          {/* InfoBoxes - Recovery */}
          <InfoBox title="Hồi phục" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          {/* InfoBoxes - Deaths*/}
          <InfoBox title="Tử vong" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
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
          <Table countries={tabledata} />
          <h3>Tổng số ca mới</h3>
          {/* Graph */}
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
