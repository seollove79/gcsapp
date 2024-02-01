import React, { useState, useContext, useEffect } from 'react';
import { CommonContext } from '../CommonContext';
import { Grid } from '@mui/material';

const MonitorStatusDetail = (props) => {
    const { DRONEKIT_API } = useContext(CommonContext);
    const [enableCall, setEnableCall] = useState(props.start);
    const [droneId, setDroneId] = useState(props.droneId); // 드론 아이디
    const [displayValue, setDisplayValue] = useState(props.displayValue);
    const [droneStatus, setDroneStatus] = useState({
        airSpeed: 0,
        groundSpeed: 0,
        voltage: "--",
        level: "--",
        mode: "--",
        gps: null,
        gpsFix: null,
        armed: null,
        ekf: null,
        lat: 35.839270,
        lng: 127.111796,
        alt: 50,
        slAlt: 50,
        roll: 0,
        pitch: 0,
        yaw: 0,
    });

    const DRONE_ALTITUDE_OFFSET = 10;
    const DRONE_MODEL_SCALE = 0.008; // 모델크기
    const DRONE_YAW_OFFSET = 90; // 드론의 YAW 각도 보정값
    let drone = null;

    const viewDrone = () => {
        let viewer = window.ws3d.viewer;
        if (drone != null) {
            console.log("drone update..");
            // let position = window.Cesium.Cartesian3.fromDegrees(droneStatus.lng, droneStatus.lat, droneStatus.slAlt + DRONE_ALTITUDE_OFFSET);
            let position = window.Cesium.Cartesian3.fromDegrees(127.111796, 35.839270, droneStatus.slAlt);
            let heading = window.Cesium.Math.toRadians(droneStatus.yaw - DRONE_YAW_OFFSET);
            let pitch1 = window.Cesium.Math.toRadians(droneStatus.pitch);
            let roll1 = droneStatus.roll; // 롤 없음
            let hpr = new window.Cesium.HeadingPitchRoll(heading, pitch1, roll1);
            let orientation = window.Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
            drone.position = position;
            // drone.orientation = orientation;
        } else {
            console.log("drone add..");
            drone = viewer.entities.add({
                name: 'Drone',
                position: window.Cesium.Cartesian3.fromDegrees(droneStatus.lng, droneStatus.lat, droneStatus.slAlt + DRONE_ALTITUDE_OFFSET), // 드론의 초기 위치 (경도, 위도, 높이)
                model: {
                    uri: '/scene.gltf',
                    scale: DRONE_MODEL_SCALE
                }
            });
        }
    };

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
        fetch(DRONEKIT_API + "drone_status/" + encodedDroneId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                let batteryInfo = data['Battery'];
                let voltage = batteryInfo.split(",")[0];
                voltage = voltage.split("=")[1];
                let level = batteryInfo.split(",")[2];
                level = level.split("=")[1];
                let gpsInfo = data['GPS'];
                let gps = gpsInfo.split(",")[1];
                gps = gps.split("=")[1];
                let gpsFix = gpsInfo.split(",")[0];
                gpsFix = gpsFix.split("=")[1];
                let armed = data['Armed'];
                let ekf_ok = data['ekf_ok'];
                if (ekf_ok === "True") {
                    ekf_ok = "EKF OK";
                } else {
                    ekf_ok = "EKF Error";
                }


                if (armed === "True") {
                    armed = "ARMED";
                } else {
                    armed = "DISARMED";
                }

                switch (gpsFix) {
                    case "0": gpsFix = "No"; break;
                    case "1": gpsFix = "No"; break;
                    case "2": gpsFix = "2D"; break;
                    case "3": gpsFix = "3D"; break;
                }
                setDroneStatus({
                    airSpeed: parseFloat(data['AirSpeed']).toFixed(2),
                    groundSpeed: parseFloat(data['GroundSpeed']).toFixed(2),
                    voltage: voltage + "V",
                    level: level + "%",
                    mode: data['Mode'],
                    gps: gps,
                    gpsFix: gpsFix,
                    armed: armed,
                    ekf: ekf_ok,
                    lat: data['Lat'],
                    lng: data['Lng'],
                    alt: data['Alt'],
                    slAlt: data['SL_Alt'],
                    roll: data['Roll'],
                    pitch: data['Pitch'],
                    yaw: data['Yaw'],
                });
            })
            .catch((error) => {
                // console.error("Error:", error);
            });
    }

    return (
        <div style={{ width: "400px", display: { displayValue } }}>
            <Grid container>
                <Grid item xs={12} style={{ color: "white", textAlign: "center", fontSize: "1.1em", background: "rgba(50,50,50,0.8", padding: "3px" }}>드론ID : {droneId}</Grid>
                <Grid item xs={12} style={{ color: "white", textAlign: "center", fontSize: "1em", background: "rgba(0,0,0,0.8)", padding: "5px" }}>
                    <Grid container style={{ border: "1px solid rgba(150,150,150,0.8)", borderRadius: "3px" }}>
                        <Grid item xs={12}>
                            <Grid container style={{ background: "rgba(50,50,50,0.8)" }}>
                                <Grid item xs={4}>배터리</Grid>
                                <Grid item xs={4}>GPS</Grid>
                                <Grid item xs={4}>Telemetry</Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={4} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2em" }}>{droneStatus.voltage}<br />{droneStatus.level}</Grid>
                                <Grid item xs={4} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2em" }}>{droneStatus.gps}<br />{droneStatus.gpsFix}</Grid>
                                <Grid item xs={4} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2em" }}>99%</Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container style={{ padding: "9px 0 5px 0" }}>
                        <Grid item xs={4} style={{ fontSize: "1.1em", color: "yellow" }}>{droneStatus.armed}</Grid>
                        <Grid item xs={4} style={{ fontSize: "1.1em", color: "yellow" }}>{droneStatus.mode}</Grid>
                        <Grid item xs={4} style={{ fontSize: "1.1em", color: "yellow" }}>{droneStatus.ekf}</Grid>
                    </Grid>
                    <Grid container style={{ border: "1px solid rgba(150,150,150,0.8)", borderRadius: "3px", marginTop: "5px" }}>
                        <Grid item xs={6} style={{ borderRight: "1px solid rgba(150,150,150,0.8)" }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid container style={{ background: "rgba(50,50,50,0.8)" }}>
                                        <Grid item xs={12}>고도 (m)</Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={6} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2em" }}>상대고도<br />{droneStatus.alt}</Grid>
                                        <Grid item xs={6} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2em" }}>해수면고도<br />{droneStatus.slAlt}</Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6} style={{ borderRight: "1px solid rgba(150,150,150,0.8)" }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid container style={{ background: "rgba(50,50,50,0.8)" }}>
                                        <Grid item xs={12}>속도 (m/s)</Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={6} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2em" }}>Air<br />{droneStatus.airSpeed}</Grid>
                                        <Grid item xs={6} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2em" }}>Ground<br />{droneStatus.groundSpeed}</Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </div>
    );
};

export default MonitorStatusDetail;
