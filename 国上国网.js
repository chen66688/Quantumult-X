// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;
const icons = {
	color: Color.dynamic(Color.white(), new Color("#CCCCD1")),
	largeSize: new Size(18, 18),
	mediumSize: new Size(14, 14),
	smallSize: new Size(11, 11),
	toFont(size) {
		return this[size].width;
	},

	游戏: "gamecontroller",
	闪电: "bolt.horizontal.circle",
	家: "house.fill",
	眼睛: "eye.fill",
	货币: "chineseyuanrenminbisign.circle",
	刷新: "arrow.triangle.2.circlepath",
	getImage(name, size = 18) {
		const sfs = SFSymbol.named(this[name]);
		sfs.applyFont(Font.systemFont(size));
		return sfs.image;
	},
};

const BillStyle = {
	color: icons.color,
	largeFont: Font.boldSystemFont(icons.toFont("largeSize")),
	mediumFont: Font.boldSystemFont(icons.toFont("mediumSize")),
	smallFont: Font.regularSystemFont(icons.toFont("smallSize")),
};

Object.prototype.myProxy = function (obj) {
	Reflect.ownKeys(obj).forEach((key) => {
		const value = obj[key];

		if (typeof value === "function") {
			value(this);
			return;
		}

		if (typeof this[key] !== "function") {
			this[key] = value;
			return;
		}

		if (Array.isArray(value)) {
			const [arg, cbObj] = value;
			this[key](arg).myProxy({ ...cbObj });
		} else {
			this[key](value);
		}
	});

	return this;
};

/**
 * @param {object} options
 * @param {string} [options.title]
 * @param {string} [options.message]
 * @param {Array<{ title: string; [key: string]: any }>} options.options
 * @param {boolean} [options.showCancel = true]
 * @param {string} [options.cancelText = 'Cancel']
 */
const presentSheet = async (options) => {
	options = {
		showCancel: true,
		cancelText: "Cancel",
		...options,
	};
	const alert = new Alert();
	if (options.title) {
		alert.title = options.title;
	}
	if (options.message) {
		alert.message = options.message;
	}
	if (!options.options) {
		throw new Error(
			'The "options" property of the parameter cannot be empty'
		);
	}
	for (const option of options.options) {
		alert.addAction(option.title);
	}
	if (options.showCancel) {
		alert.addCancelAction(options.cancelText);
	}
	const value = await alert.presentSheet();
	return {
		value,
		option: options.options[value],
	};
};

/**
 * Thanks @mzeryck
 *
 * @param {number} [height] The screen height measured in pixels
 */
const phoneSize = (height) => {
	const phones = {
		/** 14 Pro Max */
		2796: {
			small: 510,
			medium: 1092,
			large: 1146,
			left: 99,
			right: 681,
			top: 282,
			middle: 918,
			bottom: 1554,
		},
		/** 14 Pro */
		2556: {
			small: 474,
			medium: 1014,
			large: 1062,
			left: 82,
			right: 622,
			top: 270,
			middle: 858,
			bottom: 1446,
		},
		/** 13 Pro Max, 12 Pro Max */
		2778: {
			small: 510,
			medium: 1092,
			large: 1146,
			left: 96,
			right: 678,
			top: 246,
			middle: 882,
			bottom: 1518,
		},
		/** 13, 13 Pro, 12, 12 Pro */
		2532: {
			small: 474,
			medium: 1014,
			large: 1062,
			left: 78,
			right: 618,
			top: 231,
			middle: 819,
			bottom: 1407,
		},
		/** 11 Pro Max, XS Max */
		2688: {
			small: 507,
			medium: 1080,
			large: 1137,
			left: 81,
			right: 654,
			top: 228,
			middle: 858,
			bottom: 1488,
		},
		/** 11, XR */
		1792: {
			small: 338,
			medium: 720,
			large: 758,
			left: 55,
			right: 437,
			top: 159,
			middle: 579,
			bottom: 999,
		},
		/** 13 mini, 12 mini / 11 Pro, XS, X */
		2436: {
			small: 465,
			medium: 987,
			large: 1035,
			x: {
				left: 69,
				right: 591,
				top: 213,
				middle: 783,
				bottom: 1353,
			},
			mini: {
				left: 69,
				right: 591,
				top: 231,
				middle: 801,
				bottom: 1371,
			},
		},
		/** Plus phones */
		2208: {
			small: 471,
			medium: 1044,
			large: 1071,
			left: 99,
			right: 672,
			top: 114,
			middle: 696,
			bottom: 1278,
		},
		/** SE2 and 6/6S/7/8 */
		1334: {
			small: 296,
			medium: 642,
			large: 648,
			left: 54,
			right: 400,
			top: 60,
			middle: 412,
			bottom: 764,
		},
		/** SE1 */
		1136: {
			small: 282,
			medium: 584,
			large: 622,
			left: 30,
			right: 332,
			top: 59,
			middle: 399,
			bottom: 399,
		},
		/** 11 and XR in Display Zoom mode */
		1624: {
			small: 310,
			medium: 658,
			large: 690,
			left: 46,
			right: 394,
			top: 142,
			middle: 522,
			bottom: 902,
		},
		/** Plus in Display Zoom mode */
		2001: {
			small: 444,
			medium: 963,
			large: 972,
			left: 81,
			right: 600,
			top: 90,
			middle: 618,
			bottom: 1146,
		},
	};
	height = height || Device.screenResolution().height;
	const scale = Device.screenScale();

	const phone = phones[height];
	if (phone) {
		return phone;
	}

	if (config.runsInWidget) {
		const pc = {
			small: 164 * scale,
			medium: 344 * scale,
			large: 354 * scale,
		};
		return pc;
	}

	// in app screen fixed 375x812 pt
	return {
		small: 155 * scale,
		medium: 329 * scale,
		large: 345 * scale,
	};
};

