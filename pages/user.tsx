import { createPow } from '@textile/powergate-client'
import React from 'react'
import { CreateToken, CreateFilecoinStorageDeal } from 'slate-react-system';

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

  _handleSubmit = async (data) => {
    const file = data.file.files[0];
    var buffer = [];
    // NOTE(jim): A little hacky...
    const getByteArray = async () =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = function (e) {
          if (e.target.readyState == FileReader.DONE) {
            buffer = new Uint8Array(e.target.result as any) as any;
          }
          resolve();
        };
        reader.readAsArrayBuffer(file);
      });
    await getByteArray();
    const { cid } = await this._PG.ffs.addToHot(buffer);
    const { jobId } = await this._PG.ffs.pushConfig(cid);
    const cancel = this._PG.ffs.watchJobs((job) => {
      console.log(job);
    }, jobId);
  }


  render() {
    return (
      <>
        <CreateToken
          token={this.state.token}
          onClick={this._handleCreateToken}
        />
        <CreateFilecoinStorageDeal onSubmit={this._handleSubmit} />
      </>
    )
  }
}
export default User
