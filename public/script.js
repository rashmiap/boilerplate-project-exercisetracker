/*-----Global variables-----*/
const openSlideButton = document.getElementById('menu-small')
const closeSlideButton = document.getElementById('close-slide')
const sideNavLink = document.getElementsByClassName('side-nav-link')
const iframe = document.getElementById('formsFrame')
const resetButton = document.getElementsByClassName('reset-btn')
const homeButton = document.getElementsByClassName('home-btn')
const addUserButton = document.getElementsByClassName('add-user-btn')
const logExerciseButton = document.getElementsByClassName('exercise-btn')
const listUsersButton = document.getElementsByClassName('users-btn')
const viewJournalButton = document.getElementsByClassName('journal-btn')

/*-----Global functions-----*/
const pageReload = _ => {
  location.reload()
}

/*-----Navigation functions-----*/
const removeActiveClass = _ => {
  if (document.querySelector('.active')) {
    document.querySelector('.active').classList.remove('active')
  }
}

const activeSelection = (item) => {
  return () => {
    if (document.querySelector(`.active`)) {
      removeActiveClass()
    }

    item.classList.add('active')
  }
}

for (let i = 0; i < document.getElementsByClassName('nav-link').length; i++) {
  let element = document.getElementsByClassName('nav-link')[i]
  element.addEventListener("click", activeSelection(element))
}

for (let i = 0; i < document.getElementsByClassName('option-link').length; i++) {
  let element = document.getElementsByClassName('option-link')[i]
  element.addEventListener("click", activeSelection(element))
}

for (let i = 0; i < document.getElementsByClassName('brand').length; i++) {
  let element = document.getElementsByClassName('brand')[i]
  element.addEventListener("click", removeActiveClass)
}


/*-----Side navigation functions-----*/
const openSlideMenu = () => {
  document.getElementById('side-menu').style.width = '250px';
}

const closeSlideMenu = () => {
  document.getElementById('side-menu').style.width = '0';
  removeActiveClass()
}

openSlideButton.addEventListener("click", openSlideMenu);
closeSlideButton.addEventListener("click", closeSlideMenu);

for (let i = 0; i < sideNavLink.length; i++) {
  sideNavLink[i].addEventListener("click", closeSlideMenu)
}

/*-----Forms----*/
const hideElement = () => {
  if (iframe.contentWindow.document.querySelector('.visible')) {
    iframe.contentWindow.document.querySelector('.visible').classList.add('invisible')
    iframe.contentWindow.document.querySelector('.visible').classList.remove('visible')
  }
}

const showElement= (item) => {
  return () => {
    let element = iframe.contentWindow.document.querySelector(`${item}`)
    if (iframe.contentWindow.document.querySelector(`.visible`)) {
      hideElement()
    }
    element.classList.remove('invisible')
    element.classList.add('visible')
  }
}

for (let i = 0; i < document.getElementsByClassName('nav-link').length; i++) {
  let element = document.getElementsByClassName('nav-link')[i]
  let referenceElem = document.getElementsByClassName('nav-link')[i].getAttribute('href')
  element.addEventListener("click", showElement(referenceElem))
}

const reloadIFrame = () => {
  iframe.contentWindow.location.reload();
}

for (let i = 0; i < resetButton.length; i++) {
  resetButton[i].addEventListener("click", reloadIFrame)
}


