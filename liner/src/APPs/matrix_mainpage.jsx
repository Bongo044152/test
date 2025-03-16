import React, { useState, useRef, useEffect } from 'react';
import stylesheet from './matrix_mainpage.module.css';

import { CalculatorProcess } from "./calculator_process.jsx";

function get_random_number() {
    const random_num = Math.floor(Math.random() * 10) + 1;
    return random_num;
}

function NumberInput() {
    const [inputValue, setInputValue] = useState(`${get_random_number()}`);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const element = inputRef.current;

        if (element.value > 10 || element.value < -10) {
            return e.preventDefault();
        }

        setInputValue(e.target.value);
    };

    return (
        <input
            type="number"
            className={stylesheet.number}
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
        />
    );
}

function GetMatrix({ rows, setRows, cols, setCols }) {
    const add_row = () => {
        if(rows > 5) return;
        setRows(rows + 1);
    };

    const remove_row = () => {
        if (rows > 1) {
            setRows(rows - 1);
        }
    };

    const add_col = () => {
        if(cols > 5) return;
        setCols(cols + 1);
    };

    const remove_col = () => {
        if (cols > 1) {
            setCols(cols - 1);
        }
    };

    return (
        <div className={stylesheet.matrixContainer}>
            <div className={stylesheet.left_controler}>
                <button
                    type="button"
                    className={stylesheet.operator_button}
                    onClick={add_row}
                >
                    +
                </button>
                <button
                    type="button"
                    className={stylesheet.operator_button}
                    onClick={remove_row}
                    disabled={rows <= 1}
                >
                    -
                </button>
            </div>
            <div className={stylesheet.matrixWrapper}>
                <div className={stylesheet.matrix}>
                    <div className={stylesheet.leftBracket} />
                    <table className={stylesheet.matrixTable}>
                        <tbody>
                            {Array.from({ length: rows }, (_, rowIndex) => (
                                <tr key={rowIndex} className={stylesheet.matrixRow}>
                                    {Array.from({ length: cols }, (_, colIndex) => (
                                        <td key={colIndex} className={stylesheet.matrixCell}>
                                            <NumberInput />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={stylesheet.rightBracket} />
                </div>
                <div className={stylesheet.down_controler}>
                    <button
                        type="button"
                        className={stylesheet.operator_button}
                        onClick={add_col}
                    >
                        +
                    </button>
                    <button
                        type="button"
                        className={stylesheet.operator_button}
                        onClick={remove_col}
                        disabled={cols <= 1}
                    >
                        -
                    </button>
                </div>
            </div>
        </div>
    );
}

export const Guid = () => {
    const [rows1, setRows1] = useState(2);
    const [cols1, setCols1] = useState(2);
    const [rows2, setRows2] = useState(2);
    const [cols2, setCols2] = useState(2);
    const [Process, SetProcess] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handle_start_click = (e) => {
        setIsCalculating(true);
        
        const matrix1Elements = Array.from(document.querySelectorAll(`.${stylesheet.number}`));
        const matrix1 = [];
        const matrix2 = [];
        
        // Calculate how many elements to take for the first matrix
        const matrix1Count = rows1 * cols1;
        
        // Extract values from input elements for the first matrix
        for (let i = 0; i < rows1; i++) {
            const temp = [];
            for (let j = 0; j < cols1; j++) {
                // Get the value from the input element instead of the element itself
                temp.push(Number(matrix1Elements[i * cols1 + j].value));
            }
            matrix1.push(temp);
        }
        
        // Extract values from input elements for the second matrix
        const matrix2Elements = matrix1Elements.slice(matrix1Count);
        for (let i = 0; i < rows2; i++) {
            const temp = [];
            for (let j = 0; j < cols2; j++) {
                // Get the value from the input element instead of the element itself
                temp.push(Number(matrix2Elements[i * cols2 + j].value));
            }
            matrix2.push(temp);
        }
        
        setTimeout(() => {
            setIsCalculating(false);
            SetProcess(<CalculatorProcess matrix1={matrix1} matrix2={matrix2} key={Math.random()} />);
        }, 500);
    };

    return (
        <div className={stylesheet.main_container}>
            <h1 className={stylesheet.title}>矩陣乘法計算器</h1>
            <div className={stylesheet.matrix_operation_container}>
                <GetMatrix rows={rows1} setRows={setRows1} cols={cols1} setCols={setCols1} />
                <span className={stylesheet.multiplication}>×</span>
                <GetMatrix rows={rows2} setRows={setRows2} cols={cols2} setCols={setCols2} />
            </div>
            <button 
                type="button" 
                className={`${stylesheet.work_button} ${isCalculating ? stylesheet.calculating : ''}`}
                onClick={handle_start_click}
                disabled={isCalculating}
            >
                {isCalculating ? '生成中...' : '開始計算'}
            </button>
            {Process}
        </div>
    );
};