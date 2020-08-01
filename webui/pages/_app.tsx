import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useState } from 'react'
import theme from '../src/theme'
import { ethers } from "ethers";
// TODO: to change
import DecentramallTokenJSON from '../../smart-contracts/build/contracts/DecentramallToken.json';
import EstateAgentJSON from '../../smart-contracts/build/contracts/EstateAgent.json';
import RentalAgentJSON from '../../smart-contracts/build/contracts/RentalAgent.json';
import {
    DecentramallTokenInstance,
    EstateAgentInstance,
    RentalAgentInstance,
} from '../../smart-contracts/types/truffle-contracts/index';
import { IChainContext, ISpace, IRent } from '../src/types'
import { createPow } from '@textile/powergate-client'


export const ChainContext = React.createContext<IChainContext>({
    spaces: [],
    user: {},
    decentramallTokenInstance: undefined,
    estateAgentInstance: undefined,
    rentalAgentInstance: undefined,
});

export default function MyApp(props: AppProps) {
    const [spaces, setSpaces] = useState<ISpace[]>([]);
    const [signer, setSigner] = useState<ethers.Signer>();
    const [userRent, setUserRent] = useState<IRent>();
    const [userSpace, setUserSpace] = useState<ISpace>();
    const [decentramallTokenInstance, setDecentramallToken] = useState<ethers.Contract & DecentramallTokenInstance | undefined>();
    const [estateAgentInstance, setEstateAgent] = useState<ethers.Contract & EstateAgentInstance | undefined>();
    const [rentalAgentInstance, setRentalAgent] = useState<ethers.Contract & RentalAgentInstance | undefined>();
    const { Component, pageProps } = props

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles)
        }

        const loadWeb3 = async () => {
            await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            // A Web3Provider wraps a standard Web3 provider, which is
            // what Metamask injects as window.ethereum into each page
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);

            // The Metamask plugin also allows signing transactions to
            // send ether and pay to change state within the blockchain.
            // For this, we need the account signer...
            const currentSigner = provider.getSigner();
            const signerAddress = await currentSigner.getAddress();
            setSigner(currentSigner);

            const { chainId } = await provider.getNetwork();
            const decentramallTokenInstance = new ethers.Contract(
                DecentramallTokenJSON.networks[chainId].address,
                DecentramallTokenJSON.abi,
                provider,
            ) as ethers.Contract & DecentramallTokenInstance;
            setDecentramallToken(decentramallTokenInstance);

            const estateAgentInstance = new ethers.Contract(
                EstateAgentJSON.networks[chainId].address,
                EstateAgentJSON.abi,
                provider,
            ) as ethers.Contract & EstateAgentInstance;
            setEstateAgent(estateAgentInstance);

            const rentalAgentInstance = new ethers.Contract(
                RentalAgentJSON.networks[chainId].address,
                RentalAgentJSON.abi,
                provider,
            ) as ethers.Contract & RentalAgentInstance;
            setRentalAgent(rentalAgentInstance);

            // load all spaces
            // a much more efficient way, would be to load from events, for example, using TheGraph
            const totalTokens = await decentramallTokenInstance.totalSupply();
            if (totalTokens.toNumber() > 0) {
                const PowerGate = createPow({ host: process.env.NEXT_PUBLIC_POWERGATE_URL })
                PowerGate.setToken(process.env.NEXT_PUBLIC_FFS_TOKEN)

                const mapSpace = async (logArgs: any) => {
                    const tokenId = logArgs.tokenId.toString();
                    const rentCid = await decentramallTokenInstance.tokenURI(tokenId);
                    let rent: IRent;
                    if (rentCid.length > 0) {
                        const spaceInfo = await rentalAgentInstance.spaceInfo(tokenId);
                        rent = JSON.parse(new TextDecoder("utf-8").decode((await PowerGate.ffs.get(rentCid))));
                        rent = {
                            ...rent,
                            // rightfulOwner: spaceInfo[0]
                            rentedTo: spaceInfo[1].toString(),
                            rentalEarned: spaceInfo[2].toString(),
                            expiryBlock: spaceInfo[3].toString(),
                        }
                        // add user rent here
                        if (spaceInfo[1].toString() === signerAddress) {
                            setUserRent(rent);
                        }
                    }
                    return {
                        buyer: logArgs.buyer.toString(),
                        price: logArgs.price.toString(),
                        tokenId,
                        rent
                    }
                }
                const ifaceEstateAgent = new ethers.utils.Interface(EstateAgentJSON.abi);
                const logsEstateAgent = await provider.getLogs({
                    address: EstateAgentJSON.networks[chainId].address,
                    fromBlock: 0,
                    toBlock: 'latest',
                    topics: [[
                        ethers.utils.id('BuyToken(address,uint256,uint256)'),
                    ]]
                });

                if (logsEstateAgent.length > 0) {
                    const mappedSpace = [];
                    for (let x = 0; x < logsEstateAgent.length; x += 1) {
                        mappedSpace.push((await mapSpace(ifaceEstateAgent.parseLog(logsEstateAgent[x]).args)));
                    }
                    const userSpace = mappedSpace.find((s) => s.buyer === signerAddress);
                    setSpaces(mappedSpace);
                    console.log('mappedSpace', mappedSpace);
                    setUserSpace(userSpace);
                }
            }
        }
        loadWeb3();
    }, [])

    return (
        <React.Fragment>
            <Head>
                <title>My page</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <ChainContext.Provider value={{ spaces, user: { space: userSpace, rent: userRent, signer }, decentramallTokenInstance, estateAgentInstance, rentalAgentInstance }}>
                    <Component {...pageProps} />
                </ChainContext.Provider>
            </ThemeProvider>
        </React.Fragment>
    )
}
