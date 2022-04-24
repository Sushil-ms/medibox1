import { useEffect, useState } from 'react';
import { db } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import {
  Form,
  Badge,
  Row,
  Col,
  Container,
  Button,
  Table,
} from 'react-bootstrap';

const Appointments = () => {
  const [appointment, setAppointment] = useState([]);

  // const getNotes = async () => {
  // const notesSnapshot = await getDocs(collection(db, 'Appointment'));
  // const notesList = notesSnapshot.docs.map((doc) => doc.data());

  useEffect(() => {
    // const appointmentData = getNotes();
    // console.log(appointmentData);
    getNotes();
    // if (appointmentData) {
    //   const appointmentList = notesSnapshot.docs.map((doc) => doc.data());
    //   setAppointment((oldArray) => [...oldArray, appointmentData]);
    // }
  }, []);

  const getNotes = async () => {
  const querySnapshot = await getDocs(collection(db, 'Appointment'));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, ' => ', doc.data());
    setAppointment((oldArray) => [...oldArray, doc.data()]);
  });

  }

  console.log(appointment);

  return (
    <div className='container mt-5'>
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
          </tr>
        </thead>
        <tbody>
          {appointment.map((app, id) => {
            return (
              <tr key={id + 1}>
                <td>{id + 1}</td>
                <td>{app.Name}</td>
                <td>{app.Email}</td>
                <td>{app.phNumber}</td>
                <td>{app.Date}</td>
                <td>{app.Time}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Appointments;
