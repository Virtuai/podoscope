import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

export default class MyObservations extends Component {

  constructor(props) {
    super(props);
    this.state = { obs: '' };
  }

  resetInfo(userObs = '') {
    this.setState({ obs: userObs });
  }

  setObservation(newobs){
    this.setState({obs:newobs});
  }

  

  render() {
    return (
      <form
        // className={classes.container} 
        noValidate
        autoComplete="off">
        <TextField
          id="observations"
          label="Observations"
          // className={classes.textField}
          value={this.state.obs}
          onChange={(e) => this.setState({ obs: e.target.value })}
          margin="normal"
          fullWidth={true}
          multiline={true}
          rows={3}
          variant='filled'
          inputRef={this.props.obsRef}
        />
      </form>
    );
  }
}

MyObservations.propTypes = {
  obsRef: PropTypes.any
};
