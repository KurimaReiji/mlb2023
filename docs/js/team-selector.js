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
    return ["team"];
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
    .download {
      border: solid 1px var(--team-color);
      background: var(--team-color, black);
      color: var(--invert-team-color, white);
    }
    </style>
    <style>
    [data-team="Orioles"]{
      --team-color: var(--orioles-orange);
    }
    [data-team="Red Sox"]{
      --team-color: var(--redsox-red);
    }
    [data-team="Rays"]{
      --team-color: var(--rays-navy);
    }
    [data-team="Yankees"]{
      --team-color: var(--yankees-navy);
    }
    [data-team="Blue Jays"]{
      --team-color: var(--bluejays-blue);
    }

    [data-team="White Sox"]{
      --team-color: var(--whitesox-black);
    }
    [data-team="Guardians"]{
      --team-color: var(--guardians-red);
    }
    [data-team="Tigers"]{
      --team-color: var(--tigers-navy);
    }
    [data-team="Royals"]{
      --team-color: var(--royals-blue);
    }
    [data-team="Twins"]{
      --team-color: var(--twins-navy);
    }

    [data-team="Astros"]{
      --team-color: var(--astros-orange);
    }
    [data-team="Athletics"]{
      --team-color: var(--athletics-darkgreen);
    }
    [data-team="Angels"]{
      --team-color: var(--angels-maroon);
    }
    [data-team="Mariners"]{
      --team-color: var(--mariners-navy);
    }
    [data-team="Rangers"]{
      --team-color: var(--rangers-blue);
    }

    [data-team="Braves"]{
      --team-color: var(--braves-scarlet);
    }
    [data-team="Marlins"]{
      --team-color: var(--marlins-black);
    }
    [data-team="Mets"]{
      --team-color: var(--mets-orange);
    }
    [data-team="Phillies"]{
      --team-color: var(--phillies-red);
    }
    [data-team="Nationals"]{
      --team-color: var(--nationals-red);
    }

    [data-team="Cubs"]{
      --team-color: var(--cubs-blue);
    }
    [data-team="Reds"]{
      --team-color: var(--reds-red);
    }
    [data-team="Brewers"]{
      --team-color: var(--brewers-navy);
    }
    [data-team="Pirates"]{
      --team-color: var(--pirates-gold);
    }
    [data-team="Cardinals"]{
      --team-color: var(--cardinals-red);
    }

    [data-team="Diamondbacks"]{
      --team-color: var(--dbacks-red);
    }
    [data-team="Rockies"]{
      --team-color: var(--rockies-black);
    }
    [data-team="Dodgers"]{
      --team-color: var(--dodger-blue);
    }
    [data-team="Padres"]{
      --team-color: var(--padres-brown);
    }
    [data-team="Giants"]{
      --team-color: var(--giants-orange);
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

    [...root.querySelectorAll(`.selector [data-team]`)].forEach((div) => {
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

  attributeChangedCallback(name, oldValue, newValue) {
    const root = this.shadowRoot;
    if (name === "team") {
      root.querySelector(".download").dataset.team = newValue;
    }
  }
}

customElements.define("team-selector", TeamSelector);
export { TeamSelector };

