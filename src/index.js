import "./styles/main.scss";

import {where} from "underscore";
const Vue = require("./js/vendor/vue.min.js");

// 
// ======================================================/
const jsonUrl = "src/js/ajax/bonsai.json";
const jsonLoader = {
  start: (url) => {
    return new Promise(function (resolve, reject) {
      let req = new XMLHttpRequest();
      req.open("GET", url);

      req.onload = function () {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function () {
        reject(Error("error"));
      };

      req.send();
    });
  },
  getJSON: (url) => {
    return jsonLoader.start(url).then(JSON.parse);
  },
  filter: () => {
    store.state.message = where(store.state.message, {
      species: "Jukan"
    });
  },
  preloader: () => {
    const spinner = `<div class="sk-wave">
      <div class="sk-rect sk-rect1"></div>
      <div class="sk-rect sk-rect2"></div>
      <div class="sk-rect sk-rect3"></div>
      <div class="sk-rect sk-rect4"></div>
      <div class="sk-rect sk-rect5"></div>
      </div>`;
    document.getElementById("loader").innerHTML = spinner;
  }
};

// 
// ======================================================/
const store = {
  debug: true,
  state: {
    message: ""
  }
};

// 
// ======================================================/
const vmA = new Vue({
  el: "#app",
  data: {
    privateState: {},
    sharedState: store.state,
    loader: true
  }
});

const vmB = new Vue({
  el: "#app2",
  data: {
    privateState: {},
    sharedState: store.state
  }
});

// 
// ======================================================/
jsonLoader.preloader();
jsonLoader.getJSON(jsonUrl)
  .then(function (response) {
    // console.log(response.bonsai.length);
    store.state.message = response.bonsai;
    vmA.loader = false;
  });

(function () {
  var clickHandlers = function () {
    document.getElementById("results").onclick = jsonLoader.filter;
  };
  if (document.readyState !== "loading") clickHandlers();
  else if (document.addEventListener) document.addEventListener("DOMContentLoaded", clickHandlers);
  else document.attachEvent("onreadystatechange", function () {
    if (document.readyState === "complete") clickHandlers();
  });
})();