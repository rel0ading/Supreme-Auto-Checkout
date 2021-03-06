import React, { PropTypes } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {
  TextField,
  Toggle,
  DatePicker,
  SelectField,
  } from 'redux-form-material-ui';
import MenuItem from 'material-ui/MenuItem';
import Styles from '../../constants/Styles';
import * as Validators from '../../constants/FormValidators';
import * as menus from '../../constants/Menus';
import * as SupremeUtils from '../../utils/SupremeUtils';

const defaultValues = {
  autoCheckout: false,
  autoPay: false,
  strictSize: true,
  hideSoldOut: false,
  captchaBypass: false,
  addToCartDelay: 200,
  checkoutDelay: 2000,
};

const Options = props => {
  const { handleSubmit, pristine, submitting, atcEnabled, change } = props;
  return (
    <form onSubmit={handleSubmit} id="options-form">
      <div>
        <Field
          name="autoCheckout"
          component={Toggle}
          label="Enable auto checkout"
          style={Styles.fields.text}
          onChange={(e, v) => {
            if (!v) {
              change('atcEnabled', false);
            }
          }}
        />
      </div>

      <div>
        <Field
          name="autoPay"
          component={Toggle}
          label="Enable auto payment"
          style={Styles.fields.text}
        />
      </div>

      <div>
        <Field
          name="strictSize"
          component={Toggle}
          label="Enable strict size checking"
          style={Styles.fields.text}
        />
      </div>

      <div>
        <Field
          name="hideSoldOut"
          component={Toggle}
          label="Hide sold out products"
          style={Styles.fields.text}
        />
      </div>

      <div>
        <Field
          name="captchaBypass"
          component={Toggle}
          label="Bypass captcha (beta)"
          style={Styles.fields.text}
        />
      </div>
      <div>
      <Field
        name="atcUseMonitor"
        component={Toggle}
        label="Use product monitor for AutoCop and Buy Now button (Japan recommended)"
        style={Styles.fields.text}
      />
      </div>
      <div>
        <Field
          name="atcEnabled"
          component={Toggle}
          label="Enable AutoCop (Autocheckout required)"
          style={Styles.fields.text}
          onChange={(e, v) => {
            if (v) {
              change('autoCheckout', true);
            }
          }}
        />
      </div>

      {
        atcEnabled &&
          <div>
            <Field
              name="atcStartTime"
              component={TextField}
              floatingLabelText="ATC Start time (hh:mm:ss) 24hour format"
              hintText="ATC Start time"
              style={Styles.fields.text}
              validate={[Validators.required, Validators.time24]}
            />
            <Field
              name="atcStartDate"
              component={DatePicker}
              floatingLabelText="ATC Start date"
              hintText="ATC Start date"
              style={Styles.fields.text}
              textFieldStyle={Styles.fields.text}
              validate={[Validators.required]}
            />
          </div>
      }
      <div>
        <Field
          name="onCartSoldOut"
          component={SelectField}
          label="Action when out of stock in cart..."
          floatingLabelText="Action when out of stock in cart..."
          hintText="Action when out of stock in cart..."
          style={Styles.fields.text}
          validate={Validators.required}
        >
          <MenuItem key={SupremeUtils.OnSoldOutCartActions.REMOVE_SOLD_OUT_PRODUCTS} value={SupremeUtils.OnSoldOutCartActions.REMOVE_SOLD_OUT_PRODUCTS} primaryText={'Remove sold out products'} />
          <MenuItem key={SupremeUtils.OnSoldOutCartActions.STOP} value={SupremeUtils.OnSoldOutCartActions.STOP} primaryText={'Stop auto-checkout'} />
        </Field>
      </div>
      <div>
        <Field
          name="addToCartDelay"
          component={TextField}
          floatingLabelText="Add to cart delay (ms)"
          hintText="Add to cart delay (ms)"
          style={Styles.fields.text}
          validate={[Validators.required, Validators.number]}
        />
      </div>

      <div>
        <Field
          name="checkoutDelay"
          component={TextField}
          floatingLabelText="Checkout delay (ms)"
          hintText="Checkout delay (ms)"
          style={Styles.fields.text}
          validate={[Validators.required, Validators.number]}
        />
      </div>

      <div>
        <Field
          name="maxPrice"
          component={TextField}
          floatingLabelText="Maximum product price"
          hintText="Maximum product price"
          style={Styles.fields.text}
          validate={[Validators.required, Validators.number]}
        />
      </div>

      <div>
        <Field
          name="minPrice"
          component={TextField}
          floatingLabelText="Minimum product price"
          hintText="Minimum product price"
          style={Styles.fields.text}
          validate={[Validators.required, Validators.number]}
        />
      </div>

      <div>
        <RaisedButton
          label="Save"
          disabled={pristine || submitting}
          type="submit"
        />
      </div>
    </form>
  );
};

const OptionsForm = reduxForm({
  form: 'options',
})(Options);

const selector = formValueSelector('options');

function mapStateToProps(state, ownProps) {
  const currentProfile = state.profiles.currentProfile;
  const settings = state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
  const initialValues = Object.assign({}, defaultValues, (settings[ownProps.shop] || {})[menus.MENU_OPTIONS] || {});
  if (initialValues['atcStartDate'] && initialValues['atcStartDate'] !== 'Invalid Date') {
    initialValues['atcStartDate'] = new Date(initialValues['atcStartDate']);
  }
  return {
    initialValues,
    atcEnabled: selector(state, 'atcEnabled'),
  };
}

Options.propTypes = {
  shop: PropTypes.string.isRequired,
};


export default connect(mapStateToProps)(OptionsForm);
