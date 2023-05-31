    # How to run project?

    ## Deploy SmartContract

    - Install MetaMask, Truffle, and Ganach for localhost deployment
    - Add localhost network to Metamask

        Network name: LocalhostTestNet
        New RPC URL: HTTP://127.0.0.1:7545
        Chain ID: 1337
        Currency symbol: ETH
    - Import one of the accounts in Ganach into Metamask by using the account's privatekey(you can import several accounts for Docker and Pacient)
    - Copy/Past a private key into .secret in contract-testing dir
    - Deploy smart contract to localhost testnet.

            ```
            $ cd ./contract-testing
            $ truffle migrate --network development
            ```

    ## How to run project?

    In the project directory, you can run:

    - Set a deployed contract address from the deployment result in the .env.
    - Please set the secret key and the contract address in the application.properties file in the backend.
    - Finally, run the backend and frontend.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

**Note:** This project is dependent on another project [Healthcare-ConsentManagementSystem](https://github.com/Mudit219/Healthcare-ConsentManagementSystem)

Here is the [Demo](https://drive.google.com/file/d/1ogWXmcOs1J4XBo1kuO-jJ0V6WUmAxvbL/view?usp=share_link) of the working project.

#### Refer the [documentation](https://spangled-frost-4c1.notion.site/Consent-Management-in-Healthcare-634fa6c5bd5e4428af08746f4eb0492a) which includes detailed explanation of the project along with various flow diagrams, architecture diagrams, sample screenshots of the workflow.

