import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect, useContext } from 'react';
import { ChainContext } from '../../../pages/_app';
import { Button, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { ethers, BigNumber } from 'ethers';
import { EstateAgentInstance } from '../../contracts/types/index';


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
                <Box display="flex" flexDirection="column" margin="auto">
                    <Typography component="div" gutterBottom style={{ margin: '4rem 0' }}>
                        <Box display="flex" flexDirection="row" fontSize="1rem">
                            <Box fontWeight="bold" marginRight="1rem">
                                Buying price:
                            </Box>
                            <Box fontWeight="regular">
                                {(parseFloat(userSpace.price) / 10 ** 18).toFixed(8)} ETH
                            </Box>
                        </Box>
                    </Typography>
                </Box>
            );
        } else {
            return (
                <Box display="flex" flexDirection="column" margin="auto" justifyContent="center" alignItems="center">
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
                    <Box display="flex" flexDirection="column" margin="auto">
                        <Typography component="div" gutterBottom style={{ margin: '4rem 0' }}>
                            <Box display="flex" flexDirection="row" fontSize="1rem" marginBottom="2rem" textAlign="center">
                                <Box fontWeight="bold" marginRight="1rem">Space status: </Box>
                                <Box fontWeight="regular">rented</Box>
                            </Box>
                            <Box display="flex" flexDirection="row" fontSize="1rem" marginBottom="2rem">
                                <Box fontWeight="bold" marginRight="1rem">
                                    Rented to:
                                </Box>
                                <Box fontWeight="regular">{userSpace.rent.rentedTo}</Box>
                            </Box>
                            <Box display="flex" flexDirection="row" fontSize="1rem" marginBottom="2rem">
                                <Box fontWeight="bold" marginRight="1rem">
                                    Rental earned:
                                </Box>
                                <Box fontWeight="regular">{userSpace.rent.rentalEarned}</Box>
                            </Box>
                            <Box display="flex" flexDirection="row" fontSize="1rem" marginBottom="2rem">
                                <Box fontWeight="bold" marginRight="1rem">
                                    Store's name:
                                </Box>
                                <Box fontWeight="regular">{userSpace.rent.title}</Box>
                            </Box>
                            <Box display="flex" flexDirection="row" fontSize="1rem" marginBottom="2rem">
                                <Box fontWeight="bold" marginRight="1rem">
                                    Category:
                                </Box>
                                <Box fontWeight="regular">{userSpace.rent.category}</Box>
                            </Box>
                            <Box display="flex" flexDirection="row" fontSize="1rem" marginBottom="2rem">
                                <Box fontWeight="bold" marginRight="1rem">
                                    Description:
                                </Box>
                                <Box fontWeight="regular">{userSpace.rent.description}</Box>
                            </Box>
                            <Box display="flex" flexDirection="row" fontSize="1rem" marginBottom="2rem">
                                <Box fontWeight="bold" marginRight="1rem">
                                    URL:
                                </Box>
                                <Box fontWeight="regular">{userSpace.rent.url}</Box>
                            </Box>
                        </Typography>
                    </Box>
                );
            } else {
                return (
                    <Box display="flex" flexDirection="column" margin="auto">
                        <Typography variant="h5" gutterBottom style={{ marginTop: '1rem' }}>
                            <Box display="flex" flexDirection="row" fontSize="1rem">
                                <Box fontWeight="bold" marginRight="1rem">Space status: </Box>
                                <Box fontWeight="regular">available for rent</Box>
                            </Box>
                        </Typography>
                    </Box>
                );
            }
        }
    };
    return (
        <div>
            <Typography
                variant="h4"
                gutterBottom
                style={{ marginTop: '4rem', textAlign: 'center', fontWeight: 'bold' }}
            >
                YOUR SPACE
            </Typography>
            <Box display="flex" flexDirection="row" style={{ width: '100%' }}>
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
