import React from 'react';
import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';

const casesTypeColors = {
    cases: {
        hex: '#cc1034',
        multiplier: 800,
    },
    recovered: {
        hex: '#4CAF50',
        multiplier: 1200,
    },
    deaths: {
        hex: '#fb4443',
        multiplier: 2000,
    },
};

export const sortData = (data) => {
    const sortedData = [...data];
    return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

// Khoanh vùng maps
export const showDataOnMap = (data, casesType = 'cases') =>
    data.map((country, index) => (
        <Circle
            key={index}
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) *
                casesTypeColors[casesType].multiplier
            }
        >
            <Popup className='info-container'>
                <div>
                    <div
                        className='info-flag'
                        style={{
                            backgroundImage: `url(${country.countryInfo.flag})`,
                        }}
                    ></div>
                    <div className='info-name'>{country.country}</div>
                    <div className='info-injected'>
                        Số ca nhiễm: {numeral(country.cases).format('0,0')}
                    </div>
                    <div className='info-recovered'>
                        Hồi phục: {numeral(country.recovered).format('0,0')}
                    </div>
                    <div className='info-deaths'>
                        Tử vong: {numeral(country.deaths).format('0,0')}
                    </div>
                </div>
            </Popup>
        </Circle>
    ));

// Format lại số liệu cho dễ nhìn
export const formatStat = (stat) =>
    stat ? `+ ${numeral(stat).format('0,0')}` : '+0';
