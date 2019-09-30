import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import InfoImage from '../assets/plantilla-podoscopio.jpg';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './ImageModal.css';

export default class ImageModal extends Component {
  render() {
    return (
      <Card>
        <CardContent>
          <Grid className='gridWaiting'
            container
            spacing={4}
            direction="column"
            alignItems="center"
            justify="space-around" >
            <Grid item xs={12}>
              <img src={InfoImage} className='infoImage' />

            </Grid>
            <Grid item xs={12}>
              <Button
                size="small"
                color="primary"
                // className='createUserActionButtons'
                onClick={this.props.toggleModal}
              >
                OK
              </Button>

            </Grid>

          </Grid>
        </CardContent>
      </Card>
    );
  }
}


ImageModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};