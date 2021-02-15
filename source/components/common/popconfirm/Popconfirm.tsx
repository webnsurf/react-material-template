import React, {
  FC,
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  cloneElement,
  useRef,
  useCallback,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { getRandomId } from 'utils/general';

import { Icon } from '../icon';
import { Button } from '../button';
import { getPosition } from './utils';

const popconfirmContainer = document.getElementById('popconfirm') as HTMLElement;

export const Popconfirm: FC<PopconfirmProps> = ({
  className: providedClassName,
  okText = 'OK',
  cancelText = 'Cancel',
  position = 'top',
  disableButtons,
  centerArrow,
  onConfirm,
  disabled,
  children,
  visible,
  width,
  title,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const popconfirmRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLElement>(null);
  const originalOnClick = (children as any).props?.onClick;
  const key = useMemo(() => getRandomId(), []);

  const resizeHandler = useCallback(() => {
    const popconfirm = popconfirmRef.current;
    const anchor = anchorRef.current;

    if (popconfirm && anchor) {
      const newPosition = getPosition(position, popconfirm, anchor, centerArrow);

      setTop(newPosition.top);
      setLeft(newPosition.left);

      setTimeout(() => {
        const adjustedPosition = getPosition(position, popconfirm, anchor, centerArrow);

        setTop(adjustedPosition.top);
        setLeft(adjustedPosition.left);
      }, 10);
    }
  }, [position, centerArrow]);
  const clickOutsideHandler = useCallback(
    (event: MouseEvent) => {
      const popContainer = popconfirmRef.current;

      if (popContainer && !popContainer.contains(event.target as Node)) {
        document.removeEventListener('click', clickOutsideHandler);
        window.removeEventListener('resize', resizeHandler);

        if (visible === undefined) {
          setIsVisible(false);
        }
      }
    },
    [resizeHandler, visible],
  );
  const handleToggle = useCallback(() => {
    if (visible === undefined) {
      setIsVisible(old => {
        if (old) {
          document.removeEventListener('click', clickOutsideHandler);
          window.removeEventListener('resize', resizeHandler);
        } else {
          setTimeout(() => {
            document.addEventListener('click', clickOutsideHandler);
            window.addEventListener('resize', resizeHandler);
          }, 50);
        }

        return !old;
      });
    }
  }, [visible, clickOutsideHandler, resizeHandler]);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (originalOnClick) {
        originalOnClick(event);
      }

      handleToggle();
    },
    [originalOnClick, handleToggle],
  );
  const handleConfirm = useCallback(() => {
    handleToggle();

    if (onConfirm) {
      onConfirm();
    }
  }, [handleToggle, onConfirm]);

  useEffect(() => {
    if (isVisible) {
      resizeHandler();
    }
  }, [isVisible, resizeHandler]);
  useEffect(() => {
    setIsVisible(visible);

    if (visible) {
      window.addEventListener('resize', resizeHandler);
      return () => window.removeEventListener('resize', resizeHandler);
    }
  }, [visible, resizeHandler]);
  useEffect(
    () => () => {
      document.removeEventListener('click', clickOutsideHandler);
      window.removeEventListener('resize', resizeHandler);
    },
    [clickOutsideHandler, resizeHandler],
  );

  if (disabled) {
    return <Fragment>{children}</Fragment>;
  }

  const className = classnames(
    'sec-popconfirm',
    disableButtons && 'no-buttons',
    position,
    providedClassName,
  );

  const renderContent = () => {
    if (!isVisible) {
      return null;
    }

    return (
      <CSSTransition key={key} classNames="fadde" timeout={150}>
        <div className={className} ref={popconfirmRef} style={{ left, top, width }}>
          <div className={classnames('sec-popconfirm-arrow', position)} />

          <div className="popconfirm-content">
            <div className="popconfirm-title">
              <Icon type="info" color="warning" size={20} />
              {title}
            </div>

            {!disableButtons && (
              <div className="popconfirm-actions">
                <Button variant="outlined" size="small" onClick={handleToggle}>
                  {cancelText}
                </Button>
                <Button variant="contained" size="small" onClick={handleConfirm}>
                  {okText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CSSTransition>
    );
  };
  const anchor =
    typeof children === 'string' ? (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <span ref={anchorRef} onClick={handleClick}>
        {children}
      </span>
    ) : (
      cloneElement(children as any, { ref: anchorRef, onClick: handleClick })
    );
  const popconfirm = createPortal(
    <TransitionGroup>{renderContent()}</TransitionGroup>,
    popconfirmContainer,
  );

  return (
    <Fragment>
      {popconfirm}
      {anchor}
    </Fragment>
  );
};

export type PopconfirmPosition =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';
export interface PopconfirmProps {
  className?: string;
  disableButtons?: boolean;
  onConfirm?: () => any;
  title?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  visible?: boolean;
  position?: PopconfirmPosition;
  centerArrow?: boolean;
  width?: number;
}
