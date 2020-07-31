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
import { IUser, IChainContext, ISpace, IRent } from '../src/types'


export const ChainContext = React.createContext<IChainContext>({
    spaces: [],
    rents: [],
    user: {
        space: undefined,
        rent: undefined,
    },
    decentramallTokenInstance: undefined,
    estateAgentInstance: undefined,
    rentalAgentInstance: undefined,
});

export default function MyApp(props: AppProps) {
    const [spaces, setSpaces] = useState<ISpace[]>([]);
    const [rents, setRents] = useState<IRent[]>([]);
    const [user, setUser] = useState<IUser>({ space: undefined, rent: undefined });
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
            await (window as any).ethereum.enable();
            // A Web3Provider wraps a standard Web3 provider, which is
            // what Metamask injects as window.ethereum into each page
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);

            // The Metamask plugin also allows signing transactions to
            // send ether and pay to change state within the blockchain.
            // For this, we need the account signer...
            const signer = provider.getSigner();
            const signerAddress = await signer.getAddress();

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
                const mapSpace = (logArgs: any) => {
                    return {
                        buyer: logArgs.buyer.toString(),
                        price: logArgs.price.toString(),
                        tokenId: logArgs.tokenId.toString(),
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
                    const mappedSpace = logsEstateAgent.map((log) => mapSpace(ifaceEstateAgent.parseLog(log).args));
                    const userSpace = mappedSpace.find((s) => s.buyer === signerAddress);
                    setSpaces(mappedSpace);
                    // TODO: load user rent
                    setUser({ space: userSpace, rent: undefined });
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
                <ChainContext.Provider value={{ spaces, rents, user, decentramallTokenInstance, estateAgentInstance, rentalAgentInstance }}>
                    <Component {...pageProps} />
                </ChainContext.Provider>
            </ThemeProvider>
        </React.Fragment>
    )
}
