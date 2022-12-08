import debounce from "lodash/debounce";

class Measure {
  constructor() {
    this.injectHtml();

    // TODO: id = "measureMe" to any element in index.html
    this.element = document.getElementById("measureME");

    this.measure = document.querySelector(".measure");
    this.closeIcon = document.querySelector(".measure__close");
    this.browserWidthOuter = window.outerWidth;
    this.browserWidth = window.innerWidth;
    this.browserHeightOuter = window.outerHeight;
    this.browserHeight = window.innerHeight;

    document.getElementById("outerWidth").innerHTML = this.browserWidthOuter;
    document.getElementById("innerWidth").innerHTML = this.browserWidth;
    document.getElementById("outerHeight").innerHTML = this.browserHeightOuter;
    document.getElementById("innerHeight").innerHTML = this.browserHeight;
    document.getElementById("documentHeight").innerHTML =
      this.getHeight().toFixed();
    document.getElementById("el-offsetTop").innerHTML = this.element.offsetTop;
    document.getElementById("el-offsetHeight").innerHTML =
      this.element.offsetHeight;

    document.getElementById("scrollY").innerHTML = 0;

    this.events();
  }

  events() {
    this.closeIcon.addEventListener("click", () => this.closeTheMeasure());
    document.addEventListener("keyup", (e) => this.keyPressHandler(e));

    window.addEventListener("scroll", () => {
      let rect = this.element.getBoundingClientRect();
      let scrollPercent = (rect.y / this.browserHeight) * 100;
      document.getElementById("scrollPercent").innerHTML =
        scrollPercent.toFixed();
      document.getElementById("scrollY").innerHTML = scrollY.toFixed();
      document.getElementById("sh").innerHTML = (
        scrollY + this.browserHeight
      ).toFixed();
      // TODO: change it to literal template
      document.getElementById("demo").innerHTML =
        "Left: " +
        rect.left.toFixed() +
        "<br>" +
        "Top: " +
        rect.y.toFixed() +
        "<br>" +
        "Width: " +
        rect.width.toFixed() +
        "<br>" +
        "Height: " +
        rect.height.toFixed();
    });

    window.addEventListener(
      "resize",
      debounce(() => {
        this.browserWidthOuter = window.outerWidth;
        this.browserWidth = window.innerWidth;
        this.browserHeightOuter = window.outerHeight;
        this.browserHeight = window.innerHeight;

        document.getElementById("outerWidth").innerHTML =
          this.browserWidthOuter;
        document.getElementById("innerWidth").innerHTML = this.browserWidth;
        document.getElementById("outerHeight").innerHTML =
          this.browserHeightOuter;
        document.getElementById("innerHeight").innerHTML = this.browserHeight;
      }, 333)
    );
  }

  openTheMeasure() {
    this.measure.classList.add("measure--is-visible");
  }

  closeTheMeasure() {
    this.measure.classList.remove("measure--is-visible");
  }

  keyPressHandler(e) {
    if (e.keyCode == 27) {
      this.closeTheMeasure();
    }
  }

  getHeight() {
    const body = document.body;
    const html = document.documentElement;
    let bodyH = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      body.getBoundingClientRect().height,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    return bodyH;
  }

  injectHtml() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
    <div class="measure">
      <div class="measure__close">X</div>
      <hr>
      <p>win.outerWidth <span id="outerWidth"></span></p>
      <p>win.innerWidth <span id="innerWidth"></span></p>
      <p>win.outerHeight <span id="outerHeight"></span></p>
      <p>win.innerHeight <span id="innerHeight"></span></p>
      <p>doc.height <span id="documentHeight"></span></p>
      <p>doc.scrollY <span id="scrollY"></span></p>
      <p>doc.scrollY + <br> win.innerHeight <span id="sh"></span></p>
      <p>el.offsetTop <span id="el-offsetTop"></span></p>
      <p>el.offsetHeight <span id="el-offsetHeight"></span></p>
      <hr />
      <p>el.BoundingClientRect</p>
      <p>el.scrollPercent %<span id="scrollPercent"> </span></p>
      <p id="demo"></p>
    </div>
    `
    );
  }
}

export default Measure;
