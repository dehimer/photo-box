import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const EmailDialog = ({ open, handleClose }) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Send photo</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Email Address"
        type="email"
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleClose} color="primary">
        Send
      </Button>
    </DialogActions>
  </Dialog>
);


EmailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  handleClose: PropTypes.func.isRequired
};

export default EmailDialog;
