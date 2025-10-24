export function formDeserialize(form, data) {
  if (typeof data === 'string' && data[0] === '{') {
    data = JSON.parse(data);
  } else if (data instanceof FormData || typeof data === 'string') {
    data = Object.fromEntries(data);
  }
  for (const [key, val] of Object.entries(data)) {
    const input = form.elements.namedItem(key);
    if (input.type === 'checkbox') {
      input.checked = !!val;
    } else {
      input.value = val;
    }
  }
}

/** @virtual */
export function autofill(form = 'form') {
  const formElement = typeof form === 'string' ? document.querySelector(form) : form;
  const randomChoice = (options) => options[Math.floor(Math.random() * options.length)];
  const inputs = Array.from(formElement.elements);
  const questions = inputs.reduce((res, el) => {
    if (!el.name) return res;
    (res[el.name] ??= []).push(el.value);
    return res;
  }, {});
  formDeserialize(formElement, Object.fromEntries(Object.entries(questions).map(([name, values]) => [name, randomChoice(values)])));
}
