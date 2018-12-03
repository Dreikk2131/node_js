const titleElem = document.querySelector('.head__button');
const listElem = document.querySelector('.head__recipe');

titleElem.onclick = function() {
  listElem.classList.toggle('open');
};
