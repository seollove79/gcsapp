import * as React from 'react';
import { ReactComponent as DroneSvg } from '../images/copter.svg';
import IconButton from '@mui/material/IconButton';
import ConnectInfoModal from './ConnectInfoModal';
import MonitorStatus from './MonitorStatus';
import { Grid } from '@mui/material';
import MonitorStatusDetail from './MonitorStatusDetail';

const ManageDrone = () => {
    const [connectInfoModalOpen, setConnectInfoModalOpen] = React.useState(false);
    const [droneMonitors, setDroneMonitors] = React.useState([]); // 드론 목록
    const [droneMonitorDetails, setDroneMonitorDtails] = React.useState([]); // 드론 목록

  
    const addDroneMonitor = (droneId) => {
        const newMonitor = <Grid item><MonitorStatus start='true' droneId={droneId}/></Grid>;
        const newMonitorDetail = <Grid item><MonitorStatusDetail start='true' droneId={droneId} displayValue='none' /></Grid>;
        setDroneMonitors([...droneMonitors, newMonitor]);
        setDroneMonitorDtails([...droneMonitorDetails, newMonitorDetail]);
    };
    return (
        <>
            <div style={{position:"fixed", top:"60px", right:"10px"}}>
                <Grid container justifyContent="flex-end">
                    {droneMonitors}
                    <Grid item>
                        <div style={{ backgroundColor: "black", padding: "5px", textAlign: "center" }}>
                            <IconButton type="button" style={{ width: "40px", height: "40px", padding: "0px" }} onClick={() => { setConnectInfoModalOpen(true) }}><DroneSvg /></IconButton>
                            <div style={{ textAlign: "center", color: "white" }}>드론추가</div>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div style={{position:"fixed", top:"140px", right:"10px"}}>
                <Grid container direction="column" spacing={1}>
                    {droneMonitorDetails}
                </Grid>
            </div>
            <ConnectInfoModal open={connectInfoModalOpen} setOpen={setConnectInfoModalOpen} addDroneMonitor={addDroneMonitor} />
        </>
    );
};

export default ManageDrone;
