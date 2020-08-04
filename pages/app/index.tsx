import { Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { appendBaseURL } from '../../src/utils/url';
import StackGrid, { easings, transitions } from 'react-stack-grid';

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


export const Home = (): JSX.Element => {
    const classes = useStyles();

    const transition = transitions['fadeDown'];
    // TODO: load stores into stackgrid
    return (
        <div>
            <Button variant="contained" color="primary" href={appendBaseURL('app/user', true)}>
                Go Profile
            </Button>
            <StackGrid
                duration={480}
                columnWidth={150}
                gutterWidth={5}
                gutterHeight={5}
                easing={easings.quartOut}
                appear={transition.appear}
                appeared={transition.appeared}
                enter={transition.enter}
                entered={transition.entered}
                leaved={transition.leaved}
                rtl={false}
            >
                <div key="key1">
                    <Paper elevation={3} style={{ height: '150px' }}>
                        Item 1
                    </Paper>
                </div>
                <div key="key2">
                    <Paper elevation={3} style={{ height: '100px' }}>
                        Item 2
                    </Paper>
                </div>
                <div key="key3">
                    <Paper elevation={3} style={{ height: '200px' }}>
                        Item 3
                    </Paper>
                </div>
            </StackGrid>
        </div>
    );
};

export default Home;
