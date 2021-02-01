import React, { Component, ReactNode, Fragment } from 'react';
import classnames from 'classnames';
import {
  AppBar,
  Modal as MatModal,
  Fade,
  Backdrop,
  ModalProps as MatModalProps,
} from '@material-ui/core';

import { Button } from '../button';
import { Spinner } from '../spinner';
import { Message } from '../message';
import { Icon } from '../icon';

export class Modal extends Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);

    this.state = { isOpen: false };
  }

  componentDidMount() {
    const { initiallyOpen } = this.props;

    if (initiallyOpen) {
      this.open();
    }
  }

  open = () => {
    const { onOpen } = this.props;

    this.setState({ isOpen: true });

    if (onOpen) {
      onOpen();
    }
  };

  close = (
    _event?: any,
    reason?: 'backdropClick' | 'escapeKeyDown' | 'cancelClick' | 'closeClick',
  ) => {
    const { closable = true, onClose, onCancel } = this.props;

    if (closable || reason === 'cancelClick') {
      this.setState({ isOpen: false });

      if (onClose) {
        onClose();
      }

      if (onCancel) {
        onCancel();
      }
    }
  };

  renderFooter() {
    const { onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' } = this.props;

    return (
      <div className="modal-footer-buttons">
        {onCancel && (
          <Button
            className="cancel"
            onClick={e => this.close(e, 'cancelClick')}
            variant="text"
            color="default"
            height={36}
          >
            {cancelText}
          </Button>
        )}
        {onConfirm && (
          <Button className="confirm" onClick={onConfirm} variant="text" height={36}>
            {confirmText}
          </Button>
        )}
      </div>
    );
  }

  render() {
    const { isOpen } = this.state;
    const {
      className: passedClassName,
      children,
      heading,
      closable = true,
      loading = false,
      error,
      width,
      render,
      renderActions,
      onConfirm,
      onCancel,
      hideButtons,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      onOpen,
      initiallyOpen,
      confirmText,
      cancelText,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = this.props;

    const hasActions = (onConfirm || onCancel) && !hideButtons;
    const className = classnames(
      'sec-modal',
      closable && 'closable',
      hasActions ? 'with-footer' : 'no-footer',
      heading ? 'with-heading' : 'no-heading',
      passedClassName,
    );

    return (
      <Fragment>
        <MatModal
          className={className}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 600,
            onClick: e => this.close(e, 'backdropClick'),
          }}
          disableEscapeKeyDown={!closable}
          onEscapeKeyDown={e => this.close(e, 'escapeKeyDown')}
          style={{ zIndex: 1059 }}
          {...rest}
          closeAfterTransition={false}
          open={isOpen}
        >
          <Fade in={isOpen}>
            <div className="inner" style={{ width }}>
              {closable && (
                <button
                  className="modal-close"
                  onClick={e => this.close(e, 'closeClick')}
                  title="Close"
                  type="button"
                >
                  <Icon type="close" />
                </button>
              )}

              {heading && (
                <AppBar className="modal-heading" position="relative">
                  {heading}
                </AppBar>
              )}

              <div className="modal-content">
                <Message className="modal-error" open={!!error} message={error} marginBottom={15} />

                {render ? render(this) : children}
              </div>

              {hasActions && this.renderFooter()}

              <Spinner className="modal-spinner" visible={loading} iconSize={80} />
            </div>
          </Fade>
        </MatModal>

        {renderActions && renderActions(this)}
      </Fragment>
    );
  }
}

export interface ModalActions {
  open: () => void;
  close: () => void;
}

export type RenderProp = (modal: Modal) => ReactNode;

export interface ModalProps extends Omit<MatModalProps, 'ref' | 'open' | 'onSubmit' | 'children'> {
  className?: string;
  initiallyOpen?: boolean;
  loading?: boolean;
  closable?: boolean;
  heading?: ReactNode;
  error?: string | null | boolean;
  width?: number;
  onOpen?: () => any;
  onClose?: () => any;
  onConfirm?: () => any;
  onCancel?: () => any;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  renderActions?: RenderProp;
  render?: RenderProp;
  hideButtons?: boolean;
}

interface ModalState {
  isOpen: boolean;
}
