import mqtt from 'mqtt';
import 'antd/dist/antd.css';
import {
  Card,
  Button,
  Form,
  Input,
  Row,
  Col,
  Container,
  Badge,
} from 'react-bootstrap';

import React, { useEffect, useState } from 'react';
import { Avatar, Chip } from '@material-ui/core';
import GaugeChart from 'react-gauge-chart';
import { TimePicker } from 'antd';
import moment from 'moment';
import { consoleLogger } from '@influxdata/influxdb-client';

const Mqtttime = () => {
  const host = 'broker.emqx.io';
  const port = 8083;

  const url = `ws://${host}:${port}/mqtt`;
  const options = {
    keepalive: 30,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    clientId: `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`,
    username: 'eqmx',
    password: 'public1209',
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false,
    },
    rejectUnauthorized: false,
  };

  const [mselectedTime, msetSelectedTime] = useState('0:00');
  const [aselectedTime, asetSelectedTime] = useState('0:00');
  const [eselectedTime, esetSelectedTime] = useState('0:00');

  const [morning, setMorning] = useState('');
  const [evening, setEvening] = useState('');
  const [afternoon, setAfternoon] = useState('');
  // const [client, setClient] = useState(null);
  const [timeConnectStatus, setTimeConnectStatus] = useState('Connect');

  const client = mqtt.connect(url, options);
  const mcontext = {
    topic: 'MediBoxMorning',
    qos: '2',
  };
  const acontext = {
    topic: 'MediBoxAfternoon',
    qos: '2',
  };
  const econtext = {
    topic: 'MediBoxEvening',
    qos: '2',
  };

  const onChangeMorning = (time) => {
    const timeString = moment(time).format('HH:mm');
    msetSelectedTime(timeString);
    console.log(timeString + ' selected time');
    const obj = timeString.split(':');
    const pub = `{ Hour: ${obj[0]}, Minute: ${obj[1]}}`;
    setMorning(pub);
    console.log(mcontext);
  };

  const onChangeAfternoon = (time) => {
    const timeString = moment(time).format('HH:mm');
    asetSelectedTime(timeString);
    console.log(timeString + ' selected time');
    const obj = timeString.split(':');
    const pub = `{ Hour: ${obj[0]}, Minute: ${obj[1]}}`;
    setAfternoon(pub);
    console.log(acontext);
  };

  const onChangeEvening = (time) => {
    const timeString = moment(time).format('HH:mm');
    esetSelectedTime(timeString);
    console.log(timeString + ' selected time');
    const obj = timeString.split(':');
    const pub = `{ Hour: ${obj[0]}, Minute: ${obj[1]}}`;
    setEvening(pub);
    console.log(econtext);
  };

  const format = 'HH:mm';

  const mqttPublish = (context) => {
    const { topic, qos, payload } = context;
    client.publish(topic, payload, { qos }, (error) => {
      if (error) {
        console.log('Publish error: ', error);
      }
    });
  };

  const handleConnectTime = () => {
    console.log('handle connect was pressed');
    console.log(morning + ' hey this is morn');
    mcontext.payload = morning;
    if (timeConnectStatus == 'Connected') {
      mqttPublish(mcontext);
    }
  };

  const handleConnectTimeAfternoon = () => {
    console.log('handle connect was pressed');
    console.log(morning + ' hey this is morn');
    acontext.payload = afternoon;
    if (timeConnectStatus == 'Connected') {
      mqttPublish(acontext);
    }
  };

  const handleConnectTimeEvening = () => {
    console.log('handle connect was pressed');
    console.log(morning + ' hey this is morn');
    econtext.payload = evening;
    if (timeConnectStatus == 'Connected') {
      mqttPublish(econtext);
    }
  };

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setTimeConnectStatus('Connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setTimeConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
      });
    }
  }, [client]);

  return (
    <Container className='mt-5'>
      <Row className='justify-content-md-center'>
        <Col>
          <TimePicker
            format='HH:mm'
            showNow={false}
            value={moment(mselectedTime, format)}
            onChange={onChangeMorning}
          />
          <Button className='mx-4' type='submit' onClick={handleConnectTime}>
            Set Morning Time
          </Button>
        </Col>
        <Col>
          {' '}
          <TimePicker
            format='HH:mm'
            showNow={false}
            value={moment(aselectedTime, format)}
            onChange={onChangeAfternoon}
          />
          <Button
            className='mx-4'
            type='submit'
            onClick={handleConnectTimeAfternoon}
          >
            Set Afternoon Time
          </Button>
        </Col>
        <Col>
          {' '}
          <TimePicker
            format='HH:mm'
            showNow={false}
            value={moment(eselectedTime, format)}
            onChange={onChangeEvening}
          />
          <Button
            className='mx-4'
            type='submit'
            onClick={handleConnectTimeEvening}
          >
            Set Evening Time
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Mqtttime;
