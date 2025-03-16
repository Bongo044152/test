import React, { useState, useEffect, useRef } from 'react';
import stylesheet from "./index.module.css";
import DrawBoard_stylesheet from "./DrawBoard.module.css";
import matrix_part_stylesheet from "./matrix_part.module.css";
import { gridSize, DrawBoard, CalculatorResult } from "./DrawBoard.jsx";
import { GetMatrix } from "./matrix_part.jsx";
import { Introduce } from "./Introduce.jsx";

const Calculator = ({ drawingGrid, kernelMatrix }) => {
    const [BasicPanel, setBasicPanel] = useState(null);
    // Get drawing state and matrix data when component mounts
    useEffect(() => {
        // Process the convolution once we have both data sets
        if (drawingGrid?.length && kernelMatrix?.length) {
            processConvolution(drawingGrid, kernelMatrix);
        }
    }, [drawingGrid, kernelMatrix]);
    
    // Process convolution operation
    function processConvolution(imageData, kernel) {
        // console.log(imageData);
        // console.log(kernel);
        setBasicPanel(<CalculatorResult imageData={imageData} kernel={kernel} />)
    }
    
    return (
        <>
            <div className={stylesheet.instructionContainer}>
                <p className={stylesheet.instruction}>
                    將滑鼠懸停在右邊圖像的像素上，就可以查看其值的計算方式
                </p>
            </div>
            {BasicPanel}
        </>
    );
};

const ShowResult = ({ SetCalculator_element }) => {

    function hendel_onClick() {
        // Get DrawBlock states
        const drawContainer = document.querySelector(`.${DrawBoard_stylesheet.drawContainer}`);
        const drawingGrid = [];
        if (drawContainer) {
            const drawBlocks = Array.from(drawContainer.children);

            // Convert flat list to 2D array
            for (let i = 0; i < gridSize; i++) {
                const row = [];
                for (let j = 0; j < gridSize; j++) {
                    const block = drawBlocks[i * gridSize + j];
                    // Check if the block has the black color class
                    const isBlack = block.classList.contains(DrawBoard_stylesheet.setColorBlack);
                    row.push(isBlack ? 1 : 0); // 1 代表黑色
                }
                drawingGrid.push(row);
            }
        }
        
        // Get Matrix data
        const matrixInputs = document.querySelectorAll(`.${matrix_part_stylesheet.matrixCell} input`);
        const kernelMatrix = [];
        if (matrixInputs.length === 9) { // 3x3 matrix
            for (let i = 0; i < 3; i++) {
                const row = [];
                for (let j = 0; j < 3; j++) {
                    const inputValue = parseFloat(matrixInputs[i * 3 + j].value) || 0;
                    row.push(inputValue);
                }
                kernelMatrix.push(row);
            }
        }
        SetCalculator_element(<Calculator 
            drawingGrid={drawingGrid} 
            kernelMatrix={kernelMatrix} 
            />);
    }
    return (
        <button
            className={stylesheet.ShowResultBut}
            onClick={hendel_onClick}
        >
            顯示結果
        </button>
    );
}

export const Index = () => {
    const [Calculator_element, SetCalculator_element] = useState(null);

    return (
        <div className={stylesheet.mainContainer}>
            {/* 预期放介绍栏 */}
            <div className={stylesheet.introSection}>
                <h1 className={stylesheet.title}>矩陣影像處裡的演示</h1>
                <h3 className={stylesheet.subtitle}>描述 "卷積" 的運作原理</h3>
            </div>

            <Introduce />

            {/* 绘图区 */}
            <DrawBoard />

            {/* kernel matrix */}
            <div className={stylesheet.kernel_matrix_container}>
                <h3>Kernel Matrix</h3>
                <GetMatrix />
            </div>

            {/* 計算區 */}
            <ShowResult SetCalculator_element={SetCalculator_element} />
            {Calculator_element}
        </div>
    );
};