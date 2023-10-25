const input = document.querySelector(".input")
const autoCompleteBlock = document.querySelector(".auto-complete")
const repositories = document.querySelector(".repositories")

function hideDropRepos() {
  autoCompleteBlock.style.display = "none"
}

const addChoose = function (e) {
  e.preventDefault()

  console.log(e.target)

  input.value = ""
  hideDropRepos()

  const choosenHtml = `<li class="repositories__item">
      <p class="repositories__item--text">
        <span>Name: ${e.target.outerText}</span>
        <span>Author: ${e.target.dataset.author}</span>
        <span>Stars: ${e.target.dataset.stars}</span>
      </p>
      <button class="btn--close"></button>
    </li>`

  repositories.innerHTML += choosenHtml
}

const deleteChoose = function (e) {
  e.preventDefault()
  if (!e.target.classList.contains("btn--close")) return false
  e.target.parentElement.remove()
  return true
}

function dropRepos(repos) {
  if (repos.length === 0) {
    autoCompleteBlock.style.display = "none"
    throw Error("No repos... try again")
  }
  autoCompleteBlock.style.display = "flex"
  autoCompleteBlock.innerHTML = ""
  let count = repos.length > 5 ? 5 : repos.length

  for (let key = 0; key < count; key++) {
    console.log(repos[key])
    let author = repos[key].owner.login
    let stars = repos[key].stargazers_count
    autoCompleteBlock.innerHTML += `<li class="auto-complete__item" data-author="${author}" data-stars="${stars}">${repos[key].full_name}</li>`
  }
}

async function getRepositories() {
  const URL = "https://api.github.com/search/repositories"

  if (input.value.length === 0) {
    hideDropRepos()
    return
  }
  try {
    const response = await fetch(URL + `?q=${input.value}`)

    if (!response.ok) return
    const res = await response.json()
    const items = res.items
    dropRepos(items)
  } catch (error) {
    console.log(error)
    autoCompleteBlock.style.display = "none"
    return
  }
}

function debounce(fn, timeout) {
  let timer = null

  return (...args) => {
    clearTimeout(timer)
    return new Promise(resolve => {
      timer = setTimeout(() => resolve(fn(...args)), timeout)
    })
  }
}

repositories.addEventListener("click", deleteChoose)
autoCompleteBlock.addEventListener("click", addChoose)

const getRepositoriesDebounced = debounce(getRepositories, 300)
input.addEventListener("input", getRepositoriesDebounced)
