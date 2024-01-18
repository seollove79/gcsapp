import React from 'react';
import styles from '../css/TopInfo.module.css'; // CSS 모듈 가져오기
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const TopInfo = () => {
    return (
        <div className={styles.topInfoLayer}>
            <Grid container style={{ height: '100%' }} alignItems={"center"}>
                <Grid item xs={6}>
                    <FormatAlignJustifyIcon style={{ fontSize: "40", color: "white", marginLeft: "10px" }} />
                    <span style={{ color: "white", fontSize: "15pt", marginLeft: "10px" }}>INTOSKY Multipurpose Ground Control Station</span></Grid>
                <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Paper component="form" sx={{ p: '0px 4px', m: '0 10px 0 0', display: 'flex', alignItems: 'center', width: 300 }}>
                        <LocationOnIcon />
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="주소검색"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default TopInfo;
