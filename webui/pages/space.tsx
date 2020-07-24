import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import React from 'react'

export const Space = (): JSX.Element => {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Space
        </Typography>
      </Box>
    </Container>
  )
}

export default Space
