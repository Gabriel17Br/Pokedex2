const API_URL = "https://pokeapi.co/api/v2/pokemon"
const LIMIT = 12

let offset = 0


const container = document.getElementById("container")
const loadMoreBtn = document.getElementById("loadMoreBtn")
const searchBtn = document.getElementById("searchBtn")
const searchInput = document.getElementById("searchInput")



async function fetchPokemonList() {
  const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`)
  if (!response.ok) throw new Error("Erro ao buscar lista")
  return response.json()
}

async function fetchPokemon(nameOrId) {
  const response = await fetch(`${API_URL}/${nameOrId}`)
  if (!response.ok) throw new Error("Pokémon não encontrado")
  return response.json()
}


function createCard(pokemon) {
  const card = document.createElement("div")
  card.classList.add("card")

  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h3>${pokemon.name}</h3>
    <p>ID: ${pokemon.id}</p>
    <p>Tipo: ${pokemon.types.map(t => t.type.name).join(", ")}</p>
  `

  container.appendChild(card)
}

function showError(message) {
  container.innerHTML = `<p style="color:white;">${message}</p>`
}

function clearContainer() {
  container.innerHTML = ""
}


async function loadPokemons() {
  try {
    const data = await fetchPokemonList()

    for (const item of data.results) {
      const pokemon = await fetchPokemon(item.name)
      createCard(pokemon)
    }

    offset += LIMIT

  } catch (error) {
    showError("Erro ao carregar Pokémon")
  }
}

async function searchPokemon() {
  const value = searchInput.value.trim().toLowerCase()
  if (!value) return

  clearContainer()
  offset = 0

  try {
    const pokemon = await fetchPokemon(value)
    createCard(pokemon)
  } catch {
    showError("Pokémon não encontrado")
  }
}



loadMoreBtn.addEventListener("click", loadPokemons)
searchBtn.addEventListener("click", searchPokemon)

searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") searchPokemon()
})


loadPokemons()