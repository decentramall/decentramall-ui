import { Button, CircularProgress, Input, makeStyles, TextField } from '@material-ui/core';
import { BigNumber, ethers } from 'ethers';
import React, { useContext, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ChainContext } from '../_app';
import { RentalAgentInstance } from '../../src/contracts/types/index';
import FFSStorage from '../../src/storage';
import { ChainContext } from '../_app';

export default function Rent() {
    const chainContext = useContext(ChainContext);
    const classes = useStyles();

    const [picture, setPicture] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [url, setUrl] = useState('');

    const [dealInProgress, setDealInProgress] = useState(false);

    const handleSubmitNewRent = async () => {
        // TODO: verify fields
        // upload image first

        const storage = new FFSStorage();
        setDealInProgress(true);
        const cid = await storage.submitStorage(picture, title, description, category, url, () =>
            setDealInProgress(false)
        );

        // wait for json cid
        // TODO: remove replication
        // eslint-disable-next-line no-console
        chainContext.spaces.forEach((s) => chainContext.rentalAgentInstance.spaceInfo(s.tokenId).then(console.log));
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
        // TODO: add tokenURI
        const rentalAgentInstanceWithSigner = chainContext.rentalAgentInstance.connect(
            chainContext.user.signer
        ) as ethers.Contract & RentalAgentInstance;
        const signerAddress = await chainContext.user.signer.getAddress();
        await rentalAgentInstanceWithSigner.rent(notRented[0].tokenId, cid, { from: signerAddress, value: rentPrice });
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
        // check if user does not have rented space
        if (chainContext.user.rent === undefined) {
            return (
                <>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            label="Title"
                            name="title"
                            value={title}
                            required
                            onChange={handleChangeInput}
                            error={title === ''}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={description}
                            required
                            onChange={handleChangeInput}
                            error={description === ''}
                        />
                        <TextField
                            label="Category"
                            name="category"
                            value={category}
                            required
                            onChange={handleChangeInput}
                            error={category === ''}
                        />
                        <TextField
                            label="URL"
                            name="url"
                            value={url}
                            required
                            onChange={handleChangeInput}
                            error={url === ''}
                        />
                        <Input type="file" onChange={selectImage} />
                    </form>
                    <br />
                    <Button onClick={handleSubmitNewRent}>Submit</Button>
                    {dealInProgress && <CircularProgress />}
                </>
            );
        } else {
            //if user is already renting a space, display rent info
            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    margin="auto"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography component="div" gutterBottom style={{ marginTop: '4rem', textAlign: 'center' }}>
                        <Box fontWeight="lighter" fontSize="2rem" marginBottom="3rem" textAlign="left">
                            Your rent details:
                        </Box>
                        <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                            <Box fontWeight="bold" marginRight="1rem">
                                Store name:
                            </Box>
                            <Box fontWeight="regular">{chainContext.user.rent.title}</Box>
                        </Box>
                        <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                            <Box fontWeight="bold" marginRight="1rem">
                                Category:
                            </Box>
                            <Box fontWeight="regular">{chainContext.user.rent.category}</Box>
                        </Box>
                        <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                            <Box fontWeight="bold" marginRight="1rem">
                                Description:
                            </Box>
                            <Box fontWeight="regular">{chainContext.user.rent.description}</Box>
                        </Box>
                        <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                            <Box fontWeight="bold" marginRight="1rem">
                                URL:
                            </Box>
                            <Box fontWeight="regular">{chainContext.user.rent.url}</Box>
                        </Box>
                        <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                            <Box fontWeight="bold" marginRight="1rem">
                                End of the rent:
                            </Box>
                            //Displayed in block number
                            <Box fontWeight="regular">{chainContext.user.rent.expiryBlock}</Box>
                        </Box>
                    </Typography>
                </Box>
            );
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
