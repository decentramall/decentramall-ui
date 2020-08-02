import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React, { useState, useEffect, useContext } from 'react'
import { ChainContext } from '../../../pages/_app'
import { Button } from '@material-ui/core'
import { ethers, BigNumber } from 'ethers'
import { EstateAgentInstance } from '../../contracts/types/index';


export default function Space() {
    const chainContext = useContext(ChainContext);
    const { decentramallTokenInstance, estateAgentInstance, user } = chainContext;
    const [nextPrice, setNextPrice] = useState<string>('0');

    useEffect(() => {
        const loadNextPrice = async () => {
            const nextT = await decentramallTokenInstance.totalSupply();
            const currentNextPrice = BigNumber.from((await estateAgentInstance.price(nextT.toNumber() + 1)).toString()).mul(BigNumber.from('10000000000000000')).toString();
            setNextPrice(currentNextPrice);
        }
        loadNextPrice();
    });

    const buySpace = async () => {
        const { signer } = user;
        if (signer !== undefined) {
            const signerAddress = await signer.getAddress();
            (estateAgentInstance.connect(signer) as ethers.Contract & EstateAgentInstance).buy({ from: signerAddress, value: nextPrice }).then(console.log);
        }
        // TODO: refresh page after buying successfully
    }

    const renderContext = () => {
        if (chainContext.user.space !== undefined) {
            return <Box display="flex" flexDirection="column" margin="auto" justifyContent="center" alignItems="center">
            <Typography component="div" gutterBottom style={{marginTop: '4rem', textAlign: 'center'}}>
                <Box fontWeight="lighter" fontSize="2rem" marginBottom="3rem">
                Below are the details of your space
                </Box>
                <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                    <Box fontWeight="bold" marginRight="1rem">
                    Buyer: 
                    </Box>
                    <Box fontWeight="regular">
                    {chainContext.user.space.buyer}
                    </Box>
                </Box>
                <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                    <Box fontWeight="bold" marginRight="1rem">
                    Price:
                    </Box>
                    <Box fontWeight="regular">
                    {(parseFloat(chainContext.user.space.price)/10**18).toFixed(8)} ETH
                    </Box>
                </Box>
                <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                    <Box fontWeight="bold" marginRight="1rem">
                    Token ID:
                    </Box>
                    <Box fontWeight="regular">
                    {chainContext.user.space.tokenId}
                    </Box>
                </Box>
{/*                <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                    <Box fontWeight="bold" marginRight="1rem">
                    Space status:
                    </Box>
                    <Box fontWeight="regular">
                    {chainContext.user.space.rent !== undefined ? "Rented" : "Available for rent"}
                    </Box>
                </Box>*/}
            </Typography>
        </Box>;
        } else {
            return <Box display="flex" flexDirection="column" margin="auto" justifyContent="center" alignItems="center">
                <Typography variant="h5" gutterBottom style={{marginTop: '4rem', textAlign: 'center'}}>
                    This space would cost you {ethers.utils.formatEther(BigNumber.from(nextPrice))} ETH
                </Typography>
                <Button variant="contained" color="primary" onClick={buySpace}  style={{marginTop: '2rem', width: '10vw'}}>
                    Buy this SPACE
                </Button>
            </Box>;
        }
    }

    const renderContextStatus = () => {
        if (chainContext.user.space !== undefined) {
            if (chainContext.user.space.rent !== undefined) {
                return <Box display="flex" flexDirection="column" margin="auto" justifyContent="center" alignItems="center">
                <Typography component="div" gutterBottom style={{marginTop: '4rem', textAlign: 'center'}}>
                    <Box fontWeight="lighter" fontSize="2rem" marginBottom="3rem" textAlign="left">
                    Space status: rented
                    </Box>
                    <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                        <Box fontWeight="bold" marginRight="1rem">
                        Rented to: 
                        </Box>
                        <Box fontWeight="regular">
                        {chainContext.user.space.rent.rentedTo}
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                        <Box fontWeight="bold" marginRight="1rem">
                        Rental earned:
                        </Box>
                        <Box fontWeight="regular">
                        {chainContext.user.space.rent.rentalEarned}
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                        <Box fontWeight="bold" marginRight="1rem">
                        Store's name:
                        </Box>
                        <Box fontWeight="regular">
                        {chainContext.user.space.rent.title}
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                        <Box fontWeight="bold" marginRight="1rem">
                        Category:
                        </Box>
                        <Box fontWeight="regular">
                        {chainContext.user.space.rent.category}
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                        <Box fontWeight="bold" marginRight="1rem">
                        Description:
                        </Box>
                        <Box fontWeight="regular">
                        {chainContext.user.space.rent.description}
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="row" fontSize="1.5rem" marginBottom="2rem">
                        <Box fontWeight="bold" marginRight="1rem">
                        URL:
                        </Box>
                        <Box fontWeight="regular">
                        {chainContext.user.space.rent.url}
                        </Box>
                    </Box>
                </Typography>
            </Box>;
            } else {
                return <Box display="flex" flexDirection="column" margin="auto" justifyContent="center" alignItems="center">
                    <Typography variant="h5" gutterBottom style={{marginTop: '4rem', textAlign: 'left'}}>
                        <Box fontWeight="lighter" fontSize="2rem" marginBottom="3rem" textAlign="left">
                        Space status: available for rent
                        </Box>
                    </Typography>
                </Box>;
            }
        }
    }
    return (
        <Box display="flex" flexDirection="column" style={{width:'85%', margin: 'auto'}}>
            <Typography variant="h4" gutterBottom style={{marginTop: '4rem', textAlign: 'center', fontWeight: 'bold'}}>
                SPACE
            </Typography>
                {renderContext()}
                {renderContextStatus()}
        </Box>
    )
}