import React, { useState, useContext, useEffect } from 'react';
import { CommonContext } from '../CommonContext';
import q10 from '../images/q10.jpg';
import { Grid } from '@mui/material';
import BatteryIcon from '../images/battery.png';
import Sattelite from '../images/sattelite.png';
import Communication from '../images/communication.png';

const MonitorStatus = (props) => {
    const { DRONEKIT_API } = useContext(CommonContext);
    const [enableCall, setEnableCall] = useState(props.start);

    const [droneStatus, setDroneStatus] = useState({
        speed: null,
        battery: null,
        mode: null,
        gps: null,
    });

    useEffect(() => {
        // intervalId를 컴포넌트 레벨로 끌어올림
        let intervalId = null;

        // setInterval 시작하는 함수
        const startInterval = () => {
            if (!intervalId) {
                intervalId = setInterval(getDroneStatus, 1000);
            }
        };

        // setInterval 중지하는 함수
        const stopInterval = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null; // intervalId 초기화
            }
        };

        // enableCall 상태에 따라 interval 시작/중지
        if (enableCall) {
            startInterval();
        } else {
            stopInterval();
        }

        // Cleanup function
        return () => {
            stopInterval();
        };
    }, [enableCall]); // 의존성 배열에 enableCall을 추가

    const getDroneStatus = () => {
        console.log(enableCall);
        if (!enableCall) {
            return;
        }
        fetch(DRONEKIT_API + "drone_status", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                let batteryInfo = data['Battery'];
                let voltage = batteryInfo.split(",")[0];
                voltage = voltage.split("=")[1];
                setDroneStatus({
                    speed: data['Speed'],
                    battery: voltage,
                    mode: data['Mode'],
                    gps: data['GPS'],
                });

                // dronePosition.speed = data['Speed'];
                // dronePosition.battery = data['Battery'];
                // dronePosition.mode = data['Mode'];
                // viewDroneStatus();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    

    return (
        <>
        <div style={{padding:"5px",marginRight:"10px", background:"rgba(0,0,0,0.7"}}>
            <Grid container spacing={2}>
                <Grid item><img src={q10} style={{height:"55px"}}/></Grid>
                <Grid item>
                    <Grid container style={{width:"120px"}}>
                        <Grid item xs={12} style={{color:"white"}}>VEHICLE #01</Grid>
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
        <div style={{position:"relative",top:"5px", right:"0px"}}>
            <Grid container>
                <Grid item xs={12} style={{color:"white", textAlign:"center", fontSize:"1em", background:"rgba(104,104,104,0.8"}}>VEHICLE #01</Grid>
                <Grid item xs={12} style={{color:"white", textAlign:"center", fontSize:"1em", background:"rgba(0,0,0,0.8)", padding:"5px"}}>
                    <Grid container style={{border:"1px solid rgba(150,150,150,0.8)", borderRadius:"3px"}}>
                        <Grid item xs={12}>
                            <Grid container style={{background:"rgba(104,104,104,0.8)"}}>
                                <Grid item xs={4}>Battery</Grid>
                                <Grid item xs={4}>GPS</Grid>
                                <Grid item xs={4}>Telemetry</Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={4}>{droneStatus.battery}</Grid>
                                <Grid item xs={4}>{droneStatus.gps}</Grid>
                                <Grid item xs={4}>Telemetry</Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>

        {/* <div>
            <button onClick={() => setEnableCall(false)}>멈춰라</button>
            <button onClick={() => setEnableCall(true)}>시작해라</button>
        </div> */}

        </>
    );
};

export default MonitorStatus;
