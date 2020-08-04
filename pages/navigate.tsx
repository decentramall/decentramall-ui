import { Container, createStyles, Grid, makeStyles, Paper, Theme, Typography, InputBase, IconButton } from '@material-ui/core';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        formContainer:{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        form:{
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
        },
        input:{
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        }
    })
);

export default function Navigate() {
    const classes = useStyles();
    const choices = [
        {
            title: 'Category',
            picture: 'images/navigate-icons/category.svg',
        },
        {
            title: 'Floor',
            picture: 'images/navigate-icons/floor.svg',
        },
        {
            title: 'Others',
            picture: 'images/navigate-icons/others.svg',
        },
    ];

    return (
        <Container maxWidth="lg">
            {/* TODO: align vertically */}
            <Grid
                container
                justify="center"
                spacing={5}
                style={{
                    marginTop: '20%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Grid item xs={12} className={classes.formContainer}>
                <Paper component="form" className={classes.form}>
                    <InputBase
                        className={classes.input}
                        placeholder="Search Decentramall Stores"
                        inputProps={{ 'aria-label': 'search stores' }}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    </Paper>
                </Grid>
                {choices.map((choice) => (
                    <Grid key={choice.title} item>
                        <Paper className={classes.paper}>
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
