#!/usr/bin/env python3
"""把各游戏 HTML 接到 game-shared.css / game-shared.js，只留页面自己的样式。"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

LINK = '<link rel="stylesheet" href="./src/game-shared.css">'
SHARED_JS = '<script src="./src/game-shared.js"></script>'

# 各页只保留自己棋盘/控件的差异样式。
EXTRAS = {
    "flow.html": "#boardWrap { background: #f7f7f7; }\n",
    "mole.html": """
#boardWrap { display: flex; align-items: center; justify-content: center; }
.chip { flex: 1; padding: 8px 0; font-size: 14px; border-radius: 12px; }
.holes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: min(92%, 360px); aspect-ratio: 1; }
.hole { border: 0; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.pit {
  width: 82%; height: 82%; border-radius: 50%;
  background: radial-gradient(circle at 50% 40%, #6b4729, #472e1a);
  box-shadow: inset 0 4px 8px rgba(0,0,0,.35);
  display: flex; align-items: center; justify-content: center; font-size: 42px;
}
""",
    "bulls.html": """
.title { font-size: 18px; font-weight: 800; color: var(--game-accent); font-variant-numeric: tabular-nums; }
.title.won { color: var(--game-cleared); }
#history {
  width: 100%; max-width: var(--game-max); flex: 1; min-height: 180px;
  background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 18px;
  overflow: auto; padding: 10px 12px;
}
.empty { color: var(--game-secondary); font-size: 14px; text-align: center; margin-top: 40px; }
.guess { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-variant-numeric: tabular-nums; font-weight: 700; }
.guess .n { width: 28px; color: var(--game-secondary); }
.guess .d { flex: 1; }
.guess .ab.ok { color: var(--game-cleared); }
.draft { width: 100%; max-width: var(--game-max); display: flex; gap: 10px; margin: 10px 0; }
.slot {
  flex: 1; height: 52px; border-radius: 12px; background: #f2f2f2;
  border: 1px solid rgba(0,0,0,.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 800; font-variant-numeric: tabular-nums;
}
.slot.empty { color: var(--game-secondary); }
.keys { width: 100%; max-width: var(--game-max); display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.key {
  border: 0; border-radius: 12px; padding: 12px 0;
  font-size: 16px; font-weight: 700; color: #fff; background: var(--game-move); cursor: pointer;
}
.key:disabled { opacity: .4; }
.key.gray { background: var(--game-regret); }
.key.accent { background: var(--game-accent); }
""",
    "matrix.html": """
.level { font-size: 18px; font-weight: 800; color: var(--game-accent); font-variant-numeric: tabular-nums; }
.lives { color: var(--game-danger); font-weight: 700; letter-spacing: 2px; }
#boardWrap { display: flex; align-items: center; justify-content: center; background: #f7f7f7; }
#grid { display: grid; gap: 12px; width: min(88%, 380px); aspect-ratio: 1; }
#grid .cell { border: 0; border-radius: 16%; background: #e6e6e6; cursor: pointer; transition: background .15s; }
#grid .cell.lit { background: var(--game-accent); }
#grid .cell.found { background: var(--game-cleared); }
#grid .cell.wrong { background: #e04d5c; }
#grid .cell.miss { background: #e6e6e6; outline: 3px solid var(--game-accent); }
""",
    "checkers.html": """
.chip.solo.on { background: #338c7a; }
#boardWrap { background: var(--game-wood); }
""",
    "sokoban.html": """
.pickerRow { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.stats { display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 700; }
.stats .tip { font-size: 11px; color: var(--game-secondary); font-weight: 400; }
""",
    "memory.html": """
.chip { flex: 1; padding: 8px 0; font-size: 13px; background: var(--game-muted); }
.chip.active { background: var(--game-accent); }
.stats { justify-content: space-between; font-size: 14px; font-weight: 700; }
.stats .best { font-size: 11px; color: var(--game-secondary); font-weight: 600; }
#boardWrap { display: flex; align-items: center; padding: 10px; }
#grid { display: grid; gap: 6px; width: 100%; }
.card {
  border: 0; border-radius: 12px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; aspect-ratio: 1;
  background: #544a9e; font-size: clamp(24px, 9vmin, 48px); transition: background .15s;
}
.card.up { background: #fff; border: 2px solid rgba(0,0,0,.12); }
.card.matched { background: #e6f5ec; border: 2px solid var(--game-cleared); }
""",
    "gomoku.html": """
#status { font-size: 14px; font-weight: 700; }
#record { font-size: 12px; color: var(--game-secondary); font-weight: 600; font-variant-numeric: tabular-nums; }
#boardWrap { background: var(--game-wood); }
""",
    "minesweeper.html": """
.chip { flex: 1; padding: 8px 0; font-size: 13px; background: var(--game-muted); white-space: nowrap; }
.chip.active { background: var(--game-accent); }
.stats { justify-content: space-between; font-size: 14px; font-weight: 700; }
.stats .sub { font-size: 11px; color: var(--game-secondary); font-weight: 400; }
""",
    "blocks.html": """
.score { font-size: 20px; }
.best { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--game-secondary); font-variant-numeric: tabular-nums; }
#tray { display: flex; gap: 10px; width: 100%; max-width: var(--game-max); margin-top: 10px; }
.slot { flex: 1; height: 100px; border-radius: 14px; background: var(--game-panel); display: flex; align-items: center; justify-content: center; }
.slot.empty { background: transparent; border: 1px dashed rgba(0,0,0,.12); }
.slot.dragging { opacity: .25; }
.slot canvas { cursor: grab; }
#floatPiece { position: fixed; pointer-events: none; display: none; z-index: 10; }
""",
    "tetris.html": """
#toolbar { display: flex; align-items: center; gap: 12px; }
#nextWrap { margin-left: auto; text-align: center; }
#nextWrap .label { font-size: 11px; color: var(--game-secondary); }
#next { width: 44px; height: 44px; }
""",
    "snake.html": """
#toolbar { display: flex; align-items: center; gap: 12px; }
#toolbar .tip { margin-left: auto; font-size: 11px; color: var(--game-secondary); }
""",
    "loop.html": """
.chip.ghost { background: #fff; color: var(--game-text); border: 1px solid rgba(0,0,0,.08); }
.chip.group-on { outline: 2px solid rgba(0,0,0,.25); outline-offset: 1px; }
#statusText { font-size: 12px; font-weight: 600; color: var(--game-text); min-height: 14px; }
#dailyBest { font-size: 11px; font-weight: 600; color: var(--game-text); margin-left: auto; }
""",
    "pipes.html": """
.chip.ghost { background: #fff; color: var(--game-text); border: 1px solid rgba(0,0,0,.08); }
.chip.group-on { outline: 2px solid rgba(0,0,0,.25); outline-offset: 1px; }
#statusText { font-size: 12px; font-weight: 600; color: var(--game-text); min-height: 14px; }
#dailyBest { font-size: 11px; font-weight: 600; color: var(--game-text); margin-left: auto; }
""",
}


def replace_style(html: str, extra: str) -> str:
    extra = extra.strip()
    block = LINK + "\n"
    if extra:
        block += f"<style>\n/* 本页棋盘/控件差异，共用面板见 game-shared.css */\n{extra}\n</style>\n"
    return re.sub(r"<style>[\s\S]*?</style>\s*", block, html, count=1)


def insert_shared_js(html: str) -> str:
    if "game-shared.js" in html:
        return html
    return re.sub(r"(<script>\s*)", SHARED_JS + "\n\\1", html, count=1)


def strip_rng(html: str) -> str:
    html = re.sub(r"/\* =+\s*\n \* 随机数[\s\S]*?\*/\s*", "", html, count=1)
    html = re.sub(
        r"const MASK64 = 0xFFFFFFFFFFFFFFFFn;\s*function makeRng\(seed\) \{[\s\S]*?return \{[\s\S]*?\};\n\}\s*",
        "/* 随机数 / 计时见 game-shared.js */\n",
        html,
        count=1,
    )
    return html


def strip_format_time(html: str) -> str:
    return re.sub(r"function formatTime\([^)]*\) \{[\s\S]*?\n\}\s*", "", html, count=1)


def strip_chip_const(html: str) -> str:
    return re.sub(r"const CHIP_COLORS = \{[\s\S]*?\};\s*", "", html, count=1)


def patch(name: str, extra: str):
    path = ROOT / name
    html = path.read_text(encoding="utf-8")
    html = replace_style(html, extra)
    html = insert_shared_js(html)
    html = strip_rng(html)
    if name in {"memory.html", "minesweeper.html", "loop.html", "pipes.html"}:
        html = strip_format_time(html)
    if name in {"loop.html", "pipes.html", "tetris.html", "snake.html"}:
        html = strip_chip_const(html)
    if name == "memory.html":
        html = html.replace("formatTime(wonElapsed)", "formatTime(wonElapsed / 1000)")
        html = html.replace("formatTime(Date.now() - startedAt)", "formatTime((Date.now() - startedAt) / 1000)")
    if name == "gomoku.html":
        html = html.replace('<div class="panel">', '<div class="panel spread">')
    path.write_text(html, encoding="utf-8")
    print("ok", name)


def patch_marble():
    path = ROOT / "marble.html"
    html = path.read_text(encoding="utf-8")
    html = html.replace("<body>", '<body class="game-dark">', 1)
    if "弹珠是暗色盘面" not in html:
        html = html.replace(
            "<style>",
            "<!-- 弹珠是暗色盘面，不套浅色 game-shared 面板；按钮色仍用本页样式。 -->\n    <style>",
            1,
        )
    path.write_text(html, encoding="utf-8")
    print("ok marble.html")


def main():
    for name, extra in EXTRAS.items():
        patch(name, extra)
    patch_marble()


if __name__ == "__main__":
    main()
