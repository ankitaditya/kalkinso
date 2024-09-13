import ChatScreen from "../../ChatScreen/ChatScreen";
import { nodes, renderTree } from "./CarbonReactConfig";

export const AIReactBaseConfig =  {
    "DataTable": {
      "rows": [
        { "id": "a", "name": "Product A", "sales": 1200 },
        { "id": "b", "name": "Product B", "sales": 800 },
        { "id": "c", "name": "Product C", "sales": 600 }
      ],
      "headers": [
        { "key": "name", "header": "Product Name" },
        { "key": "sales", "header": "Sales" }
      ],
      "style": {
        "marginTop": "2rem"
      }
    },
    "LineChart": {
      "data": [
        {
          "group": "Dataset 1",
          "date": "2023-01-01",
          "value": 5000
        },
        {
          "group": "Dataset 1",
          "date": "2023-02-01",
          "value": 6000
        },
        {
          "group": "Dataset 1",
          "date": "2023-03-01",
          "value": 7000
        }
      ],
      "options":{
        "title": "Sales Performance",
        "axes": {
            "bottom": {
                "title": "Date",
                "mapsTo": "date",
                "scaleType": "time"
                },
            "left": {
                "title": "Sales",
                "mapsTo": "value",
                "scaleType": "linear"
                }
            },
        height: '400px',
        },
      "style": {
        "height": "400px",
        "marginTop": "2rem"
      }
    }
  };

  export const AIReactChatConfig = {
    "Tile":{
        "SubComponent": {
            "Breadcrumb": {
              "ariaLabel": "Page navigation",
              "SubComponent": {
                "BreadcrumbItem":[
                {
                  "href": "/#/home/",
                  "label": "Home",
                  "children": "Home"
                },
                {
                  "href": "/#/test-component/",
                  "label": "Assistance",
                  "children": "Assistance"
                },
                {
                  "href": "/#/test-component/",
                  "label": "Chat",
                  "children": "Chat"
                }
              ]},
              "style": {
                "marginBottom": "1rem",
              }
            },

            "Grid": {
                    "SubComponent": {
                        "Column": [{
                        "lg": 10,
                        "md": 4,
                        "sm": 2,
                        "SubComponent": {
                            "DataTable": {
                              "rows": [
                                { "id": "a", "name": "Product A", "sales": 1200 },
                                { "id": "b", "name": "Product B", "sales": 800 },
                                { "id": "c", "name": "Product C", "sales": 600 }
                              ],
                              "headers": [
                                { "key": "name", "header": "Product Name" },
                                { "key": "sales", "header": "Sales" }
                              ],
                              "style": {
                                "marginTop": "2rem"
                              }
                            },
                            "LineChart": {
                              "data": [
                                {
                                  "group": "Dataset 1",
                                  "date": "2023-01-01",
                                  "value": 5000
                                },
                                {
                                  "group": "Dataset 1",
                                  "date": "2023-02-01",
                                  "value": 6000
                                },
                                {
                                  "group": "Dataset 1",
                                  "date": "2023-03-01",
                                  "value": 7000
                                }
                              ],
                              "options":{
                                "title": "Sales Performance",
                                "axes": {
                                    "bottom": {
                                        "title": "Date",
                                        "mapsTo": "date",
                                        "scaleType": "time"
                                        },
                                    "left": {
                                        "title": "Sales",
                                        "mapsTo": "value",
                                        "scaleType": "linear"
                                        }
                                    },
                                height: '400px',
                                },
                              "style": {
                                "height": "400px",
                                "marginTop": "2rem"
                              }
                            }
                          },
                        },
                        {
                        "lg": 6,
                        "md": 4,
                        "sm": 2,
                        "SubComponent": {
                            "Tile": {
                            "children": "Ease Assistance",
                            "SubComponent": {
                                "Tile": [
                                {
                                    "children": "Messages",
                                    "SubComponent": {
                                    "ExpressiveCard": [
                                        {
                                        "description": "Hello! How can I help you today?",
                                        "label": "bot",
                                        "title": "10:00 AM",
                                        "style": {
                                            "padding": "0.5rem",
                                            "borderRadius": "8px",
                                            "backgroundColor": "#e0e0e0",
                                            "marginBottom": "0.5rem",
                                            "alignSelf": "flex-start",
                                            "maxWidth": "80%"
                                        }
                                        },
                                        {
                                        "description": "I need some information about your services.",
                                        "label": "user",
                                        "title": "10:01 AM",
                                        "style": {
                                            "padding": "0.5rem",
                                            "borderRadius": "8px",
                                            "backgroundColor": "#0078d4",
                                            "color": "white",
                                            "marginBottom": "0.5rem",
                                            "alignSelf": "flex-end",
                                            "maxWidth": "80%",
                                            "marginLeft": "auto"
                                        }
                                        }
                                    ],
                                    },
                                    "style": {
                                    "flexGrow": "1",
                                    "padding": "1rem",
                                    "overflowY": "auto",
                                    "backgroundColor": "#f9f9f9"
                                    }
                                },
                                {
                                    "SubComponent": {
                                    "FluidForm": {
                                        "SubComponent": {
                                        "TextInput": {
                                            "id": "chat-input",
                                            "placeholder": "Type a message...",
                                            "style": {
                                            "flexGrow": "1",
                                            "marginRight": "0.5rem"
                                            }
                                        },
                                        "Button": [
                                            {
                                            "children": "Attach",
                                            "onClick": ()=>{console.log("Attach file")},
                                            "kind": "ghost",
                                            "style": {
                                            }
                                            },
                                            {
                                            "children": "Send",
                                            "kind": "ghost",
                                            "onClick": ()=>{console.log("Send message")},
                                            "style": {}
                                            }
                                        ]
                                        },
                                        "style": {
                                        "display": "flex",
                                        "padding": "0.5rem",
                                        //   "borderTop": "1px solid #ccc",
                                        "backgroundColor": "#fff"
                                        }
                                    }
                                    },
                                    "style": {
                                    "display": "flex",
                                    "padding": "0.5rem",
                                    "borderTop": "1px solid #ccc",
                                    "backgroundColor": "#fff"
                                    }
                                }
                                ],
                            },
                            "style": {
                                "width": "30vw",
                                "height": "80vh",
                                "border": "1px solid #ccc",
                                "borderRadius": "8px",
                                "display": "flex",
                                "flexDirection": "column",
                                "overflow": "hidden",
                                "fontFamily": "Arial, sans-serif",
                                "marginLeft": "auto",
                            }
                            }
                        }
                        }
                    ]
                    }
                },
            "Loading": {
              "description": "Loading chat...",
              "active": false,
              "style": {
                "position": "absolute",
                "top": "50%",
                "left": "50%",
                "transform": "translate(-50%, -50%)"
              }
            },
            "InlineLoading": {
              "description": "Sending message...",
              "status": "active",
              "ariaLive": "polite",
              "style": {
                "display": "none"
              }
            },
            "Modal": {
              "open": false,
              "passiveModal": true,
              "modalHeading": "Chat Settings",
              "primaryButtonText": "Save",
              "secondaryButtonText": "Cancel",
              "SubComponent": {
                  "RadioButton": {
                    "labelText": "Enable notifications",
                    "value": "notifications",
                    "id": "notifications",
                    "name": "settings",
                    "checked": true,
                    "style": {
                      "marginBottom": "1rem"
                    }
                  },
                  "Checkbox": {
                    "labelText": "Enable sound",
                    "id": "sound",
                    "checked": true,
                    "style": {
                      "marginBottom": "1rem"
                    }
                  }
                },
              "style": {}
            }
          },
          "style":{
            "display": "flex",
            "flexDirection": "column",
            "height": "100%",
          }
    }
  };