/**
 * 一个基于 Proxy 的 请求对象，用于以一致的接口进行请求。
 *
 * 用法示例:
 * const {body,headers,statusCode} = await http.get(url,timeout).json();
 *
 * const response = await http.post({ url, body, timeout}).str();
 *
 * @param {string} method - HTTP 方法（例如 'get', 'post', 'put', 'delete'）。
 * @param {Object} opts - 请求的选项。
 * @param {string} url - 请求的 URL。
 * @param {number} [timeout=5] - 请求的超时时间，默认为 5 秒。
 *
 * @returns {Object} - 包含三个方法（str, json, imsg）的对象，用于发送请求。
 *   - str: 发送请求并以字符串形式返回响应体。
 *   - json: 发送请求并以 JSON 形式返回响应体。
 *   - image: 发送请求并以 图片对象形式返回响应。
 */
const http = new Proxy(
	{},
	{
		get:
			(_, method) =>
			(opts, timeout = 5) => {
				if (!opts.url) opts = { url: opts };
				opts.timeoutInterval = opts.timeout ?? timeout;

				const request = Object.assign(
					new Request(opts.url),
					{ method },
					opts
				);

				const send = async (loader) => {
					try {
						const body = await request[loader]();
						const { headers, statusCode } = request.response;
						if (statusCode !== 200)
							throw new Error(
								`Request failed with status code ${statusCode}`
							);
						return { body, headers, statusCode };
					} catch (error) {
						throw new Error(
							`Failed to load ${opts.url}: ${error.toString()}`
						);
					}
				};

				return {
					str: () => send("loadString"),
					json: () => send("loadJSON"),
					image: () => send("loadImage"),
					data: () => send("load"),
				};
			},
	}
);

/**
 * @param {...string} paths
 */
const joinPath = (...paths) => {
	const fm = FileManager.local();
	return paths.reduce((prev, curr) => {
		return fm.joinPath(prev, curr);
	}, "");
};

/**
 * 规范使用 FileManager。每个脚本使用独立文件夹
 *
 * 注意：桌面组件无法写入 cacheDirectory 和 temporaryDirectory
 * @param {object} options
 * @param { boolean| string} [options.useICloud]
 * @param {boolean| string} [options.basePath]
 */

