import { 
    Accordion, 
    Breadcrumb, 
    BreadcrumbItem, 
    Button, 
    Checkbox, 
    CodeSnippet, 
    ContentSwitcher, 
    DataTable, 
    DatePicker, 
    Dropdown, 
    FileUploader, 
    Form, 
    InlineLoading, 
    Link,  
    Loading, 
    Modal,  
    NumberInput, 
    OverflowMenu, 
    Pagination, 
    ProgressBar, 
    ProgressIndicator, 
    RadioButton, 
    RadioButtonGroup, 
    Search, 
    Select, 
    Slider, 
    Tabs, 
    Tag, 
    TextInput, 
    Tile, 
    Toggle, 
    Tooltip,
    FluidForm,
    Tab,
    Row,
    Column,
    Grid,
    TabList,
    TabPanels,
    TabPanel,
    Heading,
    Layer,
    Table,
    TableExpandRow,
    TableContainer,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
    TableExpandedRow,
    TableExpandHeader,
    TreeView,
    TreeNode
  } from '@carbon/react';
  import { LineChart, PieChart, DonutChart, StackedBarChart, GaugeChart } from '@carbon/charts-react';
import { Chart } from '@carbon/charts';
import { ExpressiveCard, pkg } from '@carbon/ibm-products';
import { TableBody } from 'carbon-components-react';
import { Document, Folder } from '@carbon/react/icons';
// import TreeView, { TreeNode } from 'carbon-components-react/lib/components/TreeView';
pkg.component.ExpressiveCard = true;
  
  export const AllComponents = {
    "Accordion": {
      "component": Accordion,
      "propsTypes": {
        "align": "string",
        "size": "string"
      }
    },
    "Breadcrumb": {
      "component": Breadcrumb,
      "propsTypes": {
        "children": "node",
        "noTrailingSlash": "bool"
      }
    },
    "Button": {
      "component": Button,
      "propsTypes": {
        "children": "node",
        "className": "string",
        "disabled": "bool",
        "kind": "string",
        "onClick": "func",
        "size": "string",
        "type": "string"
      }
    },
    "Checkbox": {
      "component": Checkbox,
      "propsTypes": {
        "checked": "bool",
        "className": "string",
        "disabled": "bool",
        "id": "string",
        "indeterminate": "bool",
        "labelText": "node",
        "onChange": "func"
      }
    },
    "CodeSnippet": {
      "component": CodeSnippet,
      "propsTypes": {
        "type": "string",
        "children": "node",
        "feedback": "string",
        "onClick": "func"
      }
    },
    "ContentSwitcher": {
      "component": ContentSwitcher,
      "propsTypes": {
        "children": "node",
        "className": "string",
        "onChange": "func",
        "selectedIndex": "number"
      }
    },
    "DataTable": {
      "component": DataTable,
      "propsTypes": {
        "rows": "array",
        "headers": "array",
        "render": "func",
        "sortRow": "func",
        "filterRows": "func"
      }
    },
    "DatePicker": {
      "component": DatePicker,
      "propsTypes": {
        "dateFormat": "string",
        "datePickerType": "string",
        "onChange": "func",
        "value": "array",
        "minDate": "string",
        "maxDate": "string"
      }
    },
    "Dropdown": {
      "component": Dropdown,
      "propsTypes": {
        "ariaLabel": "string",
        "disabled": "bool",
        "id": "string",
        "items": "array",
        "label": "node",
        "onChange": "func"
      }
    },
    "FileUploader": {
      "component": FileUploader,
      "propsTypes": {
        "labelTitle": "node",
        "labelDescription": "node",
        "buttonLabel": "node",
        "multiple": "bool",
        "accept": "array",
        "onChange": "func"
      }
    },
    "Form": {
      "component": Form,
      "propsTypes": {
        "children": "node",
        "className": "string",
        "onSubmit": "func"
      }
    },
    "InlineLoading": {
      "component": InlineLoading,
      "propsTypes": {
        "status": "string",
        "description": "string",
        "success": "bool"
      }
    },
    "Link": {
      "component": Link,
      "propsTypes": {
        "href": "string",
        "className": "string",
        "children": "node"
      }
    },
    "Loading": {
      "component": Loading,
      "propsTypes": {
        "active": "bool",
        "className": "string",
        "description": "string",
        "small": "bool",
        "withOverlay": "bool"
      }
    },
    "Modal": {
      "component": Modal,
      "propsTypes": {
        "open": "bool",
        "className": "string",
        "modalHeading": "string",
        "modalLabel": "string",
        "primaryButtonText": "string",
        "secondaryButtonText": "string",
        "onRequestClose": "func",
        "onRequestSubmit": "func"
      }
    },
    "NumberInput": {
      "component": NumberInput,
      "propsTypes": {
        "id": "string",
        "label": "node",
        "min": "number",
        "max": "number",
        "step": "number",
        "value": "number",
        "onChange": "func"
      }
    },
    "OverflowMenu": {
      "component": OverflowMenu,
      "propsTypes": {
        "iconDescription": "string",
        "direction": "string",
        "flipped": "bool",
        "menuOffset": "object"
      }
    },
    "Pagination": {
      "component": Pagination,
      "propsTypes": {
        "pageSize": "number",
        "pageSizes": "array",
        "totalItems": "number",
        "onChange": "func"
      }
    },
    "ProgressBar": {
      "component": ProgressBar,
      "propsTypes": {
        "label": "node",
        "max": "number",
        "value": "number"
      }
    },
    "ProgressIndicator": {
      "component": ProgressIndicator,
      "propsTypes": {
        "currentIndex": "number",
        "children": "node",
        "onChange": "func"
      }
    },
    "RadioButton": {
      "component": RadioButton,
      "propsTypes": {
        "value": "string",
        "labelText": "node",
        "id": "string",
        "name": "string",
        "onChange": "func"
      }
    },
    "Search": {
      "component": Search,
      "propsTypes": {
        "labelText": "node",
        "placeholder": "string",
        "onChange": "func",
        "onSearch": "func"
      }
    },
    "Select": {
      "component": Select,
      "propsTypes": {
        "id": "string",
        "labelText": "node",
        "disabled": "bool",
        "children": "node",
        "defaultValue": "string",
        "helperText": "node",
        "onChange": "func"
      }
    },
    "Slider": {
      "component": Slider,
      "propsTypes": {
        "value": "number",
        "min": "number",
        "max": "number",
        "step": "number",
        "labelText": "node",
        "onChange": "func"
      }
    },
    "Tabs": {
      "component": Tabs,
      "propsTypes": {
        "selected": "number",
        "children": "node",
        "onChange": "func"
      }
    },
    "Tag": {
      "component": Tag,
      "propsTypes": {
        "type": "string",
        "title": "string",
        "className": "string"
      }
    },
    "TextInput": {
      "component": TextInput,
      "propsTypes": {
        "id": "string",
        "labelText": "node",
        "type": "string",
        "disabled": "bool",
        "helperText": "node",
        "onChange": "func"
      }
    },
    "Tile": {
      "component": Tile,
      "propsTypes": {
        "className": "string",
        "light": "bool",
        "onClick": "func"
      }
    },
    "Toggle": {
      "component": Toggle,
      "propsTypes": {
        "id": "string",
        "labelA": "string",
        "labelB": "string",
        "toggled": "bool",
        "onChange": "func"
      }
    },
    "Tooltip": {
      "component": Tooltip,
      "propsTypes": {
        "direction": "string",
        "triggerText": "node",
        "tooltipText": "node"
      }
    },
    "LineChart": {
    "component": LineChart,
    "propsTypes": {
      "data": "array",
      "options": "object",
      "style": "object"
    }
  },
  "Chart": {
    "component": Chart,
    "propsTypes": {
      "data": "array",
      "options": "object",
      "style": "object"
    }
  },
  "PieChart": {
    "component": PieChart,
    "propsTypes": {
      "data": "array",
      "options": "object",
      "style": "object"
    }
  },
  "DonutChart": {
    "component": DonutChart,
    "propsTypes": {
      "data": "array",
      "options": "object",
      "style": "object"
    }
  },
  "StackedBarChart": {
    "component": StackedBarChart,
    "propsTypes": {
      "data": "array",
      "options": "object",
      "style": "object"
    }
  },
  "GaugeChart": {
    "component": GaugeChart,
    "propsTypes": {
      "data": "array",
      "options": "object",
      "style": "object"
    }
  }

}