export const AIReactDashboardConfig = {
    "Tile": {
      "SubComponent": {
        "Grid": {
            "SubComponent": {
              "Column": [
                {
                  "lg": 3,
                  "SubComponent": {
                    "Tile": {
                      "children": "Left Sidebar",
                      "SubComponent": {
                          "TreeView": {
                            "label": "Sample TreeView",
                            "selected": ["1-1-1"],
                            "active": ["1"],
                            "hideLabel": false,
                            "children": renderTree({
                              nodes,
                              withIcons: true
                            }),
                          }
                        }
                        ,
                      "style": {
                        "padding": "1rem",
                        "backgroundColor": "#f4f4f4"
                      }
                    }
                  }
                },
                {
                  "lg": 8,
                  "SubComponent": {
                    "Tile": {
                      "children": "Middle Column - Wall Posts",
                      "SubComponent": {
                          "TableContainer": {
                            "title": "Employee DataTable",
                            "description": "With expandable rows for detailed information",
                            "SubComponent": {
                              "Table": {
                                "aria-label": "sample table",
                                "SubComponent": {
                                  "TableHead": {
                                    "SubComponent": {
                                      "TableRow": {
                                        "SubComponent": {
                                          "TableExpandHeader": {
                                            "aria-label": "expand row"
                                          },
                                          "TableHeader": [
                                            {
                                              "key": 0,
                                              "header": "Name",
                                              "children": "Name"
                                            },
                                            {
                                              "key": 1,
                                              "header": "Age",
                                              "children": "Age"
                                            },
                                            {
                                              "key": 2,
                                              "header": "Location",
                                              "children": "Location"
                                            },
                                            {
                                              "key": 3,
                                              "header": "Department",
                                              "children": "Department"
                                            },
                                            {
                                              "key": 4,
                                              "header": "Summary",
                                              "children": "Summary"
                                            }
                                          ]
                                        }
                                      }
                                    }
                                  },
                                  "TableBody": {
                                    "SubComponent": {
                                      "TableExpandRow": [
                                        {
                                          "key": "1",
                                          "SubComponent": {
                                            "TableCell": [
                                              {
                                                "key": "1-name",
                                                "children": "John Doe"
                                              },
                                              {
                                                "key": "1-age",
                                                "children": "29"
                                              },
                                              {
                                                "key": "1-location",
                                                "children": "New York"
                                              },
                                              {
                                                "key": "1-department",
                                                "children": "Engineering"
                                              }
                                            ],
                                            "TableExpandedRow": {
                                              "colSpan": 5,
                                              "className": "demo-expanded-td",
                                              "SubComponent": {
                                                "Tile": [
                                                  {
                                                    "children": "John Doe's detailed information"
                                                  },
                                                  {
                                                    "children": "Role: Senior Engineer"
                                                  },
                                                  {
                                                    "children": "Joined: 2015"
                                                  },
                                                  {
                                                    "children": "Project: XYZ"
                                                  }
                                                ]
                                              }
                                            }
                                          }
                                        },
                                        {
                                          "key": "2",
                                          "SubComponent": {
                                            "TableCell": [
                                              {
                                                "key": "2-name",
                                                "children": "Jane Smith"
                                              },
                                              {
                                                "key": "2-age",
                                                "children": "34"
                                              },
                                              {
                                                "key": "2-location",
                                                "children": "San Francisco"
                                              },
                                              {
                                                "key": "2-department",
                                                "children": "Marketing"
                                              }
                                            ],
                                            "TableExpandedRow": {
                                              "colSpan": 5,
                                              "className": "demo-expanded-td",
                                              "SubComponent": {
                                                "Tile": [
                                                  {
                                                    "children": "Jane Smith's detailed information"
                                                  },
                                                  {
                                                    "children": "Role: Marketing Manager"
                                                  },
                                                  {
                                                    "children": "Joined: 2018"
                                                  },
                                                  {
                                                    "children": "Campaign: ABC"
                                                  }
                                                ]
                                              }
                                            }
                                          }
                                        },
                                        {
                                          "key": "3",
                                          "SubComponent": {
                                            "TableCell": [
                                              {
                                                "key": "3-name",
                                                "children": "Sam Johnson"
                                              },
                                              {
                                                "key": "3-age",
                                                "children": "45"
                                              },
                                              {
                                                "key": "3-location",
                                                "children": "Los Angeles"
                                              },
                                              {
                                                "key": "3-department",
                                                "children": "Sales"
                                              }
                                            ],
                                            "TableExpandedRow": {
                                              "colSpan": 5,
                                              "className": "demo-expanded-td",
                                              "SubComponent": {
                                                "Tile": [
                                                  {
                                                    "children": "Sam Johnson's detailed information"
                                                  },
                                                  {
                                                    "children": "Role: Sales Director"
                                                  },
                                                  {
                                                    "children": "Joined: 2010"
                                                  },
                                                  {
                                                    "children": "Region: West Coast"
                                                  }
                                                ]
                                              }
                                            }
                                          }
                                        },
                                        {
                                          "key": "4",
                                          "SubComponent": {
                                            "TableCell": [
                                              {
                                                "key": "4-name",
                                                "children": "Emily Davis"
                                              },
                                              {
                                                "key": "4-age",
                                                "children": "40"
                                              },
                                              {
                                                "key": "4-location",
                                                "children": "Chicago"
                                              },
                                              {
                                                "key": "4-department",
                                                "children": "Finance"
                                              }
                                            ],
                                            "TableExpandedRow": {
                                              "colSpan": 5,
                                              "className": "demo-expanded-td",
                                              "SubComponent": {
                                                "Tile": [
                                                  {
                                                    "children": "Emily Davis's detailed information"
                                                  },
                                                  {
                                                    "children": "Role: CFO"
                                                  },
                                                  {
                                                    "children": "Joined: 2012"
                                                  },
                                                  {
                                                    "children": "Responsibilities: Financial Planning"
                                                  }
                                                ]
                                              }
                                            }
                                          }
                                        }
                                      ]
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }                          
                        ,
                      "style": {
                        // "padding": "1rem",
                        "backgroundColor": "#fff"
                      }
                    }
                  }
                },
                {
                  "lg": 5,
                  "SubComponent": {
                    "Tile": {
                      "children": <ChatScreen />,
                      // "SubComponent": {
                      //   "Tile": {
                      //     "children": "Ease Assistance",
                      //     "SubComponent": {
                      //       "Tile": [
                      //         {
                      //           "children": "Messages",
                      //           "SubComponent": {
                      //             "ExpressiveCard": [
                      //               {
                      //                 "description": "Hello! How can I help you today?",
                      //                 "label": "bot",
                      //                 "title": "10:00 AM",
                      //                 "style": {
                      //                   "padding": "0.5rem",
                      //                   "borderRadius": "8px",
                      //                   "backgroundColor": "#e0e0e0",
                      //                   "marginBottom": "0.5rem",
                      //                   "alignSelf": "flex-start",
                      //                   "maxWidth": "80%"
                      //                 }
                      //               },
                      //               {
                      //                 "description": "I need some information about your services.",
                      //                 "label": "user",
                      //                 "title": "10:01 AM",
                      //                 "style": {
                      //                   "padding": "0.5rem",
                      //                   "borderRadius": "8px",
                      //                   "backgroundColor": "#0078d4",
                      //                   "color": "white",
                      //                   "marginBottom": "0.5rem",
                      //                   "alignSelf": "flex-end",
                      //                   "maxWidth": "80%",
                      //                   "marginLeft": "auto"
                      //                 }
                      //               }
                      //             ]
                      //           },
                      //           "style": {
                      //             "flexGrow": "1",
                      //             "padding": "1rem",
                      //             "overflowY": "auto",
                      //             "backgroundColor": "#f9f9f9"
                      //           }
                      //         },
                      //         {
                      //           "SubComponent": {
                      //             "FluidForm": {
                      //               "SubComponent": {
                      //                 "TextInput": {
                      //                   "id": "chat-input",
                      //                   "placeholder": "Type a message...",
                      //                   "style": {
                      //                     "flexGrow": "1",
                      //                     "marginRight": "0.5rem"
                      //                   }
                      //                 },
                      //                 "Button": [
                      //                   {
                      //                     "children": "Attach",
                      //                     "onClick": "Attach file",
                      //                     "kind": "ghost",
                      //                     "style": {}
                      //                   },
                      //                   {
                      //                     "children": "Send",
                      //                     "kind": "ghost",
                      //                     "onClick": "Send message",
                      //                     "style": {}
                      //                   }
                      //                 ]
                      //               },
                      //               "style": {
                      //                 "display": "flex",
                      //                 "padding": "0.5rem",
                      //                 "backgroundColor": "#fff"
                      //               }
                      //             }
                      //           },
                      //           "style": {
                      //             "display": "flex",
                      //             "padding": "0.5rem",
                      //             "borderTop": "1px solid #ccc",
                      //             "backgroundColor": "#fff"
                      //           }
                      //         }
                      //       ]
                      //     },
                      //     "style": {
                      //       "width": "100%",
                      //       "height": "80vh",
                      //       "border": "1px solid #ccc",
                      //       "borderRadius": "8px",
                      //       "display": "flex",
                      //       "flexDirection": "column",
                      //       "overflow": "hidden",
                      //       "fontFamily": "Arial, sans-serif"
                      //     }
                      //   }
                      // },
                      "style": {
                      //   "padding": "1rem",
                        "backgroundColor": "#f4f4f4"
                      }
                    }
                  }
                }
              ]
            }
          },
      },
      "style": {
        "display": "flex",
        "flexDirection": "column",
        "height": "80%"
      }
    }
  }
  
  
  