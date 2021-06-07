let base_url = "https://pokeapi.co/api/v2/";

let displayId = (id) => {
    if(id < 10) {
        return `#00${id}`;
    } else if(id < 100) {
        return `#0${id}`;
    } else {
        return `${id}`;
    }
}

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);

        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getPokemons() {
    if ('caches' in window) {
        caches.match(base_url + "pokemon").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    let pokemonsHTML = "";
                    data.results.forEach(function (pokemon) {
                        pokemonsHTML += `
                        <a href="./pokemon.html?id=${pokemon.name}" class="col s6">
                            <div class="card">
                                <p>${pokemon.name}</p>
                            </div>
                        </a>
                        `;
                    });
                    document.getElementById("pokemons").innerHTML = pokemonsHTML;
                }).catch(error);
            }
        })
    }

    fetch(base_url + "pokemon")
        .then(status)
        .then(json)
        .then(function (data) {
            let pokemonsHTML = "";
            data.results.forEach(function (pokemon) {
                pokemonsHTML += `
                <a href="./pokemon.html?id=${pokemon.name}" class="col s6">
                    <div class="card">
                        <p>${pokemon.name}</p>
                    </div>
                </a>
                `;
            });

            document.getElementById("pokemons").innerHTML = pokemonsHTML;
        })
        .catch(error);
}

