import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import React, { useState, useEffect } from 'react'
import { ChainContext } from '../_app'
import { IChainContext } from '../../src/types'
import { Button } from '@material-ui/core'
import { ethers, BigNumber } from 'ethers'
import { DecentramallTokenInstance, EstateAgentInstance } from '../../../smart-contracts/types/truffle-contracts';
import DecentramallTokenJSON from '../../../smart-contracts/build/contracts/DecentramallToken.json';
import EstateAgentJSON from '../../../smart-contracts/build/contracts/EstateAgent.json';


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

            const { chainId } = await provider.getNetwork();
            decentramallTokenInstance = new ethers.Contract(
                DecentramallTokenJSON.networks[chainId].address,
                DecentramallTokenJSON.abi,
                provider,
            ) as ethers.Contract & DecentramallTokenInstance;
            estateAgentInstance = new ethers.Contract(
                EstateAgentJSON.networks[chainId].address,
                EstateAgentJSON.abi,
                provider,
            ) as ethers.Contract & EstateAgentInstance;
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
        if (chainContext.user.space !== undefined) {
            return <p>{JSON.stringify(chainContext.user.space)}</p>
        } else {
            return <>
                <Typography variant="h4" gutterBottom>
                    This space would cost you {ethers.utils.formatEther(BigNumber.from(nextPrice))} ETH
                </Typography>
                <Button variant="contained" color="primary" onClick={buySpace}>
                    Buy this SPACE
                </Button>
            </>;
        }
    }
    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Space
            </Typography>
            <ChainContext.Consumer>
                {(chainContext) => renderContext(chainContext)}
            </ChainContext.Consumer>
        </Container>
    )
}
