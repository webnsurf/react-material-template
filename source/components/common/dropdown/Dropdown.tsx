import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
  FC,
  useCallback,
} from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { useOnClickOutside } from 'hooks/click';

import { Chevron } from '../chevron/Chevron';

interface DropdownContext {
  onChange?: (value: any) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  value: any;
  isOpen: boolean;
}

const Context = createContext({} as DropdownContext);
const useDropdown = () => useContext(Context);

export const Dropdown: FC<DropdownProps> = ({
  onChange,
  children,
  value,
  displayValue,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState(200);
  const innerContainerRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(
    dropdownRef,
    useCallback(() => setIsOpen(false), []),
  );

  useEffect(() => {
    if (innerContainerRef.current) {
      setMaxHeight(innerContainerRef.current.offsetHeight + 5);
    }
  }, [children]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => {
    if (isOpen) {
      return close();
    }

    return open();
  };

  const classNames = classnames('sec-dropdown', isOpen ? 'open' : 'closed', className);

  return (
    <Context.Provider value={{ onChange, open, close, toggle, value, isOpen }}>
      <div className={classNames} ref={dropdownRef}>
        <button
          className="dropdown-value"
          title={String(displayValue || value)}
          onClick={toggle}
          type="button"
        >
          <div className="dropdown-item-overflow">{String(displayValue || value)}</div>

          <Chevron dir={isOpen ? 'up' : 'down'} className="chevron" />
        </button>

        <div className="dropdown-inner" style={{ maxHeight }}>
          <div className="dropdown-items" ref={innerContainerRef}>
            {children}
          </div>
        </div>
      </div>
    </Context.Provider>
  );
};

export const DropdownItem: FC<DropdownItemProps> = ({
  value,
  children,
  className: passedClassname,
  title,
  onClick,
  linkTo,
}) => {
  const { onChange, close, value: currentValue } = useDropdown();

  const handleClick = useCallback(() => {
    if (onChange) {
      onChange(value);
    }

    if (onClick) {
      onClick(value);
    }

    close();
  }, [close, onChange, onClick, value]);

  const className = classnames(
    'dropdown-item',
    value && currentValue === value && 'current',
    passedClassname,
  );

  if (linkTo) {
    return (
      <Link className={className} onClick={handleClick} title={title} to={linkTo}>
        <div className="dropdown-item-inner">
          <div className="dropdown-item-overflow">{children}</div>
        </div>
      </Link>
    );
  }

  return (
    <button className={className} onClick={handleClick} title={title} type="button">
      <div className="dropdown-item-inner">
        <div className="dropdown-item-overflow">{children}</div>
      </div>
    </button>
  );
};

interface DropdownProps {
  children: ReactNode;
  value?: any;
  onChange?: (changed: any) => any;
  displayValue?: any;
  className?: string;
}

interface DropdownItemProps {
  children: ReactNode;
  value?: any;
  className?: string;
  title?: string;
  onClick?: (value: any) => any;
  linkTo?: string;
}
