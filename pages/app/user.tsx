import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, Container, Grid, Paper, Typography, Avatar, Box } from '@material-ui/core';
import Rent from '../../src/components/user/rent';
import Space from '../../src/components/user/space';
import { ChainContext } from '../_app';
import { BigNumber } from 'ethers';
import Blockies from 'react-blockies';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '23vh',
        width: '12vw',
        minWidth: '10rem',
        cursor: 'pointer',
    },
    control: {
        padding: theme.spacing(2),
    },
}));

export default function Home() {
    const chainContext = useContext(ChainContext);
    const { decentramallTokenInstance, user } = chainContext;
    const classes = useStyles();
    const [view, setView] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [signerAddress, setSignerAddress] = useState('');

    useEffect(() => {
        async function checkTotalSupply() {
            let availableCount = 0;
            for(let i = 0; i < chainContext.spaces.length; i++) {
                let s = chainContext.spaces[i];
                if(s.rent === undefined){
                    availableCount++;
                }
            }

            if (decentramallTokenInstance !== undefined) {
                const totalSupply = BigNumber.from(
                    await decentramallTokenInstance.totalSupply()
                ).toNumber();
                if (totalSupply === 0 || availableCount === 0) {
                    if(user.rent === undefined){
                        setDisabled(true);
                    }
                }
                setSignerAddress(await chainContext.user.signer.getAddress());
                setLoading(false);
            }
        }
        checkTotalSupply();
    }, [decentramallTokenInstance]);

    if (loading) {
        return <>Loading...</>;
    }

    return (
        <>
            <div style={{ width: '100%', display:"flex"}}>
                <Paper elevation={3} style={{ width: '45%', padding: '10px', margin: 'auto'}}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <Blockies seed={signerAddress} size={10} scale={3} />
                        <Paper elevation={2} style={{ padding: '10px', display: 'flex', flexDirection: 'row', marginLeft: '1rem'}}>
                            <img src="https://app.ens.domains/static/media/ensIconLogo.4d995d23.svg" width="20rem" style={{marginRight: '0.7rem'}}/>
                            <Typography variant="body1" style={{fontWeight: 'bold'}}>
                                {chainContext.user.ensAddress}
                            </Typography>
                        </Paper>
                    </Box>
                    <Typography variant="overline" display="block" gutterBottom>
                        currently logged-in with <b>{signerAddress}</b> 
                    </Typography>
                </Paper>
            </div>
            <Box>{view === 0 ? <Space /> : <Rent />}</Box>
            <BottomNavigation
                value={view}
                onChange={(event, newValue) => {
                    setView(newValue);
                }}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction
                    label={user.space !== undefined ? 'View Your SPACE' : 'Buy Space'}
                    icon={<FavoriteIcon />}
                />
                <BottomNavigationAction
                    label={user.rent !== undefined ? 'View Your Rent' : ('Rent Space' + (disabled ? ' (no SPACE available)' : ''))}
                    style={{ opacity: disabled ? '0.5' : '1' }}
                    disabled={disabled}
                    icon={<LocationOnIcon />}
                />
            </BottomNavigation>
        </>
    );
}
