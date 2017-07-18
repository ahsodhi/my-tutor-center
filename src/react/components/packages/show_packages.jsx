import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Heading from '../heading.jsx';
import GetRequest from '../../utils/get_request';
import FormRequest from '../../utils/form_request';

class Packs extends Component {
  constructor(props) {
    super(props);
    this.state = { packages: [] };
  }
  componentDidMount() {
    GetRequest('/api/packages', (response) => {
      this.setState({ packages: response.data });
    });
  }
  removePackageRequest(packageId) {
    FormRequest('DELETE', {}, '/api/packages/' + packageId, (response) => {
      if (response.success) {
        this.setState({
          packages: this.state.packages.filter((elem) => elem._id != response.data._id)
        });
      }
    });
  }
  renderPackages() {
    const packPeriod = ['Weekly','Monthly'];
    const html = this.state.packages.map((pack, index) => {
      return (
        <tr key={pack._id}>
          <td>{pack.name}</td>
          <td>{`$${pack.price}`}</td>
          <td>{packPeriod[parseInt(pack.period)]}</td>
          <td>{pack.grades ? Math.min(...pack.grades) + '-' + Math.max(...pack.grades) : ''}</td>
          <td>
            <Link to={`/edit_package/${pack._id}`} className='btn btn-warning edit-button'>Edit</Link>&nbsp;
            <button onClick={this.removePackageRequest.bind(this, pack._id)} className='btn btn-danger'>Remove</button>
          </td>
        </tr>
      );
    });
    return html;
  }
  render() {
    return (
      <div>
        <Heading text='Packages'/>
        <Link to='/add_package'><button className='btn btn-default'>Add Package</button></Link>
        {
          this.state.packages.length == 0 ?
          <h4><i>No packages added</i></h4> :
          <table className='table-hover page-content'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Period</th>
                <th>Grades</th>
              </tr>
            </thead>
            <tbody>
              {this.renderPackages()}
            </tbody>
          </table>
        }
      </div>
    );
  }
}

export default Packs;
