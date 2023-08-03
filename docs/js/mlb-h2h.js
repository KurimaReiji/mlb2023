import { MlbTeams as Teams } from "teams";
import { to_uniq, load_css_rules, load_font, svgdownload, fetchJson } from "utils";
import { get_logos } from "logos";
import { scheduledGames } from "./mlb2023-schedule.js";
import { GameResult } from "GameResult";
import { TeamSelector } from "./team-selector.js?v=0803";

const svgTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="-1200 -1200 2400 2400">
  <style data-css="external"></style>
  <style data-css="fonts"></style>
  <style>
    #bgRect {
      fill: var(--bgcolor, cornsilk);
    }
    circle {
      fill: var(--team-color, none);
      r: 30px;
      stroke-width: 4px;
      stroke: var(--team-shadow-color, black);
    }
    circle.lost {
      r: 24px;
    }
    text {
      font-family: 'Noto Sans', Arial, sans-serif;
    }
    .arc {
      fill: none;
      stroke-width: 20px;
      stroke: var(--team-color, black);
      stroke-linecap: round;
    }
    .arc[data-fill="AL"],
    .arc[data-fill="NL"]{
      stroke-width: 10px;
    }
    .record {
      font-size: 50px;
      text-anchor: middle;
    }
    #Record text {
      text-anchor: middle;
      alignment-baseline: middle;
      font-size: 120px;
    }
    #season text {
      text-anchor: middle;
      alignment-baseline: middle;
      font-size: 120px; 
    }
    #elements {
      display: none;
    }
  </style>
  <style>
    [data-fill="Orioles"],
    [data-winner="Orioles"],
    .BAL {
      --team-color: var(--orioles-orange);
      --team-shadow-color: var(--orioles-black);
    }
    [data-fill="Red Sox"],
    [data-winner="Red Sox"],
    .BOS {
      --team-color: var(--redsox-red);
      --team-shadow-color: var(--redsox-blue);
    }
    [data-fill="Yankees"],
    [data-winner="Yankees"],
    .NYY {
      --team-color: var(--yankees-navy);
      --team-shadow-color: var(--yankees-blue);
      --team-text-color: var(--yankees-navy);
    }
    [data-fill="Rays"],
    [data-winner="Rays"],
    .TB,
    .TBR {
      --team-color: var(--rays-navy);
      --team-shadow-color: var(--rays-columbia-blue);
    }
    [data-fill="Blue Jays"],
    [data-winner="Blue Jays"],
    .TOR {
      --team-color: var(--bluejays-powderblue);
      --team-shadow-color: var(--bluejays-blue);
      --team-text-color: var(--bluejays-blue);
    }

    [data-fill="White Sox"],
    [data-winner="White Sox"],
    .CWS,
    .CHW {
      --team-color: var(--whitesox-silver);
      --team-shadow-color: var(--whitesox-black);
      --team-text-color: var(--whitesox-black);
    }
    [data-fill="Guardians"],
    [data-winner="Guardians"],
    .CLE {
      --team-color: var(--guardians-red);
      --team-shadow-color: var(--guardians-navy);
    }
    [data-fill="Tigers"],
    [data-winner="Tigers"],
    .DET {
      --team-color: var(--tigers-navy);
      --team-shadow-color: var(--tigers-navy);
    }
    [data-fill="Royals"],
    [data-winner="Royals"],
    .KC,
    .KCR {
      --team-color: var(--royals-blue);
      --team-shadow-color: var(--royals-gold);
    }
    [data-fill="Twins"],
    [data-winner="Twins"],
    .MIN {
      --team-color: var(--twins-navy);
      --team-shadow-color: var(--twins-scarlet-red);
    }

    [data-fill="Astros"],
    [data-winner="Astros"],
    .HOU {
      --team-color: var(--astros-orange);
      --team-shadow-color: var(--astros-darkblue);
    }
    [data-fill="Angels"],
    [data-winner="Angels"],
    .LAA {
      --team-color: var(--angels-maroon);
      --team-shadow-color: var(--angels-blue);
    }
    [data-fill="Athletics"],
    [data-winner="Athletics"],
    .OAK {
      --team-color: var(--athletics-green);
      --team-shadow-color: var(--athletics-gold);
    }
    [data-fill="Mariners"],
    [data-winner="Mariners"],
    .SEA {
      --team-color: var(--mariners-aqua);
      --team-shadow-color: var(--mariners-navy);
      --team-text-color: var(--mariners-navy);
    }
    [data-fill="Rangers"],
    [data-winner="Rangers"],
    .TEX {
      --team-color: var(--rangers-blue);
      --team-shadow-color: var(--rangers-red);
      --team-text-color: var(--rangers-red);
    }

    [data-fill="Braves"],
    [data-winner="Braves"],
    .ATL {
      --team-color: var(--braves-scarlet);
      --team-shadow-color: var(--braves-navy);
    }
    [data-fill="Marlins"],
    [data-winner="Marlins"],
    .MIA {
      --team-color: var(--marlins-black);
      --team-shadow-color: var(--marlins-miamiblue);
    }
    [data-fill="Mets"],
    [data-winner="Mets"],
    .NYM {
      --team-color: var(--mets-orange);
      --team-shadow-color: var(--mets-blue);
    }
    [data-fill="Phillies"],
    [data-winner="Phillies"],
    .PHI {
      --team-color: var(--phillies-red);
      --team-shadow-color: var(--phillies-blue);
    }
    [data-fill="Nationals"],
    [data-winner="Nationals"],
    .WSH {
      --team-color: var(--nationals-red);
      --team-shadow-color: var(--nationals-blue);
    }

    [data-fill="Cubs"],
    [data-winner="Cubs"],
    .CHC {
      --team-color: var(--cubs-blue);
      --team-shadow-color: var(--cubs-red);
    }
    [data-fill="Reds"],
    [data-winner="Reds"],
    .CIN {
      --team-color: var(--reds-red);
      --team-shadow-color: var(--reds-black);
    }
    [data-fill="Brewers"],
    [data-winner="Brewers"],
    .MIL {
      --team-color: var(--brewers-navy);
      --team-shadow-color: var(--brewers-yellow);
    }
    [data-fill="Pirates"],
    [data-winner="Pirates"],
    .PIT {
      --team-color: var(--pirates-gold);
      --team-shadow-color: var(--pirates-black);
      --team-text-color: var(--pirates-black);
    }
    [data-fill="Cardinals"],
    [data-winner="Cardinals"],
    .STL {
      --team-color: var(--cardinals-red);
      --team-shadow-color: var(--cardinals-navy);
    }

    [data-fill="Diamondbacks"],
    [data-winner="Diamondbacks"],
    .AZ,
    .ARI {
      --team-color: var(--dbacks-red);
      --team-shadow-color: var(--dbacks-black);
    }
    [data-fill="Rockies"],
    [data-winner="Rockies"],
    .COL {
      --team-color: var(--rockies-silver);
      --team-shadow-color: var(--rockies-purple);
      --team-text-color: var(--rockies-purple);
    }
    [data-fill="Dodgers"],
    [data-winner="Dodgers"],
    .LAD {
      --team-color: var(--dodger-blue);
      --team-shadow-color: var(--dodger-blue);
    }
    [data-fill="Padres"],
    [data-winner="Padres"],
    .SD,
    .SDP {
      --team-shadow-color: var(--padres-brown);
      --team-color: var(--padres-brown);
      --team-text-color: var(--padres-brown);
    }
    [data-fill="Giants"],
    [data-winner="Giants"],
    .SF,
    .SFG {
      --team-color: var(--giants-orange);
      --team-shadow-color: var(--giants-black);
    }

    [data-fill="AL"]{
      --team-color: var(--al-red);
    }
    [data-fill="NL"]{
      --team-color: var(--nl-navy);
    }

    [data-opponent="Yankees"][data-loser="Rays"] {
      --team-color: var(--yankees-gray);
      --team-shadow-color: var(--yankees-blue);
    }
    [data-opponent="Rays"][data-loser="Yankees"] {
      --team-color: var(--rays-columbia-blue);
      --team-shadow-color: var(--rays-navy);
    }
    [data-opponent="Yankees"][data-loser="Padres"] {
      --team-color: var(--yankees-gray);
      --team-shadow-color: var(--yankees-blue);
    }
    [data-opponent="Yankees"][data-loser="Rangers"] {
      --team-color: var(--yankees-gray);
      --team-shadow-color: var(--yankees-blue);
    }
    [data-opponent="Rays"][data-loser="Rangers"] {
      --team-color: var(--rays-columbia-blue);
      --team-shadow-color: var(--rays-navy);
    }
    [data-opponent="Tigers"][data-loser="Rangers"] {
      --team-color: var(--tigers-orange);
    }
    [data-opponent="Padres"][data-loser="Yankees"] {
      --team-color: var(--padres-gold);
    }
  </style>
  <g id="elements">
    <path />
    <text class="record" dy="-30">
      <textPath startOffset="50%">0-0</textPath>
    </text>
    <circle cx="0" cy="0" />
    <g></g>
  </g>
  <rect x="-1200" y="-1200" width="2400" height="2400" stroke="none" id="bgRect"/>
  <g id="gArcs"></g>
  <g id="gDivRecords"></g>
  <g id="gGames"></g>
  <g id="teamLogo"></g>
  <g id="Record">
    <text x="0" y="360">0-0</text>
  </g>
  <g id="season">
    <text x="0" y="-360">2023</text>
  </g>
  <g id="opLogo"><g></g></g>
