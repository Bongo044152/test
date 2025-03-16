import React from 'react';
import styles from './introduce.module.css';

const Introduce = () => {
    return (
        <div className={styles.introSection}>
            <h1 className={styles.introTitle}>矩陣在影像處理中的應用</h1>
            <h2 className={styles.introSubtitle}>【簡介】</h2>
            <p className={styles.introContent}>
                在影像處理領域，矩陣運算扮演著關鍵角色。影像可以被視為像素值組成的矩陣，而卷積（Convolution）是一種
                透過數學運算來處理影像的核心技術。卷積運算的原理是透過一個小型的「Kernel 矩陣」 ( 也有人說 Filter 矩陣 ) 來掃描整張圖片，
                進行特徵提取、邊緣偵測、模糊處理、銳化等操作。這些技術在電腦視覺、機器學習及圖像增強中被廣泛應用。
            </p>
            <br />
            <p className={styles.introContent}>
                以下是一些有助於理解卷積運作的資源： ( 我的參考資料 )
            </p>
            <ul className={styles.introList}>
                <li>
                    <a
                        href="https://www.youtube.com/watch?v=rowWM-MijXU"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.introLink}
                    >
                        卷積的基礎概念與應用（YouTube）
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.youtube.com/watch?v=yb2tPt0QVPY"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.introLink}
                    >
                        影像卷積運算的視覺化解釋（YouTube）
                    </a>
                </li>
                <li>
                    <a
                        href="https://setosa.io/ev/image-kernels/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.introLink}
                    >
                        互動式卷積範例與解釋（Setosa.io）
                    </a>
                </li>
            </ul>

            <h2 className={styles.introSubtitle}>【功能介紹】</h2>
            <ul className={styles.introList}>
                <li>透過下方的繪圖框進行繪圖</li>
                <li>可克制化的 Kernel 矩陣 ( 預設 3*3 )</li>
                <li>互動式的結果呈現</li>
            </ul>
            <h2 className={styles.introSubtitle}>【補充說明】</h2>
            <p className={styles.introContent}>
                1. 矩陣運算過程中，超出運算範圍外的值，一率視為黑色 ( value : 0 ) <br />
                2. 顯示結果經過 "歸一化處理" ( 最小-最大歸一化: Min-Max Normalization ) ， 透過乘上原本的倍數 ( 顏色範圍 0 ~ 255，因此乘上 255 ) <br />
                3. 顯示結果的面板都可以進行互動，鼠標懸停會顯示計算過程 <br />
                4. 提供了範例矩陣，我個人覺得 "浮雕" 挺帥的
            </p>
        </div>
    );
};

export { Introduce };
