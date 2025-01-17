import React, { Fragment } from "react";
import { TableContainer, Table, TableCell, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import baseURL from "../BackendApi/BackendConnection";
import { useState, useEffect } from "react";
import axios from "axios";
import { selectUser } from "../Components/Redux/userSlice";
import { useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";


const DisplayRecords = ({ web3 }) => {
  const columns = ["RecordID", "DoctorName", "Hospital Name", "Diagnosis", "Prescription", "Date"]
  const user = useSelector(selectUser);
  const [EHealthRecords, setEHealthRecord] = useState([]);
  const [ConsentedRecords, setConsentedRecords] = useState([]);
  // const data = [];

  const options = {
    filterType: 'checkbox',
  };


  // const 
  // console.log("These are the parameters: " + parameters.consentRecords);
  useEffect(() => {
    if (user.role === "Pat_")
      document.title = 'Welcome Patient'
    else if (user.role === "Doc_")
      document.title = 'Welcome Doctor'
  }, []);

  useEffect(async () => {
    await accessConsents();
    // console.log(ConsentedRecords);
    // displayEHR();
  }, []);

  useEffect(() => {
    displayEHR();
  }, [ConsentedRecords])

  const checkEHR = (EHR) => {
    const map = new Map(EHR.map(pos => [pos.ehrId, pos]));
    const AllRecords = [...map.values()];
    // console.log(EHealthRecords);
    return AllRecords;
  }

  const accessConsents = async () => {
    let abi = require("../contracts/CMS.json");
    // console.log(web3);
    let consentJson = { "patientId": "", "recordIds": [] };
    let contract = new web3.eth.Contract(abi, process.env.REACT_APP_CONTRACTADDRESS);
    await contract.methods.GetConsents().call({ from: user.account}).then(async function (consents) {
      var allConsetedRecords = [];
      // console.log(consents.length);
      for (var i = 0; i < consents.length; i++) {
        consentJson = { "patientId": "", "recordIds": [] };
        let consent_abi = require("../contracts/Consent.json")["abi"];
        const _consent = new web3.eth.Contract(consent_abi, consents[i]);
        await _consent.methods.getTemplate().call({ from: user.account}).then(async function (template) {
          let consentTemplate_abi = require("../contracts/ConsentTemplate.json")["abi"];
          const _template = new web3.eth.Contract(consentTemplate_abi, template);
          var consentRecords = await _template.methods.GetConsentedRecords().call({ from: user.account });
          // console.log(consentRecords);
          consentJson["recordIds"] = [...consentRecords];
          // console.log(consentJson);
          // return consentJson;
        }
        )
        // console.log(consentJson["recordIds"]);
        var consentPatientId = await _consent.methods.getPatient().call({ from: user.account })
        consentJson["patientId"] = consentPatientId;
        allConsetedRecords.push(consentJson);
      }
      setConsentedRecords(allConsetedRecords);

    });
  }
  const displayEHR = () => {
    if (user.role === "Doc_") {
      // if(ConsentedRecords.length!==0){
      // console.log("Blehasdafsd");
      // console.log(ConsentedRecords);
      axios.post(`${baseURL}/${user.role}${user.account}/E-Health-Records`, ConsentedRecords,
        {
          headers: {
            // 'Authorization': 'Basic xxxxxxxxxxxxxxxxxxx',
            'Content-Type': 'application/json'
          }
        }).then(
          (response) => {
            // console.log("bla bla bla bla:",response);
            setEHealthRecord(checkEHR(response.data));
          },
          (error) => {
            // console.log("bla bla bla bla:",error);
            throw (error);
          }
        )
      // }
    }
    if (user.role === "Pat_") {
      axios.get(`${baseURL}/${user.role}${user.account}/E-Health-Records`).then(
        (response) => {
          // console.log("bla bla bla bla:",response);
          setEHealthRecord(response.data);
        },
        (error) => {
          // console.log("bla bla bla blasdfadsfsdf:",error);
          throw (error);
        }
      )
    }
  }
  return (
    <>
      <div>

        <MUIDataTable
          title={"E-Health-Records"}
          data={EHealthRecords}
          columns={columns}
          options={options}
        />
      </div>

      {/* <TableContainer sx={{ width: window.innerWidth - 400 }} component={Paper}>
        <Table sx={{ width: '100%' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Record ID</TableCell>
              {
                user.role == "Doc_" && (
                  <Fragment>
                    <TableCell align="right">Patient Name</TableCell>
                    <TableCell align="right">Patient Phone</TableCell>
                  </Fragment>
                )
              }
              <TableCell align="right">Doctor Name</TableCell>
              <TableCell align="right">Hospital Name</TableCell>
              <TableCell align="right">Diagnosis</TableCell>
              <TableCell align="right">Prescription</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              EHealthRecords.map((item) => (
                <TableRow
                  key={item.ehrId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell component="th" scope="row"> {item.ehrId}</TableCell>
                  {
                    user.role === "Doc_" && (
                      <Fragment>
                        <TableCell align="right">{item.patientName}</TableCell>
                        <TableCell align="right">{item.patientPhone}</TableCell>
                      </Fragment>
                    )
                  }
                  {
                    // console.log("fhasdjkfhdjkshfjkds")
                    // console.log(EHealthRecords)
                  }
                  <TableCell align="right">{item.doctorName}</TableCell>
                  <TableCell align="right">{item.hospitalName}</TableCell>
                  <TableCell align="right">{item.diagnosis}</TableCell>
                  <TableCell align="right">{item.prescription}</TableCell>
                  <TableCell align="right">{item.date}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </>
  )
}

export default DisplayRecords;