import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { ListItemButton, ListItemButtonProps } from '@mui/material';

// Define a type that combines ListItemButtonProps and RouterLinkProps, excluding 'ref' from RouterLinkProps
type ListItemLinkProps = {
  to: string;
} & Omit<ListItemButtonProps, 'component'> &
  Omit<RouterLinkProps, 'ref'>;

// Create a React forwardRef component
const ListItemLink = React.forwardRef<HTMLAnchorElement, ListItemLinkProps>(
  function ListItemLink(props, ref) {
    const { to, children, ...other } = props;

    return (
      <ListItemButton
        component={RouterLink}
        to={to}
        ref={ref}
        {...other}
      >
        {children}
      </ListItemButton>
    );
  }
);

export default ListItemLink;
