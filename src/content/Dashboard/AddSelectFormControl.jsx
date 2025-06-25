import React from 'react';
import {
  RadioButton,
  RadioButtonChecked,
  Checkbox,
  CheckboxCheckedFilled,
  Edit,
  Checkmark,
  Folder,
  Document,
  Save,
  CloseFilled,
  ViewFilled
} from '@carbon/react/icons';
import PropTypes from 'prop-types';
import { EditInPlace, pkg } from '@carbon/ibm-products';
import { UserProfileImage } from '@carbon/ibm-products';
import { DefinitionTooltip } from '@carbon/react';
import { useDispatch } from 'react-redux';
import { renameFile } from '../../actions/kits';

const componentName = 'AddSelectFormControl';
const blockClass = `${pkg.prefix}--add-select__selections`;
pkg.component.EditInPlace = true;

const icons = {
  Folder,
  Document
}

export let AddSelectFormControl = ({ item, onClick, selected, type }) => {
    const [text, setText] = React.useState(item.title);
    const [active, setActive] = React.useState(false);
    const dispatch = useDispatch();
  const controlProps = {
    onClick,
    className: `${blockClass}-form-control-wrapper ${blockClass}-form-control-wrapper--${type}`,
    size: 16,
    [`aria-labelledby`]: `control-label-${item.id}`,
    style:{ cursor: 'pointer' },
  };

  const getCheckbox = () => {
    if (selected) {
      return <CloseFilled {...controlProps} />;
    }

    return getItemIcon({...item, icon: typeof item.icon === 'string'?icons[item.icon]:Document});
  };

  const getRadio = () => {
    if (selected) {
      return <RadioButtonChecked {...controlProps} />;
    }

    return <RadioButton {...controlProps} />;
  };

  const getFormControl = () => {
    if (!item) {
      return;
    }
    if (type === 'checkbox') {
      return getCheckbox();
    } else {
      return getRadio();
    }
  };

  const getAvatarProps = ({ src, alt, icon, backgroundColor, theme }) => ({
    className: `${blockClass}-cell-avatar`,
    size: 'lg',
    theme,
    image: src,
    imageDescription: alt,
    icon,
    backgroundColor,
  });

  const getItemIcon = ({ icon: Icon }) => <Icon {...controlProps} />;

  return (
    <div className={`${blockClass}-form-control`}>
      {getFormControl()}
      <div className={`${blockClass}-form-control-label-wrapper`}>
        {item.avatar && <UserProfileImage {...getAvatarProps(item.avatar)} />}
        {item.icon && false && (
          <div className={`${blockClass}-cell-icon`}>{getItemIcon({...item, icon: typeof item.icon === 'string'?icons[item.icon]:Document})}</div>
        )}
        <div className={`${blockClass}-form-control-label-text`}>
          <span
            className={`${blockClass}-cell-title`}
            id={`control-label-${item.id}`}
          >
             <DefinitionTooltip openOnHover definition={text}>
              <EditInPlace 
                // style={{overflow:'hidden',
                //   whiteSpace:'nowrap',
                //   textOverflow:'ellipsis',
                //   width: '170px',
                //   display: 'block'}}
                value={text || 'Click to Edit'}
                onChange={(value) => setText(value)}
                onSave={() => {
                  dispatch(renameFile({...item, title: text, value: text}))
                }}
                onCancel={() => setText(item.title)}
             />
             </DefinitionTooltip>
          </span>
          {item.subtitle && (
            <span className={`${blockClass}-cell-subtitle`}>
              {item.subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

AddSelectFormControl.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  type: PropTypes.oneOf(['checkbox', 'radio']),
};

AddSelectFormControl.displayName = componentName;
