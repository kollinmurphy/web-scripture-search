var engine;

window.onload = function () {

  engine = new Engine();
  document.querySelector("#btnSearch").addEventListener("click", function () {
    engine.beginSearch(document.querySelector("#txtKeywords").value);
  });

  document.querySelector("#txtKeywords").addEventListener("keyup", function (event) {
    checkIfSubmittable(event);
  });

  function checkIfSubmittable(event) {
    // check if a search is possible with the current text
    let tempAr = parseKeywords(document.querySelector("#txtKeywords").value);

    if (tempAr.length > 0) {
      document.querySelector("#btnSearch").disabled = false;

      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("btnSearch").click();
      }

    } else {
      document.querySelector("#btnSearch").disabled = true;
    }
  }

  checkIfSubmittable({keyCode: -1});

};