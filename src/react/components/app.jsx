import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import NavBar from './navbar.jsx';
import Profile from './profile/edit_profile.jsx';
import { AddClient, EditClient, Clients } from './clients';
import { Packs, AddPack, EditPack } from './packages';
import { Teachers, AddTeacher, EditTeacher } from './teachers';
import { Schedules, AddSchedule, EditSchedule } from './schedules'
import Subjects from './subjects/show_subjects.jsx';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar history={this.props.history}/>
        <div className='page-content'>
          <Route path='/profile' component={Profile}/>

          <Route path='/clients' component={Clients}/>
          <Route path='/add_client' component={AddClient}/>
          <Route path='/edit_client/:id' component={EditClient}/>

          <Route path='/packages' component={Packs}/>
          <Route path='/add_package' component={AddPack}/>
          <Route path='/edit_package/:id' component={EditPack}/>

          <Route path='/teachers' component={Teachers}/>
          <Route path='/add_teacher' component={AddTeacher}/>
          <Route path='/edit_teacher/:id' component={EditTeacher}/>

          <Route path='/schedules' component={Schedules}/>
          <Route path='/add_schedule' component={AddSchedule}/>
          <Route path='/edit_schedule/:id' component={EditSchedule}/>

          <Route path='/subjects' component={Subjects}/>
        </div>
      </div>
    );
  }
}

export default App;
