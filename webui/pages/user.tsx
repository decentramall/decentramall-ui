import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, Container, Grid, Paper, Typography } from '@material-ui/core';
import { ChainContext } from './_app';
import { IChainContext } from '../src/types';
import { BigNumber } from 'ethers';
import { decentramallTokenInstance } from '../src/contracts/index';
import { appendBaseURL } from '../src/utils/url';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    grid: {
        marginTop: '40%',
        justifyContent: 'center',
        alignItems: 'center',
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
        '& .disabled': {
            color: '#999',
            pointerEvents: 'none',
            opacity: '0.7',
        },
    },
    control: {
        padding: theme.spacing(2),
    },
}));

export default function Home() {
    const classes = useStyles();
    const { user } = useContext<IChainContext>(ChainContext);
    const [isRentDisabled, setRentDisabled] = useState(false);

    useEffect(() => {
        async function checkTotalSupply() {
            const totalSupply = BigNumber.from(await decentramallTokenInstance.totalSupply()).toNumber();
            if (totalSupply === 0) {
                setRentDisabled(true);
            }
        }
        checkTotalSupply();
    });

    const choices = [
        {
            title: (user?.space !== undefined ? 'View your' : 'Buy') + ' SPACE',
            picture: 'images/navigate-icons/category.svg',
            view: 'space',
            href: appendBaseURL('user/space', true),
        },
        {
            title: 'Rent SPACE',
            picture: 'images/navigate-icons/others.svg',
            view: 'rent',
            href: appendBaseURL('user/rent', true),
            disabled: isRentDisabled,
        },
    ];

    return (
        <Container maxWidth="sm">
            {/* TODO: align vertically */}
            <Grid container justify="center" spacing={5} className={classes.grid}>
                {choices.map((choice) => (
                    <Grid key={choice.title} item xs={12} md={6}>
                        <Paper
                            className={`${classes.paper} ${choice.disabled ? '.disabled' : ''}`}
                            onClick={() => (window.location.href = choice.href)}
                        >
                            <img height="95" src={choice.picture} style={{ margin: '2rem' }} />
                            <Typography variant="body1" component="p" gutterBottom>
                                {choice.title}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
