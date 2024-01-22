import * as React from 'react';
import styles from '../css/ManageDrone.module.css'; // CSS 모듈 가져오기
import { ReactComponent as DroneSvg } from '../images/copter.svg';
import IconButton from '@mui/material/IconButton';
import ConnectInfoModal from './ConnectInfoModal';
import MonitorStatus from './MonitorStatus';
import { Grid } from '@mui/material';

const ManageDrone = () => {
    const [connectInfoModalOpen, setConnectInfoModalOpen] = React.useState(false);
    const [droneMonitors, setDroneMonitors] = React.useState([]); // 드론 목록

    const addDroneMonitor = () => {
        const newMonitor = <MonitorStatus start='true'/>;
        setDroneMonitors([...droneMonitors, newMonitor]);
    };
    return (
        <>
            <div className={styles.rightLayer}>
                <Grid container>
                    <Grid item>
                        {droneMonitors}
                    </Grid>
                    <Grid item>
                        <div style={{ backgroundColor: "black", padding: "5px", textAlign: "center" }}>
                            <IconButton type="button" style={{ width: "40px", height: "40px", padding: "0px" }} onClick={() => { setConnectInfoModalOpen(true) }}><DroneSvg /></IconButton>
                            <div style={{ textAlign: "center", color: "white" }}>드론추가</div>
                        </div>
                    </Grid>
                    
                </Grid>
            </div>
            <ConnectInfoModal open={connectInfoModalOpen} setOpen={setConnectInfoModalOpen} addDroneMonitor={addDroneMonitor} />

        </>
    );
};

export default ManageDrone;
