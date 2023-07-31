import { MlbTeams as Teams } from "teams";
import { get_logos } from "logos";

const logos = get_logos(2023);

const teams = Teams.all()
  .map((team) => {
    return {
      team,
      logo: logos[team]
    }
  })
  .map(({ team, logo }) => {
    const div = document.createElement("div");
    div.dataset.team = team;
    div.dataset.league = Teams.league(team);
    div.dataset.division = Teams.division(team);
    div.classList.add("clickable");
    div.append(logo);
    return div;
  });

class TeamSelector extends HTMLElement {
  static get observedAttributes() {
    return [""];
  }

  constructor() {
    super();
  }

  render() {
    const css = `<style>
    :host {
      font-family: 'Noto Sans', Arial, sans-serif;
      min-width: 200px;
      display: block;
    }
    .selector svg {
      width: min(40px, 75%);
      aspect-ratio: 1 / 1;
      display: block;
      margin-inline: auto;
    }
    .selector {
      padding-block: 1em .5em;
      padding-inline: 2em;
      margin-inline: auto;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
    }
    .selector .clickable {
      aspect-ratio: 1 / 1;
      display: grid;
      place-content: center center;
      height: min(12vh, 60px);
    }
    [data-team]:nth-of-type(n+16):nth-of-type(-n+20){
      margin-top: 1em;
    }
    .download {
      text-align: center;
      line-height: 1;
      padding-block: .25em;
      border: solid 1px gray;
      margin-inline: auto;
      margin-block: 1em;
      max-width: 12em;
      border-radius: 1.5em;
      background: var(--team-color, none);
      cursor: pointer;
      transition: padding-inline .6s;
    }
    .download:hover {
      padding-inline: 1em;
    }
    .clickable {
      cursor: pointer;
    }
    </style>`;
    const html = `
    <div class="selector">
      <div data-grid="AL"></div>
      <div data-grid="NL"></div>
    </div>
    <div class="download">Save as PNG</div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `${css}${html}`;
  }

  connectedCallback() {
    this.render();
    const root = this.shadowRoot;

    root.querySelector(".selector").replaceChildren(...teams);

    [...root.querySelectorAll(`[data-team]`)].forEach((div) => {
      div.addEventListener("click", ({ currentTarget }) => {
        const team = currentTarget.dataset.team;
        document.dispatchEvent(new CustomEvent("TeamSelected", {
          detail: {
            href: `/mlb2023/h2h.html?team=${team}`
          }
        }))
      });
    });

    root.querySelector(".download").addEventListener("click", (_) => {
      document.dispatchEvent(new CustomEvent("DownloadSVG", { detail: {} }))
    });
  }
}

customElements.define("team-selector", TeamSelector);
export { TeamSelector };