</svg>
`;

const trunc = (n) => Number(n.toFixed(2));

const rad2deg = rad => (rad * 180.0) / Math.PI;

const byDivision = (team) => (a, b) => {
  const divs = ["East", "Central", "West"];
  const league = Teams.league(team);
  const [aa, bb] = [a, b].map((ab) => {
    if (Teams.league(ab) === league) {
      return divs.indexOf(Teams.division(ab));
    } else {
      return 5 + [...divs].reverse().indexOf(Teams.division(ab));
    }
  })
  if (aa < bb) return -1;
  if (aa > bb) return 1;
  return 0;
}

const isGameOf = (team) => (game) => {
  return [game.road, game.home].some(t => t === team);
}

const getOpponentOf = (team) => (game) => {
  return [game.road, game.home].find(t => t !== team);
}

const to_series = (a, c) => {
  const curSeries = a.at(-1);
  const prevGame = curSeries.at(-1);
  if (curSeries.length === 0 || (prevGame.home === c.home && prevGame.road === c.road)) {
    curSeries.push(c);
  } else {
    a.push([c]);
  }
  return a;
}

const create_arc = (path, start, end, distance, clockwise = 0, largeArcFlag = 0, sweepFlag = 1) => {
  const angles = [start, end].map(pos => 2 * (pos / 52) * Math.PI + (15 / 52) * Math.PI);
  const x = angles.map((r) => distance * Math.sin(r));
  const y = angles.map((r) => distance * Math.cos(r));
  const d = `M ${x[0]} ${y[0]} A ${distance} ${distance} ${clockwise} ${largeArcFlag} ${sweepFlag} ${x[1]} ${y[1]}`;
  path.setAttribute("d", d);
  return path;
}

const add_win_loss_to_arc = ({ svg, arc }) => {
  const text = ["win", "loss"].map((item) => Number(arc.dataset[item])).join("-");
  const textNode = svg.querySelector("#elements .record").cloneNode(true);
  const textPath = textNode.querySelector("textPath");
  textPath.setAttribute("href", `#${arc.id}`);
  textPath.textContent = text;
  return textNode;
}

