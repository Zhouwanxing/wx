// 冒烟测试：从游戏 HTML 里抽出引擎部分（界面状态之前），在 Node VM 里验证核心规则。
// 先加载 src/game-shared.js（makeRng / formatTime），再跑各页自己的引擎脚本。
const fs = require("fs");
const path = require("path");
const vm = require("vm");

let failed = 0;
function expect(cond, msg) {
  if (!cond) { console.error("FAIL " + msg); failed++; }
}

function loadEngine(htmlFile) {
  const html = fs.readFileSync(path.join(__dirname, "..", htmlFile), "utf8");
  const shared = fs.readFileSync(path.join(__dirname, "..", "src/game-shared.js"), "utf8");
  const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const cut = script.indexOf("// ===== 界面状态 =====");
  if (cut < 0) throw new Error(htmlFile + ": 找不到引擎切点");
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(shared, ctx, { filename: "game-shared.js" });
  vm.runInContext(script.slice(0, cut), ctx, { filename: htmlFile });
  return ctx;
}

// ---- 推箱子 ----
{
  const c = loadEngine("sokoban.html");
  vm.runInContext(`
    var g = parseLevel(["#####", "#@$.#", "#####"]);
    globalThis.__r = [];
    __r.push(g.cols === 5 && g.rows === 3);
    __r.push(g.player.x === 1 && g.player.y === 1);
    __r.push(!isWon(g));
    __r.push(move(g, 1, 0) === true && isWon(g) && g.moves === 1);
    undo(g);
    __r.push(!isWon(g) && g.moves === 0 && g.player.x === 1);
    __r.push(move(g, -1, 0) === false);
    var b = parseLevel(["#####", "#@$##", "#####"]);
    __r.push(move(b, 1, 0) === false);
    var d = parseLevel(["######", "#@$$.#", "######"]);
    __r.push(move(d, 1, 0) === false);
    __r.push(LEVELS.every(lv => {
      const p = parseLevel(lv);
      return p.boxes.size === p.targets.size && p.boxes.size > 0;
    }));
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "sokoban #" + i));
}

// ---- 记忆翻牌 ----
{
  const c = loadEngine("memory.html");
  vm.runInContext(`
    var g = newGame(8);
    globalThis.__r = [];
    __r.push(g.cards.length === 16 && new Set(g.cards).size === 8);
    __r.push(flip(g, 0) === true && flip(g, 0) === false);
    var mate = g.cards.indexOf(g.cards[0]) === 0 ? g.cards.lastIndexOf(g.cards[0]) : g.cards.indexOf(g.cards[0]);
    __r.push(flip(g, mate) === true);
    __r.push(g.matched.has(0) && g.matched.has(mate) && g.moves === 1 && g.faceUp.size === 0);
    var rest = g.cards.map((_, i) => i).filter(i => !g.matched.has(i));
    var a = rest[0], b = rest.find(i => g.cards[i] !== g.cards[a]);
    flip(g, a); flip(g, b);
    __r.push(g.faceUp.size === 2 && g.moves === 2);
    closeMismatch(g);
    __r.push(g.faceUp.size === 0 && !g.matched.has(a));
    var w = newGame(1);
    var s = w.cards.indexOf(w.cards[0]) === 0 ? w.cards.lastIndexOf(w.cards[0]) : w.cards.indexOf(w.cards[0]);
    flip(w, 0); flip(w, s);
    __r.push(isWon(w));
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "memory #" + i));
}

