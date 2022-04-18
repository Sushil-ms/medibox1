import {Form,Badge,Row,Col,Container,Button} from 'react-bootstrap';
import './UserForm.css';
import { useState } from 'react';
import { useHistory, useParam } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ref, child, get, set } from 'firebase/database';
import database from '../../firebase-config';


const UserForm=()=>{

    const initialValues={name:'',age:'',dob:'',email:'',phNumber:'',height:'',weight:'',diagnosis:''};
    const [formValues,setFormValues]=useState(initialValues);
    const [isSubmit,setIsSubmit]=useState(false);

    const history = useHistory();
    
    const handleChange=(e)=>{
        const {id,value}=e.target;
        setFormValues({...formValues,[id]:value});

      
    };

    

    const handleSubmit=(e)=>{
        e.preventDefault();
        setIsSubmit(true);
        
        if(setIsSubmit){

          
          set(ref(database, `PatientData/`), {
            ...formValues,
            
          })
            .then(() => {
              toast.success('data stored');
            })
            .catch((error) => {
              alert('failed');
            });
          setTimeout(() => history.push('/AllUsers'), 500);


        }
    };







    return (
      <div className='UserForm'>
        <h1>
          <Badge bg='secondary'>Add Patient Information</Badge>
        </h1>
        <Container className='mt-5'>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    className='col-4'
                    type='text'
                    value={formValues.name}
                    onChange={handleChange}
                    placeholder='Enter Name'
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='age'>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    className='col-4'
                    type='number'
                    required
                    value={formValues.age}
                    onChange={handleChange}
                    placeholder='Enter Age'
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='dob'>
                  <Form.Label>Date Of Birth</Form.Label>
                  <Form.Control
                    className='col-4'
                    type='date'
                    required
                    value={formValues.dob}
                    onChange={handleChange}
                    placeholder='Enter Date of Birth'
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='email'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className='col-4'
                    type='email'
                    value={formValues.email}
                    onChange={handleChange}
                    placeholder='Enter Email'
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='phNumber'>
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    className='col-4'
                    type='telephonenumber'
                    value={formValues.phNumber}
                    onChange={handleChange}
                    placeholder='Enter Contact Number'
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='height'>
                  <Form.Label>Height</Form.Label>
                  <Form.Control
                    className='col-4'
                    type='number'
                    value={formValues.height}
                    onChange={handleChange}
                    placeholder='Enter Height'
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='weight'>
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    className='col-4'
                    type='number'
                    value={formValues.weight}
                    onChange={handleChange}
                    placeholder='Enter Weight'
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className='mb-3' controlId='diagnosis'>
              <Form.Label>Enter Diagnosis</Form.Label>
              <Form.Control
                as='textarea'
                rows={4}
                value={formValues.diagnosis}
                onChange={handleChange}
              />
            </Form.Group>
            <div
              className='formButton'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button
                size='lg'
                className='mt-3'
                variant='primary'
                type='submit'
              >
                Submit
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    );



};

export default UserForm;