const update_record = ({ team, myGames, target }) => {
  const win = myGames.filter((g) => g.winner === team).length;
  const loss = myGames.filter((g) => g.loser === team).length;
  target.textContent = `${win}-${loss}`;
}

const update_teamLogo = ({ logo, grp, size = 500 }) => {
  logo.setAttribute("width", size);
  logo.setAttribute("height", size);

  grp.append(logo);
  grp.setAttribute("transform", `translate(-${0.5 * size},-${0.5 * size})`);
}

const update_games = ({ svg, myGames, team, rOffset, z, numSeries }) => {
  const circles = Teams.all()
    .map((op) => {
      const targets = myGames
        .filter((g) => g.opponent === op)
        .map((g) => {
          const angle = 2 * (g.pos / numSeries) * Math.PI + (15 / numSeries) * Math.PI;
          const x = z * (rOffset + g.seriesGameNumber) * Math.sin(angle);
          const y = z * (rOffset + g.seriesGameNumber) * Math.cos(angle);
          const c = svg.querySelector("#elements circle").cloneNode(true);
          ["date", "opponent", "seriesGameNumber", "seriesNumber", "winner", "loser", "score", "pos"].forEach((item) => {
            if (g[item]) c.dataset[item] = g[item];
          });
          c.setAttribute("transform", `translate(${trunc(x)},${trunc(y)})`);
          if (g.loser === team) {
            c.classList.add("lost");
          }
          return c;
        });
      return targets;
    }).flat();
  svg.querySelector("#gGames").replaceChildren(...circles);
}

