export default async function init(el) {
  const rows = Array.from(el.children);
  const idName = `${rows[0].textContent.trim().toLowerCase()}`;

  el.innerHTML = '';
  el.setAttribute('id', idName);
}
