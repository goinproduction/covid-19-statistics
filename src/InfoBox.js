import React from 'react'
import {Card, CardContent, Typography} from "@material-ui/core";
import "./InfoBox.css";
function InfoBox({title, cases, active, isRed, total, ...props}) {
    return (
        <Card 
            onClick={props.onClick} 
            className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}> 
            <CardContent>
                {/* Title  */}
                <Typography color="textSecondary" className="infoBox__title">
                    {title}
                </Typography>
                 {/* So luong ca nhiem  */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/* Tong so luong ca nhiem */}
                <Typography className="infoBox__total" color="textSecondary">
                    Tổng ca nhiễm: {total}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox