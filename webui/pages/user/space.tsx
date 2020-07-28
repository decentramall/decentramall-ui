import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import React from 'react'


interface ISpaceProps {
    spaces: any[];
}
export default function Space(props: ISpaceProps) {
    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Space
            </Typography>
            {props.spaces.map((space) => <p>{space}</p>)}
        </Container>
    )
}
