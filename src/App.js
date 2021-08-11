import React, { useState, useEffect } from 'react';
import './App.css';
import {
    MenuItem,
    FormControl,
    Select,
    Card,
    CardContent,
} from '@material-ui/core';
import Maps from './components/maps/Maps';
import InfoBox from './components/infobox/InfoBox'
import Table from './components/table/Table';
import { sortData, formatStat } from './utils/Util';
import LineGraph from './components/linegraph/LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);

    // @Mặc định sẽ nằm ở VN
    const [mapCenter, setMapCenter] = useState({
        lat: 21,
        lng: 105.8,
    });
    const [mapZoom, setMapZoom] = useState(5);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState('cases');
    const [stateName, setStateName] = useState('nhiễm');

    // @Lấy dữ liệu chung (toàn thế giới) từ API đổ vào countryInfo
    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    // @
    useEffect(() => {
        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
                .then((response) => response.json())
                .then((data) => {
                    //@ Lấy name + shortName của countries đổ vào countries
                    const countries = data.map((country) => ({
                        name: country.country,
                        value: country.countryInfo.iso2,
                    }));
                    // @Coutries chứa name/shortname
                    setCountries(countries);

                    // @Sắp xếp số ca nhiễm từ lớn đến bé => đưa vào bảng
                    const sortedData = sortData(data);
                    setTableData(sortedData);

                    // @Lấy dữ liệu đầy đủ từng quốc gia từ API đổ vào mapCountries
                    setMapCountries(data);
                });
        };
        getCountriesData();
    }, []);

    // @Khi người dùng chuyển đổi quốc gia
    const onCountryChange = async (event) => {
        try {
            const countryCode = event.target.value;
            countryCode === null
                ? setCountry('worldwide')
                : setCountry(countryCode);
            const url =
                countryCode === 'worldwide'
                    ? 'https://disease.sh/v3/covid-19/all'
                    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

            // @Lấy dữ liệu theo quốc gia đã chọn
            await fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    // @Lấy countrycode và dữ liệu đầy đủ của quốc gia được chọn
                    setCountry(countryCode);
                    setCountryInfo(data);

                    // @Set lat/map của quốc gia đó
                    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                    setMapZoom(5);
                });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='app'>
            <div className='app__left'>
                {/* Header  */}
                <div className='app__header'>
                    <FormControl className='app__dropdown'>
                        <Select
                            variant='outlined'
                            value={country}
                            onChange={onCountryChange}
                        >
                            <MenuItem value='worldwide'>Toàn cầu</MenuItem>
                            {countries.map((country, index) => (
                                <MenuItem key={index} value={country.value}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className='app__stats'>
                    <InfoBox
                        isRed
                        active={casesType === 'cases'}
                        onClick={() => {
                            setCasesType('cases');
                            setStateName('nhiễm');
                        }}
                        title='Ca nhiễm'
                        cases={formatStat(countryInfo.todayCases)}
                        total={formatStat(countryInfo.cases)}
                    />
                    <InfoBox
                        active={casesType === 'recovered'}
                        onClick={() => {
                            setCasesType('recovered');
                            setStateName('hồi phục');
                        }}
                        title='Hồi phục'
                        cases={formatStat(countryInfo.todayRecovered)}
                        total={formatStat(countryInfo.recovered)}
                    />
                    <InfoBox
                        isRed
                        active={casesType === 'deaths'}
                        onClick={() => {
                            setCasesType('deaths');
                            setStateName('tử vong');
                        }}
                        title='Tử vong'
                        cases={formatStat(countryInfo.todayDeaths)}
                        total={formatStat(countryInfo.deaths)}
                    />
                </div>

                {/* Maps */}
                <div className='app__map'>
                    <Maps
                        casesType={casesType}
                        countries={mapCountries}
                        center={mapCenter}
                        zoom={mapZoom}
                    />
                </div>
            </div>
            <Card className='app__right'>
                <CardContent>
                    <h3>Số ca nhiễm theo quốc gia</h3>
                    <Table countries={tableData} />

                    <h3>Tổng số ca {stateName} mới</h3>
                    <LineGraph className='app__graph' casesType={casesType} />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
