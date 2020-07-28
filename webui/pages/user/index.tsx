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

    const openView = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, newView: string) => {
        setView(newView);
        event.preventDefault();
    }

    const choices = (user: { space: {
        buyer: string;
        price: string;
        tokenId: string;
    } | undefined, rent: string }) => {
        return [
            {
                title: (user.space !== undefined ? 'See your' : 'Buy') + ' SPACE',
                picture: 'images/navigate-icons/category.svg',
                view: 'space',
            },
            {
                title: 'Rent SPACE',
                picture: 'images/navigate-icons/others.svg',
                view: 'rent',
            },
        ];
    }

    const navigateOptions = (chainContext: IChainContext) => {
        if (view === 'space') {
            return <Space />;
        } else if (view === 'rent') {
            return <Rent />;
        } else {
            return <Container maxWidth="sm">
                {/* TODO: align vertically */}
                <Grid container justify="center" spacing={5} style={{ marginTop: '40%' }}>
                    {choices(chainContext.user).map((choice) => (
                        <Grid key={choice.title} item>
                            <Paper className={classes.paper} onClick={(e) => openView(e, choice.view)}>
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