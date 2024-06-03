const upColor = "#55C860";
const downColor = "#FD4938";
const noChangeColor = "#7D919D";
export const klineConfig = {
    // 类别
    grid: {
        show: true,
        horizontal: {
            show: false,
            size: 1,
            color: "#E3E7EC",
            style: "dashed",
            dashedValue: [2, 2]
        },
        vertical: {
            show: true,
            size: 1,
            color: "#E3E7EC",
            style: "dashed",
            dashedValue: [2, 2]
        }
    },
    separator: {
        size: 0,
        color: "#888888",
        fill: true,
        activeBackgroundColor: "rgba(230, 230, 230, .15)"
    },
    candle: {
        type: "area", // area, candle_solid
        tooltip: {
            showRule: "follow_cross", // none
            showType: "rect",
            rect: {
                // 'fixed' | 'pointer'
                position: "fixed",
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 4,
                paddingBottom: 4,
                offsetLeft: 4,
                offsetTop: 4,
                offsetRight: 4,
                offsetBottom: 4,
                borderRadius: 4,
                borderSize: 1,
                borderColor: "#f2f3f5",
                color: "#FEFEFE"
            }
        },
        bar: {
            upColor,
            downColor,
            noChangeColor,
            upBorderColor: upColor,
            downBorderColor: downColor,
            noChangeBorderColor: noChangeColor,
            upWickColor: upColor,
            downWickColor: downColor,
            noChangeWickColor: noChangeColor
        },
        area: {
            lineSize: 2,
            lineColor: "#3B82F6",
            backgroundColor: [
                {
                    offset: 0,
                    color: "rgba(59, 130, 246, 0.01)"
                },
                {
                    offset: 1,
                    color: "rgba(59, 130, 246, 0.2)"
                }
            ],
            smooth: true,
            point: {
                show: true,
                color: "rgba(59, 130, 246, 0.5)",
                radius: 4,
                rippleColor: "rgba(59, 130, 246, 0.3)", // getAlphaBlue(0.3),
                rippleRadius: 8,
                animation: true,
                animationDuration: 1000
            }
        },
        priceMark: {
            show: true,
            // 最高价标记
            high: {
                show: true,
                color: "#D9D9D9",
                textOffset: 5,
                textSize: 10,
                textFamily: "Helvetica Neue",
                textWeight: "normal"
            },
            // 最低价标记
            low: {
                show: true,
                color: "#D9D9D9",
                textOffset: 5,
                textSize: 10,
                textFamily: "Helvetica Neue",
                textWeight: "normal"
            },
            // 最新价标记
            last: {
                show: true,
                upColor,
                downColor,
                noChangeColor,
                line: {
                    show: true,
                    // 'solid' | 'dashed'
                    style: "dashed",
                    dashedValue: [4, 4],
                    size: 1
                },
                text: {
                    show: true,
                    // 'fill' | 'stroke' | 'stroke_fill'
                    style: "fill",
                    size: 12,
                    paddingLeft: 4,
                    paddingTop: 4,
                    paddingRight: 4,
                    paddingBottom: 4,
                    // 'solid' | 'dashed'
                    borderStyle: "solid",
                    borderSize: 0,
                    borderColor: "transparent",
                    borderDashedValue: [2, 2],
                    color: "#FFFFFF",
                    family: "Helvetica Neue",
                    weight: "normal",
                    borderRadius: 2
                }
            }
        }
    },
    indicator: {
        tooltip: {
            showRule: "none", // 'none'
            showType: "standard",
            custom: [
                { title: "time", value: "{time}" },
                { title: "open", value: "{open}" },
                { title: "high", value: "{high}" },
                { title: "low", value: "{low}" },
                { title: "close", value: "{close}" },
                { title: "volume", value: "{volume}" }
            ]
        },
        bars: [
            {
                // 'fill' | 'stroke' | 'stroke_fill'
                style: "fill",
                // 'solid' | 'dashed'
                borderStyle: "solid",
                borderSize: 1,
                borderDashedValue: [2, 2],
                upColor: "rgba(85, 200, 96, .5)",
                downColor: "rgba(253, 73, 56, .5)",
                noChangeColor: "rgba(125, 145, 157, .5)"
            }
        ],
        lines: [
            {
                // 'solid' | 'dashed'
                style: "solid",
                smooth: false,
                size: 1,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)" // '#FF9600'
            },
            {
                style: "solid",
                smooth: false,
                size: 1,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)"
                // color: '#935EBD'
            },
            {
                style: "solid",
                smooth: false,
                size: 1,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)"
                // color: '#2196F3'
            },
            {
                style: "solid",
                smooth: false,
                size: 1,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)"
                // color: '#E11D74'
            },
            {
                style: "solid",
                smooth: false,
                size: 1,
                dashedValue: [2, 2],
                color: "rgba(0,0,0,0)"
                // color: '#01C5C4'
            }
        ]
    },
    xAxis: {
        show: true,
        size: "auto",
        // x轴线
        axisLine: {
            show: true,
            color: "#9EA3AE", // "#888888",
            size: 0.5
        },
        // x轴分割文字
        tickText: {
            show: true,
            color: "#9EA3AE", // #D9D9D9"
            family: "Helvetica Neue",
            weight: "normal",
            size: 12,
            marginStart: 0, // 4,
            marginEnd: 0 // 4
        },
        // x轴分割线
        tickLine: {
            show: true,
            size: 0.5,
            length: 3,
            color: "#9EA3AE" // "#888888"
        }
    },
    // y轴
    yAxis: {
        show: true,
        size: "auto",
        // 'left' | 'right'
        position: "right",
        // 'normal' | 'percentage' | 'log'
        type: "normal",
        inside: true,
        reverse: false,
        // y轴线
        axisLine: {
            show: true,
            color: "#888", // #888
            size: 0.5
        },
        // x轴分割文字
        tickText: {
            show: true,
            color: "#9EA3AE", // #D9D9D9
            family: "Helvetica Neue",
            weight: "normal",
            size: 12,
            marginStart: 0, // 4,
            marginEnd: 0 //4
        },
        // x轴分割线
        tickLine: {
            show: true,
            size: 1,
            length: 3,
            color: "#888888"
        }
    }
};