const update_arcs = ({ svg, team, opponents, rOffset, z }) => {
  const path = svg.querySelector("#elements path");

  const arcs = opponents
    .map((opponent) => {
      const dots = [...svg.querySelectorAll(`[data-opponent="${opponent}"]`)];
      const obj = {
        id: `arc${opponent.replace(/ /g, "")}`,
        dots, opponent,
        fill: opponent,
        distance: rOffset + 4.85
      };
      return [obj, Object.assign({}, obj, { id: `inner${obj.id}`, distance: rOffset + 0.15 })];
    })
    .flat()
    .concat(
      [
        { league: "AL", division: "West" },
        { league: "AL", division: "Central" },
        { league: "AL", division: "East" },
        { league: "NL", division: "West" },
        { league: "NL", division: "Central" },
        { league: "NL", division: "East" },
      ].map(({ league, division }) => {
        const dots = [...svg.querySelectorAll(`[data-opponent]`)]
          .filter((dot) => Teams.league(dot.dataset.opponent) === league)
          .filter((dot) => Teams.division(dot.dataset.opponent) === division)
          ;
        return {
          id: `${league}${division}`,
          dots,
          league,
          division,
          fill: league,
          distance: rOffset + 6.2
        }
      })
    )
    .flat()
    .map(({ id, dots, distance, fill }) => {
      const win = dots.filter((dot) => dot.dataset.winner === team).length;
      const loss = dots.filter((dot) => dot.dataset.loser === team).length;
      const positions = dots.map((dot) => Number(dot.dataset.pos));
      const [start, end] = [Math.max(...positions), Math.min(...positions)];
      const ext = 0.25 + (distance / (rOffset + 100));
      const arc = create_arc(path.cloneNode(), start + ext, end - ext, z * distance);
      arc.classList.add("arc");
      arc.dataset.win = win;
      arc.dataset.loss = loss;
      arc.dataset.fill = fill;
      arc.id = id;
      return arc;
    });
  svg.querySelector("#gArcs").replaceChildren(...arcs);
}

const update_divRecords = ({ svg }) => {
  const divRecords = [...svg.querySelectorAll("#gArcs path")]
    .filter((arc) => !arc.id.includes("inner"))
    .map((arc) => ({ arc, svg }))
    .map(add_win_loss_to_arc);
  svg.getElementById("gDivRecords").replaceChildren(...divRecords);
}

const update_opLogos = ({ team, svg, opponents, rOffset, z, logos }) => {
  const opLogos = opponents
    .map((opTeam) => {
      const len = z * (rOffset - .75);
      const isSameLeague = Teams.league(team) === Teams.league(opTeam);
      const size = isSameLeague ? 80 : 65;
      const opLogo = logos[opTeam];
      opLogo.setAttribute("width", size);
      opLogo.setAttribute("height", size);
      const grp = svg.querySelector("#opLogo g").cloneNode(true);
      grp.append(opLogo);
      const pos = [...svg.querySelectorAll(`[data-opponent="${opTeam}"]`)]
        .map((c) => Number(c.dataset.pos))
        .reduce((a, c, i, ary) => {
          a += c;
          if (i === ary.length - 1) return (a / ary.length);
          return a;
        }, 0);
      const angle = 2 * (pos / 52) * Math.PI + (15 / 52) * Math.PI;
      const flip = isSameLeague ? Math.PI : Math.PI;
      grp.setAttribute("transform", `translate(${len * Math.sin(angle)},${len * Math.cos(angle)}) rotate(${-rad2deg(angle + flip)}) translate(${-0.5 * size},${-0.5 * size})`);
      return grp;
    });
  svg.querySelector("#opLogo").replaceChildren(...opLogos);
}

