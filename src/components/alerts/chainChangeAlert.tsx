import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  
export default function ChainChangeAlert() {
    const [state, setState] = React.useState({
        open: true,
    });

    const { open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    return (
        <div>
        <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            open={open}
            onClose={handleClose}
            key="chain-change-alert"
        >
            <Alert severity="error">Make sure you are on Ropsten!</Alert>
        </Snackbar>
        </div>
    );
}
