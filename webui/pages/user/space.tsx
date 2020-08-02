import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import React, { useState, useEffect } from 'react'
import { ChainContext } from '../_app'
import { IChainContext } from '../../src/types'
import { Button } from '@material-ui/core'
import { ethers, BigNumber } from 'ethers'
import { DecentramallTokenInstance, EstateAgentInstance } from '../../src/contracts/types/index';


export default function Space() {
    const [nextPrice, setNextPrice] = useState<string>('0');
    let decentramallTokenInstance: ethers.Contract & DecentramallTokenInstance;
    let estateAgentInstance: ethers.Contract & EstateAgentInstance;
    let signer: ethers.providers.JsonRpcSigner;
    let signerAddress: string;

    useEffect(() => {
        const loadNextPrice = async () => {
            await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);

            signer = provider.getSigner();
            signerAddress = await signer.getAddress();

            // const { chainId } = await provider.getNetwork();
            const nextT = await decentramallTokenInstance.totalSupply();
            const currentNextPrice = BigNumber.from((await estateAgentInstance.price(nextT.toNumber() + 1)).toString()).mul(BigNumber.from('10000000000000000')).toString();
            setNextPrice(currentNextPrice);
        }
        loadNextPrice();
    });

    const buySpace = () => {
        (estateAgentInstance.connect(signer) as ethers.Contract & EstateAgentInstance).buy({ from: signerAddress, value: nextPrice }).then(console.log);
        // TODO: refresh page after buying successfully
    }

    const renderContext = (chainContext: IChainContext) => {
        decentramallTokenInstance = chainContext.decentramallTokenInstance;
        estateAgentInstance = chainContext.estateAgentInstance;

        if (chainContext.user.space !== undefined) {
            var data = JSON.parse(JSON.stringify(chainContext.user.space));
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
    return (
        <Box display="flex" flexDirection="column" style={{width:'85%', margin: 'auto'}}>
            <Typography variant="h4" gutterBottom style={{marginTop: '4rem', textAlign: 'center', fontWeight: 'bold'}}>
                SPACE
            </Typography>
            <ChainContext.Consumer>
                {(chainContext) => renderContext(chainContext)}
            </ChainContext.Consumer>
        </Box>
    )
}
