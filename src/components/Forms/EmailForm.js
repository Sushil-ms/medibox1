import React from 'react';
import { Form, Badge, Row, Col, Container, Button } from 'react-bootstrap';
import './UserForm.css';
import { useState } from 'react';
import { useHistory, useParam } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ref, child, get, set } from 'firebase/database';
import database from '../../firebase-config';
import { send } from 'emailjs-com';

const EmailForm = () => {
  const initialValues = {
    from_name: '',
    to_name: '',
    message: '',
    to_email: '',
    reply_to: '',
    to_cc:''
  };
  const [toSend, setToSend] = useState(initialValues);

  const onSubmit = (e) => {
    e.preventDefault();
    send('service_pfsfmdh', 'template_ns2jgce', toSend, 'gdL3hT6XdF0hq6bfW')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setToSend(initialValues);
      })
      .catch((err) => {
        console.log('FAILED...', err);
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setToSend({ ...toSend, [id]: value });
  };

  return (
    <Container className='mt-5'>
      <Form onSubmit={onSubmit}>
        <Row>
          <Col>
            <Form.Group className='mb-3' controlId='from_name'>
              <Form.Label>Doctor Name</Form.Label>
              <Form.Control
                className='col-4'
                type='text'
                onChange={handleChange}
                name='from_name'
                placeholder='Enter From Name'
                value={toSend.from_name}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId='to_name'>
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                className='col-4'
                type='text'
                required
                value={toSend.to_name}
                onChange={handleChange}
                placeholder='Enter To Name'
              />
            </Form.Group>
          </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className='mb-3' controlId='to_email'>
                <Form.Label>Patient Email</Form.Label>
                <Form.Control
                  className='col-4'
                  type='text'
                  required
                  value={toSend.to_email}
                  onChange={handleChange}
                  placeholder='Enter To Email'
                />
              </Form.Group>
              </Col>
              <Col>
              <Form.Group className='mb-3' controlId='to_cc'>
                <Form.Label>Care Taker Email</Form.Label>
                <Form.Control
                  className='col-4'
                  type='text'
                  required
                  value={toSend.to_cc}
                  onChange={handleChange}
                  placeholder='Enter To Email'
                />
              </Form.Group>
            </Col>
          </Row>
        
        <Row>
          <Col md={4}>
            <Form.Group className='mb-3' controlId='reply_to'>
              <Form.Label>Doctor's Email</Form.Label>
              <Form.Control
                className='col-4'
                type='email'
                value={toSend.reply_to}
                onChange={handleChange}
                placeholder='Email'
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className='mb-3' controlId='message'>
          <Form.Label>Enter Message</Form.Label>
          <Form.Control
            as='textarea'
            rows={4}
            value={toSend.message}
            onChange={handleChange}
            placeholder='Your Message'
          />
        </Form.Group>
        <div
          className='formButton'
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button size='lg' className='mt-3' variant='primary' type='submit'>
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EmailForm;
