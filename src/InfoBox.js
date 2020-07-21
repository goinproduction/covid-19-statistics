import React from 'react'
import {Card, CardContent, Typography} from "@material-ui/core";
function InfoBox({title, cases, total}) {
    return (
        <Card className="infoBox"> 
            <CardContent>
                {/* Title  */}
                <Typography color="textSecondary" className="infoBox__title">
                    {title}
                </Typography>
 
                <h2 className="infoBox__cases">{cases}</h2>
                {/* So luong ca nhiem  */}

                {/* Tong so luong ca nhiem */}
                <Typography className="infoBox__total">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox