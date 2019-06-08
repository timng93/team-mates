import React, {Component, Fragment} from "react";
import {Meteor} from "meteor/meteor";
import {Groups} from "../../../api/groups";
import {withTracker} from "meteor/react-meteor-data";
import {
  Typography,
  Paper,
  Chip,
  Button,
  FormControl,
  TextField
} from "@material-ui/core";
import {Link} from "react-router-dom";
import {Form, Field} from "react-final-form";
import styles from "./styles";
import {withStyles} from "@material-ui/core/styles";

class ProfileCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
  }

  onSubmit = (values, err) => {
    if (this.state.isEditing) {
      Meteor.users.update(this.props.currentUserId, {
        $set: {
          username: values.username,
          email: values.email
        }
      });
      if (err) {
        console.log(err);
      }
    } else {
      null;
    }
  };
  render() {
    const {isEditing} = this.state;
    const {classes, currentUser} = this.props;
    return (
      <div>
        {isEditing ? (
          <Form
            onSubmit={(values, err) => this.onSubmit(values, err)}
            render={({
              handleSubmit,
              form,
              submitting,
              pristine,
              hasValidationErrors,
              hasSubmitErrors,
              submitError
            }) => {
              return (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                >
                  <FormControl>
                    <Field
                      name="email"
                      render={({input, meta}) => (
                        <div>
                          <TextField
                            {...input}
                            autoComplete="off"
                            label="Email"
                            type="email"
                            name="email"
                            margin="normal"
                            variant="outlined"
                          />
                        </div>
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Field
                      name="username"
                      render={({input, meta}) => (
                        <TextField
                          {...input}
                          autoComplete="off"
                          label="Username"
                          type="username"
                          name="username"
                          margin="normal"
                          variant="outlined"
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <Button
                      type="submit"
                      variant="contained"
                      size="medium"
                      disabled={submitting || pristine || hasValidationErrors}
                    >
                      {this.state.isEditing ? "Save" : "Edit"}
                    </Button>
                  </FormControl>
                </form>
              );
            }}
          />
        ) : (
          <Fragment>
            <Paper className={classes.profile}>
              <div className={classes.profileInfo}>
                <Typography className={classes.pageTitle}>
                  My Profile
                </Typography>
                <Chip
                  label={`Username - ${currentUser.username}`}
                  className={classes.chip}
                  variant="outlined"
                />
                <Chip
                  label={`Email - ${currentUser.emails[0].address}`}
                  className={classes.chip}
                  variant="outlined"
                />
              </div>
            </Paper>
            <Typography>
              <button
                type="button"
                onClick={() => {
                  this.setState({
                    isEditing: !isEditing
                  });
                }}
              >
                {this.state.isEditing ? "Save" : "Edit"}
              </button>
            </Typography>
          </Fragment>
        )}
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("groups");

  return {
    groups: Groups.find().fetch(),
    currentUser: Meteor.user(),
    currentUserId: Meteor.userId()
  };
})(withStyles(styles)(ProfileCard));
