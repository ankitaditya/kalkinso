import React from 'react';
import TuiImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';

export default class ImageEditorWorkbench extends React.Component {
  rootEl = React.createRef();

  imageEditorInst = null;

  componentDidMount() {
    this.imageEditorInst = new TuiImageEditor(this.rootEl.current, {
      includeUI: {
        loadImage: {
          path: this.props.image_uri,
          name: this.props.title,
        },
        theme: {}, // You can customize the theme here
        menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
        initMenu: 'filter',
        uiSize: {
          width: '100%',
          height: '65vh',
        },
        menuBarPosition: 'bottom',
      },
      cssMaxWidth: 700,
      cssMaxHeight: 500,
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70,
      },
    });

    this.bindEventHandlers(this.props);
  }

  componentWillUnmount() {
    this.unbindEventHandlers();

    this.imageEditorInst.destroy();

    this.imageEditorInst = null;
  }

  shouldComponentUpdate(nextProps) {
    this.bindEventHandlers(this.props, nextProps);

    return false;
  }

  getInstance() {
    return this.imageEditorInst;
  }

  getRootElement() {
    return this.rootEl.current;
  }

  bindEventHandlers(props, prevProps) {
    Object.keys(props)
      .filter(this.isEventHandlerKeys)
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        if (prevProps && prevProps[key] !== props[key]) {
          this.imageEditorInst.off(eventName);
        }
        this.imageEditorInst.on(eventName, props[key]);
      });
  }

  unbindEventHandlers() {
    Object.keys(this.props)
      .filter(this.isEventHandlerKeys)
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        this.imageEditorInst.off(eventName);
      });
  }

  isEventHandlerKeys(key) {
    return /on[A-Z][a-zA-Z]+/.test(key);
  }

  handleSave = () => {
    const editorInstance = this.getInstance();
    const dataURL = editorInstance.toDataURL(); // Get the edited image as a Data URL
    // console.log(dataURL); // Save or use the image
  };

  render() {
    return (
        <div ref={this.rootEl} />
    );
  }
}
