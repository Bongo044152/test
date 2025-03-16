import React, { useState, useEffect, useRef } from 'react';
import stylesheet from "./DrawBoard.module.css";

const gridSize = 25;

const DrawBlock = ({ CanDraw }) => {
    const [colorClass, setColorClass] = useState('');

    function handleMouseEnter() {
        if (CanDraw === 'black') {
            setColorClass(stylesheet.setColorBlack);
        }
        else if (CanDraw === 'white') {
            setColorClass(null);
        }
    }

    function handleMouseDown(event) {
        if (event.button === 0) {
            setColorClass(stylesheet.setColorBlack);
        }
        else if (event.button === 2) {
            setColorClass(null);
        }
    }

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseDown={handleMouseDown}
            className={`${stylesheet.basicDrawElement} ${colorClass || ''}`}
        />
    );
};

const DrawBoard = () => {
    /**
     * 控制繪畫事件，一共三種模式:
     * 1. "white" 表示擦拭
     * 2. "black" 表示繪製
     * 3. null 表示取消 (不擦拭也不繪製)
     */
    const [CanDraw, setCanDraw] = useState(null);
    const gridRef = useRef(null);

    // 阻止右键菜单
    useEffect(() => {
        const preventContextMenu = (e) => {
            e.preventDefault();
            return false;
        };
        document.addEventListener('contextmenu', preventContextMenu);
        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
        };
    }, []);

    // 監聽鼠標事件
    useEffect(() => {
        const handleMouseDown = (event) => {
            if (event.button === 0) {
                setCanDraw("black");
            }
            else if (event.button === 2) {
                event.preventDefault();
                setCanDraw("white");
            }
        };
        const handleMouseUp = () => setCanDraw(null);
        const handleMouseLeave = () => setCanDraw(null);

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // 生成网格
    const generateGrid = () => {
        const grid = [];
        for (let i = 0; i < gridSize * gridSize; i++) {
            grid.push(
                <DrawBlock
                    key={i}
                    CanDraw={CanDraw}
                />
            );
        }
        return grid;
    };

    // 重置画布
    const [key, setKey] = useState(0);
    const handleClear = () => {
        if (gridRef.current) {
            setKey(prevKey => prevKey + 1);
        }
    };

    return (
        <div className={stylesheet.drawBoardWrapper}>
            {/* 小標題 */}
            <h3 className={stylesheet.sub_title}>繪圖區</h3>
            {/* 绘图区域 */}
            <div
                key={key}
                ref={gridRef}
                className={stylesheet.drawContainer}
            >
                {generateGrid()}
            </div>
            {/* 一鍵清除 */}
            <div className={stylesheet.controlsContainer}>
                <button
                    className={stylesheet.clearButton}
                    onClick={handleClear}
                >
                    一鍵清除
                </button>
            </div>
            {/* 補充說明欄 */}
            <div className={stylesheet.instructionContainer}>
                <p className={stylesheet.instruction}>
                    按住鼠标左键绘画，按住鼠标右键擦除
                </p>
            </div>
        </div>
    );
};

const DisplayBlock = ({ colorClass, style }) => {
    if (style) return <div className={`${stylesheet.basicDisplayElement}`} style={style} />;

    return <div className={`${stylesheet.basicDisplayElement} ${colorClass}`} />;
};


const InteractivePanel = ({ imageData, setcurrent_prams, Setcurrent_pos }) => {
    const [DisplayBoard, setDisplayBoard] = useState(null);

    useEffect(() => {
        const content = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                content.push(
                    <DisplayBlock
                        key={`${i}-${j}`}
                        colorClass={imageData[i][j] ? stylesheet.setColorBlack : null}
                    />
                );
            }
        }
        setDisplayBoard(
            <div className={stylesheet.displayBolckContainer}>
                {content}
            </div>
        );
    }, [imageData]);

    function shown_matrix(elements, i, j, shown) {
        let current_element;

        // 左上
        current_element = elements[i - 1]?.[j - 1];
        if (current_element) {
            if (shown)
                current_element.classList.add(stylesheet.border_left, stylesheet.border_top);
            else
                current_element.classList.remove(stylesheet.border_left, stylesheet.border_top);
        }

        // 上
        current_element = elements[i - 1]?.[j];
        if (current_element) {
            if (shown)
                current_element.classList.add(stylesheet.border_top);
            else
                current_element.classList.remove(stylesheet.border_top);
        }

        // 右上
        current_element = elements[i - 1]?.[j + 1];
        if (current_element) {
            if (shown)
                current_element.classList.add(stylesheet.border_right, stylesheet.border_top);
            else
                current_element.classList.remove(stylesheet.border_right, stylesheet.border_top);
        }

        // 左
        current_element = elements[i]?.[j - 1];
        if (current_element) {
            if (shown)
                current_element.classList.add(stylesheet.border_left);
            else
                current_element.classList.remove(stylesheet.border_left);
        }

        // 右
        current_element = elements[i]?.[j + 1];
        if (current_element) {
            if (shown)
                current_element.classList.add(stylesheet.border_right);
            else
                current_element.classList.remove(stylesheet.border_right);
        }

        // 左下
        current_element = elements[i + 1]?.[j - 1];
        if (current_element) {
            if (shown)
                current_element.classList.add(stylesheet.border_left, stylesheet.border_bottom);
            else
                current_element.classList.remove(stylesheet.border_left, stylesheet.border_bottom);
        }

        // 下
        current_element = elements[i + 1]?.[j];
        if (current_element) {
            if (shown)
                current_element.classList.add(stylesheet.border_bottom);
            else
                current_element.classList.remove(stylesheet.border_bottom);
        }

        // 右下
        current_element = elements[i + 1]?.[j + 1];
        if (current_element) {
            if (shown)
                current_element.classList.add(stylesheet.border_right, stylesheet.border_bottom);
            else
                current_element.classList.remove(stylesheet.border_right, stylesheet.border_bottom);
        }
    }

    useEffect(() => {
        if (DisplayBoard) {
            const row_elements = Array.from(
                document.querySelector(`.${stylesheet.displayBolckContainer}`).children
            );
            // 轉換成 2維 陣列，方便處理
            const elements = [];
            let temp = [];
            for (let i = 0; i < gridSize * gridSize; i++) {
                if (i % gridSize === 0 && i !== 0) {
                    elements.push(temp);
                    temp = [];
                }
                temp.push(row_elements[i]);
            }
            // 最后把最后一行添加进去
            if (temp.length) {
                elements.push(temp);
            }

            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    elements[i][j].addEventListener('mouseenter', () => {
                        shown_matrix(elements, i, j, true);
                        let res = [
                            [
                                imageData[i - 1]?.[j - 1] ?? 1, imageData[i - 1]?.[j] ?? 1, imageData[i - 1]?.[j + 1] ?? 1
                            ],
                            [
                                imageData[i]?.[j - 1] ?? 1, imageData[i]?.[j] ?? 1, imageData[i]?.[j + 1] ?? 1
                            ],
                            [
                                imageData[i + 1]?.[j - 1] ?? 1, imageData[i + 1]?.[j] ?? 1, imageData[i + 1]?.[j + 1] ?? 1
                            ]
                        ];

                        res = res.map(row => row.map(e => e ?? 1));
                        setcurrent_prams(res);
                        Setcurrent_pos([i, j]);
                    });
                    elements[i][j].addEventListener('mouseleave', () => {
                        shown_matrix(elements, i, j, false);
                    });
                }
            }

            // 清理事件监听器
            return () => {
                for (let i = 0; i < gridSize; i++) {
                    for (let j = 0; j < gridSize; j++) {
                        elements[i][j].removeEventListener('mouseenter', () => { });
                        elements[i][j].removeEventListener('mouseleave', () => { });
                    }
                }
            };
        }
    }, [DisplayBoard]);

    return (
        <div className={stylesheet.drawBoardWrapper}>
            {/* 顯示區域 */}
            {DisplayBoard}
        </div>
    );
};

