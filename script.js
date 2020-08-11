// init dom
const searchButton = document.querySelector('.search-button');
const inputKeyword = document.querySelector('.input-keyword');

// init var
let data = [];

// event bind show movies
searchButton.addEventListener("click", showMovies);
inputKeyword.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) showMovies();
});

// event bind click details
document.addEventListener("click", async function (e) {
    if (e.target.classList.contains('modal-detail-button')) {
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid);
        updateUIDetail(movieDetail);
    }
})


// function init

async function showMovies() {
    const inputKeyword = document.querySelector('.input-keyword');
    const movies = await getMovies(inputKeyword.value);
    console.log(movies);
    UpdateUI(movies);
}

async function getMovies(keyword) {
    const pagesLength = 10;
    for (let i = 1; i < pagesLength; i++) {
        await fetch(`https://www.omdbapi.com/?apikey=5beca760&s=${keyword}&page=${i}`)
            .then(response => response.json())
            .then(response => response.Search)
            .then(response => {
                if (response) response.forEach(r => data.push(r))
            });
    }
    return data;
}

function UpdateUI(movies) {
    let cards = '';
    movies.forEach(m => { if (m.Poster !== "N/A") cards += showCards(m) });
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards;
    data = [];
}

function showCards(m) {
    return `<div class="col-md-4 my-3">
                        <div class="card">
                        <img src="${m.Poster}" class="card-img-top" />
                        <div class="card-body">
                            <h5 class="card-title">${m.Title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6 >
                            <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal"
                            data-target="#movieDetailModal" data-imdbid="${m.imdbID}" >Show Detaiis</a>
                        </div >
                        </div >
                    </div > `;
}

function getMovieDetail(imdbid) {
    return fetch(`https://www.omdbapi.com/?apikey=5beca760&i=${imdbid}`)
        .then(response => response.json())
        .then(m => m);
}

function updateUIDetail(m) {
    const movieDetail = showMovieDetail(m);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail;
}

function showMovieDetail(m) {
    return ` <div class="container-fluid">
    <div class="row">
    <div class="col-md-3">
        <img src="${m.Poster}" class="img-fluid" />
    </div>
    <div class="col-md">
        <ul class="list-group">
        <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
        <li class="list-group-item">
            <strong>Director : </strong>${m.Director}
        </li>
        <li class="list-group-item">
            <strong>Actors : </strong>${m.Actors}
        </li>
        <li class="list-group-item">
        <strong>Writer : </strong>${m.Writer}</li>
        <li class="list-group-item">
            <strong>Plot : </strong>${m.Plot}</li>
        </ul >
    </div >
    </div >
</div > `;
}