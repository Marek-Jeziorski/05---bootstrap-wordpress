import "../styles/styles.scss";

// Import all of Bootstrap's JS
// import * as bootstrap from "bootstrap";

// import Alert from 'bootstrap/js/dist/alert'

// or, specify which plugins you need:

// Import only the Bootstrap components we need
import { Util, Dropdown, Offcanvas, Popover } from "bootstrap";

// import Popover from "bootstrap/js/dist/popover";

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popover) => {
  new Popover(popover);
});

let measure;

document.querySelector(".open-measure").addEventListener("click", (e) => {
  e.preventDefault();
  if (typeof measure == "undefined") {
    import("./Measure")
      .then((x) => {
        measure = new x.default();
        setTimeout(() => measure.openTheMeasure(), 20);
      })
      .catch(() => console.log("Jest jakiś problem"));
  } else {
    measure.openTheMeasure();
  }
});

if (module.hot) {
  module.hot.accept();
}
