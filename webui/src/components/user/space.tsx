import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect, useContext } from 'react';
import { ChainContext } from '../../../pages/_app';
import { Button, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Chip, Accordion, AccordionSummary, AccordionDetails, Link } from '@material-ui/core';
import { ethers, BigNumber } from 'ethers';
import { EstateAgentInstance } from '../../contracts/types/index';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import WeekendIcon from '@material-ui/icons/Weekend';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StoreCard from '../store/storeCard';

export default function Space() {
    const chainContext = useContext(ChainContext);
    const { decentramallTokenInstance, estateAgentInstance, user } = chainContext;
    const [userSpace, setUserSpace] = useState(user.space);
    const [nextPrice, setNextPrice] = useState<string>('0');
    const [errorBuying, setErrorBuying] = useState(false);
    const [successBuying, setSuccessBuying] = useState(false);
    const [finishedTx, setFinishedTx] = useState(false);

    useEffect(() => {
        const loadNextPrice = async () => {
            if (decentramallTokenInstance !== undefined) {
                const nextT = await decentramallTokenInstance.totalSupply();
                const currentNextPrice = BigNumber.from(
                    (await estateAgentInstance.price(nextT.toNumber() + 1)).toString()
                )
                    .mul(BigNumber.from('10000000000000000'))
                    .toString();
                setNextPrice(currentNextPrice);
            }
        };
        loadNextPrice();
    }, [decentramallTokenInstance]);

    const buySpace = async () => {
        const { signer } = user;
        if (signer !== undefined) {
            const signerAddress = await signer.getAddress();
            (estateAgentInstance.connect(signer) as ethers.Contract & EstateAgentInstance)
                .buy({ from: signerAddress, value: nextPrice })
                .then(async (response) => {
                    await (response as any).wait()
                    // Receive an event when that filter occurs
                    estateAgentInstance.once(
                        estateAgentInstance.filters.BuyToken(signerAddress, null, null),
                        (buyer, price, tokenId, event) => {
                            // TODO: get data from tokenid just like in loadSpaces method in src/contracts/index.ts inead of refreshing page
                            window.location.reload(false)
                            console.log(buyer, price, tokenId);
                            setSuccessBuying(true);
                        });

                })
                .catch(() => setErrorBuying(true))
                .finally(() => setFinishedTx(true));
        }
    };

    const renderContext = () => {
        if (userSpace !== undefined) {
            return (
                <Box display="flex" flexDirection="column" margin="auto" justifyContent="center" alignItems="center">
                    <Typography component="div" gutterBottom style={{ marginTop: '4rem', textAlign: 'center' }}>
                        <Box fontWeight="lighter" fontSize="2rem" marginBottom="3rem">
                            Below are the details of your space
                        </Box>
                        <Box display="flex" flexDirection="column" fontSize="1.5rem" marginBottom="2rem">
                            <Box display="flex" fontWeight="bold" marginRight="1rem" alignItems="center" justifyContent="center">
                                <MonetizationOnIcon style={{fontSize:'3rem', marginRight: '1rem'}}/>
                                Purchased Price
                            </Box>
                            <Box fontWeight="regular" style={{marginTop: '1rem'}}>
                                {(parseFloat(userSpace.price) / 10 ** 18).toFixed(8)} ETH
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" fontSize="1.5rem" marginBottom="2rem">
                            <Box display="flex" fontWeight="bold" marginRight="1rem" alignItems="center" justifyContent="center">
                                <FingerprintIcon style={{fontSize:'3rem', marginRight: '1rem'}}/>
                                Token ID
                            </Box>
                            <Box fontWeight="regular" style={{marginTop: '1rem'}}>{userSpace.tokenId}</Box>
                        </Box>
                    </Typography>
                </Box>
            );
        } else {
            return (
                <Box display="flex" flexDirection="column" margin="auto" justifyContent="center" alignItems="center" marginBottom="10%">
                    <Typography variant="h5" gutterBottom style={{ marginTop: '4rem', textAlign: 'center' }}>
                        This space would cost you {ethers.utils.formatEther(BigNumber.from(nextPrice))} ETH
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={buySpace}
                        style={{ marginTop: '2rem' }}
                    >
                        Buy this SPACE
                    </Button>
                </Box>
            );
        }
    };

    const renderContextStatus = () => {
        if (userSpace !== undefined) {
            if (userSpace.rent !== undefined) {
                return (
                    <Box
                        display="flex"
                        flexDirection="column"
                        margin="auto"
                        justifyContent="center"
                        alignItems="center"
                        style={{marginBottom: '5%'}}
                    >
                        <Accordion style={{padding: '1rem'}}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <Box fontWeight="lighter" fontSize="2rem" textAlign="left">
                                Space status: <Chip label="Rented" icon={<BeenhereIcon style={{color: '#fff'}}/>} style={{background:'#47ae5a', color: '#fff'}}/>
                            </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography component="div" gutterBottom style={{ marginTop: '4rem', textAlign: 'center' }}>
                                <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                                    <Box fontWeight="bold" marginRight="1rem">
                                        Rented to:
                                    </Box>
                                    <Box fontWeight="regular">{userSpace.rent.rentedTo}</Box>
                                </Box>
                                <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                                    <Box fontWeight="bold" marginRight="1rem">
                                        Rental earned:
                                    </Box>
                                    <Box fontWeight="regular">{(parseInt(userSpace.rent.rentalEarned) / 10**18).toFixed(8)} ETH</Box>
                                </Box>
                                <Link style={{textDecoration: 'none'}} href={userSpace.rent.url.includes("http") ? userSpace.rent.url : `https://${userSpace.rent.url}`}>
                                    <StoreCard rentInfo={userSpace.rent}/>
                                </Link>
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                );
            } else {
                return (
                    <Box
                        display="flex"
                        flexDirection="column"
                        margin="auto"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography variant="h5" gutterBottom style={{ marginTop: '4rem', textAlign: 'left' }}>
                            <Box fontWeight="lighter" fontSize="2rem" marginBottom="3rem" textAlign="left">
                            Space status: <Chip label="Available for rent" icon={<WeekendIcon style={{color: '#fff'}}/>} style={{background:'#0099ee', color: '#fff'}}/>
                            </Box>
                        </Typography>
                    </Box>
                );
            }
        }
    };
    return (
        <div>
            <Box display="flex" flexDirection="column" style={{ width: '85%', margin: 'auto' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '4rem', textAlign: 'center', fontWeight: 'bold' }}
                >
                    SPACE
            </Typography>
                {renderContext()}
                {renderContextStatus()}
            </Box>
            <Dialog
                open={finishedTx && (successBuying || errorBuying)}
                onClose={() => { setFinishedTx(false); setSuccessBuying(false); setErrorBuying(false); }}
            >
                <DialogTitle>Buying Space</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {successBuying ? 'You\'ve bought a new space!' : (errorBuying ? 'An error occured buying a new space!' : '')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setFinishedTx(false); setSuccessBuying(false); setErrorBuying(false); }} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
