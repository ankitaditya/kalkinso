import React, { Component } from "react";
import Konva from "konva";
import Draggable from "react-draggable";
import { Stage, Layer } from "react-konva";
import { CirclePicker } from "react-color";
import ColorPickerPalette from "../ColorPickerPalette";
import { DropImage } from "../DropImage";
import { v4 as uuidv1 } from "uuid";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { connect } from "react-redux";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { Buffer } from "buffer";
import axios from "axios";
import {
  Retangulo,
  Triangulo,
  Texto,
  Circulo,
  Imagem,
  Background,
} from "../Formas";
import "./Editor.css";

// imagens
import Bold from "../../assets/icons-editor-bar/bold.png";
import Italic from "../../assets/icons-editor-bar/italics.png";
import Circle from "../../assets/icons-editor-bar/circle.png";
import Rectangle from "../../assets/icons-editor-bar/rectangle.png";
import FillColor from "../../assets/icons-editor-bar/fill-color.png";
import InsertText from "../../assets/icons-editor-bar/insert-text.png";
import Image from "../../assets/icons-editor-bar/image.png";
import Duplicate from "../../assets/icons-editor-bar/duplicate.png";
import Triangule from "../../assets/icons-editor-bar/triangule.png";
import Front from "../../assets/icons-editor-bar/front.png";
import Desfazer from "../../assets/icons-editor-bar/desfazer.png";
import Refazer from "../../assets/icons-editor-bar/refazer.png";
import Save from "../../assets/icons-editor-bar/save.png";
import Back from "../../assets/icons-editor-bar/back.png";
import Underline from "../../assets/icons-editor-bar/underline.png";
import ZoomIn from "../../assets/icons-editor-bar/zoom-in.png";
import ZoomOut from "../../assets/icons-editor-bar/zoom-out.png";
import BackgroundIcon from "../../assets/icons-editor-bar/background.png";
import Preview from "../../assets/icons-editor-bar/preview.png";
import AiIcon from "../../assets/icons-editor-bar/ai.png";
import { generateSignedUrl } from "../../../../../utils/redux-cache";
import { Loading } from "@carbon/react";
import { Close } from "@carbon/react/icons";

var HISTORY = [];

var POSITION = 0;

function saveHistory(history) {
  var remove = (HISTORY.length - 1) - POSITION;
  HISTORY = HISTORY.slice(0, HISTORY.length - remove);
  HISTORY.push(history.slice(0));
  POSITION = HISTORY.length - 1;
}

function revertHistory() {
  return HISTORY[POSITION];
}

const Btn = props => {
  return (
    <div className="proximo-btn" onClick={props.onClick}>
      {props.title}
    </div>
  );
};

const promptTemplates = {
  "Book Writer": "bookWriter",
  "Book Cover Designer": "bookCoverDesigner",
  "Research Paper Writer": "researchPaperWriter",
  "Task Description Writer": "taskDescriptionWriter",
  "SOP Writer": "sopWriter",
  "Question Paper Writer": "questionPaperWriter",
  "Standard Work Instruction Document": "standardWorkInstructionDocument",
  "Business Plan Writer": "businessPlanWriter",
  "PCB Component List": "pcbComponentList",
  "Additional Category": "additionalCategory",
};

