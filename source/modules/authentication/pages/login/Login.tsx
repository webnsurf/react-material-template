import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { Modal } from 'components/common/modal';
import { Button } from 'components/common';
import { Form, Input } from 'components/forms';
import { useLogin } from 'store/user/actions';

import { AUTH_PAGES } from '../../constants';

const { login, register } = AUTH_PAGES;

export const LoginPage: FC = () => (
  <Modal
    initiallyOpen
    closable={false}
    width={550}
    heading={
      <div className="sec-login-heading">
        <div className="text">Please enter your details below:</div>

        <Link to={register.path}>
          <Button color="secondary" size="small">
            {register.buttonLabel}
          </Button>
        </Link>
      </div>
    }
  >
    <Form
      onSubmit={useLogin()}
      buttonLabel={login.buttonLabel}
      className="sec-login-page"
      buttonPosition="center"
    >
      <div className="input-wrapper">
        <Input name="email" type="email" label="Email" required />
      </div>

      <div className="input-wrapper">
        <Input name="password" type="password" label="Password" required />
      </div>
    </Form>
  </Modal>
);
