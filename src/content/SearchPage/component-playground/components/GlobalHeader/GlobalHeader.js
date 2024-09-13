/**
 * Copyright IBM Corp. 2022, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Header, HeaderContainer, HeaderName } from '@carbon/react';

const GlobalHeader = () => {
  return (
    <HeaderContainer
      render={() => (
        <Header aria-label="KALKINSO [SEARCH]">
          <HeaderName href="/" prefix="KALKIN">
            SO
          </HeaderName>
        </Header>
      )}
    />
  );
};

export default GlobalHeader;