const promptTemplate = (prompt, response) => {
  const promptTemplates = {
    editContent: `
        You are a professional book editor and writer. Your task is to create a list of books with the following details:
        1. Title: A catchy, engaging, and relevant title for each book.
        2. Subtitle: A subtitle that complements the title and gives more context about the content.
        3. Cover Prompt: A detailed description for generating a visually appealing cover image. This should include the genre, mood, key elements, and a visual style.
        4. Other Image Prompts: Additional prompts for smaller images related to the book's theme, such as characters, key scenes, or thematic symbols.
        Give response in the following format:
        {
          "books": [
            {
              "title": "<Book title>",
              "subtitle": "<Book subtitle>",
              "coverPrompt": "<Description for generating cover image>",
              "otherImagePrompts": [
                "<List of descriptions for generating related images>"
              ]
          ],...
        }
        Here is the user's input:
        "${prompt}"

        Based on this input, generate at least 3 suggestions for books, structured as follows:
        - Title: <Book title>
        - Subtitle: <Book subtitle>
        - Cover Prompt: <Description for generating cover image>
        - Other Image Prompts: <List of descriptions for generating related images>

        Ensure that the suggestions are unique, creative, and aligned with the user's input.
        `,
    bookWriter: `
        For my prompt, generate an image that visually represents the theme, setting, or concept of a book. 
        When generating the image:
        1. Ensure the style is detailed and professional, appropriate for use as a book cover or thematic artwork.
        2. Incorporate elements like characters, landscapes, or symbolic imagery that reflect the book's genre (e.g., fantasy, science fiction, mystery).
        3. Use a visually engaging color palette and composition.
        4. If a previous response exists, incorporate its themes into the new image.
        Here is my prompt: ${prompt}
        Previous Response: ${response}
      `,
    bookCoverDesigner: `
        Generate a visually appealing and professionally designed image suitable for a book or article cover. Ensure that the design incorporates well-calculated margins for text and imagery, keeping important elements within safe zones.
        Prompt Details: "${prompt}"
        Context from Previous Response (if any): "${response}"
      `,
    researchPaperWriter: `
        For my prompt, generate an image that complements an academic research paper. 
        When generating the image:
        1. Include diagrams, charts, or visual aids that help explain the paper's main findings or concepts.
        2. Use a clean, professional, and scholarly style.
        3. If applicable, incorporate scientific or technical elements relevant to the subject.
        4. If a previous response exists, integrate its data or themes into the new image.
        Here is my prompt: ${prompt}
        Previous Response: ${response}
      `,
    taskDescriptionWriter: `
        For my prompt, generate an image that illustrates or supports a detailed task description. 
        When generating the image:
        1. Include clear, step-by-step visual instructions or representations of the task.
        2. Use icons, diagrams, or illustrations to enhance understanding.
        3. Ensure the design is clean, modern, and easy to interpret.
        4. If a previous response exists, align the visual content with the provided instructions.
        Here is my prompt: ${prompt}
        Previous Response: ${response}
      `,
    sopWriter: `
        For my prompt, generate an image that complements a Standard Operating Procedure (SOP). 
        When generating the image:
        1. Include flowcharts, diagrams, or illustrations that clarify the procedure.
        2. Use a professional and straightforward design style.
        3. Incorporate any relevant visual elements that enhance understanding of the steps.
        4. If a previous response exists, reflect its steps or content in the visual.
        Here is my prompt: ${prompt}
        Previous Response: ${response}
      `,
    questionPaperWriter: `
        For my prompt, generate an image that can be used in a professionally formatted question paper. 
        When generating the image:
        1. Include educational visuals, diagrams, or illustrations relevant to the subject.
        2. Use a clean and academic style appropriate for a classroom setting.
        3. Avoid overly complex visuals that may confuse students.
        4. If a previous response exists, reflect its context in the new image.
        Here is my prompt: ${prompt}
        Previous Response: ${response}
      `,
    standardWorkInstructionDocument: `
        For my prompt, generate an image that supports a Standard Work Instruction (SWI) document. 
        When generating the image:
        1. Include step-by-step diagrams, process flowcharts, or illustrations that clarify instructions.
        2. Use a professional and easy-to-follow visual style.
        3. Ensure alignment with the document’s content and tone.
        4. If a previous response exists, integrate its relevant aspects into the new image.
        Here is my prompt: ${prompt}
        Previous Response: ${response}
      `,
    businessPlanWriter: `
        For my prompt, generate an image that visually represents a business plan. 
        When generating the image:
        1. Include charts, graphs, or conceptual visuals related to market analysis, financial projections, or strategies.
        2. Use a professional, modern, and visually engaging style.
        3. Incorporate relevant branding or thematic elements if specified.
        4. If a previous response exists, use it to inform the visual content.
        Here is my prompt: ${prompt}
        Previous Response: ${response}
      `,
    pcbComponentList: `
        For my prompt, generate an image that complements a PCB component list. 
        When generating the image:
        1. Include detailed visual representations of the PCB layout, components, or design schematics.
        2. Use a clean and technical style with appropriate labels.
        3. Highlight key components or features as described in the prompt.
        4. If a previous response exists, reflect its details in the new image.
        Here is my prompt: ${prompt}
        Previous Response: ${response}
      `,
    additionalCategory: `
        For my prompt, generate an image that matches the provided description or theme. 
        When generating the image:
        1. Ensure the visual elements are consistent with the specified category or purpose.
        2. Use an appropriate style and level of detail as requested.
        3. If a previous response exists, incorporate its context into the new image.
        Here is my prompt: ${prompt}
        Previous Response: ${response}
      `,
  };
  return promptTemplates;
};

class Editor extends Component {
  constructor(props) {
    super(props);
    this.stageRef = React.createRef();
    this.containerCanvas = React.createRef();
  }
  state = {
    arrayObjectsLayer: [],
    visibleTray: true,
    visiblePreview: false, // New state: toggles preview sidebar
    kanvasWidth: 18.9,
    kanvasHeight: 10,
    widthKanvas: 421,
    heightKanvas: 596,
    loading: false,
    showPallet: false,
    selectedObject: {},
    showBackground: false,
    backgroundOn: true,
    indexTextSelected: 0,
    assets: [],
    zoom: 1,
    imgBase64: undefined,
    margin: { // Margin configuration for book cover design
      horizontal: 50,
      top: 40,
    },
    printSize: { // New state: print dimensions for book printing (in pixels)
      width: 600,
      height: 800,
    },
    newTextObj: {
      textEditVisible: false,
      fill: "black",
      textX: 0,
      textY: 0,
      textYTextArea: 0,
      textXTextArea: 0,
      textValue: "Two clicks to edit",
      fontSize: 28,
      width: 250,
      y: 100,
      x: 100,
      height: 150,
      fontStyle: "normal",
      align: "left",
      id: 0,
      type: "text",
    },
    newCircleObj: {
      y: 100,
      x: 100,
      radius: 50,
      fill: "#637EF7",
      id: 0,
      type: "circle",
    },
    newImageObj: {
      x: 0,
      image: null,
      id: 50,
      type: "image",
    },
    newSquareObj: {
      y: 100,
      x: 100,
      width: 100,
      height: 50,
      fill: "#637EF7",
      id: 0,
      type: "square",
    },
    newTriangleObj: {
      y: 100,
      x: 100,
      sides: 3,
      radius: 80,
      fill: "#637EF7",
      id: 0,
      type: "triangule",
    },
    // state draggable stuff
    activeDrags: 0,
    deltaPosition: {
      x: 0,
      y: 0,
    },
    controlledPosition: {
      x: -400,
      y: 200,
    },
  };

