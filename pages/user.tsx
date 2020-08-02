import React, { useState, useEffect } from 'react'
import {
  makeStyles,
  Container,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'
import Rent from '../src/components/user/rent'
import Space from '../src/components/user/space'
import { ChainContext } from './_app'
import { IChainContext, IUser } from '../src/types'
import { BigNumber } from 'ethers'
import { decentramallTokenInstance } from '../src/contracts/index'

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
}))

export default function Home() {
  const classes = useStyles()
  const [view, setView] = useState<string | undefined>()
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    async function checkTotalSupply() {
      const totalSupply = BigNumber.from(
        await decentramallTokenInstance.totalSupply()
      ).toNumber()
      if (totalSupply === 0) {
        setDisabled(true)
      }
    }
    checkTotalSupply()
  })

  const openView = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    newView: string
  ) => {
    setView(newView)
    event.preventDefault()
  }

  const choices = (user: IUser) => {
    return [
      {
        title: (user.space !== undefined ? 'View your' : 'Buy') + ' SPACE',
        picture: 'images/navigate-icons/category.svg',
        view: 'space',
      },
      {
        title: 'Rent SPACE',
        picture: 'images/navigate-icons/others.svg',
        view: 'rent',
      },
    ]
  }

  const rentStyle = (view: string) => {
    if (view === 'rent' && disabled) {
      return {
        color: '#999',
        pointerEvents: 'none',
        opacity: '0.7',
      } as any
    }
    return
  }

  const navigateOptions = (chainContext: IChainContext) => {
    if (view === 'space') {
      return <Space />
    } else if (view === 'rent') {
      return <Rent />
    } else {
      return (
        <Container maxWidth="sm">
          {/* TODO: align vertically */}
          <Grid
            container
            justify="center"
            spacing={5}
            style={{
              marginTop: '40%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {choices(chainContext.user).map((choice) => (
              <Grid key={choice.title} item xs={12} md={6}>
                <Paper
                  className={classes.paper}
                  onClick={(e) => openView(e, choice.view)}
                  style={rentStyle(choice.view)}
                >
                  <img
                    height="95"
                    src={choice.picture}
                    style={{ margin: '2rem' }}
                  />
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
  }

  return (
    <ChainContext.Consumer>
      {(chainContext) => navigateOptions(chainContext)}
    </ChainContext.Consumer>
  )
}
