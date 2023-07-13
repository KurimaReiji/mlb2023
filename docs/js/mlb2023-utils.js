import { MlbTeams as Teams } from "./mlb2023-teams.js";

/**
 * return nth day of the season. i.e. the opening day is Day 1.
 * @param {string} date
 * @param {string} openingDay
 * @returns {number}
 */
const daysFromOpeningDay = (date, openingDay = "2023-03-30") => {
  const onedaylong = 24 * 60 * 60 * 1000;
  return 1 + (new Date(date) - new Date(openingDay)) / onedaylong;
};

/**
 * returns truncated winning percentage. e.g. 0.333, 0.5, 0.667
 * @param {number} win
 * @param {number} loss
 * @returns {number}
 */
const winpct = (win, loss) => {
  const val = (1000 * win) / (win + loss);
  return Math.trunc(Math.round(val)) / 1000;
};

/**
 * compare function to sort by winning percentage
 * @param {object} a
 * @param {object} b
 * @returns
 */
const teams_by_wpct = (a, b) => {
  const [aWpct, bWpct] = [a, b].map((obj) => obj.win / (obj.win + obj.loss));
  if (aWpct > bWpct) return -1;
  if (aWpct < bWpct) return 1;
  if (a.win > b.win) return -1;
  if (a.win < b.win) return 1;
  return 0;
};

/**
 * calculate games behind from the leader
 * @param {number} win
 * @param {number} loss
 * @param {number} leaderWin
 * @param {number} leaderLoss
 * @returns {number}
 */
const games_behind = (win, loss, leaderWin, leaderLoss) => {
  if (win === leaderWin && loss === leaderLoss) return "";
  return ((leaderWin - win + (loss - leaderLoss)) * 0.5).toFixed(1);
};

/**
 * reducer to uniq
 * @param {*} acc
 * @param {*} cur
 * @param {*} idx
 * @param {*} ary
 * @returns
 */
const to_uniq = (acc, cur, idx, ary) => {
  if (idx === ary.length - 1) acc = [...new Set(ary)];
  return acc;
};

const to_total = (acc, cur) => acc + cur;

/**
 * filter function to select games at home.
 * @param {string} team
 * @returns {boolean}
 */
const games_at_home = (team) => (game) => game.home.team === team;

/**
 * filter function to select games on road.
 * @param {string} team
 * @returns {boolean}
 */
const games_on_road = (team) => (game) => game.road.team === team;

/**
 * filter function to select the interleague games.
 * @param {string} team
 * @returns {boolean}
 */
const isInterLeague = (game) => {
  return Teams.league(game.home.team) !== Teams.league(game.road.team);
};

/**
 * head to head records of the team.
 * @param {string} team
 * @returns {object}
 */
const headToHead = (team) => (games) => {
  const opponents = games.map((game) => game.opponentOf(team)).reduce(to_uniq);
  const interLeagueGames = games.filter((game) => game.isInterLeagueGame);
  const intraLeagueGames = games.filter((game) => !game.isInterLeagueGame);
  const data = opponents
    .map((opp) => {
      const vsGames = games.filter((g) => g.opponentOf(team) === opp);
      return {
        opponent: opp,
        win: vsGames.filter((g) => g.winner === team).length,
        loss: vsGames.filter((g) => g.loser === team).length,
        tied: vsGames.filter((g) => g.isTied).length,
      };
    })
    .concat([
      {
        opponent: "Inter",
        win: interLeagueGames.filter((g) => g.winner === team).length,
        loss: interLeagueGames.filter((g) => g.loser === team).length,
        tied: interLeagueGames.filter((g) => g.isTied).length,
      },
      {
        opponent: "Intra",
        win: intraLeagueGames.filter((g) => g.winner === team).length,
        loss: intraLeagueGames.filter((g) => g.loser === team).length,
        tied: intraLeagueGames.filter((g) => g.isTied).length,
      },
    ]);

  return data;
};

const createElement = (tagName) => {
  return ({ text = "", attr = {}, dataset = {}, cls = [] }) => {
    const elm = document.createElement(tagName);
    elm.textContent = text;
    Object.keys(dataset).forEach((key) => {
      elm.dataset[key] = dataset[key];
    });
    Object.keys(attr).forEach((name) => {
      elm.setAttribute(name, attr[name]);
    });
    cls.forEach((name) => {
      elm.classList.add(name);
    });
    return elm;
  };
};

const Pythagorean = (rs, ra, exp = 1.83) => {
  // The initial formula for pythagorean winning percentage was as follows: (runs scored ^ 2) / [(runs scored ^ 2) + (runs allowed ^ 2)]
  // Baseball-Reference.com, for instance, uses 1.83 as its exponent of choice
  return rs ** exp / (rs ** exp + ra ** exp);
};