const useFileManager = (options = {}) => {
	let { useICloud, basePath } = options;

	if (typeof useICloud === "string") basePath = useICloud;

	const fm = useICloud ? FileManager.iCloud() : FileManager.local();
	const paths = [fm.documentsDirectory(), Script.name()];
	if (basePath && typeof basePath === "string") {
		paths.push(basePath);
	}
	const cacheDirectory = joinPath(...paths);

	/**
	 * 删除路径末尾所有的 /
	 * @param {string} filePath
	 */
	const safePath = (filePath) => {
		return fm.joinPath(cacheDirectory, filePath).replace(/\/+$/, "");
	};

	/**
	 * 如果上级文件夹不存在，则先创建文件夹
	 * @param {string} filePath
	 */
	const preWrite = (filePath) => {
		const i = filePath.lastIndexOf("/");
		const directory = filePath.substring(0, i);
		if (!fm.fileExists(directory)) {
			fm.createDirectory(directory, true);
		}
	};

	/**
	 * @param {string} filePath
	 * @param {string} stringData
	 */

	const writeString = (filePath, content) => {
		const nextPath = safePath(filePath);
		preWrite(nextPath);
		fm.writeString(nextPath, content);
	};

	/**
	 * @param {string} filePath
	 * @param {object} jsonData
	 */
	const writeJSON = (filePath, jsonData) =>
		writeString(filePath, JSON.stringify(jsonData));

	/**
	 * @param {string} filePath
	 * @param {Image} image
	 */
	const writeImage = (filePath, image) => {
		const nextPath = safePath(filePath);
		preWrite(nextPath);
		return fm.writeImage(nextPath, image);
	};

	/**
	 * @param {string} filePath
	 * @param {*} Data - 数据对象
	 */
	const writeData = (filePath, Data) => {
		const nextPath = safePath(filePath);
		preWrite(nextPath);
		return fm.write(nextPath, Data);
	};

	/**
	 * 文件不存在时返回 null
	 * @param {string} filePath
	 * @returns {string|null}
	 */
	const readString = (filePath, bool) => {
		const fullPath = fm.joinPath(cacheDirectory, filePath);
		if (fm.fileExists(fullPath)) {
			if (bool) return fullPath;
			return fm.readString(fm.joinPath(cacheDirectory, filePath));
		}
		return null;
	};

	/**
	 * @param {string} filePath
	 */
	const readJSON = (filePath) => JSON.parse(readString(filePath));

	/**
	 * @param {string} filePath
	 */
	const readImage = (filePath, bool) => {
		const fullPath = fm.joinPath(cacheDirectory, filePath);

		if (bool) return fullPath;
		return fm.readImage(fullPath);
	};

	/**
	 * @param {string} filePath
	 * @returns {any}
	 *
	 */
	const readData = (filePath, bool) => {
		const fullPath = fm.joinPath(cacheDirectory, filePath);
		if (fm.fileExists(fullPath)) {
			if (bool) return fullPath;
			return Data.fromFile(fullPath);
		}
		return null;
	};

	return {
		fm,
		cacheDirectory,
		writeString,
		writeJSON,
		writeImage,
		writeData,
		readString,
		readJSON,
		readImage,
		readData,
	};
};

/** 规范使用文件缓存。每个脚本使用独立文件夹 */
const useCache = (name = "cache", path = "basePath") =>
	useFileManager({ [path]: name });

const html = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>2048 Game</title>
		<style>
		:root {
  --width: 75px;
  --padding: 10px;
  --size: 4;
  --radius: 10px;
}

body {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0ecdc;
  font-weight: 900;
  color: #756e66;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

.box {
  display: flex;
  width: calc(var(--width) * var(--size) + var(--padding) * (var(--size) + 4));
  flex-direction: column;
  align-items: center; 
  gap: 25px;
}

.row {
  display: flex;
  justify-content: space-between;
  width: 100%; 
}

.row:nth-child(3) {
  justify-content: center;
}

.game-container {
  display: flex;
  font-size: 30px;
  align-items: center; 
}

.score-box {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  font-size: 11px;
  color: #e6d6c4;
}

.game-over {
  background-color: #b9ada1;
  padding-top: 10px;
  width: 6em;
  height: 4em;
  border-radius: 3px;
}

#bset {
  background-color: #b9ada1;
  padding-top: 10px;
  width: 6em;
  height: 4em;
  margin-left: 5px; 
  border-radius: 3px;
}

#score,
#bset-score {
  color: #faf8f0;
  font-size: 20px;
}

.message {
  font-size: 14px;
  font-weight: 300;
}
.message span {
  font-size: 15px;
  font-weight: 500;
}

.message div {
  font-weight: 400;
  text-decoration: underline;
}
.restartGame {
  background-color: #8c7b68;
  color: #f8f6f2;
  border: none;
  border-radius: 3px;
}

.my-2048 {
  background-color: #b9a1a6;
  position: relative;
  width: calc(var(--width) * var(--size) + var(--padding) * (var(--size) - 1));
  height: calc(var(--width) * var(--size) + var(--padding) * (var(--size) - 1));
  padding: var(--padding);
  border-radius: var(--radius);
}

.bg {
  display: grid;
  grid-template-columns: repeat(var(--size), 1fr);
  gap: var(--padding);
}
.bg div {
  width: var(--width);
  height: var(--width);
  background-color: #cbc0b5;
  color: transparent;
  border-radius: var(--radius);
}

