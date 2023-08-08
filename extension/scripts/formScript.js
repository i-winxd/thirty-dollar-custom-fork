
document.addEventListener('DOMContentLoaded', async function () {
  const form = document.querySelector('form');
  let queryOptions = { url: "https://thirtydollar.website/" };
  let [tab] = await chrome.tabs.query(queryOptions);
  let title = document.querySelector('h1')
  let tabid
  if (!tab) {
    document.getElementById('sbut').disabled = true
    title.innerHTML = "No thirty dollar website found, please open page"
    return
  } else {
    document.getElementById('sbut').disabled = false
    title.innerHTML = "Tab found!"
    tabid = tab.id
  }
  //
  chrome.tabs.sendMessage(tabid, { action: "checkInjected" }, function (response) {
    if (chrome.runtime.lastError) {
      chrome.scripting.executeScript({target: {tabId: tabid}, files: ["insertSound.js"]})     
    }
  });
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    title.innerHTML = "You submitted it";
    console.log("Submitted!!");

    let soundAudio = form.querySelector('#sound-audio').files[0];
    let fr = new FileReader()
    fr.readAsText(soundAudio);
    fr.onload = (e) => {
      let textResult = fr.result
      let inputJSON = JSON.parse(textResult);
      let inputJSONExports = inputJSON.exports;
      for(let inputJSONItem of inputJSONExports){
        chrome.tabs.sendMessage(tabid, {name: inputJSONItem.soundName, credit: "Custom", type: "Note", image: inputJSONItem.imgBits, audio: inputJSONItem.soundBits})
      }
    };
    fr.onerror = (e) => {
      return
    }
  }); 
});