const get_xwl = (win, loss, rs, ra) => {
  const wpct = Pythagorean(Number(rs), Number(ra));
  const xWin = (Number(win) + Number(loss)) * wpct;
  const xLoss = (Number(win) + Number(loss)) * (1 - wpct);
  return {
    win: Math.round(xWin),
    loss: Math.round(xLoss),
    luck: (win - xWin).toFixed(2),
  };
};

const to_last10 = (acc, cur) => {
  if (cur === "W") acc.win += 1;
  if (cur === "L") acc.loss += 1;
  return acc;
}

const get_records = (team) => (games) => {
  const win = games.filter(g => g.winner === team).length;
  const loss = games.filter(g => g.loser === team).length;
  const rs = games.map((g) => g.runsScored(team)).reduce(to_total);
  const ra = games.map((g) => g.runsAllowed(team)).reduce(to_total);
  const oneRunGames = games.filter((g) => g.isOneRunGame);
  const shutOutGames = games.filter((g) => g.isShutOutGame);
  const wl = games.map((g) => {
    if (g.winner === team) return "W";
    if (g.loser === team) return "L";
    if (g.isTied) return "T";
    return "_";
  }).join("");
  const last10 = wl.slice(-10).split("")
    .reduce(to_last10, { win: 0, loss: 0 });
  const strk = `${wl.replace(/T/g, "").at(-1)}${wl.replace(/T/g, "").match(/W+$|L+$/)[0].length}`;
  const g = games.length;

  return {
    g,
    win,
    loss,
    tied: games.filter(g => g.isTied).length,
    winpct: winpct(win, loss),
    rs,
    ra,
    rdiff: rs - ra,
    xwl: get_xwl(win, loss, rs, ra),
    wl,
    last10,
    strk,
    oneRun: {
      win: oneRunGames.filter(g => g.winner === team).length,
      loss: oneRunGames.filter(g => g.loser === team).length,
    },
    shutOut: {
      pitching: shutOutGames.filter(g => g.runsAllowed(team) === 0).length,
      batting: shutOutGames.filter(g => g.runsScored(team) === 0).length,
    },
    tenPlusRun: {
      scored: games.filter(g => g.runsScored(team) > 9).length,
      allowed: games.filter(g => g.runsAllowed(team) > 9).length,
    },
    headToHead: headToHead(team)(games)
  }
};

const pad = (i) => (n) => `${n}`.padStart(i);
const pad2 = pad(2);
const pad3 = pad(3);

const fetchOptions = {
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json"
  }
};

const responseToJson = (res) => {
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

function waitFor(selector, parent) {
  // https://stackoverflow.com/a/61511955
  if (!parent) parent = document;
  return new Promise(resolve => {
    if (parent.querySelector(selector)) {
      return resolve(parent.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (parent.querySelector(selector)) {
        resolve(parent.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(parent, {
      childList: true,
      subtree: true
    });
  });
}

function load_css_rules(link, root) {
  return new Promise(resolve => {
    if (link.sheet) resolve([...link.sheet.cssRules].map(r => r.cssText).join("\n"));
    link.addEventListener("load", ({ currentTarget }) => {
      const css = [...root.styleSheets].find(sheet => sheet.href === currentTarget.href);
      const rules = [...css.cssRules].map(r => r.cssText).join("\n");
      resolve(rules);
    });
  });
}

function load_font({ name, url }) {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const rule = `@font-face{
          font-family: '${name}';
          src: url("${reader.result}");
        }`;
      resolve(rule);
    });

    fetch(url)
      .then(r => r.blob())
      .then(b => reader.readAsDataURL(b))
  });
}

const svgdownload = (filename = "output.png", svg = null) => {
  const delay = (msec) => new Promise((r) => setTimeout(r, msec));
  svg = svg || document.querySelector("svg");
  const svgData = new XMLSerializer().serializeToString(svg);

  const canvas = document.createElement("canvas");
  canvas.width = svg.width.baseVal.value;
  canvas.height = svg.height.baseVal.value;
  const ctx = canvas.getContext("2d");
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      var a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.setAttribute("download", filename);
      delay(200).then(() => {
        a.dispatchEvent(new MouseEvent("click"));
        console.log(filename);
        resolve(filename);
      });
    };
    image.src = "data:image/svg+xml;charset=utf-8;base64," + window.btoa(svgData);
  });
};

export {
  daysFromOpeningDay,
  winpct,
  teams_by_wpct,
  games_behind,
  to_uniq,
  to_total,
  games_at_home,
  games_on_road,
  isInterLeague,
  createElement,
  pad2,
  pad3,
  get_records,
  fetchOptions,
  responseToJson,
  waitFor,
  load_css_rules,
  load_font,
  svgdownload,
}
