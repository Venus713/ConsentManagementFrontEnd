import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import { DialogTitle,DialogContent,DialogActions } from '@material-ui/core';
import { Button } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import { FormControl, MenuItem } from "@mui/material";
import {selectUser} from "../Redux/userSlice";
import {useSelector} from "react-redux";
import {useState} from "react";
import {toast} from 'react-toastify';
import { useEffect } from 'react';
import axios from 'axios';
import baseURL from '../../BackendApi/BackendConnection';
import { Grid } from "@mui/material";
import Select from "@material-ui/core/Select";


const HospitalModalDialog = ({ open, handleClose, web3, connectionFile}) => {
  
  const [selectedHospital,setSelectedHospital] = useState("")
  const [availableHospitals,setAvailableHospitals] = useState([])
  const user = useSelector(selectUser);
  const [alreadyConnected,setAlreadyConnected] = useState(false);

  useEffect(() => {
    axios.get(`${baseURL}/admin/Get-AvailableHospitals`, 
        {
            headers: { 
                'Content-Type' : 'application/json'
            }
        }).then(
            (response)=>{
              // console.log("bla bla bla bla:",response);
              setAvailableHospitals(response.data);
            },
            (error)=>{
            // console.log("bla bla bla blasdfadsfsdf:",error);
              throw(error);
            }
    )

    SetAlreadyConnectionHospitals();
  },[])
  
  useEffect(() => {
    SetAlreadyConnectionHospitals();
    
  },[selectedHospital,alreadyConnected])

  const SetAlreadyConnectionHospitals = async () => {
    
    if(connectionFile) {
      let ConnectionFileAbi = require("../../contracts/ConnectionFile.json")["abi"];
      let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,connectionFile);
      
      await ConnectionFileContract.methods.getHopitalConnections().call({from : user.account}, async (res) => {
        
        const connectedHospitals = [...new Set(res)]
        if(connectedHospitals.includes(selectedHospital)) {
          console.log("WE cam till here to disconnect",connectedHospitals)
          setAlreadyConnected(true)
        }
        else {
          setAlreadyConnected(false)
        }
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
    let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
    
    let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        
    
    console.log("Here is our user------",user,CONTRACT_ADDRESS)
      if(connectionFile) {
        let ConnectionFileAbi = require("../../contracts/ConnectionFile.json")["abi"];
        let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi, connectionFile);
        
        if(!alreadyConnected) {
          await ConnectionFileContract.methods.AddHospitalConnection(selectedHospital).send({from : user.account, gas: 500000}).then(
            (response)=>{
              console.log("++++++++++",response)
              console.log("Got correct call")
              console.log('*************************', user.role)
              axios.post(`${baseURL}/${user.role}/Add-E-Health-Records/?metaId=${user.account}&hospitalName=${selectedHospital}`,{}, {
                headers: {
                  // 'Authorization': 'Basic xxxxxxxxxxxxxxxxxxx',
                  'Content-Type': 'application/json'
                }
              }).then(
                (response)=>{
                  toast.success('Connection Successful with Db update !', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                },
                (error)=>{
                  throw(error);
                }
              )
            },(error)=>{
              console.log("----------------------",error)
                console.log("Got wrong call")
                toast.error('Connection Failed !!', {
                    position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                throw(error)
            })
        }
        else {
          await ConnectionFileContract.methods.disconnectHospital(selectedHospital).send({from : user.account}).then(
            (response)=>{
                console.log("Got correct call")
                toast.success('Disconnection Successful !', {
                    position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
            },(error)=>{
                console.log("Got wrong call")
                toast.error('Disconnection Failed !!', {
                    position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                throw(error)
            })
        }
      }
      handleClose();
  }

  return (
    // props received from App.js
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Connect to a Hospital</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ backgroundColor: "#FFFFFF",marginTop:"5%" }}>
            <FormControl>
            <TextField
                id="hospital"
                value={selectedHospital}    
                onChange={(e)=>setSelectedHospital(e.target.value)}
                label="Hospital"
                type="text"
                style={{ width: 450 , marginTop: "35px"}}
                select
                required
                variant="outlined"
            >
                {
                  availableHospitals.map((item)=>(
                      <MenuItem Item key={item} value={item} style={{width:"100%", justifyContent: "left" , marginLeft: "20px"}} >
                          {item}
                      </MenuItem>
                  ))
                }
            </TextField>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" style={{backgroundColor : alreadyConnected ? "#990012" : "#5050cc" , color : "white"}}> { alreadyConnected ? "Disconnect" : "Connect"} </Button>
            </DialogActions>
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HospitalModalDialog;