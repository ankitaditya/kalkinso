import React from 'react';
import { TextInput } from '@carbon/react';
import PropTypes from 'prop-types';

const CustomInput = ({ onChange, conditionState }) => {
  const onChangeHandler = (e) => {
    onChange(e.target.value);
  };
  return (
    <div className={`custom-component`}>
      <TextInput
        labelText={'labelText'}
        hideLabel
        value={conditionState.value ?? ''}
        id={'customInput'}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default CustomInput;

CustomInput.propTypes = {
  /**
   * current condition state
   */
  conditionState: PropTypes.object,
  /**
   * This function need to be called that provides a label which should be shown in the condition after a user has made their selection / set their value
   */
  onChange: PropTypes.func,
};
