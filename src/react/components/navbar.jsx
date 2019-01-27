import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {pathname} = this.props.history.location;
    return (
        <div className="topbar">
          <div className="topbar-left">
            <Link to='/profile' className="brand-name">
              <div>
                <img src='logo.png' className='logo' />
                MyTutor Center
              </div>
            </Link>
          </div>
          <div className="topbar-right">
            <ul>
              <li className={pathname.includes('client')?'link-active':''}><Link to='/clients'>Clients</Link></li>
              <li className={pathname.includes('teacher')?'link-active':''}><Link to='/teachers'>Teachers</Link></li>
              <li className={pathname.includes('subject')?'link-active':''}><Link to='/subjects'>Subjects</Link></li>
              <li className={pathname.includes('schedule')?'link-active':''}><Link to='/schedules'>Schedules & Invoice</Link></li>
              <li className={pathname.includes('package')?'link-active':''}><Link to='/packages'>Packages</Link></li>
            </ul>
          </div>
        </div>
    );
  }
}

export default NavBar;
