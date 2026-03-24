const form = document.getElementById("form");
const searchInput = document.getElementById("search");
const resultContainer = document.getElementById("result");
const moreContainer = document.getElementById("more");

function displaySuggestions(suggestionsArray) {
  resultContainer.innerHTML = "";

  if (!suggestionsArray || !suggestionsArray.length) {
    const p = document.createElement("p");
    p.textContent = "No results to be found!";
    resultContainer.append(p);
    return;
  }

  const resultList = document.createElement("ul");
  resultList.classList.add("songs");
  suggestionsArray.forEach((suggestion) => {
    const resultListItem = document.createElement("li");
    resultListItem.innerHTML = `
    <span>
      <strong>${suggestion.artist.name}</strong> - ${suggestion.title}
    </span>
    <button onclick="getLyrics('${suggestion.artist.name}', '${suggestion.title}')">Get Lyrics</button>`;
    resultList.append(resultListItem);
  });
  resultContainer.append(resultList);
}

async function getLyrics(artist, title) {
  const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
  if (!res.ok) return console.log("Something went wrong with the request.");
  const data = await res.json();
  resultContainer.innerHTML = `<h2><strong>${artist}</strong> - ${title}</h2><span>${data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>")}</span>`;
  moreContainer.innerHTML = "";
}

async function getMoreSongs(url) {
  const res = await fetch(`https://proxy.corsfix.com/?${url}`);
  if (!res.ok) return console.log("Something went wrong with the request.");
  const data = await res.json();
  total = data.total;
  next = data.next;
  previous = data.prev;
  displaySuggestions(data.data);
  displayPagination();
}

function displayPagination() {
  moreContainer.innerHTML = "";

  if (!total || total <= 15) return;
  if (next) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => getMoreSongs(next));
    moreContainer.append(nextBtn);
  }
  if (previous) {
    const previousBtn = document.createElement("button");
    previousBtn.textContent = "Previous";
    previousBtn.addEventListener("click", () => getMoreSongs(previous));
    moreContainer.prepend(previousBtn);
  }
}

async function getSuggestions() {
  previous = null;
  next = null;
  total = null;
  const res = await fetch(`https://api.lyrics.ovh/suggest/${term}`);
  if (!res.ok) return console.log("Something went wrong with the request.");
  const data = await res.json();
  total = data.total;
  next = data.next;
  displaySuggestions(data.data);
  displayPagination();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!searchInput.value.trim()) return alert("Please type in a search term.");
  term = searchInput.value.trim();
  getSuggestions();
});

let term;
let previous;
let next;
let total;
