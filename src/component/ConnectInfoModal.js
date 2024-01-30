import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Grid, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import styles from '../css/ConnectInfoModal.module.css';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { CommonContext } from '../CommonContext';

const ConnectInfoModal = (props) => {
    const [formData, setFormData] = useState({
        connectType: '',
        droneId: '',
        ipAddress: '',
        port: ''
    });

    // 연결 중 상태와 오류 상태를 추가합니다.
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState(null);

    const { DRONEKIT_API, setDRONEKIT_API } = useContext(CommonContext);

    const handleClose = () => {
        setFormData({
            connectType: '',
            droneId: '',
            ipAddress: '',
            port: ''
        });
        setConnecting(false); // 연결 중 상태를 초기화합니다.
        setError(null); // 오류 상태를 초기화합니다.
        props.setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setConnecting(true); // 연결을 시작하기 전에 연결 상태를 '진행 중'으로 설정합니다.
        setError(null); // 이전 오류 상태를 초기화합니다.

        if (!formData.connectType || !formData.ipAddress || !formData.port || !formData.droneId) {
            alert("연결방식, 드론ID, IP주소, 포트를 입력해주세요.");
            setConnecting(false); // 오류 발생 시 연결 중 상태를 해제합니다.
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
                    "drone_id": formData.droneId,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            console.log(data);
            if(data.status === "Connected") {
                alert("드론이 연결되었습니다.");
                handleClose();
                props.addDroneMonitor(formData.droneId);
            }

            if(data.status === "Already Connected") {
                alert("이미 연결되어 있습니다.");
                props.addDroneMonitor(formData.droneId);
                handleClose();
            }

            if(data.status === "Failed") {
                setError(data.details); // 오류 상태를 설정합니다.
            }
        } catch (error) {
            console.error("Error:", error);
            setError(error); // 오류 상태를 설정합니다.
        } finally {
            setConnecting(false); // 요청이 완료되면 연결 상태를 '완료'로 변경합니다.
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
                        <button onClick={handleClose} style={{ padding: "0", border: "0", marginRight: "5px", backgroundColor: "black" }}>
                            <CloseIcon style={{ color: "white", width: "20px", height: "20px" }} />
                        </button>
                    </Grid>
                </Grid>
                <Grid container style={{ background: "rgba(100,100,100,0.7)", alignItems: "center", padding: "20px" }}>
                    <Grid item xs={12} style={{textAlign:"center"}}>
                        {connecting ? (
                            // 연결 중일 때 CircularProgress를 표시합니다.
                            <div>
                            <CircularProgress /><br/><span style={{color:"white"}}>연결중입니다...</span>
                            </div>
                        ) : (
                            // 연결 중이 아닐 때 폼을 표시합니다.
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
                                        name="droneId"
                                        label="드론 ID"
                                        id="droneId"
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
                        )}
                        {error && (
                            // 오류가 있을 때 오류 메시지를 표시합니다.
                            <div style={{ color: 'red' }}>오류가 발생했습니다: {error.message}</div>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default ConnectInfoModal;
