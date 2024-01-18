import React, { useEffect, useState } from 'react';
import styles from './css/App.module.css'; // CSS 모듈 가져오기
import TopInfo from './component/TopInfo';
import ManageDrone from './component/ManageDrone';



function App() {

  const DRONEKIT_API = "http://cleanjb.iptime.org:8000/";
  const DRONE_CHECK_INTERVAL = 100;
  const DRONE_ALTITUDE_OFFSET = 10;
  const DRONE_MODEL_URL = './scene.gltf'; // 모델경로
  const DRONE_MODEL_SCALE = 0.008; // 모델크기
  const GUIDED_POSITION_HEIGHT = 10; // 가이드 위치 높이
  const DRONE_YAW_OFFSET = 90; // 드론의 YAW 각도 보정값

  let map3d = null;
  let viewer = null;

  const [droneStatus, setDroneStatus] = useState({
    longitude: 0, 
    latitude: 0, 
    altitude: 0,
    seaLevelAltitude: 0,
    roll: 0,
    pitch: 0,
    yaw: 0,
    armed: false,
    speed: 0,
    battery: 0,
    mode: "UNKNOWN"
  });

  useEffect(() => {
    let controlDensity = "window.vw.DensityType.BASIC";
    let interactionDensity = "window.vw.DensityType.BASIC";
    let mapOptions = new window.vw.MapOptions(
      window.vw.BasemapType.GRAPHIC,
      "",
      eval(controlDensity),
      eval(interactionDensity),
      false,
      new window.vw.CameraPosition(
          new window.vw.CoordZ(126.609375, 37.519120, 1000),
          new window.vw.Direction(-90, 0, 0)
      ),
      new window.vw.CameraPosition(
          new window.vw.CoordZ(126.609375, 37.519120, 1000),
          new window.vw.Direction(0, -90, 0)
      )
    );

    map3d = new window.vw.Map("vmap", mapOptions);
    viewer = window.ws3d.viewer;
    
    // const connectDrone = () => {
    //   let connectType = document.formConnectInfo['connect-type'].value;
    //   let ipaddress = document.formConnectInfo['ipaddress'].value;
    //   let port = document.formConnectInfo['number'].value;

    //   fetch(DRONEKIT_API + "connect_drone", {
    //       method: "POST",
    //       headers: {
    //           "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //           "connection_string": connectType + ":" + ipaddress + ":" + port,
    //       }),
    //   })
    //   .then((response) => response.json())
    //   .then((data) => {
    //       connectDroneModal.hide();
    //       alert("드론이 연결되었습니다.");
    //       getDronePositionLoop();
    //       getDroneStatusLoop();
    //       setTimeout(zoomToDrone, 500);
    //   })
    //   .catch((error) => {
    //       console.error("Error:", error);
    //   });
    // };


  });

  

  return (
    <div style={{position:"relative", width:"100%", height:"100vh"}}>
      <div id="vmap" style={{ width: "100%", height: "100%", backgroundColor:"red" }}></div>
      <TopInfo />
      <ManageDrone />
    </div>
  );
}

export default App;
