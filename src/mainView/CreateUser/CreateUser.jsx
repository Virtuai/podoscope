import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CreateUser.css';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import PhoneIcon from '@material-ui/icons/Phone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { postUser, genericGet } from '../utils/requestsManager';
import { formatDate, formatSex } from '../utils/valueFormater';

export default class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      secondName: '',
      firstSurname: '',
      secondSurname: '',
      phoneNumber: '',
      email: '',
      selectedDate: new Date('1990-01-01T21:11:54'),
      sex: 'OTHER',
      cedula: '',

      waiting: false
    };
    this.handleSexChange = this.handleSexChange.bind(this);
    this.createUser = this.createUser.bind(this);
    this.renderCreateCard = this.renderCreateCard.bind(this);
    this.renderWait = this.renderWait.bind(this);
    this.showUser = this.showUser.bind(this);
    this.confirmSave = this.confirmSave.bind(this);
  }

  handleSexChange(event) {
    console.log(event.target);
    this.setState(
      { sex: event.target.value }
    );
  }

  createUser() {
    this.setState({ waiting: true }, () => {
      genericGet(`/users/${this.state.cedula}`,
        (data) => {
          if (data.length > 0) {
            this.setState({ waiting: false, dialogOpen: true });
          }
          else {
            this.confirmSave();
          }
        },
        () => {
          console.log('error!!!');
          this.setState({ waiting: false });
        });
    });
  }

  renderCreateCard() {
    const makeTextField = (attr, id, label, adornment = {}) => {
      const makeAdornment = (adornment) => {
        return adornment
          ? {
            endAdornment: (
              <InputAdornment position="end">
                {adornment}
              </InputAdornment>
            )
          }
          : {};
      };
      return (
        <Grid item xs={5}>
          <TextField
            id={id}
            label={label}
            value={this.state[attr]}
            onChange={(x) => {
              const nState = {};
              nState[attr] = x.target.value;
              this.setState(nState);
            }}
            margin="normal"
            InputProps={makeAdornment(adornment)} />
        </Grid>
      );
    };

    return (
      <Card >
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Create new user
          </Typography>
          <form
            noValidate
            autoComplete="off">
            <Grid container spacing={1} justify='space-around' >
              {makeTextField('firstName', 'first-name', 'First name')}
              {makeTextField('secondName', 'second-name', 'Second name')}
              {makeTextField('firstSurname', 'first-surname', 'First surname')}
              {makeTextField('secondSurname', 'second-surname', 'Second surname')}

              {makeTextField('cedula', 'cedula', 'Cedula', <AccountCircle />)}
              {makeTextField('cellphone', 'cellphone', 'Cellphone', <PhoneIcon />)}

              <Grid item xs={5} >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Date picker dialog"
                    format="MM/dd/yyyy"
                    value={this.state.selectedDate}
                    onChange={(x) => this.setState({ selectedDate: x })}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={5} className='formGrid'>
                <FormControl className='formControl'>
                  <InputLabel htmlFor="sex-selector">Sex</InputLabel>
                  <Select
                    value={this.state.sex}
                    onChange={this.handleSexChange}
                    inputProps={{
                      name: 'sex',
                      id: 'sex-selector',
                    }}
                    autoWidth>
                    <MenuItem value={'MALE'}>Male</MenuItem>
                    <MenuItem value={'FEMALE'}>Female</MenuItem>
                    <MenuItem value={'OTHER'}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {makeTextField('email', 'email', 'Email', <MailOutlineIcon />)}
            </Grid>
          </form >
        </CardContent>
        <CardActions >
          <Button size="small" color="secondary" onClick={this.props.toggleModal}>
            Cancel
          </Button>
        </CardActions>
      </Card>);
  }

  renderWait() {
    return (
      <Card className='waitingCard'>
        <Grid className='gridWaiting'
          container
          spacing={4}
          direction="column"
          alignItems="center"
          justify="space-around" >
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" align='center'>
              Creating user...
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        </Grid>
      </Card >
    );
  }

  showUser() {
    this.props.setUser({
      name: [this.state.firstName, this.state.secondName, this.state.firstSurname, this.state.secondSurname].join(' '),
      cedula: this.state.cedula,
      cellphone: this.state.phoneNumber,
      email: this.state.email,
      dob: formatDate(this.state.selectedDate),
      sex: formatSex(this.state.sex),
      waiting: false,
      dialogOpen: false
    });

    //close modal
    this.props.toggleModal();
  }

  confirmSave() {
    this.setState({ waiting: true, dialogOpen: false }, () => {
      postUser(this.state,
        //if succesfull
        () => {
          this.showUser();
        },
        //on error
        () => {
          console.log('error!!');
          //return to create user
          this.setState({ waiting: false });
        });
    });
  }

  render() {
    return (
      <>
        {!this.state.waiting ? this.renderCreateCard() : this.renderWait()}
        <Dialog
          open={this.state.dialogOpen}
          onClose={() => this.setState({ dialogOpen: false })}
          aria-labelledby="draggable-dialog-title">
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Ya existe un usuario con la cédula dada.
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Desea sobreescribir la información del usuario?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.showUser} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.confirmSave} color="primary">
              Sobreescribir
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

CreateUser.propTypes = {
  toggleModal: PropTypes.func,
  setUser: PropTypes.func
};
