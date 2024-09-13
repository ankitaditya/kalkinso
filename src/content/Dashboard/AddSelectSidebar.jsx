import React, { useEffect, useState } from 'react';
import { Tag, Accordion, AccordionItem, FileUploaderDropContainer } from '@carbon/react';
import PropTypes from 'prop-types';
import { NoDataEmptyState } from '@carbon/ibm-products';
import { pkg } from '@carbon/ibm-products';
import { AddSelectMetaPanel } from '@carbon/ibm-products/lib/components/AddSelect/AddSelectMetaPanel';
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';
import "./AddSelectSidebar.scss";
import CodeEditor from './CodeEditor';
import FileUploadWidget from './Widgets/FileUpload';
import BlockNoteEditor from './BlockNoteEditor';
import FigmaEditor from './FigmaEditor';


const blockClass = `home--add-select__sidebar`;
const componentName = 'AddSelectSidebar';

const monacoSupportedFileExtensions = {
  "abap": {"language":"abap"},
  "cls": {"language":"apex"},
  "clj": {"language":"clojure"},
  "coffee": {"language":"coffeescript"},
  "cpp": {"language":"cpp"},
  "cs": {"language":"csharp"},
  "csharp": {"language":"csharp"},
  "c": {"language":"c"},
  "css": {"language":"css"},
  "dockerfile": {"language":"dockerfile"},
  "fsharp": {"language":"fsharp"},
  "go": {"language":"go"},
  "groovy": {"language":"groovy"},
  "hlsl": {"language":"hlsl"},
  "html": {"language":"html"},
  "ini": {"language":"ini"},
  "java": {"language":"java"},
  "javascript": {"language":"javascript"},
  "js": {"language":"javascript"},
  "jsx": {"language":"javascript"},
  "json": {"language":"json"},
  "json5": {"language":"json"},
  "less": {"language":"less"},
  "lua": {"language":"lua"},
  "markdown": {"language":"markdown"},
  "md": {"language":"markdown"},
  "objective-c": {"language":"objective-c"},
  "perl": {"language":"perl"},
  "perl6": {"language":"perl"},
  "php": {"language":"php"},
  "plaintext": {"language":"plaintext"},
  "txt": {"language":"plaintext"},
  "postiats": {"language":"postiats"},
  "powerquery": {"language":"powerquery"},
  "powershell": {"language":"powershell"},
  "pug": {"language":"pug"},
  "python": {"language":"python"},
  "py": {"language":"python"},
  "r": {"language":"r"},
  "razor": {"language":"razor"},
  "ruby": {"language":"ruby"},
  "rust": {"language":"rust"},
  "scss": {"language":"scss"},
  "shaderlab": {"language":"shaderlab"},
  "shell": {"language":"shell"},
  "sh": {"language":"shell"},
  "sol": {"language":"solidity"},
  "sql": {"language":"sql"},
  "st": {"language":"smalltalk"},
  "swift": {"language":"swift"},
  "typescript": {"language":"typescript"},
  "ts": {"language":"typescript"},
  "vb": {"language":"vb"},
  "xml": {"language":"xml"},
  "yaml": {"language":"yaml"},
  "yml": {"language":"yaml"},
  "default": {"language":"plaintext"}
};


