/*
 * 小游戏共用脚本，对齐 iOS GameShared / GameViewShared：
 * 确定性随机数、秒数格式、按钮色。各页面不再各抄一份 makeRng / formatTime。
 */
'use strict';

const MASK64 = 0xFFFFFFFFFFFFFFFFn;

/** SplitMix64：同一个种子必出同一串随机数，每日题和发牌靠它复现。 */
function makeRng(seed) {
    let state = BigInt(seed) === 0n ? 0x9E3779B97F4A7C15n : BigInt(seed) & MASK64;
    const next = () => {
        state = (state + 0x9E3779B97F4A7C15n) & MASK64;
        let z = state;
        z = ((z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n) & MASK64;
        z = ((z ^ (z >> 27n)) * 0x94D049BB133111EBn) & MASK64;
        return (z ^ (z >> 31n)) & MASK64;
    };
    return {
        /** [0, n) 整数 */
        int(n) { return Number(next() % BigInt(n)); },
        /** [lo, hi] 整数 */
        range(lo, hi) { return lo + Number(next() % BigInt(hi - lo + 1)); },
        /** 洗牌（原地） */
        shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Number(next() % BigInt(i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        },
        pick(arr) { return arr[Number(next() % BigInt(arr.length))]; },
    };
}

/** 秒数格式化成 m:ss，各游戏计时共用。 */
function gameFormatTime(value) {
    const total = Math.max(0, Math.floor(Number(value) || 0));
    return Math.floor(total / 60) + ":" + String(total % 60).padStart(2, "0");
}

/** 兼容旧页面的 formatTime 名字。 */
function formatTime(value) {
    return gameFormatTime(value);
}

/** 数回 / 水管 / 俄罗斯方块 / 贪吃蛇的按钮色，对齐 Color.game*。 */
const CHIP_COLORS = {
    size: "rgb(84, 74, 158)",
    easy: "rgb(41, 148, 102)",
    normal: "rgb(41, 117, 189)",
    hard: "rgb(230, 133, 31)",
    evil: "rgb(199, 56, 82)",
    modeDaily: "rgb(230, 115, 31)",
    modeRandom: "rgb(41, 148, 102)",
    newGame: "rgb(84, 74, 158)",
    restart: "rgb(77, 97, 148)",
    check: "rgb(26, 143, 128)",
    hint: "rgb(235, 102, 31)",
    move: "rgb(77, 97, 148)",
    undo: "rgb(41, 117, 189)",
    pause: "rgb(230, 133, 31)",
    danger: "rgb(199, 56, 82)",
};
