// Tip: Import the palettes object from palettes.json so that you can use them in `initPalettesIfEmpty`
import defaults from "./palettes.json";

const KEY = "palettes";

// We've given these to you for free! Use them in the helpers below
const setLocalStorageKey = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorageKey = (key) => {
  const storedValue = localStorage.getItem(key);
  try {
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (e) {
    console.error("Bad JSON in localStorage:", e);
    return null;
  }
};

// Replace whatever palettes are saved in `localStorage` with the provided object of `newPalettes`
const setPalettes = (newPalettes) => {
  setLocalStorageKey(KEY, newPalettes || {});
};

// Tip: Only export the functions below. They will form your "data layer API". Do not give the rest of your program access to the functions above, thus limiting the scope of how your application will interact with localStorage.

// Always return an object, either full of palettes or empty. If it always returns an object, it will make the code that uses this function simpler.
const getPalettes = () => {
  const obj = getLocalStorageKey(KEY);
  return obj && typeof obj === "object" ? obj : {};
};

// If you don't have any palettes on page load, then you should add the default palettes to localStorage.
// To be clear, that's on page load, not immediately following the event that they delete all of the palettes.
// So if the user deletes each palette, only if they refresh the page, the defaults will appear
const initPalettesIfEmpty = () => {
  const current = getPalettes();
  if (Object.keys(current).length === 0) {
    setPalettes(defaults);
  }
};

// Add the palette to your saved localStorage palettes. First retrieve the existing palettes,
// add the new palette to the object, and then set the palettes again.
const addPalette = (newPalette) => {
  if (!newPalette || !newPalette.uuid) return;
  const all = getPalettes();
  all[newPalette.uuid] = newPalette;
  setPalettes(all);
};

// Remove the palette from your saved localStorage palettes as found by the palette's `uuid`.
// First retrieve the existing palettes, find and remove the specified palette from the object,
// and then set the palettes again.
const removePaletteById = (uuid) => {
  if (!uuid) return;
  const all = getPalettes();
  if (uuid in all) {
    delete all[uuid];
    setPalettes(all);
  }
};

// Remember these functions are all only the data layer of our project. None of them should be touching the DOM.

export {
  setPalettes,
  getPalettes,
  initPalettesIfEmpty,
  addPalette,
  removePaletteById,
};