.square-content {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.square-content div {
  --row: 0;
  --col: 0;

  width: var(--width);
  height: var(--width);
  text-align: center;
  line-height: var(--width);
  font-size: 28px;
  border-radius: var(--radius);
  position: absolute;
  top: calc(var(--width) * var(--row) + var(--padding) * (var(--row) + 1));
  left: calc(var(--width) * var(--col) + var(--padding) * (var(--col) + 1));
  animation: in .3s;
  transition: .3s;
}

@keyframes in {
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
} 
		</style>
		
	</head>

	<body>
		<div class="box">
			<!-- 第一排 -->
			<div class="row">
				<div class="game-container">2048</div>

				<!-- 分数 -->
				<div class="score-box">
					<!-- 当前得分 -->
					<div class="game-over">
						SCORE
						<div id="score">0</div>
					</div>

					<!-- 最高得分 -->
					<div id="bset">
						BSET
						<div id="bset-score">0</div>
					</div>
				</div>
			</div>
			<!-- 第二排 -->
			<div class="row">
				<!-- 介绍 -->
				<div class="message">
					Join the tiles, get to <span>2048!</span>
					<div>How to play →</div>
				</div>

				<!-- 重置 -->
				<button class="restartGame">New Game</button>
			</div>
			<!-- 第三排 -->
			<div class="row">
				<div class="my-2048">
					<!-- 背景 布局 -->
					<div class="bg"></div>

					<div class="square-content"></div>
				</div>
			</div>
		</div>

		<script>
			const SIZE = 4;
const WIDTH = 75;
const PADDING = 10;

const colorMap = {
	0: "#CBC0B5",
	2: "#ECE4DB",
	4: "#ECE1CC",
	8: "#E9B582",
	16: "#E99B6D",
	32: "#E78367",
	64: "#E56948",
	128: "#E8D180",
};

const nextFunc = {
	ArrowUp: (r, c) => [r + 1, c],
	ArrowDown: (r, c) => [r - 1, c],
	ArrowLeft: (r, c) => [r, c + 1],
	ArrowRight: (r, c) => [r, c - 1],
};

const fontColor = (num) => {
	return \`\${num}\` === "0" ? "transparent" : num <= 4 ? "#756E66" : "#F8F6F2";
};

const root = document.querySelector(":root");
root.style.setProperty("--size", SIZE);
root.style.setProperty("--width", WIDTH + "px");
root.style.setProperty("--padding", PADDING + "px");

const square_Content = document.querySelector(".square-content");
const tileContainer = {}; // 存储所有方块的容器

// 创建累计分数方法
const score = document.getElementById("score");
score.setScore = (num) => {
	if (num) {
		score.textContent = +score.textContent + +num;
	} else {
		score.textContent = 0;
	}
};

// 记录最高分
const data = localStorage.getItem("2048");
const best = document.getElementById("bset-score");
best.textContent = data ?? 0;
best.setBest = () => {
	if (+best.textContent < score.textContent) {
		best.textContent = +score.textContent;
		localStorage.setItem("2048", score.textContent);
	}
};

//初始化棋盘
const board = initializeBoard();
generateRandomSquare(2, board);
const pieceCoordinates = () =>
	board
		.flat()
		.map((val) => val.textContent)
		.join("");

//注册键盘事件
document.onkeydown = throttle(({ key }) => {
	nextFunc[key] && move(board, key, tileContainer);
}, 400);

//注册手指滑动事件
initSwipe();

//注册重置事件
document.querySelector(".restartGame").onclick = () => {
completion("刷新");
resetGame();
};

//初始化棋盘
function initializeBoard() {
	const bg = document.querySelector(".bg");
	return Array.from({ length: SIZE }, () =>
		Array.from({ length: SIZE }, () => {
			const div = document.createElement("div");
			div.textContent = 0;
			bg.appendChild(div);
			return div;
		})
	);
}

//随机生成棋子
function generateRandomSquare(count = 1, board) {
	const newArr = [];
	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			const value = board[i][j];
			if (value.textContent === "0") {
				newArr.push([i, j]);
			}
		}
	}

	for (let i = 0; i < count; i++) setRandom(newArr);
}

function getRandom(max, min) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setRandom(newArr) {
	const randomIndex = getRandom(newArr.length - 1, 0);
	const randomNum = getRandom(1, 0) ? 2 : 4;

	const [r, j] = newArr[randomIndex];
	board[r][j].textContent = randomNum;

	const div = document.createElement("div");
	div.textContent = randomNum;
	div.style.color = fontColor(randomNum);
	div.style.backgroundColor = colorMap[randomNum];
	div.style.setProperty("--row", r);
	div.style.setProperty("--col", j);
	tileContainer[\`\${r}-\${j}\`] = div;
	// 设置随机位置
	square_Content.appendChild(div);
	// 删除被选中的元素
	newArr.splice(randomIndex, 1);
}

// 实现移动逻辑
function move(board, direction, tileContainer) {
	const r = board.length; //y轴
	const c = board[0].length; //x轴

	//判断当前位置是否超出边界
	const isValid = (row, col) => {
		return row >= 0 && row < r && col >= 0 && col < c;
	};

	//判断下一个不为0的位置
	const getNextNoZero = (row, col) => {
		let [nextR, nextC] = nextFunc[direction](row, col);

		while (isValid(nextR, nextC)) {
			const value = +board[nextR][nextC].textContent;
			if (value !== 0) {
				return [nextR, nextC, value];
			}

			[nextR, nextC] = nextFunc[direction](nextR, nextC);
		}
	};

	//设置属性
	const setAttribute = (item, value) => {
		item.textContent = value;
		item.style.color = fontColor(value);
		item.style.backgroundColor = colorMap[value];
	};

	//动画方法
	const animateElement = (nextR, nextC, r, c, value) => {
		//开始移动动画
		const div = tileContainer[\`\${nextR}-\${nextC}\`];
		if (div) {
			div.style.setProperty("--row", r);
			div.style.setProperty("--col", c);
			div.ontransitionend = () => setAttribute(div, value);

			tileContainer[\`\${nextR}-\${nextC}\`] = void 0;
			tileContainer[\`\${r}-\${c}\`] = div;
		}
	};

	// 移动逻辑
	const createNewBoard = (r, c) => {
		for (;;) {
			let [nextR, nextC, nextValue] = getNextNoZero(r, c) ?? [];
			if (!nextValue) return;
			let value = +board[r][c].textContent;
			if (value === 0) {
				board[r][c].textContent = nextValue;
				board[nextR][nextC].textContent = 0;
				animateElement(nextR, nextC, r, c, nextValue);
			} else if (+value === +nextValue) {
				board[r][c].textContent = value * 2;
				board[nextR][nextC].textContent = 0;
				const oldDiv = tileContainer[\`\${r}-\${c}\`];

				setTimeout(() => square_Content.removeChild(oldDiv), 300);

				score.setScore(value * 2);
				best.setBest();
				animateElement(nextR, nextC, r, c, value * 2);
				break;
			} else break;
		}

		//递归 对下一颗棋子计算
		createNewBoard(...nextFunc[direction](r, c));
	};

	const piece = pieceCoordinates();
	// 移动方向
	switch (direction) {
		case "ArrowUp":
			for (let i = 0; i < c; i++) createNewBoard(0, i);
			break;

		case "ArrowDown":
			for (let i = 0; i < c; i++) createNewBoard(r - 1, i);
			break;

		case "ArrowLeft":
			for (let i = 0; i < r; i++) createNewBoard(i, 0);
			break;

		case "ArrowRight":
			for (let i = 0; i < r; i++) createNewBoard(i, c - 1);
			break;
	}

	piece !== pieceCoordinates() &&
		setTimeout(() => {
			generateRandomSquare(1, board);
		}, 300);

	if (isGameOver()) {
		setTimeout(() => {
      completion(\`Game Over 分数: \${score.textContent}\`);
			

			alert("Game Over");
			resetGame();
			score.setScore();
		}, 300);
	}
}

// 游戏结束
function isGameOver() {
	const arr = [];
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[0].length; j++) {
			const value = board[i][j].textContent;
			if (value === "0") return;
			arr[i] ||= [];
			arr[i][j] = value;
		}
	}

	// 检查行和列是否相邻

	for (let i of arr) {
		// 从左到右检查相邻元素是否相等
		for (let j = 0; j < i.length - 1; j++) {
			const a = i[j];
			const b = i[j + 1];
			if (a === b) return;
		}

		// 从右到左检查相邻元素是否相等
		for (let j = i.length - 1; j > 0; j--) {
			const a = i[j];
			const b = i[j - 1];
			if (a === b) return;
		}
	}

	for (let j = 0; j < arr[0].length; j++) {
		// 从下到上检查相邻元素是否相等
		for (let i = arr.length - 1; i > 0; i--) {
			const a = arr[i][j];
			const b = arr[i - 1][j];
			if (a === b) return;
		}

		// 从上到下检查相邻元素是否相等
		for (let i = 0; i < arr.length - 1; i++) {
			const a = arr[i][j];
			const b = arr[i + 1][j];
			if (a === b) return;
		}
	}
	return true;
}

//重置游戏
function resetGame() {
	square_Content.innerHTML = "";
	board.flat().forEach((div) => (div.textContent = 0));
	generateRandomSquare(2, board);
}

// 初始化滑动事件
function initSwipe() {
	let startX = 0;
	let startY = 0;
	square_Content.ontouchstart = (e) => {
		e.preventDefault();
		startX = e.targetTouches[0].clientX;
		startY = e.targetTouches[0].clientY;
	};

	square_Content.ontouchend = ({ changedTouches }) => {
		const endX = changedTouches[0].clientX;
		const endY = changedTouches[0].clientY;

		// 判断方向
		const deltaX = endX - startX;
		const deltaY = endY - startY;

		const direction = () => {
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				return deltaX > 0 ? "ArrowRight" : "ArrowLeft";
			} else {
				return deltaY > 0 ? "ArrowDown" : "ArrowUp";
			}
		};

		const distanceBetweenPoints = () => {
			return Math.sqrt(deltaX * deltaX + deltaY * deltaY) > 50;
		};

		distanceBetweenPoints() && move(board, direction(), tileContainer);

		startX = 0;
		startY = 0;
	};
}

//节流
function throttle(func, delay) {
	let waiting = false;
	return function (...args) {
		if (!waiting) {
			func.apply(this, args);
			waiting = true;
			setTimeout(() => {
				waiting = false;
			}, delay);
		}
	};
}

		</script>
	</body>
</html>
`;

const playGame2048 = async () => {
	const localFM = useCache("2048");
	const htmlpath = joinPath(localFM.cacheDirectory, "2048.html");

	if (localFM.readString("2048.html") !== html) {
		localFM.writeString("2048.html", html);
	}

	const wv = new WebView();
	wv.loadFile(htmlpath);

	const showAlert = (title) =>
		new Alert().myProxy({
			title,
			presentAlert: true,
		});

	const recursiveAlert = () =>
		wv.evaluateJavaScript("", true).then(showAlert).then(recursiveAlert);

	recursiveAlert();

	await wv.present();
};

const addTitleName = (topLeft) => {
	//计算宽度
	const body = BillData.find((i) => i.title === "用户").value;
	const len = body.includes("*") ? body.length + 0.5 : body.length + 1;

	topLeft.addStack().myProxy({
		centerAlignContent: true,
		size: new Size(len * 18 + 10 + 2, topLeft.size.height / 4),
		//backgroundColor: Color.blue(),

		addImage: [
			icons.getImage("家"),
			{
				tintColor: icons.color,
				imageSize: icons.largeSize,
			},
		],

		addSpacer: 10,

		addText: [
			body,
			{
				textColor: BillStyle.color,
				font: BillStyle.largeFont,
				url: "scriptable:///run?scriptName=国上国网&event=switchAcc",
			},
		],
	});
};

const addIcon = (topLeft, newWidth, newheight) => {
	topLeft
		.addStack()
		.myProxy({
			centerAlignContent: true,
			size: new Size(
				newWidth ?? topLeft.size.width * 0.37,
				newheight ?? topLeft.size.height / 4
			),
			//backgroundColor: Color.red(),

			addText: [
				isOverdue ? "欠费" :"余额",
				{
					textColor: BillStyle.color,
					font: BillStyle.mediumFont,
				},
			],
			addSpacer: 5,
			addImage: [
				icons.getImage("闪电"),
				{
					tintColor: icons.color,
					imageSize: icons.smallSize,
					imageOpacity: 0.5,
				},
			],
		})
		.myProxy({
			addSpacer: 5,
			addText: [
				"|",
				{
					textColor: BillStyle.color,
					font: BillStyle.smallFont,
				},
			],
		})
		.myProxy({
			addSpacer: 5,
			addImage: [
				icons.getImage("眼睛"),
				{
					tintColor: icons.color,
					imageSize: icons.smallSize,
					imageOpacity: 0.5,
				},
			],
		});
};

const addBalance = (topLeft) => {
	const body = BillData.find((i) => i.title === "余额").value;
	let [int, decimal] = (+body).toFixed(2).split(".");
	int = isOverdue ? "-" + int : int;
	const width = topLeft.size.width;
	const height = topLeft.size.height / 4;

	let w = 0;
	const w_Init = 0;

	const ctx = new DrawContext();
	ctx.size = new Size(width, height);
	ctx.opaque = false;
	ctx.respectScreenScale = true;

	//27号字体的宽度
	let fontWidthList = {
		"-":13,
		0: 18,
		1: 13,
		2: 17,
		3: 17,
		4: 18,
		5: 17,
		6: 18,
		7: 16,
		8: 18,
		9: 18,
	};

	w += w_Init;
	ctx.setFont(Font.boldSystemFont(27));
	ctx.drawText(int, new Point(w, -2));

	int.split("").forEach((n) => (w += fontWidthList[n]));

	ctx.setFont(Font.boldSystemFont(17));
	ctx.drawTextInRect("." + decimal, new Rect(w, 7, width, height));

	decimal.split("").forEach((n) => (w += n == 1 ? 12 : 14));

	ctx.drawTextInRect("元", new Rect(w, 6, width, height));

	w += 15 + 5;
	ctx.drawImageAtPoint(icons.getImage("刷新", 12), new Point(w, 11));

	topLeft.addStack().myProxy({
		size: new Size(width, height),
		//backgroundColor: Color.green(),

		addImage: [
			ctx.getImage(),
			{
				tintColor: isOverdue ? new Color("#B32E4E") : icons.color,
			},
		],
	});
};

const addDeadline = (topLeft) => {
	const body = "截至" + BillData.find((i) => i.title === "截至日期").value;
	const width = topLeft.size.width;
	const height = topLeft.size.height / 4;

	const ctx = new DrawContext();
	ctx.size = new Size(width, height);
	ctx.opaque = false;
	ctx.respectScreenScale = true;
	ctx.setFont(BillStyle.mediumFont);
	ctx.drawText(body, new Point(0, 9));

	topLeft.addStack().myProxy({
		centerAlignContent: true,
		size: new Size(width, height),
		//backgroundColor: Color.black(),

		addImage: [
			ctx.getImage(),
			{
				tintColor: icons.color,
			},
		],
	});
};

const containerTopLeft = (containerTop) =>
	containerTop.addStack().myProxy({
		layoutVertically: true,
		size: new Size(containerTop.size.width * 0.6, containerTop.size.height),
		//backgroundColor: Color.brown(),

		addTitleName,
		addIcon,
		addBalance,
		addDeadline,
	});

const setPaymentPage = (
	widget,
	width,
	height,
	text = "去交费",
	icon = icons.getImage("货币"),
	url = "com.wsgw.e.zsdl://platformapi/"
) =>
	widget.addStack().myProxy({
		centerAlignContent: true,
		size: new Size(width * 0.6, height),
		cornerRadius: 20,
		backgroundGradient: Gradient([
			"#6BA7E5",
			"#67A0E2",
			"#2C334D",
			"#242A43",
		]),

		// 添加图标
		addImage: [
			icon,
			{
				imageSize: icons.largeSize,
				tintColor: icons.color,
			},
		],

		addSpacer: 2,

		// 添加文字
		addText: [
			text,
			{
				textColor: BillStyle.color,
				font: BillStyle.mediumFont,
				url,
			},
		],
	});

const setDate = (w, options = {}) =>
	w.myProxy({
		addDate: [
			new Date(),
			{
				font: BillStyle.smallFont,
				applyTimeStyle: true,
				textColor: icons.color,
				textOpacity: 0.8,
				...options,
			},
		],
	});

const containerTopRight = (containerTop) =>
	containerTop.addStack().myProxy({
		layoutVertically: true,
		size: new Size(containerTop.size.width * 0.4, containerTop.size.height),
		//backgroundColor: Color.red(),

		renderPaymentPage(TopRight) {
			const width = TopRight.size.width;
			const height = TopRight.size.height * 0.31;

			TopRight.addStack()
				.myProxy({
					size: new Size(width, height),
					addSpacer: width * 0.31,
				})
				.addStack()
				.myProxy({
					$: (w) => setPaymentPage(w, width, height),
				});
		},

		addSpacer: containerTop.size.height * 0.1,

		addGame2048(TopRight) {
			const width = TopRight.size.width;
			const height = TopRight.size.height * 0.31;

			TopRight.addStack()
				.myProxy({
					size: new Size(width, height),
					addSpacer: width * 0.31,
				})
				.addStack()
				.myProxy({
					$: (w) =>
						setPaymentPage(
							w,
							width,
							height,
							"2048",
							icons.getImage("游戏"),
							"scriptable:///run?scriptName=国上国网&event=playGame2048"
						),
				});
		},

		updateTime(TopRight) {
			TopRight.addStack().myProxy({
				bottomAlignContent: true,
				size: new Size(
					TopRight.size.width,
					TopRight.size.height * 0.25
				),
				//backgroundColor: Color.gray(),

				addSpacer: 75,
				setDate,
			});
		},
	});

const createContainerTop = (container) =>
	container.addStack().myProxy({
		topAlignContent: true,
		size: new Size(container.size.width, container.size.height * 0.7),
		//backgroundColor: Color.gray(),

		containerTopLeft,
		containerTopRight,
	});

const createContainerBottom = (container) =>
	container.addStack().myProxy({
		centerAlignContent: true,
		size: new Size(container.size.width, container.size.height * 0.3),

		populateBottomContainer(containerbottom) {
			const newData = BillData.filter(
				(i) => !/用户|余额|截至日期|是否欠费/.test(i.title)
			);
			newData.forEach((item) => {
				const col = containerbottom.addStack().myProxy({
					layoutVertically: true,
					size: new Size(
						containerbottom.size.width / newData.length,
						containerbottom.size.height
					),
				});

				Object.keys(item).forEach((k) => {
					const row = col.addStack().myProxy({
						size: new Size(
							col.size.width,
							col.size.height / Object.keys(item).length
						),
					});

					const result = item[k];

					if (k === "value") {
						const unit = item.title.includes("电量") ? "度" : "元";
						row.myProxy({
							bottomAlignContent: true,
							addText: [
								(+result).toFixed(2),
								{
									textColor: BillStyle.color,
									font: BillStyle.mediumFont,
								},
							],
						}).myProxy({
							addText: [
								unit,
								{
									textColor: BillStyle.color,
									font: BillStyle.smallFont,
								},
							],
						});
					} else {
						row.myProxy({
							centerAlignContent: true,
							addText: [
								result,
								{
									textColor: BillStyle.color,
									font: BillStyle.smallFont,
								},
							],
						});
					}
				});
			});
		},
	});

// 中型小组件
config.mediumRender = (widget) => {
	widget.addStack().myProxy({
		layoutVertically: true,
		size: new Size(...config.familySize),

		createContainerTop,
		createContainerBottom,
	});
};

// 小型小组件
config.smallRender = (widget) => {
	widget.addStack().myProxy({
		layoutVertically: true,
		size: new Size(...config.familySize),

		addTitleName,
		$: (widget) => addIcon(widget, widget.size.Width * 0.5),

		addBalance,
		setRenderPaymentPage(widget) {
			const w = widget.addStack();
			w.centerAlignContent();
			w.addSpacer(5);
			setDate(w);
			w.addSpacer(27);
			setPaymentPage(w, 130, 26);
		},
	});
};

const createWidget = (widget) => {
	const screen = Device.screenResolution();
	const size = phoneSize(screen.height);
	const scale = Device.screenScale();
	const family = config.widgetFamily;

	const widthPX = family === "large" ? size.medium : size[family];
	const heightPX = family === "medium" ? size.small : size[family];

	const height = heightPX / scale;
	const width = widthPX / scale;
	config.familySize = [width - 15, height - 15];

	config[family + "Render"](widget);
};

const Gradient = ([light1, light2, dark1, dark2]) =>
	new LinearGradient().myProxy({
		colors: [
			Color.dynamic(new Color(light2), new Color(dark2)),

			Color.dynamic(new Color(light1), new Color(dark1)),
		],
		locations: [0.05, 1],
		startPoint: new Point(1, 1),
	});

class UIData {
	static fileName = "settings.json";
	static iCloudFM = useFileManager({ useICloud: true });

	static async create(url) {
		const instance = new UIData();
		await instance.fetchData(url);
		return instance;
	}

	constructor(data = null) {
		this.update_interval = 6 * 3600000;
		this.last_update_time = 0;
		this.index = 0;
		this.data = data;
	}

	get isUpdatable() {
		const timeElapsed = Date.now() - this.last_update_time;
		return timeElapsed >= this.update_interval;
	}

	async fetchData(url) {
		const cache = UIData.iCloudFM.readJSON(UIData.fileName) ?? {};
		Object.assign(this, cache);

		if (this.isUpdatable) {
			const { body } = await http.get(url, 18).json();

			if (!body) throw new Error("请求失败,请安装模块 检查boxjs配置");

			this.last_update_time = Date.now();
			this.data = body;
		}
	}

	severData() {
		UIData.iCloudFM.writeJSON(UIData.fileName, this);
	}

	async getData() {
		await this.event();
		this.updateIndex();
		this.severData();
		
		return this.data?.[this.index];
	}

	updateIndex() {
		const i = args.widgetParameter;
		if (!i) return;
		if (!this.data[i]) throw new Error("户号不存在");
		this.index = i;
	}

	async event() {
		const eventFunction = this["_api_" + args.queryParameters.event];

		if (eventFunction) {
			await eventFunction.call(this);
		}
	}

	async _api_switchAcc() {
		const options = this.data.map((item) => {
			const { value: title } = item.find((i) => i.title === "用户");
			return { title };
		});

		const { value: index } = await presentSheet({
			title: "户号",
			message: "请选择要展示的户号",
			options,
			cancelText: "取消",
		});

		if (index !== -1) this.index = index;
	}

	async _api_playGame2048() {
		await playGame2048();
	}
}

const uiData = await UIData.create(
	"http://api.example.com/electricity/bill/all"
);

const BillData = await uiData.getData();

const isOverdue = BillData.find(i => i.title === "是否欠费").value;

new ListWidget().myProxy({
	// 设置背景渐变
	backgroundGradient: Gradient(["#56A0EB", "#4B90E2", "#2B3551", "#090B21"]),

	// 运行小组件
	run(widget) {
		if (config.runsInWidget) {
			createWidget(widget);
			Script.setWidget(widget);
		} else {
			config.widgetFamily = "medium";
			createWidget(widget);
			widget.presentMedium();
		}

		Script.complete();
	},
});
