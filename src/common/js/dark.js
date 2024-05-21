(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    echarts.registerTheme('dark', {
        "color": [
            "#409eff",
            "#c23531",
            "#61a0a8",
            "#d48265",
            "#91c7ae",
            "#749f83",
            "#ca8622",
            "#bda29a",
            "#6e7074",
            "#546570",
            "#c4ccd3"
        ],
        "backgroundColor": " #373737",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "rgba(255,255,255,0.6)"
            },
            "subtextStyle": {
                "color": "#aaa"
            }
        },
        "line": {
            "itemStyle": {
                "borderWidth": 1
            },
            "lineStyle": {
                "width": "2"
            },
            "symbolSize": "1",
            "symbol": "circle",
            "smooth": false
        },
        "radar": {
            "itemStyle": {
                "borderWidth": 1
            },
            "lineStyle": {
                "width": "1"
            },
            "symbolSize": "1",
            "symbol": "circle",
            "smooth": false
        },
        "bar": {
            "itemStyle": {
                "barBorderWidth": 0,
                "barBorderColor": "#ccc",
            },
            "emphasis": {
                "itemStyle": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc",
                }
            }
        },
        "pie": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc",
            },
            "emphasis": {
                "itemStyle": {
                    "borderWidth": 0,
                    "borderColor": "#ccc",
                }
            }
        },
        "scatter": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc",
            },
            "emphasis": {
                "itemStyle": {
                    "borderWidth": 0,
                    "borderColor": "#ccc",
                }
            }
        },
        "boxplot": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc",
            },
            "emphasis": {
                "itemStyle": {
                    "borderWidth": 0,
                    "borderColor": "#ccc",
                }
            }
        },
        "parallel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc",
            },
            "emphasis": {
                "itemStyle": {
                    "borderWidth": 0,
                    "borderColor": "#ccc",
                }
            }
        },
        "sankey": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc",
            },
            "emphasis": {
                "itemStyle": {
                    "borderWidth": 0,
                    "borderColor": "#ccc",
                }
            }
        },
        "funnel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc",
            },
            "emphasis": {
                "itemStyle": {
                    "borderWidth": 0,
                    "borderColor": "#ccc",
                }
            }
        },
        "gauge": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc",
            },
            "emphasis": {
                "itemStyle": {
                    "borderWidth": 0,
                    "borderColor": "#ccc",
                }
            }
        },
        "candlestick": {
            "itemStyle": {
                "color": "#c23531",
                "color0": "#314656",
                "borderColor": "#c23531",
                "borderColor0": "#314656",
                "borderWidth": 1,
            }
        },
        "graph": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc",
            },
            "lineStyle": {
                "width": 1,
                "color": "#aaa"
            },
            "symbolSize": "1",
            "symbol": "circle",
            "smooth": false,
            "color": [
                "#409eff",
                "#c23531",
                "#61a0a8",
                "#d48265",
                "#91c7ae",
                "#749f83",
                "#ca8622",
                "#bda29a",
                "#6e7074",
                "#546570",
                "#c4ccd3"
            ],
            "label": {
                "color": "#eee",
            }
        },
        "map": {
            "itemStyle": {
                "areaColor": "#eee",
                "borderColor": "#444",
                "borderWidth": 0.5,
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "rgba(255,215,0,0.8)",
                    "borderColor": "#444",
                    "borderWidth": 1,
                },
                "label": {
                    "color": "rgb(100,0,0)",
                }
            },
            "label": {
                "color": "#000",
            },
        },
        "geo": {
            "itemStyle": {
                "areaColor": "#eee",
                "borderColor": "#444",
                "borderWidth": 0.5,
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "rgba(255,215,0,0.8)",
                    "borderColor": "#444",
                    "borderWidth": 1,
                },
                "label": {
                    "color": "rgb(100,0,0)",
                }
            },
            "label": {
                "color": "#000",
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "rgba(255,255,255,0.6)"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "rgba(255,255,255,0.6)"
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": ["#cccccc", "#333333"]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "rgba(255,255,255,0.6)"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "rgba(255,255,255,0.6)"
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": ["#cccccc", "#333333"]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "rgba(255,255,255,0.6)"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "rgba(255,255,255,0.6)"
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": ["#cccccc", "#333333"]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "rgba(255,255,255,0.6)"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "rgba(255,255,255,0.6)"
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": ["#cccccc", "#333333"]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "borderColor": "#999",
            },
            "emphasis": {
                "iconStyle": {
                    "borderColor": "#666",
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "rgba(255,255,255,0.6)"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "rgba(255,255,255,0.6)",
                    "width": 1
                },
                "crossStyle": {
                    "color": "rgba(255,255,255,0.6)",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#293c55",
                "width": 1
            },
            "itemStyle": {
                "color": "#293c55",
                "borderWidth": 1,
            },
            "controlStyle": {
                "color": "#293c55",
                "borderColor": "#293c55",
                "borderWidth": 0.5,
            },
            "emphasis": {
                "itemStyle": {
                    "color": "#a9334c",
                },
                "controlStyle": {
                    "color": "#293c55",
                    "borderColor": "#293c55",
                    "borderWidth": 0.5
                },
                "label": {
                    "color": "#293c55",
                }
            },
            "checkpointStyle": {
                "color": "#e43c59",
                "borderColor": "rgba(194,53,49, 0.5)"
            },
            "label": {
                "color": "#293c55",
            }
        },
        "visualMap": {
            "color": [
                "#bf444c",
                "#d88273",
                "#f6efa6"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(47,69,84,0)",
            "dataBackgroundColor": "rgba(47,69,84,0.3)",
            "fillerColor": "rgba(167,183,204,0.4)",
            "handleColor": "#a7b7cc",
            "handleSize": "100%",
            "textStyle": {
                "color": "#333"
            }
        },
        "markPoint": {
            "label": {
                "color": "#eee",
            },
            "emphasis": {
                "label": {
                    "color": "#eee",
                }
            }
        }
    });
}));
