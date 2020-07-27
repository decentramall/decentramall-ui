import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core';
import Rent from './rent';
import Space from './space';
import { ChainContext, IChainContext } from '../_app';


const useStyles = makeStyles((theme) => ({
    options: {
        marginTop: '15%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        margin: '2%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: '#38a9e4',
        color: 'white',
        fontFamily: 'Helvetica, Arial Black, sans',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    }
}))

export default function Home() {
    const classes = useStyles()
    const [view, setView] = useState<string | undefined>();

    const openView = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, newView: string) => {
        setView(newView);
        event.preventDefault();
    }

    const navigateOptions = (chainContext: IChainContext) => {
        if (view === 'space') {
            return <Space spaces={chainContext.spaces} />;
        } else if (view === 'rent') {
            return <Rent />;
        } else {
            return <div className={classes.options}>
                <div className={classes.circle} onClick={(e) => openView(e, 'space')}>
                    SPACE
                </div>
                <div className={classes.circle} onClick={(e) => openView(e, 'rent')}>
                    Rent
                </div>
            </div>;
        }
    }

    return (
        <ChainContext.Consumer>
            {(chainContext) => navigateOptions(chainContext)}
        </ChainContext.Consumer>
    );
}