const setup = (games, team) => {
  const opponents = Teams.all()
    .filter((t) => t !== team)
    .sort(byDivision(team));

  const myGames = games
    .filter(isGameOf(team))
    .map((g) => Object.assign(g, { opponent: getOpponentOf(team)(g) }))
    .map((g) => {
      const opIndex = opponents.findIndex((t) => t === g.opponent);
      return Object.assign(g, { opIndex })
    })
    .reduce(to_series, [[]])
    .map((series, i) => {
      series.forEach((g, j) => {
        g.seriesNumber = i + 1;
        g.seriesGameNumber = j + 1;
      });
      return series;
    })
    .flat()
    .sort((a, b) => a.opIndex - b.opIndex)
    ;

  const seriesNumbers = myGames.map((g) => g.seriesNumber).reduce(to_uniq);
  const numSeries = seriesNumbers.length; // 52=4*4+2*10+2*1+14*1

  myGames.forEach((g) => {
    g.pos = 1 + seriesNumbers.findIndex((n) => n === g.seriesNumber);
  });

  return { myGames, opponents, numSeries };
}

const create_chart = (games, team, self) => {
  const logos = get_logos(2023);

  const { myGames, opponents, numSeries } = setup(games, team);
  const svg = document.querySelector("mlb-h2h").shadowRoot.querySelector("template").content.cloneNode(true).querySelector("svg");

  update_record({ team, myGames, target: svg.querySelector("#Record text") });
  update_teamLogo({ team, logo: logos[team], grp: svg.getElementById("teamLogo") });

  const rOffset = 8;
  const z = 78;
  update_games({ svg, myGames, team, rOffset, z, numSeries });
  update_arcs({ svg, team, opponents, rOffset, z });
  update_divRecords({ svg })
  update_opLogos({ team, svg, opponents, rOffset, z, logos });

  return svg;
}

const tweet = ({ team, record, svg }) => {
  const wins = [...svg.querySelectorAll(`[data-winner="${team}"]`)];
  const losses = [...svg.querySelectorAll(`[data-loser="${team}"]`)];
  const vsLeague = ["AL", "NL"]
    .sort((a, b) => a === Teams.league(team) ? -1 : 1)
    .map((league) => {
      const win = wins.filter((c) => Teams.league(c.dataset.opponent) === league).length;
      const loss = losses.filter((c) => Teams.league(c.dataset.opponent) === league).length;
      return { win, loss, league, division: "" };
    })
    ;

  const vsDivision = ["AL", "NL"]
    .sort((a, b) => a === Teams.league(team) ? -1 : 1)
    .map((league) => {
      return ["East", "Central", "West"].map((division) => ({ league, division }));
    })
    .flat()
    .map(({ league, division }) => {
      const arc = svg.getElementById(`${league}${division}`);
      const win = arc.dataset.win;
      const loss = arc.dataset.loss;
      return { win, loss, league, division };
    })
    ;

  const ja = team === "Angels" ? "#エンゼルス" : "";
  return [
    `2023 ${team} are ${record}. ${Teams.hashtag(team)} ${ja}`,
    `#HeadToHead `,
    [...vsLeague, ...vsDivision].map(({ win, loss, league, division }) => `${win}-${loss} vs ${[league, division].join(" ")}`),
  ]
    .flat()
    .join("\n");
}

