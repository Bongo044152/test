import React, { useState, useEffect, useRef } from 'react';
import stylesheet from "./matrix_part.module.css";

// Predefined convolution matrices
const presetMatrices = {
    identity: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ],
    blur: [
        [0.0625, 0.125, 0.0625],
        [0.125, 0.25, 0.125],
        [0.0625, 0.125, 0.0625]
    ],
    motionBlurHorizontal: [
        [0.11, 0.11, 0.11],
        [0.11, 0.11, 0.11],
        [0.11, 0.11, 0.11]
    ],
    sharpen: [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ],
    edgeDetection: [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1]
    ],
    emboss: [
        [-2, -1, 0],
        [-1, 1, 1],
        [0, 1, 2]
    ]
};

function get_random_number() {
    const random_num = Math.floor(Math.random() * 10) + 1;
    return random_num;
}

function NumberInput({ value, onChange }) {
    const inputRef = useRef(null);

    function disableScrolling(e) {
        // Only process events if mouse is over this specific input
        if (e.target === inputRef.current || inputRef.current.contains(e.target)) {
            const target = inputRef.current;
            const value = parseFloat(target.value);
            e.preventDefault();

            if (e.deltaY < 0) {
                if (value < 10)
                    onChange(parseFloat(value) + 1);
            }
            else {
                if (value > -10)
                    onChange(parseFloat(value) - 1);
            }
        }
    }

    const handleMouseEnter = () => {
        // Using a unique handler function for this specific component instance
        inputRef.current._wheelHandler = disableScrolling;
        window.addEventListener("wheel", inputRef.current._wheelHandler, { passive: false });
    };

    const handleMouseLeave = () => {
        // Remove only this component's specific handler
        if (inputRef.current && inputRef.current._wheelHandler) {
            window.removeEventListener("wheel", inputRef.current._wheelHandler);
            inputRef.current._wheelHandler = null;
        }
    };

    // handle on change
    const handleChange = (e) => {
        const newValue = parseFloat(e.target.value);
        if (newValue > 10 || newValue < -10) {
            return;
        }
        onChange(e.target.value);
    };

    // Clean up event listeners when component unmounts
    useEffect(() => {
        return () => {
            if (inputRef.current && inputRef.current._wheelHandler) {
                window.removeEventListener("wheel", inputRef.current._wheelHandler);
            }
        };
    }, []);

    return (
        <input
            type="number"
            className={stylesheet.number}
            ref={inputRef}
            value={value}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onChange={handleChange}
            step="0.01"
        />
    );
}

function GetMatrix() {
    const rows = 3, cols = 3;
    const [matrixValues, setMatrixValues] = useState(
        Array(rows).fill().map(() => Array(cols).fill().map(() => `${get_random_number()}`))
    );
    const [selectedPreset, setSelectedPreset] = useState("custom");

    // Update all matrix values
    const handleValueChange = (rowIndex, colIndex, newValue) => {
        const newMatrix = [...matrixValues];
        newMatrix[rowIndex][colIndex] = newValue;
        setMatrixValues(newMatrix);
        setSelectedPreset("custom"); // When manually changing values, set to custom
    };

    // Apply preset matrix
    const applyPreset = (presetKey) => {
        if (presetKey === "custom") return;

        const preset = presetMatrices[presetKey];
        const newMatrix = preset.map(row => row.map(value => value.toString()));
        setMatrixValues(newMatrix);
        setSelectedPreset(presetKey);
    };

    return (
        <div className={stylesheet.matrixContainer}>
            <div className={stylesheet.presetSelector}>
                <label htmlFor="presetSelect" className={stylesheet.presetLabel}>選擇濾鏡效果：</label>
                <select
                    id="presetSelect"
                    className={stylesheet.presetSelect}
                    value={selectedPreset}
                    onChange={(e) => applyPreset(e.target.value)}
                >
                    <option value="custom">自定義矩陣</option>
                    <option value="identity">原始影像 (Identity)</option>
                    <option value="blur">模糊 (Box Blur)</option>
                    <option value="motionBlurHorizontal">運動模糊 (motion blur horizontal)</option>
                    <option value="sharpen">銳化 (Sharpen)</option>
                    <option value="edgeDetection">邊緣檢測 (Edge Detection)</option>
                    <option value="emboss">浮雕效果 (Emboss)</option>
                </select>
            </div>
            <div className={stylesheet.matrixWrapper}>
                <div className={stylesheet.matrix}>
                    <div className={stylesheet.leftBracket} />
                    <table className={stylesheet.matrixTable}>
                        <tbody>
                            {matrixValues.map((row, rowIndex) => (
                                <tr key={rowIndex} className={stylesheet.matrixRow}>
                                    {row.map((value, colIndex) => (
                                        <td key={colIndex} className={stylesheet.matrixCell}>
                                            <NumberInput
                                                value={value}
                                                onChange={(newValue) => handleValueChange(rowIndex, colIndex, newValue)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={stylesheet.rightBracket} />
                </div>
            </div>
        </div>
    );
}

export { GetMatrix };