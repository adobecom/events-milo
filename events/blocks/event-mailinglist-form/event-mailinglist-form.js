import { createTag } from "../../scripts/utils.js";


function validateInput(input) {
  const email = input.value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function decorateError(error, inputElement) {
  inputElement.style.borderBottomColor = "red";
  const errorSpan = inputElement.nextSibling;
  errorSpan.style.display = "block";
  errorSpan.innerHTML = error;

}
function handleSubmit(event) {
  console.log("Email submitted");
  event.preventDefault();

  const inputElement = event.target.parentElement.parentElement.parentElement.querySelector(":scope > div:nth-of-type(2) > input");
  const email = inputElement.value;
  if(email.length === 0){
    console.log("Email is empty");
    decorateError("Required Field",inputElement);
    return;
  } else if(!validateInput(email)) {
    console.log("Email is invalid");
    decorateError("Must be a valid Email address",inputElement);
    return;
  }

  //hide form view
  const formView = event.target.parentElement.parentElement.parentElement.parentElement
  console.log("formView",formView);
  formView.classList.add("hide");

  //show thankyou view
  const thankyouView = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(":scope > div:nth-of-type(1)"); //TODO
  console.log("thankyouView",thankyouView);
  thankyouView.classList.remove("hide");
  decorateThankYouView(thankyouView);
  

  
  //TODO send email to backend
  //sendEmail();
}

function decorateButton(submitP) {
  const button = createTag("button", { class: "mailinglist-submit" });
  button.innerHTML = submitP.innerHTML;
  button.addEventListener("click", handleSubmit);
  const div = createTag("div", { class: "mailinglist-submit-container" });
  submitP.parentElement.appendChild(div);
  div.appendChild(button);
  submitP.remove();
}

function addElementtoForm(form, inputP, labelP) {

  const placeholder = inputP.innerHTML;
  const labelText = labelP.innerHTML;
  const labelAttr = {
    for: "email",
    textContent: labelText,
    class: "mailinglist-label",
  }

  const inputAttr = {
    type: "email",
    name: "email",
    placeholder: placeholder,
    required: "true",
    class: "mailinglist-input",
  }

  const label = createTag("label", labelAttr);
  label.innerHTML = labelText;
  form.appendChild(label);

  const input = createTag("input", inputAttr);
  form.appendChild(input);

  const errorSpan = createTag("span", { class: "error-message" });
  errorSpan.innerHTML = "Please enter a valid email address";
  form.appendChild(errorSpan);

  inputP.remove();
  labelP.remove();

}
function addForm(bp) {

  const formDiv = bp.formDiv;
  const parent = formDiv.parentElement;
  const formAttr = {
    id: "mailinglist-form"
  }
  const form = createTag("form", formAttr);
  form.appendChild(formDiv);
  parent.insertBefore(form,parent.firstChild);

  const main = form.querySelector("div:nth-of-type(2)");
  main.classList.add("mailinglist-textBox");
  addElementtoForm(main,bp.inputP,bp.labelP);
  decorateButton(bp.submitP);
}

function decorateFormView(block) {

  const bp = {
    block,
    formDiv : block.querySelector(':scope > div:nth-of-type(1)'),
    modalTitle: block.querySelector(':scope > div:nth-of-type(1) > div > h2'),
    modalDescription: block.querySelector(':scope > div:nth-of-type(1) > div > p'),
    labelP : block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(2) > p:nth-of-type(1)'),
    inputP : block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(2) > p:nth-of-type(2)'),
    consentNotice : block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(3) > p'),
    submitP : block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(3) > p:nth-of-type(2)'),
    thankyouView : block.querySelector(':scope > div:nth-of-type(2)')
    };
    
  bp.formDiv.classList.add("mailinglist-form");
  bp.modalTitle.classList.add("mailinglist-title");
  bp.modalDescription.classList.add("mailinglist-description");
  bp.consentNotice.classList.add("mailinglist-consent-notice");
  bp.thankyouView.classList.add("hide");

  addForm(bp);
}

function decorateThankYouView(thanksView) {

  const bp = {
    thanksView,
    thankyouTitle: thanksView.querySelector(':scope > div:nth-of-type(2) h2'),
    thankyouDescription: thanksView.querySelector(':scope > div:nth-of-type(2) > p'),
    };

    console.log("thankyouTitle",bp.thankyouTitle);
    console.log("thankyouDescription",bp.thankyouDescription);
    bp.thankyouTitle.classList.add("thankyou-title");
    bp.thankyouDescription.classList.add("thankyou-description");

}

function decorateFooter(footer) {
  footer.style.display = "flex";
}

//function init(block){
  export default function init(el) {
  //decide which view to load depending on the modal url
  const modalUrl = window.location.href.split("#")[1];
  console.log("link : ",window.location.href," modalUrl", modalUrl);


  decorateFooter(el.querySelector(":scope > div:nth-of-type(3) > div > picture"));
  if(modalUrl === "subscribe"){
   //call a function to init event mailing list form.
   decorateFormView(el);
  } else if(modalUrl === "thankyou"){
    //call a function to show thank you message. 
    decorateThankYouView(el);
  } else {
    console.error("Invalid modal url");
  }
}
