import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Badge,
  Row,
  Col,
  Container,
  Button,
  FloatingLabel,
  Table,
  Card,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';

import { useHistory, useParam } from 'react-router-dom';
import { toast } from 'react-toastify';

import { DataSnapshot, onValue } from 'firebase/database';
import { ref, child, get, set } from 'firebase/database';
import { database } from '../../firebase-config';

import { token, org, bucket, url } from '../../influx-config';
import { InfluxDB } from '@influxdata/influxdb-client';

const PatientView = () => {
  const [data, setData] = useState();
  const [influxData, setInfluxData] = useState([]);

  const history = useHistory();

  let query = `  from(bucket: "MediBox")
  |> range(start: -30d)
  |> filter(fn: (r) => r["_measurement"] == "medicinestatus")
  |> filter(fn: (r) => r["_field"] == "AmbientTemp")
  |> group (columns: ["temp"])   // all durations - each jobname has its table                      // each table has only the last value
  |> drop (columns: ["_start", "_stop"])
  |> map(fn: (r) => ({ r with _field: r.temp}))   // hack: transfer the tag-name
  |> drop (columns: ["temp"])
  |> limit (n: 10)                      // Now there is only ONE table
  |> group(columns: ["_time"], mode:"by")
  |> sort(columns: ["_time"], desc: false)`;

  // from(bucket: "MediBox")
  // |> range(start: -30d)
  // |> filter(fn: (r) => r["_measurement"] == "medicinestatus")
  // |> filter(fn: (r) => r["_field"] == "AmbientTemp")
  // |> group (columns: ["temp"])   // all durations - each jobname has its table                      // each table has only the last value
  // |> drop (columns: ["_start", "_stop"])
  // |> map(fn: (r) => ({ r with _field: r.temp}))   // hack: transfer the tag-name
  // |> drop (columns: ["temp"])
  // |> limit (n: 10)                      // Now there is only ONE table
  // |> group(columns: ["_time"], mode:"by")
  // |> sort(columns: ["_time"], desc: false)

  useEffect(() => {
    setData([]);
    onValue(ref(database, `PatientData/`), (snapshot) => {
      const patientInfo = snapshot.val();
      if (patientInfo !== null) {
        setData((oldState) => [patientInfo]);
      }
    });
  }, []);

  useEffect(() => {
    let res = [];
    const influxQuery = async () => {
      //create InfluxDB client
      const queryApi = await new InfluxDB({ url, token }).getQueryApi(org);
      //make query
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          //push rows from query into an array object
          res.push(o);
          console.log(res);
        },
        complete() {
          let finalData = [];

          //variable is used to track if the current ID already has a key
          var exists = false;

          //nested for loops aren’t ideal, this could be optimized but gets the job done
          //  for (let i = 0; i < res.length; i++) {
          //    for (let j = 0; j < finalData.length; j++) {
          //      //check if the sensor ID is already in the array, if true we want to add the current data point to the array
          //      if (res[i]['sensor_id'] === finalData[j]['id']) {
          //        exists = true;

          //        let point = {};
          //        point['x'] = res[i]['_time'];
          //        point['y'] = res[i]['_value'];
          //        finalData[j]['data'].push(point);
          //      }
          //    }
          //    //if the ID does not exist, create the key and append first data point to array
          //    if (!exists) {
          //      let d = {};
          //      d['id'] = res[i]['sensor_id'];
          //      d['data'] = [];
          //      let point = {};
          //      point['x'] = res[i]['_time'];
          //      point['y'] = res[i]['_value'];
          //      d['data'].push(point);
          //      finalData.push(d);
          //    }
          //    //need to set this back to false
          //    exists = false;
          //  }

          setInfluxData(res);
        },
        error(error) {
          console.log('query failed- ', error);
        },
      });
    };

    influxQuery();
  }, []);

  console.log(influxData);

  console.log(data && data[0] ? data : data);

  return (
    <div className='my-auto'>
      <Container className='mt-5'>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <Card style={{ width: '18rem' }}>
              <ListGroup className='list-group-flush'>
                <ListGroupItem>
                  {'Name : ' + (data && data[0] ? data[0].name : 'Loading')}
                </ListGroupItem>

                <ListGroupItem>
                  {'Age : ' + (data && data[0] ? data[0].age : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'DOB : ' + (data && data[0] ? data[0].dob : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'Contact Number : ' +
                    (data && data[0] ? data[0].phNumber : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'Height : ' + (data && data[0] ? data[0].height : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'Weight : ' + (data && data[0] ? data[0].weight : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'BMI : ' + (data && data[0] ? data[0].BMI : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'BSA : ' + (data && data[0] ? data[0].BSA : 'Loading')}
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
          <Col md='auto'>
            <Card style={{ width: '18rem' }}>
              <ListGroup className='list-group-flush'>
                <ListGroupItem>
                  {'Allergy : ' +
                    (data && data[0] ? data[0].allergy : 'Loading')}
                </ListGroupItem>

                <ListGroupItem>
                  {'Chief Complaints : ' +
                    (data && data[0] ? data[0].cheifComplaints : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'Physical Examination : ' +
                    (data && data[0] ? data[0].physicalExamination : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'Diagnosis : ' +
                    (data && data[0] ? data[0].diagnosis : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'Medical Plan: ' +
                    (data && data[0] ? data[0].plan : 'Loading')}
                </ListGroupItem>
                <ListGroupItem>
                  {'Current Medication : ' +
                    (data && data[0] ? data[0].currentMedication : 'Loading')}
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container className='mt-5'>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <Button
              className='my-2 mx-2'
              variant='primary'
              size='md'
              onClick={() => history.push('/Mqtt')}
            >
              Sensor Data
            </Button>
          </Col>
          <Col md='auto'>
            <Button
              className='my-2 mx-2'
              variant='primary'
              size='md'
              onClick={() => history.push('/timeset')}
            >
              Update Time
            </Button>
            <Button
              className='my-2 mx-2'
              variant='primary'
              size='md'
              onClick={() => history.push('/PatientMedicine')}
            >
              Your Medication
            </Button>
            <Button
              className='my-2 mx-2'
              variant='primary'
              size='md'
              onClick={() => window.open('https://m.me/105215288796259?ref=Flow')}
            >
              Book Appointment
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PatientView;