async function downloadHandler(detail) {
  const opts = Object.assign({
    width: 1600,
    height: 1600,
  }, detail);

  const { team, width, height, self } = opts;

  const svg = opts.svg.cloneNode(true);
  svg.setAttributeNS(null, "width", width);
  svg.setAttributeNS(null, "height", height);

  const record = svg.querySelector("#Record text").textContent;
  const filename = `${team}-${record}.png`;

  const waitForCss = [...self.shadowRoot.querySelectorAll(`link[rel="stylesheet"]`)]
    .map((link) => {
      return load_css_rules(link, svg);
    });
  const rules = await Promise.all(waitForCss)
    .then(css => css.join("\n"));
  svg.querySelector(`style[data-css="external"]`).textContent = rules;

  const waitForFonts = [
    { name: "Noto Sans", url: "/mlb2023/fonts/NotoSans-Regular.ttf" },
  ].map(load_font);
  const fonts = await Promise.all(waitForFonts)
    .then(css => css.join("\n"));
  svg.querySelector(`style[data-css="fonts"]`).textContent = fonts;

  svg.dataset.download = filename;
  document.body.append(svg);
  await svgdownload(filename, document.querySelector(`[data-download]`));
  svg.remove();
  console.log(tweet({ team, record, svg }));
}

const gamesToday = () => {
  return fetchJson("https://statsapi.mlb.com/api/v1/schedule?sportId=1")
    .then((input) => {
      const data = input.dates[0].games
        .filter((g) => !g.resumeGameDate)
        .map((g) => ({
          gamePk: g.gamePk,
          date: g.officialDate,
          road: Teams.nickname(g.teams.away.team.name),
          home: Teams.nickname(g.teams.home.team.name),
          score: [g.teams.away.score, g.teams.home.score].join(" - "),
          status: g.status.detailedState,
        }))
        .filter(({ status }) => ["Final", "Game Over", "Completed Early"].includes(status))
        ;
      return data;
    });
}

const merge = (scheduled, results) => {
  return scheduled
    .map((g) => {
      const obj = results.find((o) => o.gamePk === g.gamePk);
      if (!obj) return g;
      const r = new GameResult(obj);
      const [date, winner, loser, score] = [r.date, r.winner, r.loser, obj.score];
      return Object.assign(g, { date, winner, loser, score });
    });
}

class MlbH2h extends HTMLElement {
  static get observedAttributes() {
    return ["team"];
  }

  constructor() {
    super();
    const self = this;
    this.render();
    this.container = self.shadowRoot.querySelector(".canvas");

    document.addEventListener("ResultsLoaded", async ({ detail }) => {
      const today = await gamesToday();
      self.data = merge(scheduledGames, detail.concat(today));
      const team = self.getAttribute("team") || "Angels";
      const svg = create_chart(self.data, team, self);
      self.container.replaceChildren(svg);
    });
  }

  render() {
    const css = [
      `<link rel="stylesheet" href="/mlb2023/css/mlb2023-colors.css">`,
      `<style>
      :host {
        --direction: column;
        height: 100%;
      }
      @media (orientation: landscape) {
        :host {
          --direction: row;
        }
        .container {
          height: 100%;
        }
        .canvas {
          height: 100%;
        }
      }
      @media (orientation: portrait){
        .canvas {
          width: 100%;
        }
      }
      .container {
        display: flex;
        flex-direction: var(--direction);
        align-items: center;
      }
      .canvas {
        aspect-ratio: 1 / 1;
        padding: .25em;
        background: var(--bg-color, cornsilk);
      }
      </style>`
    ].join("\n");
    const html = `<div class="container">
      <div class="canvas"></div>
        <team-selector></team-selector>
      </div>
    <template>${svgTemplate}</template>`;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `${css}${html}`;
  }

  connectedCallback() {
    const self = this;

    document.addEventListener("DownloadSVG", ({ detail }) => {
      const team = self.getAttribute("team") || "Angels";
      const opts = Object.assign({
        self,
        svg: self.shadowRoot.querySelector("svg"),
        team
      }, detail);
      downloadHandler(opts);
    });

    document.addEventListener("UpdateResults", async ({ detail }) => {
      const today = await gamesToday();
      document.dispatchEvent(new CustomEvent("ResultsLoaded", { detail: today }));
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const self = this;
    const root = this.shadowRoot;
    const container = root.querySelector(".canvas");

    root.querySelector("team-selector").setAttribute("team", this.getAttribute("team"));

    if (!this.data) return;
    if (name === "team") {
      const team = newValue;
      const svg = create_chart(self.data, team);
      container.replaceChildren(svg);

      root.querySelector("team-selector").setAttribute("team", team);
    }
  }
}

customElements.define("mlb-h2h", MlbH2h);
export { MlbH2h }
