import React, { useState } from 'react'
import { makeStyles, Container, Grid, Paper, Typography } from '@material-ui/core';
import Rent from './rent';
import Space from './space';
import { ChainContext, IChainContext } from '../_app';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        height: 150,
        width: 150,
        cursor: 'pointer',
    },
    control: {
        padding: theme.spacing(2),
    },
}))

export default function Home() {
    const classes = useStyles()
    const [view, setView] = useState<string | undefined>();
    const choices = [
        {
            title: 'Buy SPACE',
            picture: 'images/navigate-icons/category.svg',
        },
        {
            title: 'Rent SPACE',
            picture: 'images/navigate-icons/others.svg',
        },
    ]

    const openView = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, newView: string) => {
        setView(newView);
        event.preventDefault();
    }

    const navigateOptions = (chainContext: IChainContext) => {
        if (view === 'space') {
            return <Space spaces={chainContext.spaces} />;
        } else if (view === 'rent') {
            return <Rent />;
        } else {
            return <Container maxWidth="sm">
                {/* TODO: align vertically */}
                <Grid container justify="center" spacing={5} style={{ marginTop: '40%' }}>
                    {choices.map((choice) => (
                        <Grid key={choice.title} item>
                            <Paper className={classes.paper}>
                                <img height="95" src={choice.picture} />
                                <Typography variant="body1" component="p" gutterBottom>
                                    {choice.title}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>;
        }
    }

    return (
        <ChainContext.Consumer>
            {(chainContext) => navigateOptions(chainContext)}
        </ChainContext.Consumer>
    );
}