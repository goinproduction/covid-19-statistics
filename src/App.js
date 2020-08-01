import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, formatStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tabledata, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [stateName, setStateName] = useState('nhiễm');
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
          setMapCountries(data);
          setCountries(countries);
        });
    };
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

        // Maps
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })
  }
  // debug: console.log(countryInfo);
  return (
    <div className="app">
      <div className="app__left">
        {/* Header  */}
        <div className="app__header">
          <h1 className="text-primary">COVID-19</h1>
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
          <InfoBox 
            isRed
            active = {casesType === 'cases'} 
            onClick = {() =>{ 
              setCasesType('cases');
              setStateName('nhiễm');
            }}
            title="Ca nhiễm" 
            cases={formatStat(countryInfo.todayCases)} 
            total={formatStat(countryInfo.cases)} />
          <InfoBox 
            active = {casesType === 'recovered'} 
            onClick = {() => {
              setCasesType('recovered');
              setStateName('hồi phục');
            }}
            title="Hồi phục"
            cases={formatStat(countryInfo.todayRecovered)} 
            total={formatStat(countryInfo.recovered)} />
          <InfoBox 
            isRed
            active = {casesType === 'deaths'}
            onClick = {() => {
              setCasesType('deaths');
              setStateName('tử vong');
            }}
            title="Tử vong" 
            cases={formatStat(countryInfo.todayDeaths)} 
            total={formatStat(countryInfo.deaths)} />
        </div>

        {/* Maps */}
        <div className="app__map">
          <Map
            casesType = {casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Số ca nhiễm theo quốc gia</h3>
          {/* Table */}
          <Table countries={tabledata} />
              <h3>Tổng số ca {stateName} mới</h3>
          {/* Graph */}
          <LineGraph className="app__graph" casesType = {casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
