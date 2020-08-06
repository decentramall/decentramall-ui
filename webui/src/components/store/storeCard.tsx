import React from 'react';
import { Theme, createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import {Card, CardContent, CardMedia, Typography} from '@material-ui/core';
import { IRent } from '../../types';
import LinkIcon from '@material-ui/icons/Link';

interface Props {
    rentInfo: IRent;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 151,
    },
    url: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  }),
);

export default function StoreCard(props: Props) {
    const {rentInfo} = props;
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Card className={classes.root}>
        <CardMedia
            className={classes.cover}
            image={URL.createObjectURL(new Blob([rentInfo.logo], { type: "image/jpeg" }))}
            title={rentInfo.title}
        />
        <div className={classes.details}>
            <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
                {rentInfo.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
                {rentInfo.description}
            </Typography>
            </CardContent>
            <div className={classes.url}>
                <LinkIcon style={{marginRight: '1rem'}} />
                {rentInfo.url}
            </div>
        </div>
        </Card>
    );
}