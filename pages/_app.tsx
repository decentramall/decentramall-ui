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
import {
    DecentramallTokenInstance,
    EstateAgentInstance
} from '../../smart-contracts/types/truffle-contracts/index';


export interface IChainContext {
    spaces: string[];
    rents: string[];
    user: {
        space: {
            buyer: string;
            price: string;
            tokenId: string;
        } | undefined;
        rent: string;
    }
}
export const ChainContext = React.createContext<IChainContext>({
    spaces: [],
    rents: [],
    user: {
        space: undefined,
        rent: ''
    }
});

export default function MyApp(props: AppProps) {
    const [spaces, setSpaces] = useState<string[]>([]);
    const [rents, setRents] = useState<string[]>([]);
    const [user, setUser] = useState<{ space: {
        buyer: string;
        price: string;
        tokenId: string;
    } | undefined, rent: string }>({ space: '', rent: '' });
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

            const { chainId } = await provider.getNetwork();
            const decentramallTokenInstance = new ethers.Contract(
                DecentramallTokenJSON.networks[chainId].address,
                DecentramallTokenJSON.abi,
                provider,
            ) as ethers.Contract & DecentramallTokenInstance;
            const estateAgentInstance = new ethers.Contract(
                EstateAgentJSON.networks[chainId].address,
                EstateAgentJSON.abi,
                provider,
            ) as ethers.Contract & EstateAgentInstance;

            // load all spaces
            // a much more efficient way, would be to load from events, for example, using TheGraph
            const totalTokens = await decentramallTokenInstance.totalSupply();
            if (totalTokens.toNumber() > 0) {
                const ifaceEstateAgent = new ethers.utils.Interface(EstateAgentJSON.abi);
                const myBoughtSpaces = await provider.getLogs(
                    estateAgentInstance.filters.BuyToken(await signer.getAddress(), null, null)
                );
                if (myBoughtSpaces.length > 0) {
                    const log = ifaceEstateAgent.parseLog(myBoughtSpaces[myBoughtSpaces.length - 1]);
                    const space = {
                        buyer: log.args.buyer.toString(),
                        price: log.args.price.toString(),
                        tokenId: log.args.tokenId.toString(),
                    }
                    setUser({ space, rent: '' });
                }
            }
            const loadedSpaces = [];
            for (let t = 0; t < totalTokens.toNumber(); t += 1) {
                loadedSpaces.push((await decentramallTokenInstance.tokenByIndex(t)).toString());
            }
            setSpaces(loadedSpaces);
            // TODO: load rents
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
                <ChainContext.Provider value={{ spaces, rents, user }}>
                    <Component {...pageProps} />
                </ChainContext.Provider>
            </ThemeProvider>
        </React.Fragment>
    )
}
