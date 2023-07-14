import { MlbTeams as Teams, toNicknames } from "./mlb2023-teams.js";
import { toGameResult } from "./GameResult.js";
import { createElement, winpct, teams_by_wpct, get_records } from "./mlb2023-utils.js";

const url = `../mlb2023-results.json`;
const inputs = await (await fetch(url, { cache: "no-cache" })).json();
const games = inputs.map(toNicknames).map(toGameResult);

const divisions = [
  "AL East",
  "AL Central",
  "AL West",
  "NL East",
  "NL Central",
  "NL West",
];

function to_div(team) {
  return `${Teams.league(team)} ${Teams.division(team)}`;
}

function get_group_win_loss(teams) {
  return teams.reduce((a, c) => {
    a.win += c.win;
    a.loss += c.loss;
    return a;
  }, { win: 0, loss: 0 });
}

function get_wpct_row(tr) {
  const tr2 = createElement("tr")({
    dataset: { row: "wpct" }
  });
  [...tr.querySelectorAll("th,td")].forEach((td0) => {
    let text = "";
    let above500 = "";
    if (td0.dataset.win) {
      const wpct = winpct(Number(td0.dataset.win), Number(td0.dataset.loss));
      above500 = wpct >= .5 ? "above" : "below";
      text = isNaN(wpct) ? "-" : wpct.toFixed(3).replace(/^0/, "");
    }
    const td = createElement("td")({
      text: text,
      dataset: Object.assign({
        above500,
      }, td0.dataset)
    });
    tr2.append(td);
  })
  return tr2;
}

const data = Teams.all()
  .map((team) => {
    const myGames = games.filter((o) => o.isGameOf(team));
    const records = get_records(team)(myGames);
    return Object.assign({ team }, records);
  })
  .map(({ team, win, loss, headToHead }) => {
    const league = Teams.league(team);
    const al = { opponent: "AL" };
    const nl = { opponent: "NL" };
    if (league === "AL") {
      headToHead.push(Object.assign({ ...headToHead.find(o => o.opponent === "Intra") }, al));
      headToHead.push(Object.assign({ ...headToHead.find(o => o.opponent === "Inter") }, nl));
    } else if (league === "NL") {
      headToHead.push(Object.assign({ ...headToHead.find(o => o.opponent === "Inter") }, al));
      headToHead.push(Object.assign({ ...headToHead.find(o => o.opponent === "Intra") }, nl));
    }

    return {
      team,
      Total: {
        win: win,
        loss: loss,
      },
      headToHead
    }
  })
  .map((obj) => {
    const divs = divisions
      .map((div) => {
        const record = get_group_win_loss(obj.headToHead.filter((o) => `${to_div(o.opponent)}` === div));
        return {
          division: div, ...record
        }
      })
      .reduce((a, c) => {
        a[c.division] = { win: c.win, loss: c.loss };
        return a;
      }, {});

    const others = get_group_win_loss(obj.headToHead.filter((o) => to_div(o.opponent) !== to_div(obj.team) && !["AL", "NL", "Inter", "Intra"].includes(o.opponent)));

    return Object.assign(obj, { Others: others }, divs);
  })
  .map((obj) => {
    const h2h = obj.headToHead.reduce((a, c) => {
      a[c.opponent] = { win: c.win, loss: c.loss };
      return a;
    }, {});
    delete obj.headToHead;
    return Object.assign(obj, { ...h2h });
  })
  ;

divisions.forEach((myDiv) => {
  const myTeams = data.filter((o) => to_div(o.team) === myDiv);
  const grouped = myTeams.reduce((a, c) => {
    Object.keys(c).filter(k => ["Total", "Others", "AL", "NL", ...divisions].includes(k))
      .forEach((k) => {
        a[k] = a[k] || { win: 0, loss: 0 };
        a[k].win += c[k].win;
        a[k].loss += c[k].loss;
      });
    return a;
  }, {});
  data.push({ division: myDiv, ...grouped });
});
console.log(data);

const table = createElement("table")({});
const thead = createElement("thead")({});
const tbody = createElement("tbody")({});

const htr = createElement("tr")({});
const ths = divisions.map((d) => createElement("th")({ text: d, dataset: { item: d } }));
htr.append(
  createElement("th")({ text: "Division", dataset: { item: "Division" } }),
  createElement("th")({ text: "Total", dataset: { item: "Total" } }),
  createElement("th")({ text: "Others", dataset: { item: "Others" } }),
  ...ths.slice(0, 3),
  createElement("th")({ text: "AL", dataset: { item: "AL" } }),
  createElement("th")({ text: "NL", dataset: { item: "NL" } }),
  ...ths.slice(3)
);
thead.append(htr);

const divRows = divisions
  .map((d) => {
    const obj = data.find(o => o.division === d);
    const tr = createElement("tr")({
      dataset: { division: d }
    });
    const name = createElement("th")({
      text: d,
    });
    tr.append(name);
    [...htr.querySelectorAll(`th:nth-of-type(n+2)`)]
      .map((th) => th.dataset.item)
      .forEach((item) => {
        const rec = obj[item];
        const td = createElement("td")({
          text: `${rec.win}-${rec.loss}`,
          dataset: { item, win: rec.win, loss: rec.loss }
        })
        tr.append(td);
      });

    const wpct_row = get_wpct_row(tr);

    const teams = Teams.all()
      .filter((t) => to_div(t) === d)
      .map((team) => data.find(o => o.team === team))
      .map((obj) => {
        obj.win = obj.Total.win;
        obj.loss = obj.Total.loss;
        return obj;
      })
      .sort(teams_by_wpct)
      .map((obj) => {
        const team = obj.team;
        const tr = createElement("tr")({
          dataset: { team }
        });
        const name = createElement("th")({
          text: team,
          dataset: { item: "team" }
        });
        tr.append(name);

        [...htr.querySelectorAll(`th:nth-of-type(n+2)`)]
          .map((th) => th.dataset.item)
          .forEach((item) => {
            const rec = obj[item];
            const td = createElement("td")({
              text: `${rec.win}-${rec.loss}`,
              dataset: { item, win: rec.win, loss: rec.loss }
            })
            tr.append(td);
          });

        const wpct_row = get_wpct_row(tr);
        return [tr, wpct_row];
      })
      .flat();
    return [tr, wpct_row, ...teams];
  })
  .flat();

tbody.append(...divRows);
table.append(thead, tbody);

document.querySelector(".container").append(table);

const inter = ["AL", "NL"].map((league) => {
  const record = Teams.all()
    .filter((t) => Teams.league(t) === league)
    .map((team) => data.find(o => o.team === team))
    .reduce((a, c) => {
      a.win += c["Inter"].win;
      a.loss += c["Inter"].loss;
      return a;
    }, { win: 0, loss: 0 });
  return { league, ...record };
}).reduce((a, c) => {
  a[c.league] = c.win;
  return a;
}, { AL: 0, NL: 0 });
console.log(inter);
