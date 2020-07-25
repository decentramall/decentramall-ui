import { createPow } from '@textile/powergate-client'
import React from 'react'
import { CreateFilecoinStorageDeal } from 'slate-react-system';
import { Button } from '@material-ui/core';


interface IUserState {
  cid: string;
}
class User extends React.Component<{}, IUserState> {
  PowerGate = null

  constructor(props: any) {
    super(props);
    this.state = {
      cid: ""
    };
  }

  componentDidMount = () => {
    this.PowerGate = createPow({ host: 'http://0.0.0.0:6002' })
    console.log('process.env.NEXT_FFS_TOKEN', process.env.NEXT_PUBLIC_FFS_TOKEN);
    this.PowerGate.setToken(process.env.NEXT_PUBLIC_FFS_TOKEN)
  }

  _getId = async () => {
    // console.log(await this.PowerGate.ffs.get(this.state.cid));
    console.log(await this.PowerGate.ffs.showAll());
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
    const { cid } = await this.PowerGate.ffs.stage(buffer);
    const { jobId } = await this.PowerGate.ffs.pushStorageConfig(cid);
    console.log(jobId);
    const cancel = this.PowerGate.ffs.watchJobs((job) => {
      console.log(job);
      this.PowerGate.ffs.get(job.cid).then(console.log);
      this.setState({ cid: job.cid });
    }, jobId);
  }


  render() {
    return (
      <>
        <CreateFilecoinStorageDeal onSubmit={this._handleSubmit} />
        <Button onClick={this._getId}>Get</Button>
      </>
    )
  }
}
export default User