const DisplayCalculatUnit = ({ number, matrix_value, res, minmax }) => {
    const isFloat = (num) => typeof num === 'number' && !isNaN(num) && num % 1 !== 0;
    
    // 處理數值異常情況
    const displayNumber = isNaN(number) || number === undefined ? '?' : number;
    let displayRes = isNaN(res) || res === undefined ? 0 : res;

    // 設定文字顏色 (根據灰階背景)
    const textColor = displayNumber === '?' ? 'black' : displayNumber > 200 ? 'black' : 'white';
    let resTextColor = displayRes > 200 ? 'black' : 'white';

    if (displayNumber === '?') {
        resTextColor = 'black';
    }

    // 提示框內容（當 res 存在時顯示）
    const tooltipContent = res !== undefined && !isNaN(res) && res !== null ? (
        <div className={stylesheet.tooltip}>
            <h3 className={stylesheet.tooltip_title}>備註: 右邊的結果經過歸一化處理</h3>
            <p className={stylesheet.tooltip_text}>
                (當前數字 - 結果最大值) / (結果最大值 - 結果最小值)
            </p>
            <h4 className={stylesheet.tooltip_subtitle}>計算過程:</h4>
            <p className={stylesheet.tooltip_text}>
                {(displayNumber !== '?' && minmax) ? (
                    <>
                        ({isFloat(displayNumber) ? displayNumber.toFixed(2) : displayNumber} - {minmax[0].toFixed(2)}) / ({minmax[1].toFixed(2)} - {minmax[0].toFixed(2)})
                        <br />
                        最終結果乘上 255 以獲得顏色 -&gt; {res}
                    </>
                ) : (
                    <>數據不可用</>
                )}
            </p>
        </div>
    ) : null;

    // **當 matrix_value 為 undefined，顯示結果與提示框**
    if (matrix_value === undefined) {
        return (
            <div className={stylesheet.calculat_unit_wrapper}>
                <div
                    className={stylesheet.color_box}
                    style={{
                        backgroundColor: `rgb(${displayRes}, ${displayRes}, ${displayRes})`,
                        color: resTextColor
                    }}
                >
                    {isFloat(displayNumber) ? displayNumber.toFixed(2) : displayNumber}
                </div>
                {tooltipContent}
            </div>
        );
    }

    // **計算步驟的顯示**
    return (
        <div className={stylesheet.calculat_unit_wrapper}>
            <div
                className={stylesheet.color_box}
                style={{
                    backgroundColor: `rgb(${displayNumber}, ${displayNumber}, ${displayNumber})`,
                    color: textColor
                }}
            >
                {displayNumber}
            </div>
            <div>
                <span className={stylesheet.operator}>×</span>
                <span>{matrix_value}</span>
            </div>
        </div>
    );
};

