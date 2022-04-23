// const mqtt = require('mqtt')
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
    username: 'test_med',
    password: 'test_med',
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false,
    },
    rejectUnauthorized: false,
  };

  const [selectedTime, setSelectedTime] = useState('0:00');
  // const [client, setClient] = useState(null);
  const [timeConnectStatus, setTimeConnectStatus] = useState('Connect');

  const client = mqtt.connect(url, options);

  const onChange = (time) => {
    const timeString = moment(time).format('HH:mm');
    setSelectedTime(timeString);
  };

  console.log(selectedTime);

  const format = 'HH:mm';

  const obj = selectedTime.split(':');
  const pub = `{ HH: ${obj[0]}, mm: ${obj[1]}}`;

  const context = {
    topic: 'timeset',
    qos: '2',
  };

  context.payload = pub;

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
    if (timeConnectStatus == 'Connected') {
      mqttPublish(context);
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
            value={moment(selectedTime, format)}
            onChange={onChange}
          />
        </Col>
        <Button className='mx-4' type='submit' onClick={handleConnectTime}>
          Set Time
        </Button>
      </Row>
    </Container>
  );
};

export default Mqtttime;