  handleDragStart = e => {
    e.target.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15,
      },
      scaleX: 1.1,
      scaleY: 1.1,
    });
  };

  handleDragEnd = e => {
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    });
  };

  saveEverything = async () => {
    await localStorage.setItem("stateSaved", JSON.stringify(this.state));
  };

  deleteSavedState = async () => {
    await localStorage.removeItem("stateSaved");
    const state = await localStorage.getItem("defaultState");
    if (state) this.setState(JSON.parse(state));
  };

  async componentDidMount() {
    const selectedTool = JSON.parse(localStorage.getItem("selectedTool"));
    const assets = JSON.parse(localStorage.getItem("images"));
    if (
      selectedTool &&
      selectedTool.name === "design-assistant" &&
      Object.keys(selectedTool.selectedEntry).length > 0
    ) {
      console.log(selectedTool);
      if (selectedTool.selectedEntry.fileType.includes("json")) {
        axios.get(selectedTool.selectedEntry.signedUrl).then(response => {
          this.setState({ arrayObjectsLayer: response.data });
          localStorage.removeItem("selectedTool");
        });
      } else {
        this.loadImageSrc(
          selectedTool.selectedEntry.signedUrl,
          this.addNewImage
        );
        localStorage.removeItem("selectedTool");
      }
    }
    if (assets && this.state.assets.length === 0) {
      this.setState({ assets: assets });
    }
    saveHistory(this.state.arrayObjectsLayer);
    await localStorage.setItem("defaultState", JSON.stringify(this.state));
    const state = await localStorage.getItem("stateSaved");
    if (state) this.setState(JSON.parse(state));
    else this.setState({ selectedObject: this.state.arrayObjectsLayer[0] });
  }

  handleTextDblClick = (e, index) => {
    const absPos = e.target.getAbsolutePosition();
    const stageBox = this.stageRef.current.container().getBoundingClientRect();
    let { arrayObjectsLayer, widthKanvas } = this.state;
    for (let i; i < arrayObjectsLayer.length; i++) {
      arrayObjectsLayer[i].textEditVisible = false;
    }
    arrayObjectsLayer[index].textEditVisible = true;
    arrayObjectsLayer[index].textXTextArea =
      (stageBox.left +
        absPos.x +
        this.containerCanvas.current.scrollLeft) /
      this.state.zoom;
    arrayObjectsLayer[index].textYTextArea =
      stageBox.bottom +
      absPos.y -
      stageBox.height +
      40 +
      this.containerCanvas.current.scrollTop;
    saveHistory(arrayObjectsLayer);

    this.setState({
      arrayObjectsLayer,
    });
  };

  handleSelect = index => {
    this.setState({
      indexTextSelected: index,
    });
  };

  changeStyle = style => {
    let { arrayObjectsLayer, indexTextSelected } = this.state;
    if (arrayObjectsLayer[indexTextSelected])
      arrayObjectsLayer[indexTextSelected].fontStyle = style;
    saveHistory(arrayObjectsLayer);
    this.setState({
      arrayObjectsLayer,
    });
  };

  setUnderline = underline => {
    let { arrayObjectsLayer, indexTextSelected } = this.state;
    if (arrayObjectsLayer[indexTextSelected])
      arrayObjectsLayer[indexTextSelected].textDecoration = underline;
    saveHistory(arrayObjectsLayer);

    this.setState({
      arrayObjectsLayer,
    });
  };

  changeFontSize = event => {
    let { arrayObjectsLayer, indexTextSelected } = this.state;
    arrayObjectsLayer[indexTextSelected].fontSize = parseInt(event.target.value);

    saveHistory(arrayObjectsLayer);
    this.setState({
      arrayObjectsLayer,
    });
  };

  handleTextEdit = (e, index) => {
    let { arrayObjectsLayer } = this.state;
    arrayObjectsLayer[index].textValue = e.target.value;
    saveHistory(arrayObjectsLayer);

    this.setState({
      arrayObjectsLayer,
    });
  };

  trazerItem = front => {
    let { arrayObjectsLayer, selectedObject } = this.state;
    if (this.state.selectedObject) {
      front
        ? arrayObjectsLayer.push(
            arrayObjectsLayer.splice(
              arrayObjectsLayer.findIndex(elt => elt.id === selectedObject.id),
              1
            )[0]
          )
        : arrayObjectsLayer.unshift(
            arrayObjectsLayer.splice(
              arrayObjectsLayer.findIndex(elt => elt.id === selectedObject.id),
              1
            )[0]
          );
      saveHistory(arrayObjectsLayer);

      this.setState({
        arrayObjectsLayer,
      });
    }
  };

  addNewText = () => {
    let { arrayObjectsLayer, newTextObj } = this.state;
    newTextObj.id = Math.round(Math.random() * 10000);
    arrayObjectsLayer.push(newTextObj);
    let selectedObject = newTextObj;
    saveHistory(arrayObjectsLayer);

    this.setState({
      arrayObjectsLayer,
      selectedObject,
    });
  };

  addNewSquare = () => {
    let { arrayObjectsLayer } = this.state;
    let newSquareObj = Object.assign({}, this.state.newSquareObj);
    newSquareObj.id = Math.round(Math.random() * 10000);
    let selectedObject = newSquareObj;
    arrayObjectsLayer.push(newSquareObj);
    saveHistory(arrayObjectsLayer);

    this.setState({
      arrayObjectsLayer,
      selectedObject,
    });
  };

  addNewTriangle = () => {
    let { arrayObjectsLayer } = this.state;
    let newTriangleObj = Object.assign({}, this.state.newTriangleObj);
    arrayObjectsLayer.id = Math.round(Math.random() * 10000);
    let selectedObject = newTriangleObj;
    arrayObjectsLayer.push(newTriangleObj);
    saveHistory(arrayObjectsLayer);
    this.setState({
      arrayObjectsLayer,
      selectedObject,
    });
  };

  addNewCircle = () => {
    let { arrayObjectsLayer } = this.state;
    let newCircleObj = Object.assign({}, this.state.newCircleObj);
    newCircleObj.id = Math.round(Math.random() * 10000);
    let selectedObject = newCircleObj;
    arrayObjectsLayer.push(newCircleObj);
    saveHistory(arrayObjectsLayer);

    this.setState({
      arrayObjectsLayer,
      selectedObject,
    });
  };

  addNewImage = image => {
    let { arrayObjectsLayer, newImageObj } = this.state;
    newImageObj.id = Math.round(Math.random() * 10000);
    newImageObj.image = image;
    arrayObjectsLayer.push(newImageObj);
    saveHistory(arrayObjectsLayer);

    this.setState({
      arrayObjectsLayer,
    });
  };

  tooglePallet = () => {
    if (this.state.selectedObject)
      this.setState({
        showPallet: !this.state.showPallet,
      });
  };

  loadImage = base64 => {
    var image = new window.Image();
    image.src = `data:image/png;base64,${base64}`;
    image.addEventListener("load", this.addNewImage(image));
  };

  loadImageSrc = async (src, func) => {
    axios
      .get(src, {
        responseType: "arraybuffer",
      })
      .then(response => {
        let image = new window.Image();
        const base64 = Buffer.from(response.data, "binary").toString("base64");
        image.src = `data:image/png;base64,${base64}`;
        image.addEventListener("load", () => func(image));
      })
      .catch(error => {
        console.error("Error loading image from URL:", error);
      });
  };

  genImage = async () => {
    let response = prompt(
      "Please enter your prompt",
      "Sample Book Cover Designer"
    );
    this.setState({ loading: true });
    await this.getSuggestionsJson(response);
    this.setState({ loading: false });
  };

  // Utility function to convert the image URL to Base64
  convertImageToBase64 = async url => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        resolve(base64data);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(blob);
    });
  };

  selectShape = (selectedObject, index = undefined) => {
    let { arrayObjectsLayer, indexTextSelected } = this.state;
    for (let i; i < arrayObjectsLayer.length; i++) {
      arrayObjectsLayer[i].textEditVisible = false;
    }
    if (index) {
      indexTextSelected = index - 1;
      arrayObjectsLayer[indexTextSelected].textEditVisible = false;
    } else {
      if (arrayObjectsLayer[indexTextSelected]) {
        arrayObjectsLayer[indexTextSelected].textEditVisible = false;
        indexTextSelected = undefined;
      }
    }
    this.setState({
      selectedObject,
      arrayObjectsLayer,
      indexTextSelected,
    });
  };

  desfazer = () => {
    POSITION = POSITION === 0 ? POSITION : POSITION - 1;
    const history = revertHistory();
    this.setState({
      arrayObjectsLayer: history.slice(0),
    });
  };

  refazer = () => {
    POSITION =
      POSITION < HISTORY.length - 1 ? POSITION + 1 : POSITION;
    const history = revertHistory();
    this.setState({
      arrayObjectsLayer: history.slice(0),
    });
  };

  setArrayObject = arrayObjectsLayer => {
    saveHistory(arrayObjectsLayer);

    this.setState({
      arrayObjectsLayer,
    });
  };

  zommStage(zoom) {
    if (!(zoom < 1) && !(zoom > 4)) {
      this.setState({
        zoom,
      });
    }
  }

  duplicarObject = () => {
    let { arrayObjectsLayer, selectedObject } = this.state;
    if (selectedObject) {
      let copy = { ...selectedObject };
      copy.x = copy.x + 10;
      copy.y = copy.y + 10;
      copy.id = Math.round(Math.random() * 10000);
      selectedObject = { ...copy };
      arrayObjectsLayer.push(copy);
    }
    saveHistory(arrayObjectsLayer);
    this.setState({
      arrayObjectsLayer,
      selectedObject,
    });
  };

  setObjColor = color => {
    let arrayObjectsLayer = this.state.arrayObjectsLayer;
    let selectedObject = { ...this.state.selectedObject };

    for (let i = 0; i < arrayObjectsLayer.length; i++) {
      if (selectedObject.id === arrayObjectsLayer[i].id) {
        if (typeof color === "string") {
          arrayObjectsLayer[i].fill = color;
        } else {
          arrayObjectsLayer[i].fill = color.hex;
        }
      }
    }
    saveHistory(arrayObjectsLayer);

    this.setState({
      selectedObject,
      arrayObjectsLayer,
    });
  };

  deleteNodeSelected = () => {
    let { selectedObject, arrayObjectsLayer } = this.state;
    if (arrayObjectsLayer.length > 0) {
      for (let i = 0; i < arrayObjectsLayer.length; i++) {
        if (arrayObjectsLayer[i].type === "text")
          arrayObjectsLayer[i].textEditVisible = false;
        if (selectedObject.id === arrayObjectsLayer[i].id) {
          arrayObjectsLayer.splice(i, 1);
        }
      }
      saveHistory(arrayObjectsLayer);

      this.setState({
        arrayObjectsLayer,
      });
    }
  };

  setVisibleTray = value => {
    this.setState({
      visibleTray: value,
    });
  };

  b64toBlob = b64Data => {
    const contentType = "image/png";
    const sliceSize = 1024;
    let byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (
      let offset = 0;
      offset < byteCharacters.length;
      offset += sliceSize
    ) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    this.savePng(blob);
  };

  imageToBlob = () => {
    const { zoom } = this.state;
    this.setState({
      selectedObject: {},
      showBackground: true,
    });
    setTimeout(() => {
      const base64Image = this.stageRef.current.getStage().toDataURL({
        pixelRatio: zoom, // quality of image
      });
      const block = base64Image.split(";");
      const contentType = block[0].split(":")[1];
      const realData = block[1].split(",")[1];
      this.setState({
        showBackground: false,
      });
      return this.b64toBlob(realData, contentType);
    }, 200);
  };

  savePng = async blob => {
    const fileName = `design-${uuidv1()}.png`;
    const params = {
      Bucket: "kalkinso.com",
      Key: `users/${this.props.user}/tasks/tools/design-assistant/${fileName}`,
      ContentType: "image/png",
    };
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("params", JSON.stringify(params));
    axios
      .post("/api/kits/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(response => {
        if (response.data.success) {
          console.log("sucessfully saved!");
        }
      })
      .catch(error => {});
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  getSuggestionsJson = async inputPrompt => {
    const canvasWidth = 421;
    const canvasHeight = 596;
    const { margin } = this.state;
    const marginX = margin.horizontal;
    const marginTop = margin.top;

    try {
      // Step 1: Fetch book suggestions using the text API
      const textResponse = await axios.post(
        "/api/kalkiai/completions",
        JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an expert text editor and book writer in multi-language. and give output only in JSON format. do not include any else other than json",
            },
            {
              role: "user",
              content: promptTemplate(inputPrompt, "")["editContent"],
            },
          ],
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const bookSuggestions = JSON.parse(
        textResponse?.data?.result.replace(/```/g, "").replace(/^json\n/, "").trim()
      )?.books?.slice(0, 1) || [];

      let { arrayObjectsLayer, newImageObj } = this.state;
      const suggestions = await Promise.all(
        bookSuggestions.map(async (book, index) => {
          const { title, subtitle, coverPrompt, otherImagePrompts } = book;
          const titleObj = {
            textEditVisible: false,
            fill: "white",
            textX: canvasWidth / 2,
            textY: marginTop + 10,
            textYTextArea: marginTop + 10,
            textXTextArea: canvasWidth / 2,
            x: marginX,
            y: marginTop,
            textValue: title,
            fontSize: 40,
            width: canvasWidth - 2 * marginX,
            height: 60,
            fontStyle: "bold",
            align: "center",
            id: Math.round(Math.random() * 10000),
            type: "text",
          };
          const subtitleObj = {
            textEditVisible: false,
            fill: "white",
            textX: canvasWidth / 2,
            textY: marginTop + 60 + 20,
            textYTextArea: marginTop + 60 + 20,
            textXTextArea: canvasWidth / 2,
            x: marginX,
            y: marginTop + 60 + 20,
            textValue: subtitle,
            fontSize: 28,
            width: canvasWidth - 2 * marginX,
            height: 40,
            fontStyle: "italic",
            align: "center",
            id: Math.round(Math.random() * 10000),
            type: "text",
          };
          const backgroundImageResponse = await axios.post(
            "/api/kalkiai/images",
            JSON.stringify({
              params: {
                model: "dall-e-3",
                prompt: coverPrompt,
                n: 1,
                size: "1024x1792",
              },
              key: `users/${this.props.user}/tasks/tools/design-assistant/images/background_${uuidv1()}.png`,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const backgroundImageData = backgroundImageResponse?.data?.result;
          const bgX = (canvasWidth - 1024) / 2;
          const bgY = (canvasHeight - 1792) / 4;
          let selectedObject = null;
          this.loadImageSrc(backgroundImageData.signedUrl, image => {
            const backgroundImageObject = {
              image,
              x: 0,
              y: 0,
              width: canvasWidth,
              height: canvasHeight,
              id: Math.round(Math.random() * 10000),
              type: "image",
            };
            arrayObjectsLayer.push(backgroundImageObject);
            selectedObject = backgroundImageObject;
            saveHistory(arrayObjectsLayer);
            this.setState({
              arrayObjectsLayer,
              selectedObject,
            });
          });
          let assets = this.state.assets;
          assets.push({ signedUrl: backgroundImageData.signedUrl, type: "image" });
          this.setState({ assets });

          arrayObjectsLayer.push(titleObj);
          selectedObject = titleObj;
          saveHistory(arrayObjectsLayer);
          this.setState({
            arrayObjectsLayer,
            selectedObject,
          });
          arrayObjectsLayer.push(subtitleObj);
          selectedObject = subtitleObj;
          saveHistory(arrayObjectsLayer);
          this.setState({
            arrayObjectsLayer,
            selectedObject,
          });

          return {
            title,
            subtitle,
            background_image: {
              prompt: backgroundImageData?.signedUrl,
              dimension: "512x512",
              model: "dall-e-2",
              x: bgX,
              y: bgY,
            },
            other_images: [],
          };
        })
      );

      return suggestions;
    } catch (error) {
      console.error("Error generating suggestions JSON:", error);
      return [];
    }
  };

  handleDrag = (e, ui) => {
    e.stopPropagation();
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      },
    });
  };

  // functions for draggable color palette
  onStart = () => {
    this.setState({ activeDrags: ++this.state.activeDrags });
  };

  onStop = () => {
    this.setState({ activeDrags: --this.state.activeDrags });
  };

  adjustXPos = e => {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = this.state.controlledPosition;
    this.setState({ controlledPosition: { x: x - 10, y } });
  };

  adjustYPos = e => {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = this.state.controlledPosition;
    this.setState({ controlledPosition: { x, y: y - 10 } });
  };

  onControlledDrag = (e, position) => {
    const { x, y } = position;
    this.setState({ controlledPosition: { x, y } });
  };

  onControlledDragStop = (e, position) => {
    this.onControlledDrag(e, position);
    this.onStop();
  };

  backgroundToogle = () => {
    this.setState({
      backgroundOn: !this.state.backgroundOn,
    });
  };

  render() {
    const {
      selectedObject,
      arrayObjectsLayer,
      indexTextSelected,
      showPallet,
      widthKanvas,
      heightKanvas,
      backgroundOn,
      showBackground,
      zoom,
      printSize,
    } = this.state;
    const width = widthKanvas / zoom; // cm to pixel
    const height = heightKanvas / zoom; // cm to pixel

    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    return (
      <div>
        <div className="containerCanvas" ref={this.containerCanvas}>
          <Sidebar
            style={{
              height: "40vh",
            }}
            visible={this.state.visibleTray}
            position="bottom"
            onHide={() => this.setVisibleTray(false)}
            closeIcon={<div><Close /></div>}
          >
            <div
              className="card flex"
              style={{
                marginTop: "1.5rem",
              }}
            >
              <Divider layout="vertical" />
              <DropImage
                getImage={base64 => {
                  this.loadImage(base64);
                  this.setVisibleTray(false);
                }}
              >
                <p
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={
                      "https://content.hostgator.com/img/weebly_image_sample.png"
                    }
                    alt="Thumbnail"
                    style={{
                      minWidth: "25vh",
                      maxWidth: "25vh",
                      height: "20vh",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      marginRight: "1rem",
                      marginLeft: "1rem",
                    }}
                  />
                </p>
              </DropImage>
              {this.state.assets &&
                this.state.assets.map((asset, index) => {
                  return (
                    <>
                      <Divider layout="vertical" />
                      <p
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <img
                          onClick={e => {
                            this.loadImageSrc(
                              this.state.assets[index].signedUrl,
                              this.addNewImage
                            );
                          }}
                          src={asset.signedUrl}
                          value={index}
                          alt={`Thumbnail-${index}`}
                          style={{
                            minWidth: "25vh",
                            maxWidth: "25vh",
                            height: "25vh",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            marginRight: "1rem",
                            marginLeft: "1rem",
                          }}
                        />
                      </p>
                    </>
                  );
                })}
            </div>
          </Sidebar>

          {/* Toolbar */}
          <div className="containerToolbar">
            <div
              className="containerIconeToolbar"
              onClick={this.imageToBlob}
            >
              <img className="img" src={Save} title="Save as png" alt="save" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={this.desfazer}
            >
              <img className="img" src={Desfazer} title="Desfazer" alt="undo" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={this.refazer}
            >
              <img className="img" src={Refazer} title="Refazer" alt="redo" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={() => this.setVisibleTray(true)}
            >
              <img className="img" src={Image} title="Adicionar imagem" alt="image" />
            </div>
            <div className="containerIconeToolbar" onClick={this.genImage}>
              <img className="img" src={AiIcon} title="AIGen" alt="ai" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={this.addNewCircle}
            >
              <img className="img" src={Circle} title="Circulo" alt="circle" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={this.addNewSquare}
            >
              <img className="img" src={Rectangle} title="Retangulo" alt="rectangle" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={this.addNewTriangle}
            >
              <img className="img" src={Triangule} title="Triangulo" alt="triangle" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={this.addNewText}
            >
              <img className="img" src={InsertText} title="Criar texto" alt="text" />
            </div>
            <div className="containerIconeToolbar">
              <div className="containerOpcao">
                {arrayObjectsLayer[indexTextSelected] ? (
                  <select
                    disabled={!arrayObjectsLayer[indexTextSelected]}
                    value={arrayObjectsLayer[indexTextSelected].fontSize}
                    onChange={this.changeFontSize}
                  >
                    {[...new Array(100)].map(
                      (i, index) =>
                        index > 5 && (
                          <option
                            key={index}
                            onClick={() =>
                              this.changeFontSize(`${index * zoom}px`)
                            }
                            value={index}
                          >
                            {`${index}px`}
                          </option>
                        )
                    )}
                  </select>
                ) : (
                  <select
                    disabled={true}
                    value={28}
                    onChange={this.changeFontSize}
                  />
                )}
              </div>
            </div>
            <div
              className="containerIconeToolbar"
              onClick={() =>
                this.changeStyle(
                  arrayObjectsLayer[indexTextSelected] &&
                    arrayObjectsLayer[indexTextSelected].fontStyle === "bold"
                    ? "normal"
                    : "bold"
                )
              }
              style={
                arrayObjectsLayer[indexTextSelected] &&
                arrayObjectsLayer[indexTextSelected].fontStyle === "bold"
                  ? { backgroundColor: "grey" }
                  : {}
              }
            >
              <img className="img" src={Bold} title="Negrito" alt="bold" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={() =>
                this.changeStyle(
                  arrayObjectsLayer[indexTextSelected] &&
                    arrayObjectsLayer[indexTextSelected].fontStyle === "italic"
                    ? "normal"
                    : "italic"
                )
              }
              style={
                arrayObjectsLayer[indexTextSelected] &&
                arrayObjectsLayer[indexTextSelected].fontStyle === "italic"
                  ? { backgroundColor: "grey" }
                  : {}
              }
            >
              <img className="img" src={Italic} title="Italico" alt="italic" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={() =>
                this.setUnderline(
                  arrayObjectsLayer[indexTextSelected] &&
                    arrayObjectsLayer[indexTextSelected].textDecoration === "underline"
                    ? ""
                    : "underline"
                )
              }
              style={
                arrayObjectsLayer[indexTextSelected] &&
                arrayObjectsLayer[indexTextSelected].textDecoration === "underline"
                  ? { backgroundColor: "grey" }
                  : {}
              }
            >
              <img className="img" src={Underline} title="Sublinhado" alt="underline" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={this.tooglePallet}
              style={showPallet ? { backgroundColor: "grey" } : {}}
            >
              <img className="img" src={FillColor} title="Cor" alt="color" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={this.duplicarObject}
            >
              <img className="img" src={Duplicate} title="Duplicar" alt="duplicate" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={() => this.zommStage(zoom + 1)}
            >
              <img className="img" src={ZoomOut} title="Zoom -" alt="zoom out" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={() => this.zommStage(zoom - 1)}
            >
              <img className="img" src={ZoomIn} title="Zoom +" alt="zoom in" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={() => this.trazerItem(true)}
            >
              <img className="img" src={Front} title="Trazer elemento para frente" alt="front" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={() => this.trazerItem()}
            >
              <img className="img" src={Back} title="Levar elemento para trás" alt="back" />
            </div>
            <div
              className="containerIconeToolbar"
              onClick={() => this.backgroundToogle()}
            >
              <img
                className="img"
                src={BackgroundIcon}
                title="Background"
                style={!backgroundOn ? { backgroundColor: "grey" } : {}}
                alt="background"
              />
            </div>
            {/* NEW: Preview Toggle Button */}
            <div
              className="containerIconeToolbar"
              onClick={() =>
                this.setState({ visiblePreview: !this.state.visiblePreview })
              }
              style={{ backgroundColor: this.state.visiblePreview ? "grey" : "" }}
            >
              <img
                className="img"
                src={Preview}
                title="Preview"
                style={!this.state.visiblePreview ? { backgroundColor: "grey" } : {}}
                alt="preview"
              />
            </div>
          </div>

          {/* Main Canvas */}
          <div>
            {showPallet && (
              <div onClick={this.tooglePallet} className="containerColors">
                <Draggable onDrag={this.handleDrag} {...dragHandlers}>
                  <div
                    className="containerColorPickerPalette"
                    onClick={e => e.stopPropagation()}
                  >
                    <ColorPickerPalette setObjColor={this.setObjColor} />
                    <div className="containerCirclePicker">
                      <CirclePicker
                        color={selectedObject.fill}
                        onChangeComplete={this.setObjColor}
                        onChange={this.setObjColor}
                      />
                    </div>
                  </div>
                </Draggable>
              </div>
            )}
            <div className={`container-area`}>
              {this.state.loading && (
                <Loading loading={this.state.loading} withOverlay={true} />
              )}
              <Stage
                scaleY={1 / zoom}
                scaleX={1 / zoom}
                ref={this.stageRef}
                width={width}
                height={height}
                onMouseDown={e => {
                  const clickedOnEmpty =
                    e.target === e.target.getStage();
                  if (clickedOnEmpty) {
                    this.selectShape(null);
                  }
                }}
              >
                <Layer>
                  {(showBackground && backgroundOn) && (
                    <Background width={5000} height={5000} />
                  )}
                  {arrayObjectsLayer &&
                    arrayObjectsLayer.map((item, index) => {
                      return item.type === "square" ? (
                        <Retangulo
                          key={index}
                          shapeProps={item}
                          isSelected={
                            selectedObject && item.id === selectedObject.id
                          }
                          onSelect={() => {
                            this.selectShape(item);
                          }}
                          onChange={newAttrs => {
                            const itemCopy = arrayObjectsLayer.slice();
                            itemCopy[index] = newAttrs;
                            this.setArrayObject(itemCopy);
                          }}
                        />
                      ) : item.type === "triangule" ? (
                        <Triangulo
                          key={index}
                          shapeProps={item}
                          isSelected={
                            selectedObject && item.id === selectedObject.id
                          }
                          onSelect={() => {
                            this.selectShape(item);
                          }}
                          onChange={newAttrs => {
                            const itemCopy = arrayObjectsLayer.slice();
                            itemCopy[index] = newAttrs;
                            this.setArrayObject(itemCopy);
                          }}
                        />
                      ) : item.type === "circle" ? (
                        <Circulo
                          key={index}
                          shapeProps={item}
                          isSelected={
                            selectedObject && item.id === selectedObject.id
                          }
                          onSelect={() => {
                            this.selectShape(item);
                          }}
                          onChange={newAttrs => {
                            const itemCopy = arrayObjectsLayer.slice();
                            itemCopy[index] = newAttrs;
                            this.setArrayObject(itemCopy);
                          }}
                        />
                      ) : item.type === "image" ? (
                        <Imagem
                          key={index}
                          shapeProps={item}
                          isSelected={
                            selectedObject && item.id === selectedObject.id
                          }
                          onSelect={() => {
                            this.selectShape(item);
                          }}
                          onChange={newAttrs => {
                            const itemCopy = arrayObjectsLayer.slice();
                            itemCopy[index] = newAttrs;
                            this.setArrayObject(itemCopy);
                          }}
                        />
                      ) : item.type === "text" ? (
                        <Texto
                          key={index}
                          onSelect={() => {
                            this.selectShape(item, index + 1);
                          }}
                          shapeProps={item}
                          isSelected={
                            selectedObject && item.id === selectedObject.id
                          }
                          handleTextDblClick={e =>
                            this.handleTextDblClick(e, index)
                          }
                          onChange={newAttrs => {
                            const itemCopy = arrayObjectsLayer.slice();
                            itemCopy[index] = newAttrs;
                            this.setArrayObject(itemCopy);
                          }}
                        />
                      ) : (
                        false
                      );
                    })}
                </Layer>
              </Stage>
            </div>
            {arrayObjectsLayer &&
              arrayObjectsLayer.map((item, index) => {
                return item ? (
                  <textarea
                    key={index}
                    value={item.textValue}
                    style={{
                      display: item.textEditVisible ? "block" : "none",
                      position: "absolute",
                      top: item.textYTextArea + "px",
                      left: item.textXTextArea * zoom + "px",
                      width: item.width * (1 / zoom),
                      height: item.height * (1 / zoom),
                      fontSize: item.fontSize * (1 / zoom),
                      color: item.fill,
                      fontStyle: item.fontStyle,
                      fontWeight: item.fontStyle,
                    }}
                    onChange={e => this.handleTextEdit(e, index)}
                  />
                ) : (
                  false
                );
              })}
          </div>
          <KeyboardEventHandler
            handleKeys={["backspace", "delete"]}
            onKeyEvent={this.deleteNodeSelected}
          />
        </div>

        {/* NEW: Preview Sidebar for Print */}
        <Sidebar
          visible={this.state.visiblePreview}
          position="right"
          style={{ width: "50vw", height: "100vh", overflowY: "auto" }}
          onHide={() => this.setState({ visiblePreview: false })}
          closeIcon={<div><Close /></div>}
        >
          <div className="previewSidebar" style={{ padding: "1rem" }}>
            <h3>Print Preview</h3>
            <div style={{ marginBottom: "1rem" }}>
              <label>
                Print Width:{" "}
                <input
                  type="number"
                  value={this.state.printSize.width}
                  onChange={e =>
                    this.setState({
                      printSize: {
                        ...this.state.printSize,
                        width: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <br />
              <label>
                Print Height:{" "}
                <input
                  type="number"
                  value={this.state.printSize.height}
                  onChange={e =>
                    this.setState({
                      printSize: {
                        ...this.state.printSize,
                        height: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
            </div>
            <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
              <Stage
                width={printSize.width}
                height={printSize.height}
              >
                <Layer>
                  {arrayObjectsLayer &&
                    arrayObjectsLayer.map((item, index) => {
                      if (item.type === "square") {
                        return <Retangulo key={index} shapeProps={item} />;
                      } else if (item.type === "triangule") {
                        return <Triangulo key={index} shapeProps={item} />;
                      } else if (item.type === "circle") {
                        return <Circulo key={index} shapeProps={item} />;
                      } else if (item.type === "image") {
                        return <Imagem key={index} shapeProps={item} />;
                      } else if (item.type === "text") {
                        return <Texto key={index} shapeProps={item} />;
                      } else {
                        return null;
                      }
                    })}
                </Layer>
              </Stage>
            </div>
          </div>
        </Sidebar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.profile.user,
});

export default connect(mapStateToProps)(Editor);
