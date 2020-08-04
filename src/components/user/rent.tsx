import React, { useState, useContext } from 'react';
import { Button, Input, makeStyles, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { ChainContext } from '../../../pages/_app';
import { ethers, BigNumber } from 'ethers';
import { RentalAgentInstance } from '../../contracts/types/index';
import FFSStorage from '../../storage';

export default function Rent() {
    const chainContext = useContext(ChainContext);
    const classes = useStyles();

    const [picture, setPicture] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [url, setUrl] = useState('');

    const [dealInProgress, setDealInProgress] = useState(false);
    const [errorRenting, setErrorRenting] = useState(false);
    const [successRenting, setSuccessRenting] = useState(false);
    const [finishedTx, setFinishedTx] = useState(false);

    const handleSubmitNewRent = async () => {
        // TODO: verify fields
        try {
            const storage = new FFSStorage();
            setDealInProgress(true);
            const cid = await storage.submitStorage(picture, title, description, category, url, () => { });
            // choose one SPACE without rent
            const notRented = chainContext.spaces.filter(
                async (s) =>
                    ((await chainContext.rentalAgentInstance.spaceInfo(s.tokenId)) as any).rentedTo ===
                    '0x0000000000000000000000000000000000000000'
            );

            const totalSupply = BigNumber.from((await chainContext.decentramallTokenInstance.totalSupply()).toString());

            const rentPrice = BigNumber.from(
                (await chainContext.estateAgentInstance.price(totalSupply.add(1).toString())).toString()
            )
                .mul('10000000000000000')
                .div('10')
                .toString();
            const rentalAgentInstanceWithSigner = chainContext.rentalAgentInstance.connect(
                chainContext.user.signer
            ) as ethers.Contract & RentalAgentInstance;
            const signerAddress = await chainContext.user.signer.getAddress();
            await rentalAgentInstanceWithSigner
                .rent(notRented[0].tokenId, cid, { from: signerAddress, value: rentPrice });
            // wait just for tx to finish and update user UI with rent
            setDealInProgress(false)
            setFinishedTx(true);
            setSuccessRenting(true);
        } catch (e) {
            setDealInProgress(false)
            setFinishedTx(true);
            setErrorRenting(true);
        } finally {

        }
    };

    const selectImage = (event: React.ChangeEvent<any>) => {
        setPicture(event.target.files[0]);
    };

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
    };

    const renderContext = () => {
        // chack if user does not have rented space
        if (chainContext.user.rent === undefined) {
            return (
                <div style={{ marginLeft: '30%', padding: '20px' }}>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            label="Title"
                            name="title"
                            value={title}
                            required
                            onChange={handleChangeInput}
                            style={{ width: '400px' }}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={description}
                            required
                            onChange={handleChangeInput}
                            multiline
                            style={{ width: '400px' }}
                        />
                        <TextField
                            label="Category"
                            name="category"
                            value={category}
                            required
                            onChange={handleChangeInput}
                            style={{ width: '400px' }}
                        />
                        <TextField
                            label="URL"
                            name="url"
                            value={url}
                            required
                            onChange={handleChangeInput}
                            style={{ width: '400px' }}
                        />
                        <Input type="file" onChange={selectImage} />
                    </form>
                    <Button onClick={handleSubmitNewRent}>Submit</Button>
                    <br />
                    {dealInProgress && <CircularProgress />}
                    <Dialog
                        open={finishedTx && (successRenting || errorRenting)}
                        onClose={() => { setFinishedTx(false); setSuccessRenting(false); setErrorRenting(false); }}
                    >
                        <DialogTitle>Renting Space</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {successRenting ? 'You\'ve rent a space!' : (errorRenting ? 'An error occured renting a space!' : '')}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setFinishedTx(false); setSuccessRenting(false); setErrorRenting(false); }} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        } else {
            // TODO: properly present rent details
            return <p>{JSON.stringify(chainContext.user.rent)}</p>;
        }
    };

    return renderContext();
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
        width: '250px',
    },
}));