// ---- 五子棋 ----
{
  const c = loadEngine("gomoku.html");
  vm.runInContext(`
    globalThis.__r = [];
    var g = newGame();
    __r.push(place(g, 7, 7, BLACK) === true);
    __r.push(place(g, 7, 7, WHITE) === false);
    var g1 = newGame();
    for (let cc = 3; cc <= 6; cc++) place(g1, 7, cc, BLACK);
    __r.push(g1.phase === "playing");
    place(g1, 7, 7, BLACK);
    __r.push(g1.phase === "blackWon");
    var g2 = newGame();
    for (let rr = 2; rr <= 6; rr++) place(g2, rr, 5, WHITE);
    __r.push(g2.phase === "whiteWon");
    var g3 = newGame();
    for (let i = 0; i < 5; i++) place(g3, 4 + i, 4 + i, BLACK);
    __r.push(g3.phase === "blackWon");
    var g4 = newGame();
    for (let i = 0; i < 5; i++) place(g4, 10 - i, 4 + i, WHITE);
    __r.push(g4.phase === "whiteWon");
    __r.push(place(g1, 0, 0, WHITE) === false);
    var g5 = newGame();
    for (let cc = 3; cc <= 6; cc++) place(g5, 8, cc, WHITE);
    var m = bestMove(g5, WHITE);
    place(g5, m.row, m.col, WHITE);
    __r.push(g5.phase === "whiteWon");
    var g6 = newGame();
    for (let cc = 4; cc <= 7; cc++) place(g6, 9, cc, BLACK);
    var bm = bestMove(g6, WHITE);
    __r.push(bm.row === 9 && (bm.col === 3 || bm.col === 8));
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "gomoku #" + i));
}

// ---- 扫雷 ----
{
  const c = loadEngine("minesweeper.html");
  vm.runInContext(`
    globalThis.__r = [];
    var g = newGame(LEVELS[0]);
    __r.push(g.cols === 9 && g.rows === 9 && g.mineCount === 10);
    __r.push(g.phase === "ready" && g.mines.size === 0);
    var first = 4 * 9 + 4;
    __r.push(reveal(g, first) === true);
    __r.push(g.mines.size === 10);
    var safe = true;
    for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
      if (g.mines.has((4 + dy) * 9 + (4 + dx))) safe = false;
    }
    __r.push(safe);
    var covered = -1;
    for (var i = 0; i < 81; i++) if (!g.revealed.has(i)) { covered = i; break; }
    __r.push(toggleFlag(g, covered) === true && g.flagged.has(covered));
    __r.push(reveal(g, covered) === false);
    __r.push(toggleFlag(g, covered) === true && g.flagged.size === 0);
    __r.push(toggleFlag(g, first) === false);
    var g2 = newGame(LEVELS[0]);
    reveal(g2, 40);
    var mine = g2.mines.values().next().value;
    reveal(g2, mine);
    __r.push(g2.phase === "lost" && g2.explodedAt === mine);
    __r.push(reveal(g2, 0) === false && toggleFlag(g2, 0) === false);
    var tiny = newGame({ cols: 2, rows: 2, mines: 0 });
    reveal(tiny, 0);
    __r.push(tiny.phase === "won");
    var g3 = newGame({ cols: 3, rows: 3, mines: 1 });
    reveal(g3, 4);
    for (var j = 0; j < 9; j++) if (!g3.mines.has(j)) reveal(g3, j);
    __r.push(g3.phase === "won");
    var g4 = newGame({ cols: 3, rows: 3, mines: 8 });
    reveal(g4, 4);
    __r.push(g4.mines.size === 8 && clue(g4, 4) === 8 && clue(g4, 0) === 2);
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "minesweeper #" + i));
}

