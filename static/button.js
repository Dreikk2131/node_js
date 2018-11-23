var titleElem = document.querySelector('.head__button');
var listElem = document.querySelector('.head__recipe');

titleElem.onclick = function() {
    listElem.classList.toggle('open');
};