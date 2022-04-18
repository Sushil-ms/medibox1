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
          
            <Route path='/AddMedication' component={AddMedication}></Route>
            <Route path='/View'>
              <View />
            </Route>
            <Route path='/Edit'>
              <Edit />
            </Route>
        
        </Switch>
      </div>
    </Router>
  );
}

export default App;
