import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { ModalProps } from 'components/common/modal';
import { Button } from 'components/common';
import { Form, Input } from 'components/forms';
import { useRegister } from 'store/user/actions';
import { AuthRegisterRequest } from 'api/auth/types';
import { FieldValidator } from 'utils/validation';

import { AUTH_PAGES } from '../../constants';

const { login, register } = AUTH_PAGES;
const repeatPasswordValidator: FieldValidator<string, AuthRegisterRequest>[] = [
  (value, { password }) => {
    if (value !== password) {
      return 'Passwords do not match';
    }
  },
];

const modalProps: ModalProps = {
  initiallyOpen: true,
  heading: (
    <div className="sec-register-heading">
      <div className="text">Please enter your details below:</div>

      <Link to={login.path}>
        <Button color="secondary" size="small">
          {login.buttonLabel}
        </Button>
      </Link>
    </div>
  ),
  closable: false,
  width: 550,
};

export const RegisterPage: FC = () => (
  <Form
    onSubmit={useRegister()}
    buttonLabel={register.buttonLabel}
    className="sec-register-page"
    modalProps={modalProps}
  >
    <div className="input-wrapper">
      <Input name="name" label="Name" required />
    </div>

    <div className="input-wrapper">
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="asvasd"
        className="asdbvds"
        required
      />
    </div>

    <div className="input-wrapper">
      <Input name="password" type="password" label="Password" minLength={8} required />
    </div>

    <div className="input-wrapper">
      <Input
        name="repeatPassword"
        type="password"
        label="Repeat password"
        validators={repeatPasswordValidator}
      />
    </div>
  </Form>
);