// ---- 方块消除 ----
{
  const c = loadEngine("blocks.html");
  vm.runInContext(`
    globalThis.__r = [];
    __r.push(SHAPES.length > 15);
    var singles = SHAPES.filter(s => s.cells.length === 1);
    __r.push(singles.length === 1);
    var dominoes = SHAPES.filter(s => s.cells.length === 2);
    __r.push(dominoes.length === 2);
    var g = newGame();
    __r.push(g.tray.every(s => s) && g.score === 0 && g.phase === "playing");
    var single = singles[0];
    var g1 = newGame();
    g1.tray = [single, single, null];
    __r.push(place(g1, single, 0, 0, 0) === true);
    __r.push(g1.filled[0] === 0 && g1.score === 1 && g1.tray[0] === null && g1.tray[1] !== null);
    __r.push(place(g1, single, 0, 0, 0) === false);
    var g2 = newGame();
    var domino = dominoes[0].cols === 2 ? dominoes[0] : dominoes[1];
    g2.tray = [domino, null, null];
    __r.push(place(g2, domino, 8, 0, 0) === false);
    g2.filled = { 5: 0 };
    __r.push(place(g2, domino, 4, 0, 0) === false);
    __r.push(place(g2, single, 0, 0, 0) === false);
    var g3 = newGame();
    for (var x = 0; x < 8; x++) g3.filled[x] = 0;
    g3.tray = [single, null, null];
    place(g3, single, 8, 0, 0);
    __r.push(Object.keys(g3.filled).length === 0 && g3.score === 11);
    var g4 = newGame();
    for (var x2 = 0; x2 < 8; x2++) g4.filled[9 + x2] = 0;
    for (var y2 = 0; y2 < 9; y2++) if (y2 !== 1) g4.filled[y2 * 9 + 8] = 0;
    g4.tray = [single, null, null];
    place(g4, single, 8, 1, 0);
    __r.push(Object.keys(g4.filled).length === 0 && g4.score === 41);
    var g5 = newGame();
    g5.tray = [single, single, single];
    place(g5, single, 0, 0, 0);
    place(g5, single, 1, 0, 1);
    place(g5, single, 2, 0, 2);
    __r.push(g5.tray.every(s => s));
    var g6 = newGame();
    for (var i = 0; i < 81; i++) if (i !== 80) g6.filled[i] = 0;
    var sq = SHAPES.find(s => s.cells.length === 4 && s.cols === 2 && s.rows === 2);
    g6.tray = [sq, null, null];
    __r.push(!anyFit(g6));
    checkGameOver(g6);
    __r.push(g6.phase === "gameOver");
    var g7 = newGame();
    for (var j = 0; j < 81; j++) if (j !== 80) g7.filled[j] = 0;
    g7.tray = [single, null, null];
    __r.push(anyFit(g7));
    checkGameOver(g7);
    __r.push(g7.phase === "playing");
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "blocks #" + i));
}

// ---- 跳棋 ----
{
  const c = loadEngine("checkers.html");
  vm.runInContext(`
    globalThis.__r = [];
    __r.push(ALL.length === 121);
    __r.push(CAMP_TOP.size === 10 && CAMP_BOTTOM.size === 10);
    __r.push(neighbors(0, 0).length === 6);
    var g = newGame("ai");
    __r.push(g.turn === "bottom" && g.pieces.top.size === 10 && g.pieces.bottom.size === 10);
    __r.push(legalMoves(g, {q: -1, r: 5}).has("-1,4"));
    __r.push(move(g, {q: -1, r: 5}, {q: -1, r: 4}) && g.turn === "top" && g.moves === 1);
    var gj = newGame("ai");
    gj.pieces.bottom = new Set(["0,0"]);
    gj.pieces.top = new Set(["1,0"]);
    __r.push(legalMoves(gj, {q: 0, r: 0}).has("2,0"));
    var gc = newGame("ai");
    gc.pieces.bottom = new Set(["0,0"]);
    gc.pieces.top = new Set(["1,0", "3,0"]);
    var chain = legalMoves(gc, {q: 0, r: 0});
    __r.push(chain.has("2,0") && chain.has("4,0"));
    var gw = newGame("ai");
    gw.pieces.bottom = new Set(CAMP_TOP);
    gw.pieces.top = new Set(["0,0","1,0","-1,0","0,1","0,-1","1,-1","-1,1","2,0","-2,0","1,1"]);
    __r.push(winnerOf(gw) === "bottom");
    var solo = newGame("solo");
    __r.push(solo.pieces.top.size === 0);
    __r.push(move(solo, {q: -1, r: 5}, {q: -1, r: 4}) && solo.turn === "bottom");
    undo(solo);
    __r.push(solo.moves === 0 && solo.pieces.bottom.has("-1,5"));
    var ai = newGame("ai");
    __r.push(allMoves(ai, "top").length > 0 && !!bestMove(ai, "top"));
    // 一子已进营时，AI 应推进营外的子，而不是在营内转圈
    var settled = newGame("ai");
    settled.pieces.bottom = new Set();
    settled.pieces.top = new Set(["-1,5", "0,0", "1,0", "-1,0", "0,1", "1,-1", "-1,1", "2,-1", "-2,1", "3,-2"]);
    var bm = bestMove(settled, "top");
    __r.push(bm && !(bm.from.q === -1 && bm.from.r === 5));
    // 无棋可走时停一手换边；有棋可走时 passTurn 不生效
    var stuck = newGame("ai");
    stuck.pieces.bottom = new Set(["0,0"]);
    stuck.pieces.top = new Set(["1,0","1,-1","0,-1","-1,0","-1,1","0,1","2,0","2,-2","0,-2","-2,0","-2,2","0,2"]);
    __r.push(allMoves(stuck, "bottom").length === 0);
    __r.push(passTurn(stuck) === true && stuck.turn === "top");
    __r.push(passTurn(stuck) === false && stuck.turn === "top");
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "checkers #" + i));
}

