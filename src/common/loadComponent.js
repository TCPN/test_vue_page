export async function loadComponent(el, file) {
  const res = await fetch(file);
  const html = await res.text();
  if (typeof el === 'string') {
    el = document.querySelector(el);
  }
  if (!el) {
    throw new Error(`Cannot find the mount point ${el} for ${file}`);
  }
  el.outerHTML = html;
}
