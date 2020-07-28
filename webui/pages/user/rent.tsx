import { createPow } from '@textile/powergate-client'
import React from 'react'
import { CreateFilecoinStorageDeal } from 'slate-react-system';
import { Button, Input } from '@material-ui/core';


interface IRentState {
    cid: string;
    rented: string;
    picture?: any;
}
class Rent extends React.Component<{}, IRentState> {
    PowerGate = null

    constructor(props: any) {
        super(props);
        this.state = {
            cid: '',
            rented: ''
        };
    }

    componentDidMount = () => {
        this.PowerGate = createPow({ host: process.env.NEXT_PUBLIC_POWERGATE_URL })
        this.PowerGate.setToken(process.env.NEXT_PUBLIC_FFS_TOKEN)
        // TODO: chack if user has rented space
    }

    handleSubmitNewRent = () => {
        // TODO: verify fields
        // TODO: upload image first
        // TODO: wait for image cid, generated json and upload it
        // TODO: wait for json cid, and add it to the tokenURI
    }

    _getId = async () => {
        // console.log(await this.PowerGate.ffs.get(this.state.cid));
        console.log(await this.PowerGate.ffs.showAll());
    }

    _handleSubmit = async (data) => {
        //const file = data.file.files[0];
        const file = this.state.picture;
        if (file === undefined) {
            return;
        }
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
            // the status 5 means: deal finished
            this.PowerGate.ffs.get(job.cid).then(console.log);
            this.setState({ cid: job.cid });
        }, jobId);
    }

    selectImage = (event: React.ChangeEvent<any>) => {
        this.setState({ picture: event.target.files[0] });
    }

    render() {
        // TODO: if valid rent space get
        return (
            <>
                <Input type="file" onChange={this.selectImage} />
                {/* <CreateFilecoinStorageDeal onSubmit={this._handleSubmit} /> */}
                <Button onClick={this._handleSubmit}>Submit</Button>
                <Button onClick={this._getId}>Get</Button>
            </>
        )
    }
}
export default Rent
