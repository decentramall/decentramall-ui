import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            // main: red.A400,
            main: '#e80078',
        },
        // background: {
        //   paper: '#424242',
        //   default: '#303030',
        // },
        // text: {
        //   primary: '#fff',
        //   secondary: 'rgba(255, 255, 255, 0.7)',
        //   disabled: 'rgba(255, 255, 255, 0.5)',
        //   hint: 'rgba(255, 255, 255, 0.5)',
        // },
        // divider: 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
        // "fontFamily": `"Ubuntu", "Asap", "Roboto", "Helvetica", "Arial", sans-serif`,
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
    },
});

export default theme;