const DisplayCalculat = ({ params, matrix_values, res_matrix, current_pos, minmax }) => {
    // 假設 params 是數字，matrix_values 是乘數
    // 先對 params 做 0 和 1 互換並乘以 255
    const [a, b, c, d, e, f, g, h, i] = matrix_values.flat();
    let A, B, C, D, E, F, G, H, I;
    if(!params) {
        [A, B, C, D, E, F, G, H, I] = ['?', '?', '?', '?', '?', '?', '?', '?', '?'];
    }
    else{
        [A, B, C, D, E, F, G, H, I] = params.flat().map(e => (e === 1 ? 0 : 1) * 255);
    }

    return (
        <div className={stylesheet.calculatWrapper}>

            <div className={stylesheet.rowWrapper}>
                <DisplayCalculatUnit number={A} matrix_value={a} />
                <span className={stylesheet.plus_operator}>+</span>
                <DisplayCalculatUnit number={B} matrix_value={b} />
                <span className={stylesheet.plus_operator}>+</span>
                <DisplayCalculatUnit number={C} matrix_value={c} />
            </div>

            <div className={stylesheet.rowWrapper}>
                <DisplayCalculatUnit number={D} matrix_value={d} />
                <span className={stylesheet.plus_operator}>+</span>
                <DisplayCalculatUnit number={E} matrix_value={e} />
                <span className={stylesheet.plus_operator}>+</span>
                <DisplayCalculatUnit number={F} matrix_value={f} />
            </div>

            <div className={stylesheet.rowWrapper}>
                <DisplayCalculatUnit number={G} matrix_value={g} />
                <span className={stylesheet.plus_operator}>+</span>
                <DisplayCalculatUnit number={H} matrix_value={h} />
                <span className={stylesheet.plus_operator}>+</span>
                <DisplayCalculatUnit number={I} matrix_value={i} />
            </div>

            <div className={stylesheet.resultBox}>
                <span className={stylesheet.equals}>=</span>
                <DisplayCalculatUnit
                    number={A * a + B * b + C * c + D * d + E * e + F * f + G * g + H * h + I * i}
                    res={current_pos ? res_matrix[current_pos[0]][current_pos[1]] : null}
                    minmax={minmax}
                />
            </div>

        </div>
    );
};

