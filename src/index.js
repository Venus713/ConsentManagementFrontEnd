import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    Mainnet,
    DAppProvider,
    useEtherBalance,
    useEthers,
    Config,
    Localhost,
} from '@usedapp/core'

const config = {
  readOnlyChainId: Localhost.chainID,
  readOnlyUrls: {
    [Localhost.chainID]: 'http://127.0.0.1:8545',
  },
}


ReactDOM.render( 
    <DAppProvider config = { config } >
    <App / >
    </DAppProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();