function getDetailPokemon() {
    return new Promise(function(resolve, reject) {
    
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");
              
        if ("caches" in window) {
            caches.match(base_url + "pokemon/" + idParam).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        let types = "";
                        let about = "";
                        let abilities = "";
                        let stats = "";
                        let evolution = "";
                        let moves = "";

                        data.types.forEach(function(type) {
                            types +=`
                            <div class="chip">${type.type.name}</div>
                            `
                        })
                        data.abilities.forEach(function(ability) {
                            abilities += `<span>${ability.ability.name}</span>`
                        })

                        about +=`
                        <table>
                            <tbody>
                                <tr>
                                    <td class="grey-text">Species</td>
                                    <td>${data.species.name}</td>
                                </tr>
                                <tr>
                                    <td class="grey-text">Height</td>
                                    <td>${data.height}"</td>
                                </tr>
                                <tr>
                                    <td class="grey-text">Weigt</td>
                                    <td>${data.weight}lbs</td>
                                </tr>
                                <tr>
                                    <td class="grey-text">Abilities</td>
                                    <td>${abilities}</td>
                                </tr>
                                <tr colspan="2" class="submenu">
                                    <td>Breeding</td>
                                </tr>
                                <tr>
                                    <td class="grey-text">Gender</td>
                                    <td>female</td>
                                </tr>
                                <tr>
                                    <td class="grey-text">Egg Groups</td>
                                    <td>Monster</td>
                                </tr>
                                <tr>
                                    <td class="grey-text">Egg Cycle</td>
                                    <td>Grass</td>
                                </tr>
                            </tbody>
                        </table>
                        `;

                        data.stats.forEach(function(stat) {
                            stats +=`
                            <tr>
                                <td>${stat.stat.name}</td>
                                <td>${stat.base_stat}</td>
                                <td class="progress"><div class="determinate" style="width:${stat.base_stat}%"></div></td>
                            </tr>
                            `
                        })

                        data.moves.forEach(function(move) {
                            moves +=`
                            <tr>
                                <td>Name</td>
                                <td>${move.move.name}</td>
                            </tr>
                            `
                        })

                        let pokemonHTML = `
                            <div class="detail-info container">
                                <div class="">
                                    <h2 class="detail-name white-text">${data.name}</h2>
                                    ${types}
                                </div>
                                <div class="detail-id white-text right-align">
                                    <h5>${displayId(data.id)}</h5>
                                </div>
                            </div>
                            <div class="container">
                                <div class="center-align">
                                    <img src="${data.sprites.other.dream_world.front_default}" class="responsive-img" />
                                </div>
                            </div>
                            <div class="detail-card">
                                    <div class="row">
                                        <div class="col s12">
                                            <ul class="tabs" id="tabs">
                                                <li class="tab col s3 submenu"><a class="active black-text" href="#about">About</a></li>
                                                <li class="tab col s3 submenu"><a href="#stats">Base State</a></li>
                                                <li class="tab col s3 submenu"><a href="#evolution">Evolution</a></li>
                                                <li class="tab col s3 submenu"><a href="#moves">Moves</a></li>
                                            </ul>
                                        </div>
                                        <div id="about" class="col s12">
                                            <div class="container">
                                                ${about}
                                            </div>
                                        </div>
                                        <div id="stats" class="col s12">
                                            <table class="container">
                                                <tbody>
                                                    ${stats}
                                                    <tr colspan="3">
                                                        <td class="submenu">Type defenses</td>
                                                    </tr>
                                                    <tr>
                                                        <td>The effectiveness of each type on ${data.name}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div id="evolution" class="col s12">

                                        </div>
                                        <div id="moves" class="col s12">
                                            <table class="container">
                                                <tbody>
                                                    ${moves}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                            </div>
                            `;
                        document.getElementById("body-content").innerHTML = pokemonHTML;
                        let tabs = document.getElementById('tabs');
                        M.Tabs.init(tabs);
                        resolve(data);
                        let body = document.body;
                        body.classList.add(`${data.types[0].type.name}`);
                    });
                }
            });
        }
      
        fetch(base_url + "pokemon/" + idParam)
            .then(status)
            .then(json)
            .then(function(data) {
                let types = "";
                let about = "";
                let abilities = "";
                let stats = "";
                let evolution = "";
                let moves = "";

                data.types.forEach(function(type) {
                    types +=`
                    <div class="chip">${type.type.name}</div>
                    `
                })
                data.abilities.forEach(function(ability) {
                    abilities += `<span>${ability.ability.name}</span>`
                })

                about +=`
                <table>
                    <tbody>
                        <tr>
                            <td class="grey-text">Species</td>
                            <td>${data.species.name}</td>
                        </tr>
                        <tr>
                            <td class="grey-text">Height</td>
                            <td>${data.height}"</td>
                        </tr>
                        <tr>
                            <td class="grey-text">Weigt</td>
                            <td>${data.weight}lbs</td>
                        </tr>
                        <tr>
                            <td class="grey-text">Abilities</td>
                            <td>${abilities}</td>
                        </tr>
                        <tr colspan="2" class="submenu">
                            <td>Breeding</td>
                        </tr>
                        <tr>
                            <td class="grey-text">Gender</td>
                            <td>female</td>
                        </tr>
                        <tr>
                            <td class="grey-text">Egg Groups</td>
                            <td>Monster</td>
                        </tr>
                        <tr>
                            <td class="grey-text">Egg Cycle</td>
                            <td>Grass</td>
                        </tr>
                    </tbody>
                </table>
                `;

                data.stats.forEach(function(stat) {
                    stats +=`
                    <tr>
                        <td>${stat.stat.name}</td>
                        <td>${stat.base_stat}</td>
                        <td class="progress"><div class="determinate" style="width:${stat.base_stat}%"></div></td>
                    </tr>
                    `
                })

                data.moves.forEach(function(move) {
                    moves +=`
                    <tr>
                        <td>Name</td>
                        <td>${move.move.name}</td>
                    </tr>
                    `
                })

                let pokemonHTML = `
                    <div class="detail-info container">
                        <div class="">
                            <h2 class="detail-name white-text">${data.name}</h2>
                            ${types}
                        </div>
                        <div class="detail-id white-text right-align">
                            <h5>${displayId(data.id)}</h5>
                        </div>
                    </div>
                    <div class="container">
                        <div class="center-align">
                            <img src="${data.sprites.other.dream_world.front_default}" class="responsive-img" />
                        </div>
                    </div>
                    <div class="detail-card">
                            <div class="row">
                                <div class="col s12">
                                    <ul class="tabs" id="tabs">
                                        <li class="tab col s3 submenu"><a class="active black-text" href="#about">About</a></li>
                                        <li class="tab col s3 submenu"><a href="#stats">Base State</a></li>
                                        <li class="tab col s3 submenu"><a href="#evolution">Evolution</a></li>
                                        <li class="tab col s3 submenu"><a href="#moves">Moves</a></li>
                                    </ul>
                                </div>
                                <div id="about" class="col s12">
                                    <div class="container">
                                        ${about}
                                    </div>
                                </div>
                                <div id="stats" class="col s12">
                                    <table class="container">
                                        <tbody>
                                            ${stats}
                                            <tr colspan="3">
                                                <td class="submenu">Type defenses</td>
                                            </tr>
                                            <tr>
                                                <td>The effectiveness of each type on ${data.name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div id="evolution" class="col s12">

                                </div>
                                <div id="moves" class="col s12">
                                    <table class="container">
                                        <tbody>
                                            ${moves}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                    </div>
                    `;
                document.getElementById("body-content").innerHTML = pokemonHTML;
                let tabs = document.getElementById('tabs');
                M.Tabs.init(tabs);
                resolve(data);
                let body = document.body;
                body.classList.add(`${data.types[0].type.name}`);
            });
        })
}

