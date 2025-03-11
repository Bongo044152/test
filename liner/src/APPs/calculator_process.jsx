import React, { useState, useRef, useEffect } from 'react';
import stylesheet from './calculator_process.module.css';
import bracket_style from "./matrix_mainpage.module.css";

function GetMatrix(props) {
    const matrix = props.matrix, type = props.type;
    let id = 0;

    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <div className={stylesheet.matrix_body}>
                        <div className={bracket_style.leftBracket} />
                        {matrix.map((items, index) => {
                            return (
                            <div className={stylesheet.matrix_row} key={index}>
                                {items.map((item, index2) => {
                                    return (
                                        <div className={stylesheet.num_block} key={index2} id={`${type}_${id++}`}>{item}</div>
                                    );
                                })}
                            </div>
                            );
                        })}
                        <div className={bracket_style.rightBracket} />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

// ID translation function as a utility function to use in both components
function translate_to_id(type, pos, col1, col2) {
    if (type === 'matrix1') {
        return `${type}_${pos[0] * col1 + pos[1]}`;
    } else if (type === 'matrix2') {
        return `${type}_${pos[0] * col2 + pos[1]}`;
    } else {
        const Solved_matrix_col = col2; // Use col2 as Solved_matrix_col
        return `solved_${pos[0] * Solved_matrix_col + pos[1]}`;
    }
}

function GetSlovedMatrix(props) {
    const matrix1 = props.matrix1;
    const matrix2 = props.matrix2;
    const SetcanSolve = props.SetcanSolve;
    const highlightInitialCells = props.highlightInitialCells;
    let id = 0;

    if (matrix1[0].length !== matrix2.length) {
        console.error('矩陣無法相乘，因為矩陣1的列數不等於矩陣2的行數');
        SetcanSolve(false);
        
        // Highlight cells even when matrices can't be multiplied
        setTimeout(() => {
            const col1 = matrix1[0].length;
            const col2 = matrix2[0].length;
            const row2 = matrix2.length;
            
            // Highlight first row of matrix1
            for (let i = 0; i < col1; i++) {
                const matrix1_id = translate_to_id('matrix1', [0, i], col1, col2);
                const element = document.getElementById(matrix1_id);
                if (element) {
                    element.classList.add(stylesheet.num_block_red);
                }
            }
            
            // Highlight first column of matrix2
            for (let i = 0; i < row2; i++) {
                const matrix2_id = translate_to_id('matrix2', [i, 0], col1, col2);
                const element = document.getElementById(matrix2_id);
                if (element) {
                    element.classList.add(stylesheet.num_block_red);
                }
            }
        }, 0);
        
        return (
            <div className={stylesheet.error_message}>
                矩陣無法相乘，因為矩陣1的列數不等於矩陣2的行數
            </div>
        );
    }

    const resultMatrix = Array(matrix1.length).fill().map(() => Array(matrix2[0].length).fill(0));

    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix2[0].length; j++) {
            for (let k = 0; k < matrix1[0].length; k++) {
                resultMatrix[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }

    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <div className={stylesheet.matrix_body}>
                        <div className={bracket_style.leftBracket} />
                        {resultMatrix.map((items, index) => {
                            return (
                            <div className={stylesheet.matrix_row} key={index}>
                                {items.map((item, index2) => {
                                    return (
                                        <div className={stylesheet.num_block} key={index2} id={`solved_${id++}`}>?</div>
                                    );
                                })}
                            </div>
                            );
                        })}
                        <div className={bracket_style.rightBracket} />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function InformationBlock(props) {
    const { text, current_result, flag } = props;

    if (flag === true) {

        return (
            <div className={`${stylesheet.information_block} ${stylesheet.end_message}`} id="information_block">
                運算結束!
            </div>
        );
    }

    return (
        <div className={stylesheet.information_block} id="information_block">
            <div className={stylesheet.calculation} dangerouslySetInnerHTML={{ __html: text }} />
            <hr />
            <span>當前總和 = {current_result}</span>
        </div>
    );
}

function NextButton(props) {
    const { row1, row2, col1, col2, Information_block, SetInformation_block, canSolve } = props;
    const Solved_matrix_row = row1;
    const Solved_matrix_col = col2;

    const buttonRef = useRef(null);

    // State management for matrix indices
    const [currentIndex, setCurrentIndex] = useState({
        current_pos: [0, 0],
        time: 0
    });
    const [prevMatrix1, setPrevMatrix1] = useState(null);
    const [prevMatrix2, setPrevMatrix2] = useState(null);
    const [preValue, setPreValue] = useState(0);
    const [text, setText] = useState('');

    // Update matrix indices logic
    function update_matrix(pos, row, col, val) {
        let x = pos[1] + val, y = pos[0];
        if (x >= col) {
            y = y + Math.floor(x / col);
            x = x % col;
            return [y, x];
        }
        return [y, x];
    }

    // Handle button click
    const handleClick = () => {
        let newPos = [...currentIndex.current_pos];
        let newTime = currentIndex.time;
        let newText = text;
        let newPreValue = preValue;

        // Handle solved matrix
        if (newTime >= col1) {
            // Clear solved matrix style
            const id = translate_to_id(null, newPos, col1, col2);
            const target = document.getElementById(id);
            if (target) {
                target.classList.remove(stylesheet.num_block_orange);
            }
            
            // Update to new index
            newPos = update_matrix(newPos, Solved_matrix_row, Solved_matrix_col, 1);
            newTime = 0;
            newText = '';
            newPreValue = 0;
        }

        // Process end condition
        if (newPos[0] >= Solved_matrix_row) {
            // Disable button click
            if (buttonRef.current) {
                buttonRef.current.disabled = true;
            }
            
            // Clear styles
            if (prevMatrix1) {
                prevMatrix1.classList.remove(stylesheet.num_block_green);
            }
            if (prevMatrix2) {
                prevMatrix2.classList.remove(stylesheet.num_block_green);
            }
            
            SetInformation_block(<InformationBlock flag={true} />);

            const return_ans = [];

            // highlight result
            for(let i=0; i<Solved_matrix_row; i++) {
                const temp = [];
                for(let j=0; j<Solved_matrix_col; j++) {
                    const element = document.getElementById(
                        translate_to_id(null, [i, j], col1, col2)
                    );
                    element.classList.add(stylesheet.num_block_green);
                    temp.push(element.textContent);
                }
                return_ans.push(temp);
            }
            return;
        }

        // Update answer
        const answer_id = translate_to_id(null, newPos, col1, col2);
        const answer_target = document.getElementById(answer_id);
        if (answer_target) {
            answer_target.classList.add(stylesheet.num_block_orange);
        }

        // Update matrix1
        if (prevMatrix1) {
            prevMatrix1.classList.remove(stylesheet.num_block_green);
        }
        const matrix1_index = [newPos[0], newTime];
        const matrix1_id = translate_to_id('matrix1', matrix1_index, col1, col2);
        const matrix1_target = document.getElementById(matrix1_id);
        if (matrix1_target) {
            matrix1_target.classList.add(stylesheet.num_block_green);
            setPrevMatrix1(matrix1_target);
        }

        // Update matrix2
        if (prevMatrix2) {
            prevMatrix2.classList.remove(stylesheet.num_block_green);
        }
        const matrix2_index = [newTime, newPos[1]];
        const matrix2_id = translate_to_id('matrix2', matrix2_index, col1, col2);
        const matrix2_target = document.getElementById(matrix2_id);
        if (matrix2_target) {
            matrix2_target.classList.add(stylesheet.num_block_green);
            setPrevMatrix2(matrix2_target);
        }

        // Show information if both targets exist
        if (matrix1_target && matrix2_target) {
            // Generate current result
            let num1 = parseInt(matrix1_target.textContent);
            let num2 = parseInt(matrix2_target.textContent);
            const current_result = num1 * num2 + newPreValue;
            newPreValue = current_result;

            // Generate text
            newText = `${newText.length === 0 ? newText : newText + '<br />'}${num1} × ${num2} = ${num1 * num2}`;

            SetInformation_block(
                <InformationBlock text={newText} current_result={current_result} />
            );

            // Update solved matrix block
            if (answer_target) {
                answer_target.textContent = current_result;
            }
        }

        // Update all state values at once to avoid stale state issues
        setPreValue(newPreValue);
        setText(newText);
        setCurrentIndex({
            current_pos: newPos,
            time: newTime + 1
        });
    };

    return (
        <input
            type="button"
            value="Next"
            ref={buttonRef}
            onClick={handleClick}
            className={stylesheet.next_buttom}
            disabled={!canSolve}
        />
    );
}

export const CalculatorProcess = (props) => {
    const [matrix1Component, setMatrix1Component] = useState(null);
    const [matrix2Component, setMatrix2Component] = useState(null);
    const [solvedMatrix, setSolvedMatrix] = useState(null);
    const [buttonState, setButtonState] = useState(null);
    const [informationBlock, setInformationBlock] = useState(null);
    const [canSolve, setCanSolve] = useState(true);
    
    const matrix1 = props.matrix1 || [];
    const matrix2 = props.matrix2 || [];
    
    // Initialize components once when valid matrices are available
    useEffect(() => {
        setMatrix1Component(<GetMatrix matrix={matrix1} type={'matrix1'} />);
        setMatrix2Component(<GetMatrix matrix={matrix2} type={'matrix2'} />);
        setSolvedMatrix(
            <GetSlovedMatrix 
                matrix1={matrix1} 
                matrix2={matrix2} 
                SetcanSolve={setCanSolve} 
                highlightInitialCells={true}
            />
        );
    }, [matrix1, matrix2]);

    // Set up button separately to avoid dependency on informationBlock
    useEffect(() => {
        const row1 = matrix1.length;
        const row2 = matrix2.length;
        const col1 = matrix1[0].length;
        const col2 = matrix2[0].length;
        
        setButtonState(
            <NextButton 
                row1={row1} 
                row2={row2} 
                col1={col1} 
                col2={col2}
                Information_block={informationBlock} 
                SetInformation_block={setInformationBlock}
                canSolve={canSolve}
            />
        );
    }, [matrix1, matrix2, canSolve, informationBlock]);

    // Highlight initial rows/columns only when matrices CAN be multiplied
    useEffect(() => {
        if (!canSolve) return;

        const col1 = matrix1[0].length;
        const col2 = matrix2[0].length;
        const row2 = matrix2.length;

        // Initial highlight of first row/column (only if canSolve is true)
        const matrix1Elements = [];
        const matrix2Elements = [];

        for (let i = 0; i < col1; i++) {
            const matrix1_id = translate_to_id('matrix1', [0, i], col1, col2);
            matrix1Elements.push(matrix1_id);
        }
        for (let i = 0; i < row2; i++) {
            const matrix2_id = translate_to_id('matrix2', [i, 0], col1, col2);
            matrix2Elements.push(matrix2_id);
        }

        // Update matrix colors
        matrix1Elements.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add(stylesheet.num_block_red);
            }
        });

        matrix2Elements.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add(stylesheet.num_block_red);
            }
        });
    }, [canSolve, matrix1, matrix2]);


    return (
        <div className={stylesheet.outline}>
            <div className={stylesheet.MainContainer}>
                <div className={stylesheet.matrix_wrapper}>
                    {matrix1Component}
                    {solvedMatrix}
                </div>
                <div className={stylesheet.move_matrix}>
                    {matrix2Component}
                </div>
            </div>
            {buttonState}
            {informationBlock}
        </div>
    );
};