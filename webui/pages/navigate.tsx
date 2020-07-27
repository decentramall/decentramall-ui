import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
)

export default function Navigate() {
  const classes = useStyles()
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
  ]

  return (
    <Container maxWidth="sm">
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
    </Container>
  )
}
