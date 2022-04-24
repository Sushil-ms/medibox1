import AddUser from './components/pages/AddUser';
import Navigation from './components/UI/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AllUsers from './components/pages/AllUsers';
import ReactDOM from 'react-dom';
import Home from './components/pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddMedication from './components/pages/AddMedication';
import Edit from './components/pages/Edit';
import View from './components/pages/View';
import Bpm from './components/pages/Bpm';
import Temperature from './components/pages/Temperature';
import Medicinestatus from './components/pages/Medicinestatus'
import Spo2 from './components/pages/Spo2';
import AddMedication1 from './components/pages/AddMedication1';
import Mqtt from './components/pages/Mqtt';
import Mqtttime from './components/pages/Mqtttime';
import EmailForm from './components/Forms/EmailForm';
import Appointments from './components/pages/Appointments';



function App() {
  return (
    <Router>
      <div className='App'>
        <Navigation />
        <ToastContainer position='top-center' />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/AllUsers' component={AllUsers} />
          <Route path='/addUser' component={AddUser} />

          <Route path='/addmed'>
            <AddMedication1 />
          </Route>
          {/* <Route path='/AddMedication' component={AddMedication}></Route> */}
          <Route path='/View'>
            <View />
          </Route>
          <Route path='/Edit'>
            <Edit />
          </Route>
          <Route path='/bpm'>
            <Bpm />
          </Route>
          <Route path='/temperature'>
            <Temperature />
          </Route>
          <Route path='/medicinestatus'>
            <Medicinestatus />
          </Route>
          <Route path='/spo2'>
            <Spo2 />
          </Route>
          <Route exact path='/addmed'>
            <AddMedication1 />
          </Route>
          <Route exact path='/mqtt'>
            <Mqtt />
          </Route>
          <Route exact path='/timeset'>
            <Mqtttime />
          </Route>
          <Route exact path='/email'>
            <EmailForm />
          </Route>
          <Route exact path='/Appointments'>
            <Appointments />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
