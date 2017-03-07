import "./styles/main.scss";

import {where} from "underscore";
const Vue = require("./js/vendor/vue.min.js");

// 
// ======================================================/
const ajaxUrl = "src/js/ajax/bonsai.json";
const loader = {
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
    return loader.start(url).then(JSON.parse);
  },
  filter: () => {
    store.state.message = where(store.state.message, {
      species: "Jukan"
    });
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
    sharedState: store.state
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
loader.getJSON(ajaxUrl)
  .then(function (response) {
    // console.log(response.bonsai.length);
    store.state.message = response.bonsai;
  });

(function () {
  var clickHandlers = function () {
    document.getElementById("results").onclick = loader.filter;
  };
  if (document.readyState !== "loading") clickHandlers();
  else if (document.addEventListener) document.addEventListener("DOMContentLoaded", clickHandlers);
  else document.attachEvent("onreadystatechange", function () {
    if (document.readyState === "complete") clickHandlers();
  });
})();