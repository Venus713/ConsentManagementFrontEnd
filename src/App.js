import React, { Fragment, useEffect, useRef }  from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

import { useWeb3React } from '@web3-react/core'
import Web3 from "web3/dist/web3.min";


import {Box} from '@mui/material';

import SideMenuPatient from './Components/General/Menu'
import {selectUser} from "./Components/Redux/userSlice";
import doctorMenu from './Components/DoctorDashboard/DoctorMenu'
import patientMenu from './Components/PatientDashboard/PatientMenu'
import Login from "./pages/Login";
import DisplayRecords from './pages/EHealthRecords';
import UserProfile from './pages/Profile';
import RequestConsent from './pages/RequestConsent';
import AllConsents from "./pages/CreateConsents";
import ConnectedDoctors from "./pages/ConnectedDoctors";
import DoctorNotifications from './pages/DoctorNotifications';
import PatientNotifications from './pages/PatientNotifications';
import Logs from "./pages/Logs";
import ConnectedPatients from './pages/ConnectedPatient';
import LandingPage from "./pages/LandingPage";
import { ThemeProvider } from '@mui/material';
import { CssBaseline } from '@mui/material';
import theme from '../src/utils/theme';

export default function App() {
    
    const { chainId, account, activate, active,library } = useWeb3React()
    const user =  useSelector(selectUser);

    const web3 = useRef();
    
    const startWeb3 = async () => {
      await window.ethereum.enable();
      const provider = new Web3.providers.HttpProvider(
        // "https://sphinx.shardeum.org/"
        // "https://api.avax-test.network/ext/bc/C/rpc"
        "http://127.0.0.1:7545"
      );
      web3.current = new Web3(provider);
      console.log(web3.current)
    }

    useEffect(() => {
        startWeb3();
    },[])
    
    useEffect(() => {

    },[web3.current])

    return ( 
      <ThemeProvider theme={theme}>
            
        <Router>
          <CssBaseline />  

            {
              user &&
              (
              <>
              {/* <Header /> */}
              <Box sx={{ display: 'flex', minWidth: "98vw", minHeight: "98.7vh", overflow: "auto" , paddingTop: "5%"}}>
              
                {
                  // -----------------------------------------------------------------------------
                  // Directing to Doctor Dashboard
                  (user.role == "Doc")
                  ?web3.current &&(
                    <Fragment>
                      <SideMenuPatient tabs={doctorMenu}/>
                      <Routes >
                        <Route exact path={"/E-Health-Records"} element = {<DisplayRecords web3={web3.current} />} />
                        <Route exact path={"/Connected-Patients"} element = {<ConnectedPatients web3={web3.current}/>} />
                        <Route exact path={"/Profile"} element={<UserProfile/>} />
                        <Route exact path={"/Request-Consent"} element={<RequestConsent web3={web3.current}/>} />
                        <Route exact path={"/Notifications"} element={<DoctorNotifications web3={web3.current}/>} />
                        <Route exact path={"/Logs"} element={<Logs web3={web3.current}/>} />
                        <Route exact path="/login" element={user && (<Navigate replace to= "/E-Health-Records"/>)} />
                        <Route path="*" element={user && (<Navigate replace to= "/E-Health-Records"/>)} />
                      </Routes>
                    </Fragment>)
                  :web3.current &&(
                  //-----------------------------------------------------------------------------
                  // Directing to Patient Dashboard
                    <Fragment>
                      <SideMenuPatient account={account} tabs={patientMenu}/>
                      <Routes>
                        <Route exact path={"/E-Health-Records"} element = {<DisplayRecords web3={web3.current} />} />
                        <Route exact path={"/Connected-Doctors"} element = {<ConnectedDoctors web3={web3.current}/>} />
                        <Route exact path={"/Profile"} element={<UserProfile />} />
                        <Route exact path={"/Consents"} element={<AllConsents web3={web3.current}/>} />
                        <Route exact path={"/Notifications"} element={<PatientNotifications web3={web3.current}/>} />
                        <Route exact path={"/Logs"} element={<Logs web3={web3.current}/>} />
                        <Route exact path="/login" element={user && (<Navigate replace to= "/E-Health-Records"/>)} />
                        <Route exact path="*" element={user && (<Navigate replace to= "/E-Health-Records"/>)} />
                      </Routes>
                    </Fragment>
                  )
                }
              </Box>
              </>
              )
            }
            {
                //-----------------------------------------------------------------------------
                // Directing to Login Page
                !user && (
                  <Box>
                    <Routes>
                      <Route path="/login" element={<LandingPage web3={web3.current}/>} />
                      <Route path="*" element={<Navigate replace to= "/login"/>} />  
                     
                    </Routes>
                  </Box> 
                )
            }
          
      </Router>
    </ThemeProvider>
    )
    
}