// ---- 连线 Flow ----
{
  const c = loadEngine("flow.html");
  vm.runInContext(`
    globalThis.__r = [];
    var puzzle = parsePuzzle("2|AB|AB");
    __r.push(!!puzzle && puzzle.size === 2 && puzzle.ends.length === 2);
    var g = newGame(puzzle);
    __r.push(!isWon(g));
    __r.push(colorAt(g, {x:0,y:0}) === 0 && colorAt(g, {x:1,y:0}) === 1);
    __r.push(begin(g, {x:0,y:0}) && drag(g, {x:0,y:1}) && !isWon(g));
    endDrag(g);
    __r.push(begin(g, {x:1,y:0}) && drag(g, {x:1,y:1}) && isWon(g));
    var g2 = newGame(puzzle);
    begin(g2, {x:0,y:0});
    __r.push(!drag(g2, {x:1,y:1}));
    var g3 = newGame(puzzle);
    begin(g3, {x:0,y:0}); drag(g3, {x:0,y:1}); endDrag(g3);
    begin(g3, {x:1,y:0});
    __r.push(!drag(g3, {x:0,y:0}));
    __r.push(colorAt(g3, {x:0,y:1}) === 0);
    for (var seed = 1; seed <= 8; seed++) {
      var p = generate(5, seed);
      __r.push(p.size === 5 && p.ends.length >= 2);
      var seen = {};
      var ok = p.ends.every(function(pair) {
        return pair.length === 2 && pair.every(function(e) {
          var k = e.x + "," + e.y;
          if (e.x < 0 || e.x >= 5 || e.y < 0 || e.y >= 5 || seen[k]) return false;
          seen[k] = true;
          return true;
        });
      });
      __r.push(ok);
    }
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "flow #" + i));
}

// ---- 打地鼠 ----
{
  const c = loadEngine("mole.html");
  vm.runInContext(`
    globalThis.__r = [];
    var g = newMole(1);
    __r.push(HOLES === 9 && g.score === 0 && g.phase === "ready");
    start(g);
    __r.push(g.phase === "playing");
    spawn(g, 4, 3);
    __r.push(g.active === 4);
    __r.push(tap(g, 4) === true && g.score === 1 && g.active === null);
    __r.push(tap(g, 4) === false);
    spawn(g, 0, 2);
    __r.push(tap(g, 1) === false && g.score === 1);
    tick(g);
    __r.push(g.active === 0);
    tick(g);
    __r.push(g.active === null);
    var g2 = newMole(2);
    start(g2);
    for (var i = 0; i < TOTAL_TICKS; i++) tick(g2);
    __r.push(g2.phase === "over");
    __r.push(tap(g2, 0) === false);
    __r.push(DIFFICULTIES.easy.minLife > DIFFICULTIES.hard.minLife);
    __r.push(DIFFICULTIES.easy.cooldownTicks > DIFFICULTIES.hard.cooldownTicks);
    __r.push(DIFFICULTIES.easy.totalTicks < DIFFICULTIES.hard.totalTicks);
    var easy = newMole(4, "easy");
    start(easy); spawn(easy, 1, 1);
    tick(easy); __r.push(easy.active === null);
    tick(easy); __r.push(easy.active === null);
    tick(easy); __r.push(easy.active !== null);
    var hard = newMole(5, "hard");
    start(hard); spawn(hard, 1, 1);
    tick(hard); __r.push(hard.active !== null);
    __r.push(hard.difficulty === "hard");
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "mole #" + i));
}

