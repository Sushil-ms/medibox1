import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { Paper } from '@material-ui/core';
import Box from '@mui/material/Box';
import {
  Form,
  Badge,
  Row,
  Col,
  Container,
  Button,
  FloatingLabel,
  Table,
} from 'react-bootstrap';
import { ref, child, get, set, onValue, update } from 'firebase/database';
import { database } from '../../firebase-config';
import {
  DonutSmallOutlined,
  SettingsSystemDaydreamTwoTone,
} from '@material-ui/icons';

const PatientMedicine = () => {
  const initialChecked = {
    Morning: false,
    Afternoon: false,
    Evening: false,
  };

  const [allMed, setAllMed] = useState([]);
  const [morningMed, setMorningMed] = useState([]);
  const [afternoonMed, setAfternoonMed] = useState([]);
  const [eveningMed, setEveningMed] = useState([]);
  const [textValue, setTextValue] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [isChecked, setIsChecked] = useState(initialChecked);

  useEffect(() => {
    onValue(ref(database, 'MedicineData/AllMedications'), (snapshot) => {
      setAllMed([]);
      const data = snapshot.val();

      if (data.length != 0) {
        setAllMed((oldArray) => [...oldArray, data]);
      }
    });
  }, []);

  useEffect(() => {
    onValue(ref(database, 'MedicineData/Morning'), (snapshot) => {
      setMorningMed([]);
      const data = snapshot.val();

      if (data.length != 0) {
        setMorningMed((oldArray) => [...oldArray, data]);
      }
    });
  }, []);

  useEffect(() => {
    onValue(ref(database, 'MedicineData/Afternoon'), (snapshot) => {
      setAfternoonMed([]);
      const data = snapshot.val();

      if (data.length != 0) {
        setAfternoonMed((oldArray) => [...oldArray, data]);
      }
    });
  }, []);

  useEffect(() => {
    onValue(ref(database, 'MedicineData/Evening'), (snapshot) => {
      setEveningMed([]);
      const data = snapshot.val();

      if (data.length != 0) {
        setEveningMed((oldArray) => [...oldArray, data]);
      }
    });
  }, []);

  console.log(allMed);
  const data = allMed[0] && allMed[0].split(',');
  const mdata = morningMed[0] && morningMed[0].split(',');
  const edata = eveningMed[0] && eveningMed[0].split(',');
  const adata = afternoonMed[0] && afternoonMed[0].split(',');
  console.log(data);
  console.log(mdata);
  console.log(adata);
  console.log(edata);

  const handleUpdate = (props) => {
    if (props == 1) {
      setMorningMed((oldArray) => [
        oldArray[0].length > 0 ? oldArray[0] + ',' + textValue : textValue,
      ]);
      mdata.push(textValue);
      const newMornData = mdata.join(',');
      const updates = {};
      updates['MedicineData/Morning'] = newMornData;
      return update(ref(database), updates);
    }

    if (props == 2) {
      setAfternoonMed((oldArray) => [
        oldArray[0].length > 0 ? oldArray[0] + ',' + textValue : textValue,
      ]);
      mdata.push(textValue);
      const newAfterData = adata.join(',');
      const updates = {};
      updates['MedicineData/Afternoon'] = newAfterData;
      return update(ref(database), updates);
    }
    if (props == 3) {
      setEveningMed((oldArray) => [
        oldArray[0].length > 0 ? oldArray[0] + ',' + textValue : textValue,
      ]);
      edata.push(textValue);
      const newEveData = edata.join(',');
      const updates = {};
      updates['MedicineData/Evening'] = newEveData;
      return update(ref(database), updates);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setAllMed((oldArray) => [
      oldArray[0].length > 0 ? oldArray[0] + ',' + textValue : textValue,
    ]);
    data.push(textValue);
    setTextValue('');
    const newMedData = data.join(',');

    if (isChecked.Morning) {
      handleUpdate(1);
    }
    if (isChecked.Afternoon) {
      handleUpdate(2);
    }
    if (isChecked.Evening) {
      handleUpdate(3);
    }

    setTextValue('');
    setIsChecked(initialChecked);
    const updates = {};
    updates['MedicineData/AllMedications'] = newMedData;
    return update(ref(database), updates);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setTextValue(value);
  };

  const ToggleChange = (e) => {
    console.log(e.target.id);
    console.log(e.target.checked);
    if (e.target.id === 'Afternoon') {
      setIsChecked({ ...isChecked, Afternoon: !isChecked.Afternoon });
    } else if (e.target.id === 'Morning') {
      setIsChecked({ ...isChecked, Morning: !isChecked.Morning });
    } else {
      setIsChecked({ ...isChecked, Evening: !isChecked.Evening });
    }
  };

  return (
    <Container className='mx-5 my-5'>
      <Row className='justify-content-center align-items-center'>
        <Col className='justify-content-center' sm={6} md={8}>
          <Table striped bordered hover size='lg'>
            <thead>
              <tr>
                <th>No.</th>
                <th>Medication Name</th>
                <th>Morning</th>
                <th>Evening</th>
                <th>Afternoon</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((med, id) => {
                  return (
                    <tr key={id + 1}>
                      <td>{id + 1}</td>
                      <td>{med}</td>
                      <td>{mdata && mdata.includes(med) ? 1 : '-'}</td>
                      <td>{adata && adata.includes(med) ? 1 : '-'}</td>
                      <td>{edata && edata.includes(med) ? 1 : '-'}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientMedicine;
