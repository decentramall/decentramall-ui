import { createPow } from '@textile/powergate-client'
import React, { useEffect, useState, useContext } from 'react'
import { CreateFilecoinStorageDeal } from 'slate-react-system';
import { Button, Input, makeStyles, TextField, CircularProgress } from '@material-ui/core';
import { ChainContext } from '../_app';
import { ethers, BigNumber } from 'ethers';
import RentalAgentJSON from '../../../smart-contracts/build/contracts/RentalAgent.json';
import EstateAgentJSON from '../../../smart-contracts/build/contracts/EstateAgent.json';
import DecentramallTokenJSON from '../../../smart-contracts/build/contracts/DecentramallToken.json';
import {
    RentalAgentInstance, EstateAgentInstance, DecentramallTokenInstance
} from '../../../smart-contracts/types/truffle-contracts/index';
import { IChainContext } from '../../src/types';


export default function Rent() {
    const chainContext = useContext(ChainContext);
    const classes = useStyles();
    let PowerGate = null

    const [picture, setPicture] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [url, setUrl] = useState('');

    const [pictureDealInProgress, setPictureDealInProgress] = useState(false);
    const [jsonDealInProgress, setJSONDealInProgress] = useState(false);

    const [decentramallTokenInstance, setDecentramallToken] = useState<ethers.Contract & DecentramallTokenInstance | undefined>();
    const [estateAgentInstance, setEstateAgent] = useState<ethers.Contract & EstateAgentInstance | undefined>();
    const [rentalAgentInstance, setRentalAgent] = useState<ethers.Contract & RentalAgentInstance | undefined>();

    useEffect(() => {
        PowerGate = createPow({ host: process.env.NEXT_PUBLIC_POWERGATE_URL })
        PowerGate.setToken(process.env.NEXT_PUBLIC_FFS_TOKEN)
    });

    const handleSubmitNewRent = async () => {
        // TODO: verify fields
        // upload image first
        const pictureCid = await _pictureStorageDeal();
        // wait for image cid, generated json and upload it
        const jsonRent = {
            title,
            description,
            category,
            logo: pictureCid,
            url,
        }


        console.log(jsonRent);

        const { cid } = await PowerGate.ffs.stage(new Uint8Array(Buffer.from(JSON.stringify(jsonRent))));
        const { jobId } = await PowerGate.ffs.pushStorageConfig(cid);
        console.log(jobId);
        setJSONDealInProgress(true);
        const cancel = PowerGate.ffs.watchJobs((job) => {
            console.log(job);
            // the status 5 means: deal finished
            PowerGate.ffs.get(job.cid).then(console.log);
            if (job.status === 5) {
                setJSONDealInProgress(false);
                cancel();
            }
        }, jobId);
        // wait for json cid
        // TODO: remove replication
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const { chainId } = await provider.getNetwork();
        chainContext.spaces.forEach((s) => rentalAgentInstance.spaceInfo(s.tokenId).then(console.log));
        // choose one SPACE without rent
        const notRented = chainContext.spaces.filter(async (s) => ((await rentalAgentInstance.spaceInfo(s.tokenId)) as any).rentedTo === '0x0000000000000000000000000000000000000000');

        const totalSupply = BigNumber.from((await decentramallTokenInstance.totalSupply()).toString());

        const rentPrice = BigNumber.from((await estateAgentInstance.price(totalSupply.add(1).toString())).toString()).mul('10000000000000000').div('10').toString();
        // TODO: add tokenURI
        const rentalAgentInstanceWithSigner = rentalAgentInstance.connect(signer) as ethers.Contract & RentalAgentInstance;
        await rentalAgentInstanceWithSigner.rent(notRented[0].tokenId, cid, { from: signerAddress, value: rentPrice });
    }

    const _getId = async () => {
        // console.log(await PowerGate.ffs.get(this.state.cid));
        console.log(await PowerGate.ffs.showAll());
    }

    const _pictureStorageDeal = async () => {
        //const file = data.file.files[0];
        const file = picture;
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
        const { cid } = await PowerGate.ffs.stage(buffer);
        const { jobId } = await PowerGate.ffs.pushStorageConfig(cid);
        console.log(jobId);
        setPictureDealInProgress(true);
        const cancel = PowerGate.ffs.watchJobs((job) => {
            console.log(job);
            // the status 5 means: deal finished
            PowerGate.ffs.get(job.cid).then(console.log);
            if (job.status === 5) {
                setPictureDealInProgress(false);
                cancel();
            }
        }, jobId);
        return cid;
    }

    const selectImage = (event: React.ChangeEvent<any>) => {
        setPicture(event.target.files[0]);
    }

    const handleChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        switch (event.target.name) {
            case 'title':
                setTitle(event.target.value);
                break;
            case 'description':
                setDescription(event.target.value);
                break;
            case 'category':
                setCategory(event.target.value);
                break;
            case 'url':
                setUrl(event.target.value);
                break;
        }
    }

    const renderContext = (chainContext: IChainContext) => {
        setDecentramallToken(chainContext.decentramallTokenInstance);
        setEstateAgent(chainContext.estateAgentInstance);
        setRentalAgent(chainContext.rentalAgentInstance);

        // chack if user does not have rented space
        if (chainContext.user.rent === undefined) {
            return (
                <>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField label="Title" name="title" value={title} required onChange={handleChangeInput} error={title === ""}/>
                        <TextField label="Description" name="description" value={description} required onChange={handleChangeInput} error={description === ""}/>
                        <TextField label="Category" name="category" value={category} required onChange={handleChangeInput} error={category === ""}/>
                        <TextField label="URL" name="url" value={url} required onChange={handleChangeInput} error={url === ""}/>
                        <Input type="file" onChange={selectImage} />
                    </form>
                    <br />
                    {/* <CreateFilecoinStorageDeal onSubmit={this._handleSubmit} /> */}
                    <Button onClick={handleSubmitNewRent}>Submit</Button>
                    {/* <Button onClick={_getId}>Get</Button> */}
                    {(pictureDealInProgress || jsonDealInProgress) && <CircularProgress />}
                </>
            )
        } else {  
            <p>
                {JSON.stringify(chainContext.user.rent)}
            </p>
        }
    }

    return (
        <ChainContext.Consumer>
                {(chainContext) => renderContext(chainContext)}
        </ChainContext.Consumer>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
        width: '250px',
    },
}))
