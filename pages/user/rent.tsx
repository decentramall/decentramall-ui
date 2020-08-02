import React, { useState, useContext } from 'react'
import { Button, Input, makeStyles, TextField, CircularProgress } from '@material-ui/core';
import { ChainContext } from '../_app';
import { ethers, BigNumber } from 'ethers';
import {
    RentalAgentInstance, EstateAgentInstance, DecentramallTokenInstance
} from '../../src/contracts/types/index';
import { IChainContext } from '../../src/types';
import FFSStorage from '../../src/storage';


export default function Rent() {
    const chainContext = useContext(ChainContext);
    const classes = useStyles();

    const [picture, setPicture] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [url, setUrl] = useState('');

    const [dealInProgress, setDealInProgress] = useState(false);

    const [decentramallTokenInstance, setDecentramallToken] = useState<ethers.Contract & DecentramallTokenInstance | undefined>();
    const [estateAgentInstance, setEstateAgent] = useState<ethers.Contract & EstateAgentInstance | undefined>();
    const [rentalAgentInstance, setRentalAgent] = useState<ethers.Contract & RentalAgentInstance | undefined>();

    const handleSubmitNewRent = async () => {
        // TODO: verify fields
        // upload image first
        
        const storage = new FFSStorage();
        setDealInProgress(true);
        const cid = await storage.submitStorage(picture, title, description, category, url, () => setDealInProgress(false));

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
                    <Button onClick={handleSubmitNewRent}>Submit</Button>
                    {dealInProgress && <CircularProgress />}
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
