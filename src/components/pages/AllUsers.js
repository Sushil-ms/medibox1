
import { DataSnapshot, onValue } from 'firebase/database';
import React,{useState,useEffect} from 'react';
import { ref, child, get, set } from 'firebase/database';
import database from '../../firebase-config';
import { Form, Badge, Row, Col, Container, Button,Table }from 'react-bootstrap';
import {BrowserRouter as Router,Link,Route,useRouteMatch,useHistory} from 'react-router-dom';
import AddMedication from './AddMedication';
import Edit from './Edit';
import View from './View';

const AllUsers = () => {

    const [data,setData]=useState([]);

    const {url,path}=useRouteMatch();
    
    useEffect(() => {
        

        onValue(ref(database,`PatientData/`),snapshot=>{
            setData([]);
            const patientInfo=snapshot.val();
            if(patientInfo!==null)
            {
                setData((oldArray)=>[...oldArray,patientInfo]);
                  
            
            }  
            
        });

        console.log(data);


       
    }, []);

    

    const history=useHistory();

    const handleClick = (to) => {

      if(path==='/AllUsers'){
      history.push(to)
      }

    }
    



    return (
      <div className='container mt-5'>
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Diagnosis</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, id) => {
              return (
                <tr key={id + 1}>
                  <td>{id + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.phNumber}</td>
                  <td>{user.diagnosis}</td>
                  <td>
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={() => handleClick('/AddMedication', path)}
                    >
                      Add Medication
                    </Button>
                    |
                    <Button
                      variant='danger'
                      size='sm'
                      onClick={() => handleClick('/View', path)}
                    >
                      View
                    </Button>
                    |
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={() => handleClick('/Edit', path)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        
      </div>
    );
}

export default AllUsers;
