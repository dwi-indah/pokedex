let dbPromised = idb.open("pokemon", 1, function(upgradeDb) {
    let pokemonsObjectStore = upgradeDb.createObjectStore("pokemons", {
        keyPath: "name"
    });

    pokemonsObjectStore.createIndex("pokemon_name", "pokemon_name", { unique: false});
});


function savePokemons(pokemons) {
    dbPromised
    .then(function(db) {
        let tx = db.transaction("pokemons", "readwrite");
        let store = tx.objectStore("pokemons");
        console.log(pokemons);
        store.put(pokemons);
        return tx.complete;
    })
    .then(function() {
        console.log("Pokemon Successfully Saved");
    }); 
}


function deletePokemon(id){
    return new Promise(function(resolve, reject) {
        dbPromised
        .then(function(db) {
            let tx = db.transaction('pokemons', 'readwrite');
            let store = tx.objectStore('pokemons');
            console.log(id);
            store.delete(id);
            return tx.complete;
        })
        .then(function(id) {
            resolve(id);
            console.log("Pokemon Successfully Deleted");
        });
    });
}

function getAll() {
    return new Promise(function(resolve, reject) {
        dbPromised
        .then(function(db) {
            let tx = db.transaction("pokemons", "readonly");
            let store = tx.objectStore("pokemons");
            return store.getAll();
        })
        .then(function(pokemons) {
            resolve(pokemons);
        });
    });
}

function getById(id) {
    return new Promise(function(resolve, reject) {
        dbPromised
        .then(function(db) {
            let tx = db.transaction("pokemons", "readonly");
            let store = tx.objectStore("pokemons");
            return store.get(id);
        })
        .then(function(id) {
            resolve(id);
        });
    });
}