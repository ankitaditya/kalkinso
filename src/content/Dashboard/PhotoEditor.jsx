import React, { useState } from 'react';
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';

function PhotoEditor({ image_uri, title, usageStatistics,closeImgEditor, className,...rest }) {

  return (
    <div className={className} style={{...rest.style}}>
        <FilerobotImageEditor
            source={image_uri}
            onSave={(editedImageObject, designState) =>
                console.log('saved', editedImageObject, designState)
            }
            onClose={closeImgEditor}
            annotationsCommon={{
                fill: '#ff0000',
            }}
            Text={{ text: title }}
            defaultTabId={TABS.ADJUST} // or 'Annotate'
            />
    </div>
  );
}

export default PhotoEditor;