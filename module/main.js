import { IRREGULAR_VERB_ENDPOINT } from "./datafetching.js";

const main = async () => {
  let verbs;
  if (localStorage.IRREGULAR_VERB) {
    verbs = JSON.parse(localStorage.IRREGULAR_VERB);
  } else {
    const res = await fetch(IRREGULAR_VERB_ENDPOINT, {
      headers: { accept: "application/json" },
    });
    verbs = await res.json();
    localStorage.IRREGULAR_VERB = JSON.stringify(verbs);
  }

  const randomize = () => {
    return Math.floor(Math.random() * verbs.length);
  };

  let { verb, past, participle } = verbs[randomize()];

  document.body.innerHTML = `
    <div class='irregular__verb'>
      <h1 class='irregular__verb-main'>       
         &ldquo;${participle}&rdquo;
      </h1>
      <hr>
      <blockquote class='irregular_quote'>
        Past: ${past}
      </blockquote>
      <p class='the__verb'>
        Verb: ${verb}
      </p>
      <button id = "handleDictionary"><img src = "./public/dictionary.png"/></button>
      <div id = "displaydictionary">
      <p id = "loadingmessage"></p>      
      </div>    
    </div>
  `;

  const id = document.querySelector("#handleDictionary");
  const urldictionary = `https://api.dictionaryapi.dev/api/v2/entries/en/${verb}`;
  const iddictionary = document.querySelector("#displaydictionary");
  const loadingmessage = document.querySelector("#loadingmessage");

  id.addEventListener("click", function () {
    loadingmessage.textContent = `Fetching the data from dictionary`;
    fetch(urldictionary)
      .then((response) => response.json())
      .then((dictionaryjson) => {
        let { phonetics, meanings } = dictionaryjson[0];
        let { text, audio } = phonetics[0];
        let { partOfSpeech, definitions } = meanings[0];

        const display = `
      <p>IPA: ${text}</p>
      
      <audio controls>      
      <source src="${audio}" type="audio/mpeg">
      Your browser does not support the audio element.
      </audio>
      <p>Meaning: ${definitions[0].definition}</p>
      <p>Synonyms: ${definitions[0].synonyms}</p>              
      `;

      loadingmessage.textContent = "";

      iddictionary.innerHTML = display;
        console.log("succeeded");
      })
      .catch((e) => {
        iddictionary.textContent =
          "Something went wrong, sorry for any inconvenience caused!";
        console.log(e.message);
      });
  });
};

export default main;
