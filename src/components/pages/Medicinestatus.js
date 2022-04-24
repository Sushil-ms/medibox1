import { useState, useEffect } from 'react';
import DataTable from '../UI/Table';
import { Form, Badge, Row, Col, Container, Button } from 'react-bootstrap';
import { token, org, bucket, url } from '../../influx-config';
import { InfluxDB } from '@influxdata/influxdb-client';
import Paper from '@mui/material/Paper';
import Chart from '../UI/Chart';
import Grid from '@material-ui/core/Grid';

const Medicinestatus = () => {
  const [influxData, setInfluxData] = useState([]);
  const [chartdata, setChartData] = useState([]);

  let query = `  from(bucket: "MediBox")
  |> range(start: -1d)
  |> filter(fn: (r) => r["_measurement"] == "medicinestatus")
  |> filter(fn: (r) => r["_field"] == "stringdd")
  |> group (columns: ["temp"])   // all durations - each jobname has its table                      // each table has only the last value
  |> drop (columns: ["_start", "_stop"])
  |> map(fn: (r) => ({ r with _field: r.temp}))   // hack: transfer the tag-name
  |> limit (n: 10)                      // Now there is only ONE table
  |> group(columns: ["_time"], mode:"by")
  |> sort(columns: ["_time"], desc: false)`;

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

          // //variable is used to track if the current ID already has a key
          var exists = false;

          // //nested for loops aren’t ideal, this could be optimized but gets the job done
          for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < finalData.length; j++) {
              //check if the sensor ID is already in the array, if true we want to add the current data point to the array
              if (res[i]['date'] === finalData[j]['id']) {
                exists = true;

                let point = {};
                point['x'] = res[i]['_time'];
                point['y'] = res[i]['_value'];
                finalData[j]['data'].push(point);
              }
            }
            //if the ID does not exist, create the key and append first data point to array
            if (!exists) {
              let d = {};
              d['id'] = res[i]['date'];
              d['data'] = [];
              let point = {};
              point['x'] = res[i]['_time'];
              point['y'] = res[i]['_value'];
              d['data'].push(point);
              finalData.push(d);
            }
            //need to set this back to false
            exists = false;
          }

          setChartData(finalData);

          setInfluxData(res);
        },
        error(error) {
          console.log('query failed- ', error);
        },
      });
    };

    influxQuery();
  }, []);

  console.log(chartdata);

  return (
    <Container className='mt-5'>
      <h1>
        <Badge bg='secondary' className='mb-3'>
          Medicine Status{' '}
        </Badge>
      </h1>

      <Grid container spacing={12}>
        <Grid item xs={12} md={12}>
          <DataTable data={influxData} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Medicinestatus;
