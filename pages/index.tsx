import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { appendBaseURL } from '../src/utils/url';

const useStyles = makeStyles((theme) => ({
    storeContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 212px)',
        gridAutoRows: '139px',
        gridAutoFlow: 'dense',
        gridGap: '3px',
        background: `linear-gradient(to right, ${theme.palette.background.default}, ${theme.palette.grey['A400']})`,
    },
    store: {
        overflow: 'hidden',
        display: 'grid',
        '& img': {
            gridColumn: '1 / -1',
            gridRow: '1 / -1',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            top: '10px',
        },
        gridColumn: 'span 2',
    },
    logo: {
        display: 'grid',
        objectFit: 'cover',
        gridColumn: 'span 6',
        alignSelf: 'center',
        justifySelf: 'center',
    },
}));

const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

export const Home = (): JSX.Element => {
    const classes = useStyles();

    const topItems = range(1, 12, 1);
    const bottomItems = range(13, 27, 1);

    return (
        <>
            <div className={classes.storeContainer}>
                {topItems.map((el, index) => {
                    return (
                        <div key={`space-${index}`} className={`${classes.store}`}>
                            <a href={appendBaseURL('navigate', true)}>
                                <img src={`images/spaces/space-${el}.png`} />
                            </a>
                        </div>
                    );
                })}
                <div className={classes.logo}>
                    <img src="images/logo.png" />
                    <Button variant="contained" color="primary">
                        Search
                    </Button>
                    <Button variant="contained" color="primary" href={appendBaseURL('user', true)}>
                        Go Profile
                    </Button>
                </div>
                {bottomItems.map((el, index) => {
                    return (
                        <div key={`space-${index}`} className={`${classes.store}`}>
                            <a href={appendBaseURL('navigate', true)}>
                                <img src={`images/spaces/space-${el}.png`} />
                            </a>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Home;
