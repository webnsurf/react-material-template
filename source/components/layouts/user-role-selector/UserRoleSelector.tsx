import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';

import { Select, Option, SelectProps } from 'components/forms/select';
import { useUserRolesData } from 'store/data-tree';

export const UserRoleSelector: FC<SelectProps> = ({
  className: passedClassname,
  loading: providedIsLoading,
  onChange,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const userRoles = useUserRolesData();
  const roleOptions = useMemo(
    (): Option<number>[] => userRoles.map(({ id, name }) => ({ value: id, label: name })),
    [userRoles],
  );
  const isMounted = useRef(false);
  const handleChange = useCallback(
    async event => {
      if (onChange) {
        setIsLoading(true);
        await onChange(event);

        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [onChange],
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <Select
      className={classnames('sec-user-role-selector', passedClassname)}
      loading={roleOptions.length === 0 || isLoading || providedIsLoading}
      defaultValue={roleOptions[0]?.value}
      onChange={handleChange}
      options={roleOptions}
      {...rest}
    />
  );
};
