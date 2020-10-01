import React from 'react';
import { color } from 'styled-system';
import { styled } from '../../styles';

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,63}\b([-a-zA-Z0-9()@:%_+.~#?&=]*)/;

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

const LinkComponent = ({ href, ...rest }: LinkProps) => {
  const isExternal = href && urlRegex.exec(href);
  let linkProps = {};

  if (isExternal) {
    linkProps = {
      target: '_blank',
      rel: 'noopener noreferrer'
    };
  }

  return <a href={href}
    {...linkProps}
    {...rest} />;
};

export const Link = styled(LinkComponent)(
  color,
  ({ color: _color, theme }) => ({
    textDecoration: 'none',
    ...theme.links,
    ...(_color ? { color: _color } : {}),

    '&:hover, &:focus': {
      textDecoration: 'none'
    }
  })
);
