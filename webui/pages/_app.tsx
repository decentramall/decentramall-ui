import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useState } from 'react'
import theme from '../src/theme'
import { ethers } from "ethers";
import {
    decentramallTokenInstance,
    rentalAgentInstance,
    estateAgentInstance,
    loadSpaces,
} from '../src/contracts'
import { IChainContext } from '../src/types'


export const ChainContext = React.createContext<IChainContext>({
    spaces: [],
    user: {},
});

export default function MyApp(props: AppProps) {
    const [stateContext, setStateContext] = useState<IChainContext>({
        spaces: [],
        user: {},
    });
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
            // load all spaces
            // a much more efficient way, would be to load from events, for example, using TheGraph
            const { spaces, userRent, userSpace } = await loadSpaces(signer);
            setStateContext({
                spaces,
                user: { space: userSpace, rent: userRent },
                decentramallTokenInstance,
                estateAgentInstance,
                rentalAgentInstance,
            });
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
                <ChainContext.Provider value={stateContext}>
                    <Component {...pageProps} />
                </ChainContext.Provider>
            </ThemeProvider>
        </React.Fragment>
    )
}
