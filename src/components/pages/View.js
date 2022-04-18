import {
  Form,
  Badge,
  Row,
  Col,
  Container,
  Button,
  FloatingLabel,
  Table,Card,ListGroup,ListGroupItem
} from 'react-bootstrap';
import { useState,useEffect } from 'react';
import { useHistory, useParam } from 'react-router-dom';
import { toast } from 'react-toastify';


import { DataSnapshot, onValue } from 'firebase/database';
import { ref, child, get, set } from 'firebase/database';
import database from '../../firebase-config';

import { token,org,bucket,url } from '../../influx-config';
import { InfluxDB } from '@influxdata/influxdb-client';

const View = () => {

    const [data,setData]=useState([]);
    const [influxData,setInfluxData]=useState([]);



    let query = `from(bucket: "MediBox")
	|> range(start: -7d)                    
  |> filter(fn: (r) => r["_measurement"] == "medicinestatus")
  |> filter(fn: (r) => r["_field"] == "AmbientTemp")`;


    useEffect(() => {
      onValue(ref(database, `PatientData/`), (snapshot) => {
        setData([]);
        const patientInfo = snapshot.val();
        if (patientInfo !== null) {
          setData((oldArray) => [...oldArray, patientInfo]);
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



    console.log(data);


    return (
      <div className='my-auto'>
        <Container className='mt-5'>
          <Row className='justify-content-md-center'>
            <Card style={{ width: '18rem' }}>
              <ListGroup className='list-group-flush'>
                <ListGroupItem>{'age :' + data.age}</ListGroupItem>
                <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                <ListGroupItem>Vestibulum at eros</ListGroupItem>

              </ListGroup>
            
            </Card>
          </Row>
        </Container>
      </div>
    );
}

export default View;


//Medicine track record - 30D
//Get spo2 and BPM data - 2D
//Get temperature reading - 2D

//stringdd
//spo2
//BPM
//ObjectTemp
//AmbientTemp

//
// var array = msg.payload;

// //Comparer Function
// function GetSortOrder(prop) {
//   return function (a, b) {
//     if (a[prop] > b[prop]) {
//       return 1;
//     } else if (a[prop] < b[prop]) {
//       return -1;
//     }
//     return 0;
//   };
// }
// array.sort(GetSortOrder('_time'));
// //node.warn(array)

// return msg;