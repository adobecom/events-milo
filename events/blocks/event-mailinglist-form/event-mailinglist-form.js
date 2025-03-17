function addClassesToElement(element, classes) {
  element.classList.add(classes);
}

function removeClassesFromElement(element, classes) {
  element.classList.remove(...classes);
}


function onProfile(bp, formData) {

}

function addForm(formDiv) {

  const form = document.createElement("form");
  formDiv.appendChild(form);
  form.setAttribute("id", "mailinglist-form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "https://www.example.com");
  form.setAttribute("target", "_blank");

  const label = document.createElement("label");
  form.appendChild(label);
  label.setAttribute("for", "email");
  label.textContent = "Email address";

  const input = document.createElement("input");
  form.appendChild(input);
  input.setAttribute("type", "email");
  input.setAttribute("name", "email");
  input.setAttribute("placeholder", "email@adobe.com");
  input.setAttribute("required", "true");

  const button = document.createElement("button");
  form.appendChild(button);
  button.setAttribute("type", "submit");
  button.textContent = "Submit";
}

export default async function decorate(block, formData = null) {
  console.log("decorate the event-mailinglist-form block");

  const bp = {
    block,
    formDiv : block.querySelector(':scope > div:nth-of-type(1) > div'),
    modalTitle: block.querySelector(':scope > div:nth-of-type(1) > div > h2'),
    modalDescription: block.querySelector(':scope > div:nth-of-type(1) > div > p'),
    
  };

  addClassesToElement(bp.modalTitle, "mailinglist-title");
  addClassesToElement(bp.modalDescription, "mailinglist-description");

  addForm(bp.formDiv);

  console.log("bp", bp);
  // await onProfile(bp, formData);
}
