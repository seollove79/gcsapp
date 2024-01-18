import * as React from 'react';
import styles from '../css/ManageDrone.module.css'; // CSS 모듈 가져오기
import { ReactComponent as DroneSvg } from '../images/copter.svg';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const ManageDrone = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className={styles.rightLayer}>
            <div style={{ backgroundColor: "black", padding: "5px", textAlign: "center" }}>
                <IconButton type="button" style={{ width: "40px", height: "40px", padding: "0px" }} onClick={handleOpen}><DroneSvg /></IconButton>
                <div style={{ textAlign: "center", color: "white" }}>드론추가</div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box className={styles.addDroneModal}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
};

export default ManageDrone;