export const ComponentMap = { 
    Accordion, 
    Breadcrumb, 
    Button, 
    Checkbox, 
    CodeSnippet, 
    ContentSwitcher, 
    DataTable, 
    DatePicker, 
    Dropdown, 
    FileUploader, 
    Form, 
    InlineLoading, 
    Link,  
    Loading, 
    Modal,  
    NumberInput, 
    OverflowMenu, 
    Pagination, 
    ProgressBar, 
    ProgressIndicator, 
    RadioButton, 
    Search, 
    Select, 
    Slider, 
    TreeView,
    TreeNode,
    Tabs, 
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    Tag, 
    TextInput, 
    Row,
    Column,
    Tile, 
    Toggle, 
    Tooltip,
    ExpressiveCard,
    BreadcrumbItem,
    RadioButtonGroup,
    FluidForm,
    Grid,
    LineChart, 
    PieChart, 
    DonutChart, 
    StackedBarChart, 
    GaugeChart,
    Chart,
    Heading,
    Layer,
    Table,
    TableExpandRow,
    TableExpandedRow,
    TableExpandHeader,
    TableBody,
    TableContainer,
    TableHeader,
    TableRow,
    TableHead,
    TableCell
  };

export const nodes = [{
    id: '1',
    value: 'Artificial intelligence',
    label: <span>Artificial intelligence</span>,
    renderIcon: Document
  }, {
    id: '2',
    value: 'Blockchain',
    label: 'Blockchain',
    renderIcon: Document
  }, {
    id: '3',
    value: 'Business automation',
    label: 'Business automation',
    renderIcon: Folder,
    children: [{
      id: '3-1',
      value: 'Business process automation',
      label: 'Business process automation',
      renderIcon: Document
    }, {
      id: '3-2',
      value: 'Business process mapping',
      label: 'Business process mapping',
      renderIcon: Document
    }]
  }, {
    id: '4',
    value: 'Business operations',
    label: 'Business operations',
    renderIcon: Document
  }, {
    id: '5',
    value: 'Cloud computing',
    label: 'Cloud computing',
    isExpanded: true,
    renderIcon: Folder,
    children: [{
      id: '5-1',
      value: 'Containers',
      label: 'Containers',
      renderIcon: Document
    }, {
      id: '5-2',
      value: 'Databases',
      label: 'Databases',
      renderIcon: Document
    }, {
      id: '5-3',
      value: 'DevOps',
      label: 'DevOps',
      isExpanded: true,
      renderIcon: Folder,
      children: [{
        id: '5-4',
        value: 'Solutions',
        label: 'Solutions',
        renderIcon: Document
      }, {
        id: '5-5',
        value: 'Case studies',
        label: 'Case studies',
        isExpanded: true,
        renderIcon: Folder,
        children: [{
          id: '5-6',
          value: 'Resources',
          label: 'Resources',
          renderIcon: Document
        }]
      }]
    }]
  }, {
    id: '6',
    value: 'Data & Analytics',
    label: 'Data & Analytics',
    renderIcon: Folder,
    children: [{
      id: '6-1',
      value: 'Big data',
      label: 'Big data',
      renderIcon: Document
    }, {
      id: '6-2',
      value: 'Business intelligence',
      label: 'Business intelligence',
      renderIcon: Document
    }]
  }, {
    id: '7',
    value: 'Models',
    label: 'Models',
    isExpanded: true,
    // disabled: true,
    renderIcon: Folder,
    children: [{
      id: '7-1',
      value: 'Audit',
      label: 'Audit',
      renderIcon: Document
    }, {
      id: '7-2',
      value: 'Monthly data',
      label: 'Monthly data',
      renderIcon: Document
    }, {
      id: '8',
      value: 'Data warehouse',
      label: 'Data warehouse',
      isExpanded: true,
      renderIcon: Folder,
      children: [{
        id: '8-1',
        value: 'Report samples',
        label: 'Report samples',
        renderIcon: Document
      }, {
        id: '8-2',
        value: 'Sales performance',
        label: 'Sales performance',
        renderIcon: Document
      }]
    }]
  }];
export function renderTree({
    nodes,
    expanded,
    withIcons = false
  }) {
    if (!nodes) {
      return;
    }
    return nodes.map(({
      children,
      renderIcon,
      isExpanded,
      ...nodeProps
    }) => <TreeNode key={nodeProps.id} renderIcon={withIcons ? renderIcon : null} isExpanded={expanded ?? isExpanded} {...nodeProps}>
        {renderTree({
        nodes: children,
        expanded,
        withIcons
      })}
      </TreeNode>);
  }