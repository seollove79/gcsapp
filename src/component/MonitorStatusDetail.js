import React, { useState, useContext, useEffect } from 'react';
import { CommonContext } from '../CommonContext';
import { Grid } from '@mui/material';

const MonitorStatusDetail = (props) => {
    const { DRONEKIT_API } = useContext(CommonContext);
    const [enableCall, setEnableCall] = useState(props.start);
    const [droneId, setDroneId] = useState(props.droneId); // 드론 아이디
    const [displayValue, setDisplayValue] = useState(props.displayValue);

    const [droneStatus, setDroneStatus] = useState({
        speed: null,
        voltage: null,
        level: null,
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
        if (!enableCall) {
            return;
        }
        let encodedDroneId = encodeURIComponent(droneId);
        fetch(DRONEKIT_API + "drone_status/"+encodedDroneId, {
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
                let level = batteryInfo.split(",")[2];
                level = level.split("=")[1];
                let gpsInfo = data['GPS'];
                let gps = gpsInfo.split(",")[1];
                gps = gps.split("=")[1];
                setDroneStatus({
                    speed: data['Speed'],
                    voltage: voltage + "V",
                    level : level + "%",
                    mode: data['Mode'],
                    gps: gps,
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
        <div style={{width:"400px",display:{displayValue}}}>
            <Grid container>
                <Grid item xs={12} style={{color:"white", textAlign:"center", fontSize:"1em", background:"rgba(104,104,104,0.8"}}>{droneId}</Grid>
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
                                <Grid item xs={4} style={{display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2em"}}>{droneStatus.voltage}<br/>{droneStatus.level}</Grid>
                                <Grid item xs={4} style={{display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2em"}}>{droneStatus.gps}</Grid>
                                <Grid item xs={4}>Telemetry</Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default MonitorStatusDetail;
