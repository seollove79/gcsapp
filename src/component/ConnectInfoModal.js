import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import styles from '../css/ConnectInfoModal.module.css';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { CommonContext } from '../CommonContext';
import { CircularProgress } from '@mui/material';

const ConnectInfoModal = (props) => {

    const [formData, setFormData] = useState({
        connectType: '',
        ipAddress: '',
        port: ''
    });

    const { DRONEKIT_API, setDRONEKIT_API } = useContext(CommonContext);

    const handleClose = () => {
        //데이터 초기화
        setFormData({
            connectType: '',
            ipAddress: '',
            port: ''
        });
        props.setOpen(false)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작을 방지합니다.
        if (!formData.connectType || !formData.ipAddress || !formData.port) {
            alert("연결방식, IP주소, 포트를 입력해주세요.");
            return;
        }

        try {
            const response = await fetch(DRONEKIT_API + 'connect_drone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "connection_string": formData.connectType + ":" + formData.ipAddress + ":" + formData.port,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    alert("드론이 연결되었습니다.");
                    handleClose();
                    // getDronePositionLoop();
                    // getDroneStatusLoop();
                    // setTimeout(zoomToDrone, 500);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });


        } catch (error) {
            console.error('Failed to submit form:', error);
            // 네트워크 에러 처리 로직
        }
    };

    return (
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box className={styles.addDroneModal}>
                <Grid container style={{ background: "rgba(0,0,0,0.5)", height: "30px", alignItems: "center" }}>
                    <Grid item xs={11} style={{ color: "white", fontWeight: "bold", fontSize: "1.1em", opacity: "1", textAlign: "center" }}>
                        드론 연결 정보
                    </Grid>
                    <Grid item xs={1} style={{ textAlign: "right" }}>
                        <button onClick={handleClose} style={{ padding: "0", border: "0", marginRight: "5px", backgroundColor: "black" }}><CloseIcon style={{ color: "white", width: "20px", height: "20px" }} /></button>
                    </Grid>
                </Grid>
                <Grid container style={{ background: "rgba(100,100,100,0.7)", alignItems: "center", padding: "20px" }}>
                    <Grid item xs={12}>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="sel-connect-label">연결방식</InputLabel>
                                <Select
                                    name="connectType"
                                    labelId="sel-connect-label"
                                    id="connectType"
                                    value={formData.connectType}
                                    label="Connect Type"
                                    onChange={handleChange}
                                    style={{ backgroundColor: "white" }}
                                >
                                    <MenuItem value={"tcp"}>TCP</MenuItem>
                                </Select>
                                <TextField
                                    name="ipAddress"
                                    label="IP Address"
                                    id="ipAddress"
                                    size="small"
                                    onChange={handleChange}
                                    InputProps={{
                                        style: {
                                            backgroundColor: 'white',
                                        },
                                    }}
                                    style={{ marginTop: "10px" }}
                                />
                                <TextField
                                    type="number"
                                    name="port"
                                    label="포트번호"
                                    id="port"
                                    size="small"
                                    onChange={handleChange}
                                    InputProps={{
                                        style: {
                                            backgroundColor: 'white',
                                        },
                                    }}
                                    style={{ marginTop: "10px" }}
                                />
                                <Button type="submit" variant="contained" style={{ marginTop: "15px", width: "100%", fontSize: "1.1em", backgroundColor: "silver", color: "black" }}>연결</Button>
                            </FormControl>
                        </form>
                        <CircularProgress />
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default ConnectInfoModal;
