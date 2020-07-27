import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useState } from 'react'
import theme from '../src/theme'


export interface IChainContext {
    spaces: string[];
    rents: string[];
}
export const ChainContext = React.createContext<IChainContext>({
    spaces: [],
    rents: []
});

export default function MyApp(props: AppProps) {
    const [spaces, setSpaces] = useState<string[]>([]);
    const [rents, setRents] = useState<string[]>([]);
    const { Component, pageProps } = props

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles)
        }
        // TODO: load spaces
        // TODO: load rents
        setSpaces(['ola', 'xau']);
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
                <ChainContext.Provider value={{ spaces, rents }}>
                    <Component {...pageProps} />
                </ChainContext.Provider>
            </ThemeProvider>
        </React.Fragment>
    )
}
