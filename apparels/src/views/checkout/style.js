import styled from 'styled-components';

export const ChangeQuantity = styled.button`
  color: #b7b7b7;
  border: 0;
  background-color: #000;
  width: 25px;
  height: 25px;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    opacity: 0.2;
  }
`;
