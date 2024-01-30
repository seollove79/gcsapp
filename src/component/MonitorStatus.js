import React, { useState, useContext, useEffect } from 'react';
import q10 from '../images/q10.jpg';
import { Grid } from '@mui/material';
import BatteryIcon from '../images/battery.png';
import Sattelite from '../images/sattelite.png';
import Communication from '../images/communication.png';

const MonitorStatus = (props) => {
    return (
        <div style={{padding:"5px",marginRight:"10px", background:"rgba(0,0,0,0.7"}}>
            <Grid container spacing={2}>
                <Grid item><img src={q10} style={{height:"55px"}}/></Grid>
                <Grid item>
                    <Grid container style={{width:"120px"}}>
                        <Grid item xs={12} style={{color:"white"}}>{props.droneId}</Grid>
                        <Grid item xs={12} style={{marginTop:"5px"}}>
                            <Grid container spacing={2}>
                                <Grid item><img src={BatteryIcon} style={{height:"28px"}}/></Grid>
                                <Grid item><img src={Communication} style={{height:"28px"}}/></Grid>
                                <Grid item><img src={Sattelite} style={{height:"28px"}}/></Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default MonitorStatus;
