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
                 {/* So luong ca nhiem  */}
                <h2 className="infoBox__cases">{cases}</h2>

                {/* Tong so luong ca nhiem */}
                <Typography className="infoBox__total">
                    Total: {total}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox