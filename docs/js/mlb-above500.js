import { MlbTeams as Teams, teams_by_wpct, to_total, waitFor, load_css_rules, load_font, svgdownload } from "./mlb2023.js";

const svgTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="0 0 600 400">
  <style data-css="external"></style>
  <style data-css="fonts"></style>
  <style>
    #bgRect {
      fill: var(--bgcolor, cornsilk);
    }
    text {
      font-family: 'Noto Sans', Arial, sans-serif;
    }
    #title text {
      text-anchor: middle;
      alignment-baseline: middle;
    }
    .series {
      fill: none;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .axis {
      fill: none;
      stroke-linecap: round;
      stroke: black;
      stroke-width: 2;
    }
    .tics {
      fill: none;
      stroke-linecap: round;
      stroke: gray;
      stroke-width: 1;
    }
    .tic-label {
      font-size: var(--small-font-size, 18px);
      font-family: 'Noto Sans', sans-serif;
      alignment-baseline: middle;
    }
    .tic-label[data-x]{
      text-anchor: middle;
    }
    .tic-label[data-y]{
      text-anchor: end;
    }
    #yTics .tic-label {
      transform: translate(-10px, 0);
    }
    #xTics .tic-label {
      transform: translate(0, 16px);
    }
    #gTitle {
      font-size: 28px;
    }
    #gSeries path {
      --shadow-width: 8;
      --stroke-width: calc(0.5 * var(--shadow-width));
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: var(--stroke-width);
      stroke: var(--team-color, yellow);
    }
    #gSeries path.shadow {
      stroke-width: var(--shadow-width);
      stroke: var(--team-shadow-color, white);
    }
    #gLabels text {
      fill: var(--team-text-color, var(--team-color));
      stroke: var(--team-text-color, var(--team-color));
      stroke-width: 1;
      font-family: 'Noto Sans Mono', sans-serif;
      transform: translate(10px, 0);
    }

    .HOU {
      --team-color: var(--astros-orange);
      --team-shadow-color: var(--astros-darkblue);
    }
    .SEA {
      --team-color: var(--mariners-aqua);
      --team-shadow-color: var(--mariners-navy);
      --team-text-color: var(--mariners-navy);
    }
    .LAA {
      --team-color: var(--angels-maroon);
      --team-shadow-color: var(--angels-blue);
    }
    .TEX {
      --team-color: var(--rangers-blue);
      --team-shadow-color: var(--rangers-red);
      --team-text-color: var(--rangers-red);
    }
    .OAK {
      --team-color: var(--athletics-green);
      --team-shadow-color: var(--athletics-gold);
    }

    .CLE {
      --team-color: var(--guardians-red);
      --team-shadow-color: var(--guardians-navy);
    }
    .CWS,
    .CHW {
      --team-color: var(--whitesox-silver);
      --team-shadow-color: var(--whitesox-black);
      --team-text-color: var(--whitesox-black);
    }
    .MIN {
      --team-color: var(--twins-navy);
      --team-shadow-color: var(--twins-scarlet-red);
    }
    .DET {
      --team-color: var(--tigers-navy);
      --team-shadow-color: var(--tigers-navy);
    }
    .KC,
    .KCR {
      --team-color: var(--royals-blue);
      --team-shadow-color: var(--royals-gold);
    }

    .NYY {
      --team-color: var(--yankees-gray);
      --team-shadow-color: var(--yankees-blue);
      --team-text-color: var(--yankees-blue);
    }
    .TOR {
      --team-color: var(--bluejays-powderblue);
      --team-shadow-color: var(--bluejays-blue);
      --team-text-color: var(--bluejays-blue);
    }
    .TB,
    .TBR {
      --team-color: var(--rays-navy);
      --team-shadow-color: var(--rays-columbia-blue);
    }
    .BAL {
      --team-color: var(--orioles-orange);
      --team-shadow-color: var(--orioles-black);
    }
    .BOS {
      --team-color: var(--redsox-red);
      --team-shadow-color: var(--redsox-blue);
    }

    .LAD {
      --team-color: var(--dodger-blue);
      --team-shadow-color: var(--dodger-blue);
    }
    .SF,
    .SFG {
      --team-color: var(--giants-orange);
      --team-shadow-color: var(--giants-black);
    }
    .SD,
    .SDP {
      --team-color: var(--padres-gold);
      --team-shadow-color: var(--padres-brown);
      --team-text-color: var(--padres-brown);
    }
    .COL {
      --team-color: var(--rockies-silver);
      --team-shadow-color: var(--rockies-purple);
      --team-text-color: var(--rockies-purple);
    }
    .AZ,
    .ARI {
      --team-color: var(--dbacks-red);
      --team-shadow-color: var(--dbacks-black);
    }

    .CIN {
      --team-color: var(--reds-red);
      --team-shadow-color: var(--reds-black);
    }
    .PIT {
      --team-color: var(--pirates-gold);
      --team-shadow-color: var(--pirates-black);
      --team-text-color: var(--pirates-black);
    }
    .STL {
      --team-color: var(--cardinals-red);
      --team-shadow-color: var(--cardinals-navy);
    }
    .MIL {
      --team-color: var(--brewers-navy);
      --team-shadow-color: var(--brewers-yellow);
    }
    .CHC {
      --team-color: var(--cubs-blue);
      --team-shadow-color: var(--cubs-red);
    }

    .PHI {
      --team-color: var(--phillies-red);
      --team-shadow-color: var(--phillies-blue);
    }
    .WSH {
      --team-color: var(--nationals-red);
      --team-shadow-color: var(--nationals-blue);
    }
    .NYM {
      --team-color: var(--mets-orange);
      --team-shadow-color: var(--mets-blue);
    }
    .ATL {
      --team-color: var(--braves-scarlet);
      --team-shadow-color: var(--braves-navy);
    }
    .MIA {
      --team-color: var(--marlins-black);
      --team-shadow-color: var(--marlins-miamiblue);
    }
  </style>
  <rect x="0" y="0" width="600" height="400" stroke="none" id="bgRect"/>
  <g id="gTics">
    <g id="yTics">
      <g>
        <path d="" class="tics"/>
        <text class="tic-label"></text>
      </g>
    </g>
    <g id="xTics">
      <g>
        <path d="" class="tics"/>
        <text class="tic-label"></text>
      </g>
    </g>
  </g>
  <g class="gAxis">
    <path d="" class="axis" id="x-axis"/>
    <path d="" class="axis" id="y-axis"/>
  </g>
  <g id="gSeries">
    <path d="" fill="none" />
  </g>
  <g id="gLabels">
    <text alignment-baseline="middle"></text>
  </g>
  <g id="gTitle">
    <text x="50%" class="title" text-anchor="middle" alignment-baseline="middle"></text>
  </g>
</svg>
`;

const shadow = () => document.querySelector("mlb-above500").shadowRoot;

const trunc = (n) => Number(n.toFixed(2));

const transform_to_viewport = (domain, range, x) => {
  const dLength = domain[1] - domain[0];
  const rLength = Math.abs(range[1] - range[0]);
  return (x) => trunc(range[0] + (rLength * (x - domain[0])) / dLength);
}

const make_series = (games) => {
  return Teams.all()
    .map((team) => {
      const myGames = games.filter((g) => g.isGameOf(team));
      const win = myGames.filter((g) => g.winner === team).length;
      const loss = myGames.filter((g) => g.loser === team).length;
      const history = myGames
        .map((g) => {
          if (g.winner === team) return 1;
          if (g.loser === team) return -1;
          return 9999;
        })
        .map((_, i, ary) => {
          return {
            x: i + 1,
            y: ary.slice(0, i + 1).reduce(to_total, 0)
          }
        });

      const min = Math.min(...history.map(({ y }) => y));
      const max = Math.max(...history.map(({ y }) => y));

      return { win, loss, team, min, max, history }
    })
    .sort(teams_by_wpct)
    ;
}

const customProperties = [
  "padding-left", "padding-right", "padding-top", "padding-bottom"
];

const setup = ({ league, division, series, width, height }) => {
  const params = { league, division, series, width, height };

  params.svg = shadow().querySelector("template").content.cloneNode(true).querySelector("svg");

  customProperties.forEach((prop) => {
    params[prop] = getComputedStyle(shadow().querySelector("div")).getPropertyValue(`--${prop}`);
  });

  const numGames = Math.max(...series.map(({ history }) => history.length));
  const xDomain = [0, numGames];
  const xRange = [Number(params["padding-left"]), width - Number(params["padding-right"])];

  const yMin = Math.min(...series.map(o => o.min));
  const yMax = Math.max(...series.map(o => o.max));
  const yDomain = [yMax + 2, yMin - 2].map(n => n % 5 === 0 ? n + Math.sign(n) : n);
  const yRange = [Number(params["padding-top"]), height - Number(params["padding-bottom"])];
  params["title_y"] = 0.5 * Number(params["padding-top"]);

  const to_vx = transform_to_viewport(xDomain, xRange);
  const to_vy = transform_to_viewport(yDomain, yRange);

  params.axis = {
    x: [
      [xDomain[0], 0],
      [xDomain[1], 0]
    ],
    y: [
      [xDomain[0], yDomain[0]],
      [xDomain[0], yDomain[1]]
    ],
  }

  const yTics = [...new Array(30)]
    .map((n, i) => i * 5 - 60)
    .filter((n) => n < yDomain[0] && n > yDomain[1])
    .map((n) => ({ x: xDomain[0], y: n }));

  const xTics = "0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160"
    .split(",")
    .filter((n) => n <= xDomain[1])
    .map((n) => ({ x: n, y: yDomain[1] }));

  return Object.assign(params, { yTics, xTics, to_vx, to_vy, xDomain, yDomain, xRange, yRange });
}

const update_viewBox = ({ svg, width, height }) => {
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
}

const update_bgRect = ({ svg, width, height }) => {
  const bgRect = svg.getElementById("bgRect");
  bgRect.setAttribute("width", width);
  bgRect.setAttribute("height", height);
}

const update_axis = ({ svg, axis, to_vx, to_vy }) => {
  const d_axis_x = `M ${to_vx(axis.x[0][0])} ${to_vy(axis.x[0][1])} L ${to_vx(axis.x[1][0])} ${to_vy(axis.x[1][1])}`;
  const d_axis_y = `M ${to_vx(axis.y[0][0])} ${to_vy(axis.y[0][1])} L ${to_vx(axis.y[1][0])} ${to_vy(axis.y[1][1])}`;
  svg.getElementById("x-axis").setAttribute("d", d_axis_x);
  svg.getElementById("y-axis").setAttribute("d", d_axis_y);
}

const update_tics = ({ svg, yTics, xTics, xDomain, yDomain, to_vx, to_vy }) => {
  const ys = yTics
    .map(({ x, y }) => {
      const d = `M ${to_vx(xDomain[0])} ${to_vy(y)} L ${to_vx(xDomain[1])} ${to_vy(y)}`;
      const tic = svg.querySelector("#yTics path").cloneNode(true);
      tic.setAttribute("d", d);
      tic.dataset.y = y;
      const label = svg.querySelector("#yTics .tic-label").cloneNode(true);
      label.setAttribute("x", to_vx(x));
      label.setAttribute("y", to_vy(y));
      label.textContent = y;
      label.dataset.y = y;
      const grp = svg.querySelector("#yTics g").cloneNode(true);
      grp.replaceChildren(tic, label);
      return grp;
    });
  svg.getElementById("yTics").replaceChildren(...ys);

  const xs = xTics
    .filter((xy, _, a) => (a.length > 12 ? xy.x % 20 === 0 : true))
    .map(({ x, y }) => {
      const d = `M ${to_vx(x)} ${to_vy(yDomain[0])} L ${to_vx(x)} ${to_vy(yDomain[1])}`;
      const tic = svg.querySelector("#xTics path").cloneNode(true);
      tic.setAttribute("d", d);
      tic.dataset.x = x;
      const label = svg.querySelector("#xTics .tic-label").cloneNode(true);
      label.setAttribute("x", to_vx(x));
      label.setAttribute("y", to_vy(y));
      label.textContent = x;
      label.dataset.x = x;
      const grp = svg.querySelector("#xTics g").cloneNode(true);
      grp.replaceChildren(tic, label);
      return grp;
    });
  svg.getElementById("xTics").replaceChildren(...xs);
}

const update_series = ({ svg, to_vx, to_vy, series, xRange }) => {
  const reversed = series.reverse()
    .map((o) => {
      const d = o.history
        .map(({ x, y }) => ({ x: to_vx(x), y: to_vy(y) }))
        .reduce((a, c) => {
          return `${a} L ${c.x} ${c.y}`;
        }, [`M ${to_vx(0)} ${to_vy(0)}`]);
      const path = svg.querySelector("#gSeries path").cloneNode(true);
      path.setAttribute("d", d);
      ["team", "win", "loss"].forEach((item) => {
        path.dataset[item] = o[item];
      });
      path.classList.add(`${Teams.code(o.team)}`);
      const shadow = path.cloneNode(true);
      shadow.classList.add("shadow");
      return [shadow, path];
    });
  svg.querySelector("#gSeries").replaceChildren(...reversed.flat());

  const x = xRange[1];
  const labels = series.reverse()
    .map(({ team, win, loss, history }) => {
      const text = svg.querySelector("#gLabels text").cloneNode(true);
      text.textContent = `${Teams.code(team)}(${win}-${loss})`;
      [["team", team], ["win", win], ["loss", loss]].forEach(([k, v]) => {
        text.dataset[k] = v;
      });
      text.setAttribute("x", x);
      text.setAttribute("y", to_vy(history.at(-1).y));
      text.classList.add(Teams.code(team));
      return text;
    });
  svg.querySelector("#gLabels").replaceChildren(...labels);
}

const get_title = (league, division, year = 2023) => `Games above .500, ${league} ${division} ${year}`;

const update_title = ({ svg, title_y, league = "AL", division = "West" }) => {
  const title = get_title(league, division);
  const text = svg.querySelector("#gTitle text");
  text.textContent = title;
  text.setAttribute("y", title_y)
}

function fix_overlapping(targets) {
  if (targets.length === 0) return;
  const isOverlapped = (y, i, ary) => {
    if (!ary[i + 1]) return false;
    return y + h > ary[i + 1];
  };
  const h = Number(getComputedStyle(targets[0]).fontSize.replace("px", ""));
  const step = h * 0.125;
  let bboxes = targets.map((el) => el.getBBox().y);

  while (bboxes.some(isOverlapped)) {
    const idx0 = bboxes.findIndex(isOverlapped);
    const label0 = targets[idx0];
    const y0 = Number(label0.getAttribute("y"));
    label0.setAttribute("y", trunc(y0 - step));

    const label1 = targets[idx0 + 1];
    const y1 = Number(label1.getAttribute("y"));
    label1.setAttribute("y", trunc(y1 + step));
    bboxes = targets.map((el) => el.getBBox().y);
  }
};

const create_chart = ({ league, division, series, width, height }) => {
  const params = setup({ league, division, series, width, height });

  update_viewBox(params);
  update_bgRect(params);
  update_axis(params);
  update_tics(params);
  update_series(params);
  update_title(params);

  const svg = params.svg;
  svg.dataset.league = league;
  svg.dataset.division = division;
  svg.dataset.div = `${league} ${division}`;

  document.body.append(svg);
  const targets = [...svg.querySelectorAll("#gLabels text")];
  fix_overlapping(targets);
  svg.remove();
  return svg;
}

const create_charts = (series) => {
  const opts = {};

  const container = shadow().querySelector("div");
  ["width", "height"].forEach((prop) => {
    opts[prop] = Number(container.dataset[prop]);
  });

  const charts = ["AL", "NL"]
    .map((league) => {
      const divs = ["West", "Central", "East"]
        .map((division) => {
          const filteredSeries = series
            .filter(({ team }) => Teams.league(team) === league && Teams.division(team) === division)
            ;
          return create_chart({ league, division, series: filteredSeries, ...opts });
        })
        .flat();
      return divs;
    })
    .flat()
    .map((svg) => {
      svg.style.display = "none";
      return svg;
    });
  return charts;
}

function tweet({ league, division, series }) {
  const url = "https://github.com/KurimaReiji/mlb2023";
  const title = get_title(league, division);
  const tw = series
    .map(({ team, win, loss }) => `${win}-${loss} ${Teams.hashtag(team)}`);
  return [title, tw.join("\n"), url].join("\n");
}

async function downloadHandler(detail) {
  const opts = Object.assign({
    league: "AL",
    division: "West",
    width: 1200,
    height: 1600,
    filename: "output.png",
  }, detail);

  console.log(tweet(opts));

  const svg = create_chart(opts);
  svg.setAttributeNS(null, "width", opts.width);
  svg.setAttributeNS(null, "height", opts.height);

  const waitForCss = [...shadow().querySelectorAll(`link[rel="stylesheet"]`)]
    .map((link) => {
      return load_css_rules(link, shadow());
    });
  const rules = await Promise.all(waitForCss)
    .then(css => css.join("\n"));
  svg.querySelector(`style[data-css="external"]`).textContent = rules;

  const waitForFonts = [
    { name: "Noto Sans Mono", url: "/mlb2023/fonts/NotoSansMono-Regular.ttf" },
    { name: "Noto Sans", url: "/mlb2023/fonts/NotoSans-Regular.ttf" },
  ].map(load_font);
  const fonts = await Promise.all(waitForFonts)
    .then(css => css.join("\n"));
  svg.querySelector(`style[data-css="fonts"]`).textContent = fonts;

  svg.dataset.download = opts.filename;
  document.body.append(svg);
  await svgdownload(opts.filename, document.querySelector(`[data-download]`));
  svg.remove();
}

class MlbAbove500 extends HTMLElement {
  static get observedAttributes() {
    return ["division"];
  }

  constructor() {
    super();
    const self = this;

    document.addEventListener("ResultsLoaded", ({ detail }) => {
      self.series = make_series(detail);
      const charts = create_charts(self.series);
      const container = shadow().querySelector("div");
      container.replaceChildren(...charts);
    });

    document.addEventListener("DownloadSVG", ({ detail }) => {
      const opts = Object.assign({
        league: "AL",
        division: "West",
      }, detail);
      opts.series = self.series
        .filter(({ team }) => Teams.league(team) === opts.league && Teams.division(team) === opts.division);
      downloadHandler(opts);
    });

    this.render();
  }

  render() {
    const css = `<link rel="stylesheet" href="/mlb2023/css/mlb2023-colors.css">
    <style>
    :host {
      --padding-left: 50;
      --padding-right: 140;
      --padding-top: 70;
      --padding-bottom: 30;
    }    
    </style>`;
    const html = `
    <template>${svgTemplate}</template>
    <div></div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `${css}${html}`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "division") {
      waitFor(`[data-div="${newValue}"]`, this.shadowRoot).then(() => {
        this.shadowRoot.querySelectorAll(`[data-div]`).forEach((svg) => {
          svg.style.display = "none";
        });
        this.shadowRoot.querySelector(`[data-div="${newValue}"]`).style.display = "inline-block";
      });
    }
  }

  connectedCallback() {
    const hostContainer = document.querySelector(".container");
    const container = this.shadowRoot.querySelector("div");

    const opts = {};
    ["width", "height"].forEach((prop) => {
      const value = getComputedStyle(hostContainer)[prop];
      opts[prop] = Math.floor(Number(value.replace("px", "")));
    });

    const width = 1200;
    const height = Math.floor(width * (opts.height / opts.width));
    container.dataset.width = width;
    container.dataset.height = height;
  }
}

customElements.define("mlb-above500", MlbAbove500);
export { MlbAbove500 };
