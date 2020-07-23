import { createPow } from '@textile/powergate-client'
import React from 'react'
// export const Space = (): JSX.Element => {
//   return (
//     <Container maxWidth="sm">
//       <Box my={4}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           User
//         </Typography>
//       </Box>
//     </Container>
//   )
// }
import * as System from 'slate-react-system'

class User extends React.Component {
  _PG = null
  state = {
    token: null,
  }
  _handleCreateToken = async () => {
    this._PG = createPow({ host: 'http://0.0.0.0:6002' })
    const FFS = await this._PG.ffs.create()
    const token = FFS.token ? FFS.token : null
    this._PG.setToken(token)
    this.setState({ token })
  }
  render() {
    return (
      <System.CreateToken
        token={this.state.token}
        onClick={this._handleCreateToken}
      />
    )
  }
}
export default User
