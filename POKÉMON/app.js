// =======================================================
// Pokédex Scarlet/Violet – TEAM LosCalvinKlon
// =======================================================

async function fetchData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Hubo un problema con el fetch:", error);
        return null;
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStat(pokemon, statName) {
    const found = pokemon.stats.find(s => s.stat.name === statName);
    return found ? found.base_stat : "?";
}

function renderPokemon(pokemon) {
    const li = document.createElement("li");
    li.classList.add("pokedex-card");

    const id = pokemon.id.toString().padStart(3, "0");
    const name = capitalize(pokemon.name);
    const image = pokemon.sprites.front_default;

    const types = pokemon.types
        .map(t => `<span class="type-pill type-${t.type.name}">${t.type.name}</span>`)
        .join("");

    li.innerHTML = `
        <div class="pokedex-header">
            <span>#${id}</span>
            <span class="pokedex-name">${name}</span>
        </div>

        <div class="pokedex-image">
            <img src="${image}" alt="${name}">
        </div>

        <div class="pokedex-types">${types}</div>

        <div class="pokedex-meta">
            <span>Altura: ${(pokemon.height / 10).toFixed(1)} m</span>
            <span>Peso: ${(pokemon.weight / 10).toFixed(1)} kg</span>
        </div>

        <div class="pokedex-stats">
            <div class="stat-item">
                <span class="stat-label">HP</span>
                <span class="stat-value">${getStat(pokemon, "hp")}</span>
            </div>

            <div class="stat-item">
                <span class="stat-label">ATK</span>
                <span class="stat-value">${getStat(pokemon, "attack")}</span>
            </div>

            <div class="stat-item">
                <span class="stat-label">DEF</span>
                <span class="stat-value">${getStat(pokemon, "defense")}</span>
            </div>

            <div class="stat-item">
                <span class="stat-label">SPD</span>
                <span class="stat-value">${getStat(pokemon, "speed")}</span>
            </div>
        </div>
    `;

    return li;
}

function displayPokemonList(cards) {
    const ul = document.getElementById("pokemon-list");
    ul.innerHTML = "";
    cards.forEach(c => ul.appendChild(c));
}

async function searchPokemonByName(name) {
    if (!name) {
        alert("Escribe un nombre para buscar.");
        return;
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
    const data = await fetchData(url);

    if (!data) {
        alert("Pokémon no encontrado.");
        return;
    }

    const card = renderPokemon(data);
    displayPokemonList([card]);
}

document.getElementById("search-button").addEventListener("click", () => {
    const name = document.getElementById("search-input").value;
    searchPokemonByName(name);
});

document.getElementById("search-input").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchPokemonByName(e.target.value);
    }
});

// ⭐ Pokémon inicial
searchPokemonByName("ditto");
