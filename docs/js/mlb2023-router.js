const locationHandler = () => {
  const [_, site, app, ...opts] = location.pathname.split("/");
  let title;
  [...document.querySelectorAll(".container *")].forEach((app) => {
    //app.style.display = "none";
  });
  try {
    if (app === "above500") {
      const [ld, ...rest] = opts;
      const [league, division] = ld.replace(/([AN]L)/, "$1 ").split(" ");
      if (!["AL", "NL"].includes(league) || !["west", "central", "east"].includes(division)) {
        throw new Error("not found");
      }
      const div = `${league} ${division.charAt(0).toUpperCase()}${division.slice(1)}`;
      title = `Games above .500, ${div} 2023`;
      const above500 = document.querySelector("mlb-above500");
      above500.style.display = "block";
      above500.setAttribute("division", div);
    } else {
      throw new Error("not found");
    }
  } catch (error) {
    console.log(error);
    window.location.href = "/mlb2023/above500/ALwest";
  }

  document.querySelector("title").textContent = title;
}

const route = (e) => {
  e.preventDefault();
  if (e.target.href === window.location.href) return;
  window.history.pushState({}, null, e.target.href);
  locationHandler();
}

window.addEventListener("popstate", (_) => {
  locationHandler();
});

const css = `<style>
div {
  margin-block-end: .5em;
  font-family: 'Noto Sans', sans-serif;
  background: var(--mlb-blue);
  box-shadow: rgb(0 0 0) 1px 0px 5px;
  overflow-x: auto;
}
ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
li {
  white-space: nowrap;
}
div>ul {
  margin-block: 0;
  padding: 8px 0 8px .5em;
  width: 100%;
  color: white;
  height: 40px;
}
div>ul>li {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5em;
}
div>ul>li:nth-of-type(n+2) {
  border-left: 1px solid white;
}
li>ul {
  padding-inline-start: .5em;
}
li>ul>li {
  margin-right: .25em;
}
[data-division^="AL"] {
  --league-color: var(--al-red);
}
[data-division^="NL"] {
  --league-color: var(--nl-navy);
}
a {
  display: block;
  color: white;
  background: var(--league-color);
  text-decoration: none;
  padding: 0;
  width: 5.25em;
  text-align: center;
}
</style>`;

class MlbRouter extends HTMLElement {
  static get observedAttributes() {
    return ["league"];
  }

  constructor() {
    super();
  }

  render() {
    const html = `
<div>
<ul>
  <li><a href="https://github.com/KurimaReiji/mlb2023">MLB 2023</a></li>
  <li>Above .500
  <ul>
    <li><a href="/mlb2023/above500/ALwest" data-app="above500" data-division="AL West">AL West</a></li>
    <li><a href="/mlb2023/above500/ALcentral" data-app="above500" data-division="AL Central">AL Central</a></li>
    <li><a href="/mlb2023/above500/ALeast" data-app="above500" data-division="AL East">AL East</a></li>
    <li><a href="/mlb2023/above500/NLwest" data-app="above500" data-division="NL West">NL West</a></li>
    <li><a href="/mlb2023/above500/NLcentral" data-app="above500" data-division="NL Central">NL Central</a></li>
    <li><a href="/mlb2023/above500/NLeast" data-app="above500" data-division="NL East">NL East</a></li>
  </ul>
</li>
</ul>
</div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `${css}${html}`;

    [...this.shadowRoot.querySelectorAll(`a[data-app]`)].forEach((a) => {
      a.addEventListener("click", route)
    });
  }
  connectedCallback() {
    this.render();
  }
}

customElements.define("mlb-router", MlbRouter);
export { MlbRouter, route, locationHandler }
