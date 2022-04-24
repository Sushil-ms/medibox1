import {Navbar,Container,Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {LinkContainer} from 'react-router-bootstrap';


const Navigation=()=>{




    return (
      <Navbar bg='dark' variant='dark'>
        <Container>
          <LinkContainer to='/Home'>
            <Navbar.Brand>MediBox-IOT</Navbar.Brand>
          </LinkContainer>
          <Nav className='mr-auto'>
            <LinkContainer to='/AddUser'>
              <Nav.Link>Add Patients</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/AllUsers'>
              <Nav.Link>All Patients</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/Appointments'>
              <Nav.Link>Appointments</Nav.Link>
            </LinkContainer>
          </Nav>
        </Container>
      </Navbar>
    );

}


export default Navigation;
