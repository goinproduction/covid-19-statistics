import React from "react";
import {Circle, Popup} from "react-leaflet";
import numeral from "numeral";
const casesTypeColors = {
    cases: {
        hex: "#cc1034",
        multiplier: 800,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 1200,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 2000,
    },
};
// Sắp xếp các quốc gia có số ca nhiễm lớn nhất, sorted by cases
export const sortData = data => {
    const sortedData = [...data];
    return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
}
// Khoanh vùng maps
export const showDataOnMap = (data, casesType = 'cases') => {
    data.map(country => (
        <Circle
            center = {[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity = {0.4}
            color = {casesTypeColors[casesType].hex}
            fillColor = {casesTypeColors[casesType].hex}
            radius = {
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <h1>POPUP</h1>
            </Popup>
        </Circle>
    ));
}