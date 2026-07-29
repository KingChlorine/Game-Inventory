const searchbtn = document.getElementById('search')
const searchbar = document.getElementById('searchbar')

const card = document.getElementsByClassName('carouselcard')
const popup = document.getElementById('overlay')

const close = document.getElementById('close')

function hide(){

        searchbar.style.display = searchbar.style.display === 'block' ? 'none' : 'block';

    }

function popupform(){

        popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
        
    }

function closepopup(){

    popup.style.display = 'none';
}