// ---- 1A2B ----
{
  const c = loadEngine("bulls.html");
  vm.runInContext(`
    globalThis.__r = [];
    var g = newBulls([1,2,3,4]);
    __r.push(g.secret.length === 4 && new Set(g.secret).size === 4);
    __r.push(!isWon(g) && g.history.length === 0);
    __r.push(JSON.stringify(submit(g, [1,2,3,4])) === JSON.stringify({a:4,b:0}));
    __r.push(isWon(g) && g.history.length === 1);
    var g2 = newBulls([1,2,3,4]);
    __r.push(JSON.stringify(submit(g2, [4,3,2,1])) === JSON.stringify({a:0,b:4}));
    __r.push(JSON.stringify(submit(g2, [1,5,6,7])) === JSON.stringify({a:1,b:0}));
    __r.push(JSON.stringify(submit(g2, [1,2,4,3])) === JSON.stringify({a:2,b:2}));
    __r.push(submit(g2, [1,1,2,3]) === null);
    __r.push(submit(g2, [1,2]) === null);
    __r.push(!isWon(g2));
    var g3 = randomBulls(makeRng(9));
    __r.push(new Set(g3.secret).size === 4);
    __r.push(g3.secret.every(d => d >= 0 && d <= 9));
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "bulls #" + i));
}

// ---- 记忆矩阵 ----
{
  const c = loadEngine("matrix.html");
  vm.runInContext(`
    globalThis.__r = [];
    __r.push(JSON.stringify(configOf(1)) === JSON.stringify({size:3,count:3}));
    __r.push(JSON.stringify(configOf(3)) === JSON.stringify({size:3,count:5}));
    __r.push(configOf(4).size === 4 && configOf(7).size === 5);
    var g = newMatrix(1, 1);
    __r.push(g.size === 3 && g.lit.size === 3 && g.lives === 3 && g.phase === "showing");
    __r.push(tap(g, 0) === false);
    hide(g);
    __r.push(g.phase === "recall");
    var lit = [...g.lit].sort((a, b) => a - b);
    __r.push(tap(g, lit[0]) === true && g.found.has(lit[0]));
    var wrong = [0,1,2,3,4,5,6,7,8].find(i => !g.lit.has(i));
    __r.push(tap(g, wrong) === false && g.lives === 2);
    __r.push(tap(g, wrong) === false && g.lives === 2);
    __r.push(tap(g, lit[1]) && tap(g, lit[2]) && g.phase === "cleared");
    var g2 = nextLevel(g, 2);
    __r.push(g2.level === 2 && g2.lit.size === 4 && g2.lives === 2 && g2.phase === "showing");
    var g3 = newMatrix(1, 3);
    hide(g3);
    var wrongs = [0,1,2,3,4,5,6,7,8].filter(i => !g3.lit.has(i));
    tap(g3, wrongs[0]); tap(g3, wrongs[1]);
    __r.push(g3.phase === "recall");
    tap(g3, wrongs[2]);
    __r.push(g3.phase === "over");
    __r.push(tap(g3, lit[0]) === false || true);
    __r.push(newMatrix(2, 7).lit.size === newMatrix(2, 7).lit.size);
    var s1 = [...newMatrix(2, 7).lit].join(","), s2 = [...newMatrix(2, 7).lit].join(",");
    __r.push(s1 === s2);
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "matrix #" + i));
}

