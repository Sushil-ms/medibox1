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

// connection option

const Mqtt = () => {
  const tempinitalValue = {
    ObjectTemp: 0,
    AmbientTemp: 0,
  };
  const bpminitalValue = {
    BPM: 0,
    SpO2: 0,
  };
  const [tempclient, setTempClient] = useState(null);
  const [bpmclient, setBpmClient] = useState(null);
  const [tempconnectStatus, setTempConnectStatus] = useState('Connect');
  const [bpmconnectStatus, setBpmConnectStatus] = useState('Connect');
  const [tempinfo, setTempInfo] = useState(tempinitalValue);
  const [bpminfo, setBpmInfo] = useState(bpminitalValue);

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
    username: 'emqx',
    password: 'public120',
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false,
    },
    rejectUnauthorized: false,
  };

  const record1 = {
    topic: 'Medibox/MLX90614Json',
    qos: 0,
  };

  const record2 = {
    topic: 'Medibox/MAX30100Json',
    qos: 0,
  };

  const handleConnectTemp = () => {
    console.log('handle connect was pressed');
    setTempConnectStatus('Connecting');
    setTempClient(mqtt.connect(url, options));
    console.log('hi');
    if (tempconnectStatus === 'Connected') {
      console.log('hi');
      if (tempclient) {
        const { topic, qos } = record1;
        tempclient.subscribe(topic, { qos }, (error) => {
          if (error) {
            console.log('Subscribe to topics error', error);
            return;
          }
          console.log('subscribed');
        });
      }
    }
  };

  const handleDisconnectTemp = () => {
    if (tempclient) {
      tempclient.end(() => {
        setTempConnectStatus('Connect');
        setTempInfo(tempinitalValue);
      });
    }
  };

  const handleConnectBpm = () => {
    console.log('handle connect was pressed');
    setBpmConnectStatus('Connecting');
    setBpmClient(mqtt.connect(url, options));
    console.log('hi');
    if (bpmconnectStatus === 'Connected') {
      console.log('hi');
      if (bpmclient) {
        const { topic, qos } = record2;
        bpmclient.subscribe(topic, { qos }, (error) => {
          if (error) {
            console.log('Subscribe to topics error', error);
            return;
          }
          console.log('subscribed');
        });
      }
    }
  };

  const handleDisconnectBpm = () => {
    if (bpmclient) {
      bpmclient.end(() => {
        setBpmConnectStatus('Connect');
        setBpmInfo(bpminitalValue);
      });
    }
  };

  useEffect(() => {
    if (tempclient) {
      tempclient.on('connect', () => {
        setTempConnectStatus('Connected');
      });
      tempclient.on('error', (err) => {
        console.error('Connection error: ', err);
        tempclient.end();
      });
      tempclient.on('reconnect', () => {
        setTempConnectStatus('Reconnecting');
      });
      tempclient.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        console.log(payload.message);
        const info = JSON.parse(payload.message);
        setTempInfo({ ...info });
      });
    }
  }, [tempclient]);

  useEffect(() => {
    if (bpmclient) {
      bpmclient.on('connect', () => {
        setBpmConnectStatus('Connected');
      });
      bpmclient.on('error', (err) => {
        console.error('Connection error: ', err);
        bpmclient.end();
      });
      bpmclient.on('reconnect', () => {
        setBpmConnectStatus('Reconnecting');
      });
      bpmclient.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        console.log(payload.message);
        const info = JSON.parse(payload.message);
        setBpmInfo({ ...info });
      });
    }
  }, [bpmclient]);

  const onChange = () => {};

  const [timevalue, setOnChange] = useState('10:00');
  const format = 'HH:mm';

  const timeSelect = (time) => {
    setOnChange(time._i);
    console.log(time._i);
  };

  return (
    <Container className='mt-5'>
      <Row>
        <Row>
          <Col md={4} lg={6}>
            <h2>
              <Badge bg='secondary' className='mb-3'>
                Body Temperature{' '}
              </Badge>
            </h2>
            <GaugeChart
              id='gauge-chart5'
              nrOfLevels={700}
              textColor='#000000'
              arcsLength={[0.5, 0.5, 0.5]}
              colors={['#5BE12C', '#F5CD19', '#EA4228']}
              formatTextValue={() => tempinfo.ObjectTemp + ' °C'}
              percent={
                tempinfo.ObjectTemp != 0 ? +tempinfo.ObjectTemp / 100 - 0.3 : 0
              }
              arcPadding={0.02}
            />
          </Col>
          <Col md={4} lg={6}>
            <h2>
              <Badge bg='secondary' className='mb-3'>
                Ambient Temperature{' '}
              </Badge>
            </h2>
            <GaugeChart
              id='gauge-chart5'
              nrOfLevels={700}
              textColor='#000000'
              arcsLength={[0.5, 0.5, 0.5]}
              colors={['#5BE12C', '#F5CD19', '#EA4228']}
              formatTextValue={() => tempinfo.AmbientTemp + ' °C'}
              percent={
                tempinfo.AmbientTemp != 0
                  ? +tempinfo.AmbientTemp / 100 - 0.3
                  : 0
              }
              arcPadding={0.02}
            />
          </Col>
        </Row>
        <Row>
          <Col className='mt-5'>
            {/* <Chip avatar={<Avatar>Temp</Avatar>} label={info.message1}></Chip> */}

            <Button className='mx-4' type='submit' onClick={handleConnectTemp}>
              {tempconnectStatus}
            </Button>
            <Button
              className='mx-4'
              type='submit'
              onClick={handleDisconnectTemp}
            >
              Disconnect
            </Button>
          </Col>
        </Row>
      </Row>
      <Row className='justify-content-md-center mt-5'>
        <Row>
          <Col md={4} lg={6}>
            <h2>
              <Badge bg='secondary' className='mb-3'>
                Heart Rate{' '}
              </Badge>
            </h2>
            <GaugeChart
              id='gauge-chart5'
              nrOfLevels={700}
              textColor='#000000'
              arcsLength={[0.5, 0.5, 0.5]}
              colors={['#5BE12C', '#F5CD19', '#EA4228']}
              formatTextValue={() => bpminfo.BPM + ' BPM'}
              percent={bpminfo.BPM != 0 ? +bpminfo.BPM / 100 - 0.3 : 0}
              arcPadding={0.02}
            />
          </Col>
          <Col md={4} lg={6}>
            <h2>
              <Badge bg='secondary' className='mb-3'>
                SpO2{' '}
              </Badge>
            </h2>
            <GaugeChart
              id='gauge-chart5'
              nrOfLevels={700}
              textColor='#000000'
              arcsLength={[0.5, 0.5, 0.5]}
              colors={['#5BE12C', '#F5CD19', '#EA4228']}
              formatTextValue={() => bpminfo.SpO2 + '  %'}
              percent={bpminfo.SpO2 != 0 ? +bpminfo.SpO2 / 100 - 0.3 : 0}
              arcPadding={0.02}
            />
          </Col>
        </Row>
        <Row>
          <Col className='mt-5'>
            {/* <Chip avatar={<Avatar>Bpm</Avatar>} label={info.message1}></Chip> */}
            <Button className='mx-4' type='submit' onClick={handleConnectBpm}>
              {bpmconnectStatus}
            </Button>
            <Button
              className='mx-4'
              type='submit'
              onClick={handleDisconnectBpm}
            >
              Disconnect
            </Button>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Mqtt;