const Result_display = ({ imageData, matrix_values, current_pos, Set_res_matrix, setminmax }) => {
    const [resultMatrix, setResultMatrix] = useState(null);
    const [context, setcontext] = useState(null);
    const [pre_pos, setprev_pos] = useState(null);

    useEffect(() => {
        const rows = imageData.length;
        const cols = imageData[0].length;
        const outputMatrix = [];

        for (let row = 0; row < rows; row++) {
            const outputRow = [];
            for (let col = 0; col < cols; col++) {
                let convValue = 0;

                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const x = Math.max(0, Math.min(row + i, rows - 1));
                        const y = Math.max(0, Math.min(col + j, cols - 1));

                        const pixelValue = (imageData[x][y] === 1 ? 0 : 255);  // 保持一致
                        const kernelValue = matrix_values[i + 1]?.[j + 1] ?? 0;

                        convValue += pixelValue * kernelValue;
                    }
                }

                outputRow.push(convValue);
            }
            outputMatrix.push(outputRow);
        }

        // 歸一化處理
        const minVal = Math.min(...outputMatrix.flat());
        const maxVal = Math.max(...outputMatrix.flat());

        setminmax([minVal, maxVal]);
        // console.log([minVal, maxVal]);

        if (maxVal !== minVal) {  // 避免除零錯誤
            for (let i = 0; i < outputMatrix.length; i++) {
                for (let j = 0; j < outputMatrix[i].length; j++) {
                    outputMatrix[i][j] = Math.floor(((outputMatrix[i][j] - minVal) / (maxVal - minVal)) * 255);
                }
            }
        }

        setResultMatrix(outputMatrix);
        Set_res_matrix(outputMatrix);
    }, [imageData, matrix_values]);

    useEffect(() => {
        const temp_array = [];
        if (resultMatrix) {
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    temp_array.push(
                        <DisplayBlock
                            key={`${i}-${j}`}
                            style={{ backgroundColor: `rgb(${resultMatrix[i][j]}, ${resultMatrix[i][j]}, ${resultMatrix[i][j]})` }}
                        />
                    );
                }
            }
            setcontext(temp_array);
        }
    }, [resultMatrix]);

    useEffect(() => {
        if (current_pos) {
            const x = current_pos[0], y = current_pos[1];
            const elements = Array.from(document.getElementById('res').children);

            elements[x * gridSize + y].style.border = '2px solid red';

            if (pre_pos) {
                // 清除先前選擇位置的邊框
                const prevX = pre_pos[0], prevY = pre_pos[1];
                elements[prevX * gridSize + prevY].style.border = '';
            }

            setprev_pos(current_pos);
        }
    }, [current_pos]);

    return (
        <div className={stylesheet.displayBolckContainer} id='res'>
            {context}
        </div>
    );
};

const CalculatorResult = ({ imageData, kernel }) => {
    const [current_prams, setcurrent_prams] = useState(null);
    const [current_pos, Setcurrent_pos] = useState(null);
    const [res_matrix, Set_res_matrix] = useState(null);
    const [minmax, setminmax] = useState(null);

    return (
        <div className={stylesheet.main_container}>
            {/* 左邊: 影像區 */}
            <div className={stylesheet.panel}>
                <InteractivePanel
                    imageData={imageData}
                    setcurrent_prams={setcurrent_prams}
                    Setcurrent_pos={Setcurrent_pos}
                />
            </div>

            {/* 中間: 計算區 */}
            <div className={stylesheet.panel}>
                <DisplayCalculat
                    params={current_prams}
                    matrix_values={kernel}
                    res_matrix={res_matrix}
                    current_pos={current_pos}
                    minmax={minmax}
                />
            </div>

            {/* 右邊: 結果顯示區 */}
            <div className={stylesheet.panel}>
                <Result_display
                    imageData={imageData}
                    matrix_values={kernel}
                    current_pos={current_pos}
                    Set_res_matrix={Set_res_matrix}
                    setminmax={setminmax}
                />
            </div>
        </div>
    );
};


export { gridSize, DrawBoard, CalculatorResult };