function getSavedPokemons() {
    getAll().then(function(pokemons) {
        console.log(pokemons);
        // Menyusun komponen card artikel secara dinamis
        let pokemonsHTML = "";
        if(pokemons.length === 0) {
            pokemonsHTML += `
              <h4 style="padding:100px;">Uups.. there are no favourite pokemons.</h4>
            `;
        } else {
            pokemons.forEach(function(pokemon) {
            pokemonsHTML += `
            <a href="./pokemon.html?id=${pokemon.name}&saved=true">
                <div class="card">
                    <p>${pokemon.name}</p>
                </div>
            </a>
            `;
            });
        }
        document.getElementById("body-content").innerHTML = pokemonsHTML;
    });
}
  
function getSavedDetailPokemon() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    console.log(idParam);
    
    getById(idParam).then(function(data) {
        let types = "";
        let about = "";
        let abilities = "";
        let stats = "";
        let evolution = "";
        let moves = "";

        data.types.forEach(function(type) {
            types +=`
            <div class="chip">${type.type.name}</div>
            `
        })
        data.abilities.forEach(function(ability) {
            abilities += `<span>${ability.ability.name}</span>`
        })

        about +=`
        <table>
            <tbody>
                <tr>
                    <td class="grey-text">Species</td>
                    <td>${data.species.name}</td>
                </tr>
                <tr>
                    <td class="grey-text">Height</td>
                    <td>${data.height}"</td>
                </tr>
                <tr>
                    <td class="grey-text">Weigt</td>
                    <td>${data.weight}lbs</td>
                </tr>
                <tr>
                    <td class="grey-text">Abilities</td>
                    <td>${abilities}</td>
                </tr>
                <tr colspan="2" class="submenu">
                    <td>Breeding</td>
                </tr>
                <tr>
                    <td class="grey-text">Gender</td>
                    <td>female</td>
                </tr>
                <tr>
                    <td class="grey-text">Egg Groups</td>
                    <td>Monster</td>
                </tr>
                <tr>
                    <td class="grey-text">Egg Cycle</td>
                    <td>Grass</td>
                </tr>
            </tbody>
        </table>
        `;

        data.stats.forEach(function(stat) {
            stats +=`
            <tr>
                <td>${stat.stat.name}</td>
                <td>${stat.base_stat}</td>
                <td class="progress"><div class="determinate" style="width:${stat.base_stat}%"></div></td>
            </tr>
            `
        })

        data.moves.forEach(function(move) {
            moves +=`
            <tr>
                <td>Name</td>
                <td>${move.move.name}</td>
            </tr>
            `
        })

        let pokemonHTML = `
            <div class="detail-info container">
                <div class="">
                    <h2 class="detail-name white-text">${data.name}</h2>
                    ${types}
                </div>
                <div class="detail-id white-text right-align">
                    <h5>${displayId(data.id)}</h5>
                </div>
            </div>
            <div class="container">
                <div class="center-align">
                    <img src="${data.sprites.other.dream_world.front_default}" class="responsive-img" />
                </div>
            </div>
            <div class="detail-card">
                    <div class="row">
                        <div class="col s12">
                            <ul class="tabs" id="tabs">
                                <li class="tab col s3 submenu"><a class="active black-text" href="#about">About</a></li>
                                <li class="tab col s3 submenu"><a href="#stats">Base State</a></li>
                                <li class="tab col s3 submenu"><a href="#evolution">Evolution</a></li>
                                <li class="tab col s3 submenu"><a href="#moves">Moves</a></li>
                            </ul>
                        </div>
                        <div id="about" class="col s12">
                            <div class="container">
                                ${about}
                            </div>
                        </div>
                        <div id="stats" class="col s12">
                            <table class="container">
                                <tbody>
                                    ${stats}
                                    <tr colspan="3">
                                        <td class="submenu">Type defenses</td>
                                    </tr>
                                    <tr>
                                        <td>The effectiveness of each type on ${data.name}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="evolution" class="col s12">

                        </div>
                        <div id="moves" class="col s12">
                            <table class="container">
                                <tbody>
                                    ${moves}
                                </tbody>
                            </table>
                        </div>
                    </div>
            </div>
        `;
        document.getElementById("body-content").innerHTML = pokemonHTML;
        let tabs = document.getElementById('tabs');
        M.Tabs.init(tabs);
        resolve(data);
        let body = document.body;
        body.classList.add(`${data.types[0].type.name}`);
    });
}