const AddSelectSidebar = ({
  appliedModifiers,
  closeIconDescription,
  displayMetalPanel,
  illustrationTheme,
  influencerTitle,
  items,
  metaPanelTitle,
  modifiers,
  multiSelection,
  noSelectionDescription,
  noSelectionTitle,
  setDisplayMetaPanel,
}) => {
  const hasModifiers = modifiers?.options?.length > 0;
  const hasSelections = multiSelection.length > 0;

  const getNewItem = (item) => {
    const { meta, icon, avatar, ...newItem } = item;
    return newItem;
  };

  const sidebarItems = multiSelection.map((selectionId) => {
    if (Array.isArray(items)) {
      const selectedItem = items.find((item) => item.id === selectionId);
      return getNewItem(selectedItem);
    }
    return getNewItem(items[selectionId]);
  });

  useEffect(() => {}, [multiSelection]);

  const getTitle = (item) => (
    <div className={`${blockClass}-accordion-title`}>
      <div className={`${blockClass}-selected-item`}>
        <p className={`${blockClass}-selected-item-title`}>{item.title}</p>
        <p className={`${blockClass}-selected-item-subtitle`}>
          {item.subtitle}
        </p>
      </div>
      {hasModifiers && (
        <div>
          {appliedModifiers.find((modifier) => modifier.id === item.id)[
            modifiers.id
          ]}
        </div>
      )}
    </div>
  );

  const renderFile = (item) => {
    const files = [{filename: item.title, value: item.signedUrl}];
    if(!item?.signedUrl){
      return <></>;
    }
    if (item.fileType === 'txt') {
      return <BlockNoteEditor initialContent={item.signedUrl} />
    }
    if (item.fileType === 'png' || item.fileType === 'jpg' || item.fileType === 'jpeg') {
      return <FigmaEditor usageStatistics={false} style={{width:"auto"}} />;
    }
    if (monacoSupportedFileExtensions.hasOwnProperty(item.fileType)) {
      console.log("HTML file: ", files);
      return <CodeEditor file={files} style={{height: "80vh", width: "100%"}} />;
    } else {
      return <FileViewer
              style={{height: "80vh", width: "100%"}}
              fileType={item.fileType}
              filePath={item.signedUrl}
              errorComponent={CustomErrorComponent}
              onError={()=>{console.log("Error in reading file!")}}/>;
    }
    
  }

  if (Object.keys(displayMetalPanel).length !== 0) {
    return (
      <AddSelectMetaPanel
        closeIconDescription={closeIconDescription}
        meta={displayMetalPanel.meta}
        setDisplayMetaPanel={setDisplayMetaPanel}
        title={metaPanelTitle}
      />
    );
  }

  return (
    <div className={blockClass}>
      <div className={`${blockClass}-header`}>
        <p className={`${blockClass}-title`}>{influencerTitle}</p>
        {/* <Tag type="gray" size="sm">
          {multiSelection.length}
        </Tag> */}
      </div>
      {hasSelections ? (
        <Accordion align="start">
          {sidebarItems.map((item) => (
            <>
            <AccordionItem title={getTitle(item)} key={item.id}>
              {Object.keys(item).map((key) => {
                if (key === 'signedUrl' || key === 'id' || key === 'value') {
                    return null
                }
                return (
                <div className={`${blockClass}-item`} key={key}>
                  <p className={`${blockClass}-item-header`}>{key}</p>
                  <p className={`${blockClass}-item-body`}>{item[key]}</p>
                </div>
              )})}
            </AccordionItem>
            {renderFile(item)}
            {!item?.signedUrl&&(
              <FileUploadWidget emptyStateTemplate={<NoDataEmptyState
                subtitle={noSelectionDescription}
                title={noSelectionTitle}
                size='lg'
                illustrationTheme={illustrationTheme}
              />} />
            )}
            </>
          ))}
        </Accordion>
      ) : (
        <div className={`${blockClass}-body`}>
          <NoDataEmptyState
            subtitle={noSelectionDescription}
            title={noSelectionTitle}
            size="sm"
            illustrationTheme={illustrationTheme}
          />
        </div>
      )}
    </div>
  );
};

AddSelectSidebar.propTypes = {
  appliedModifiers: PropTypes.array,
  closeIconDescription: PropTypes.string,
  displayMetalPanel: PropTypes.object,
  illustrationTheme: PropTypes.oneOf(['light', 'dark']),
  influencerTitle: PropTypes.string,
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  metaPanelTitle: PropTypes.string,
  modifiers: PropTypes.object,
  multiSelection: PropTypes.array,
  noSelectionDescription: PropTypes.string,
  noSelectionTitle: PropTypes.string,
  setDisplayMetaPanel: PropTypes.func,
};

AddSelectSidebar.displayName = componentName;

export default AddSelectSidebar;