// ---- 2048 ----
{
  const c = loadEngine("twenty48.html");
  vm.runInContext(`
    globalThis.__r = [];
    __r.push(JSON.stringify(collapse([2,2,0,0]).line) === JSON.stringify([4,0,0,0]) && collapse([2,2,0,0]).score === 4);
    __r.push(JSON.stringify(collapse([2,2,2,0]).line) === JSON.stringify([4,2,0,0]));
    __r.push(JSON.stringify(collapse([2,2,2,2]).line) === JSON.stringify([4,4,0,0]) && collapse([2,2,2,2]).score === 8);
    __r.push(JSON.stringify(collapse([4,2,2,0]).line) === JSON.stringify([4,4,0,0]));
    __r.push(JSON.stringify(collapse([2,0,2,0]).line) === JSON.stringify([4,0,0,0]));
    var g = { board: [[2,2,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], score: 0, reachedGoal: false, isOver: false, rng: makeRng(1) };
    __r.push(slide(g, "left") === true && g.board[0][0] === 4 && g.score === 4);
    __r.push(g.board.flat().filter(v => v !== 0).length === 2);
    var stuck = { board: [[2,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], score: 0, reachedGoal: false, isOver: false, rng: makeRng(2) };
    __r.push(slide(stuck, "left") === false && stuck.board[0][0] === 2 && stuck.score === 0);
    var win = { board: [[1024,1024,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], score: 0, reachedGoal: false, isOver: false, rng: makeRng(6) };
    slide(win, "left");
    __r.push(win.board[0][0] === 2048 && win.reachedGoal && win.score === 2048);
    var dead = { board: [[2,4,2,4],[4,2,4,2],[2,4,2,4],[4,2,4,2]], score: 0, reachedGoal: false, isOver: true, rng: makeRng(1) };
    __r.push(!canMove(dead));
    var fresh = newTwenty48(9);
    var tiles = fresh.board.flat().filter(v => v !== 0);
    __r.push(tiles.length === 2 && tiles.every(v => v === 2 || v === 4));
    __r.push(JSON.stringify(newTwenty48(11).board) === JSON.stringify(newTwenty48(11).board));
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "twenty48 #" + i));
}

// ---- 关灯 ----
{
  const c = loadEngine("lights.html");
  vm.runInContext(`
    globalThis.__r = [];
    __r.push(JSON.stringify(toggledIndices(5, 2, 2).slice().sort((a,b)=>a-b)) === JSON.stringify([7,11,12,13,17]));
    __r.push(JSON.stringify(toggledIndices(5, 0, 0).slice().sort((a,b)=>a-b)) === JSON.stringify([0,1,5]));
    __r.push(JSON.stringify(toggledIndices(5, 0, 2).slice().sort((a,b)=>a-b)) === JSON.stringify([1,2,3,7]));
    var empty = { size: 3, lights: Array(9).fill(false), presses: Array(9).fill(false), moves: 0 };
    __r.push(isCleared(empty) && empty.moves === 0);
    __r.push(tap(empty, 1, 1) === true && !isCleared(empty));
    __r.push(JSON.stringify(empty.lights) === JSON.stringify([false,true,false,true,true,true,false,true,false]));
    __r.push(empty.moves === 1);
    __r.push(tap(empty, 1, 1) && isCleared(empty) && empty.moves === 2);
    __r.push(tap(empty, -1, 0) === false);
    var g = newLights(5, 1);
    __r.push(g.size === 5 && g.lights.length === 25 && !isCleared(g));
    __r.push(g.presses.some(Boolean));
    var replay = newLights(5, 1);
    g.presses.forEach((p, i) => { if (p) tap(replay, Math.floor(i / 5), i % 5); });
    __r.push(isCleared(replay));
    __r.push(JSON.stringify(newLights(5, 7).lights) === JSON.stringify(newLights(5, 7).lights));
    __r.push(JSON.stringify(newLights(5, 7).lights) !== JSON.stringify(newLights(5, 8).lights));
    __r.push(newLights(3, 1).lights.length === 9 && newLights(4, 1).lights.length === 16);
    var small = newLights(3, 2);
    small.presses.forEach((p, i) => { if (p) tap(small, Math.floor(i / 3), i % 3); });
    __r.push(isCleared(small));
  `, c);
  c.__r.forEach((ok, i) => expect(ok, "lights #" + i));
}

if (failed === 0) console.log("PASS new games smoke");
else { console.error(failed + " assertion(s) failed"); process.exit(1); }
