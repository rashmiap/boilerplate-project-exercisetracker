/*-----Global variables-----*/
const openSlideButton = document.getElementById('menu-small')
const closeSlideButton = document.getElementById('close-slide')
const sideNavLink = document.getElementsByClassName('side-nav-link')

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
