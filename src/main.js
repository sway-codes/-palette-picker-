import "./styles.css";
import { v4 as generateUUID } from "uuid";
import {
  getPalettes,
  initPalettesIfEmpty,
  addPalette,
  removePaletteById,
} from "./local-storage.js";
import { el, clear, copyToClipboard } from "./dom-helpers.js";

/* refs */
const form = document.getElementById("palette-form");
const list = document.getElementById("palettes");

/* seed defaults on first load, then render */
initPalettesIfEmpty();
renderAll();

/* form submit */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = form.title.value.trim();
  if (!title) return;

  const colors = [form.c1.value, form.c2.value, form.c3.value];
  const temperature = form.temperature.value;
  const uuid = generateUUID();

  addPalette({ uuid, title, colors, temperature });

  renderAll();
  form.reset();
  form.c1.value = "#c92929";
  form.c2.value = "#2f5a8b";
  form.c3.value = "#327a5f";
  form.temperature.value = "neutral";
});

/* event delegation for copy and delete */
list.addEventListener("click", async (e) => {
  const t = e.target;

  if (t.matches(".copy-btn")) {
    const hex = t.dataset.hex;
    const original = t.textContent;
    const ok = await copyToClipboard(hex);
    t.textContent = ok ? "Copied hex!" : "Copy failed";
    t.disabled = true;
    setTimeout(() => {
      t.textContent = original;
      t.disabled = false;
    }, 1000);
    return;
  }

  if (t.matches(".p-delete")) {
    const id = t.dataset.uuid;
    removePaletteById(id);
    renderAll();
  }
});

/* render helpers */
function renderAll() {
  clear(list);
  const palettes = getPalettes();
  Object.values(palettes).forEach((p) => list.appendChild(renderItem(p)));
}

function renderItem(palette) {
  const { uuid, title, colors, temperature } = palette;

  const li = el("li", { className: "palette" });

  const head = el("div", { className: "p-head" });
  head.append(
    el("div", { className: "p-title", text: title }),
    el("button", {
      className: "p-delete",
      attrs: {
        type: "button",
        "data-uuid": uuid,
        "aria-label": `Delete ${title}`,
      },
      text: "Delete",
    })
  );

  const colorsWrap = el("div", { className: "p-colors" });
  colors.forEach((hex, i) => {
    const swatch = el("div", { className: "color-swatch" });
    swatch.style.background = hex;

    const content = el("div", { className: "color-content" });

    const textRow = el("div", { className: "color-text" });
    textRow.append(
      el("span", { className: "on-black", text: hex.toUpperCase() }),
      el("span", { className: "on-white", text: hex.toUpperCase() })
    );

    const copyRow = el("div", { className: "copy-row" });
    copyRow.append(
      el("button", {
        className: "copy-btn",
        attrs: {
          type: "button",
          "data-hex": hex,
          "aria-label": `Copy color ${i + 1}`,
        },
        text: `Copy ${hex.toUpperCase()}`,
      })
    );

    content.append(textRow, copyRow);
    swatch.append(content);
    colorsWrap.append(swatch);
  });

  const banner = el("div", {
    className: `p-banner ${temperature}`,
    text: temperature,
  });

  li.append(head, colorsWrap, banner);
  return li;
}

/* handy for console */
window.__palettes = { getPalettes };
