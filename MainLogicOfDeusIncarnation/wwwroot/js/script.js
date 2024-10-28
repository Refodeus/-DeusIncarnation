	let startWidth = 105;
	let endWidth = 250;
	document.getElementById('searchButton').addEventListener('click', function() {
	var searchInput = document.getElementById('searchInput');
	var img = this.querySelector('img');
	if (searchInput.classList.contains('show'))
	{
		searchInput.classList.remove('show');
		this.style.width = `${startWidth}px`;
		const spanText = this.querySelector('span');
		spanText.innerHTML = '';
		spanText.appendChild(img);
		spanText.appendChild(document.createTextNode('Поиск'));
	}
	else
	{
		searchInput.classList.add('show');
		searchInput.focus();
		this.style.width = `${endWidth}px`;
		const spanText = this.querySelector('span');
		spanText.innerHTML = '';
		spanText.appendChild(img);
	}
});


function formatTime(timeString) {
	const parts = timeString.split(':');
	const hours = parseInt(parts[0], 10);
	const minutes = parseInt(parts[1], 10);

	let formattedTime = "Длительность: ";
	if (hours > 0)
		formattedTime += `${hours}ч `;
	formattedTime += `${minutes} мин `;
	return formattedTime;
}

let descriptions = [];
async function fetchMovies() {
	try {
		const response = await fetch('/Movies');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const movies = await response.json();
		descriptions = movies.map(movie => ({
			id: movie.id,
			title: movie.title,
			averagemark: movie.averagemark,
			time: movie.time,
			description: movie.description,
			type_video: movie.type_video,
			genres: movie.genres
		}));
		updateFilmsGallery();
		updateImages();
	} catch (error) {
		console.log('Error fetching movies: ', error);
	}
}
let abc = 0;
let currentIndex = 0;
let shiftAmount = 0;
let imagesLength = 0;
const gallary = document.getElementById('gallary');
const prevButton = document.querySelectorAll('.arrow-transition')[0];
const nextButton = document.querySelectorAll('.arrow-transition')[1];
let imageWidth = 240;
function updateFilmsGallery() {
	gallary.innerHTML = '';
	for (let index = 0; index < descriptions.length; index++) {
		if (index + 1 > 11)
			break;
		const img = document.createElement('img');
		img.src = `Images/img${index + 1}.jfif`;
		img.classList.add('image');
		img.alt = `img${index + 1}`;
		gallary.appendChild(img);
	}
}
function updateImages() {
	images = document.querySelectorAll('.image');
	const titleElement = document.getElementById('title');
	const mark_and_genres_Element = document.getElementById('mark_and_genres');
	const timeElement = document.getElementById('time');
	const descriptionElement = document.getElementById('description');

	imagesLength = images.length;

	images.forEach((img, index) => {
		img.classList.remove('active', 'blured', 'blured-opacity');
		if (index === currentIndex) {
			img.classList.add('active');
		} else if (index === currentIndex - 1 || index === currentIndex + 1) {
			img.classList.add('blured');
		} else if (index <= currentIndex - 2 || index >= currentIndex + 2) {
			img.classList.add('blured-opacity');
		}
		if (descriptions[index].id === currentIndex + 1) {
			const currentDescriptions = descriptions[index];
			titleElement.textContent = currentDescriptions.title;
			const strMark = currentDescriptions.averagemark + " " + currentDescriptions.type_video + ", " + currentDescriptions.genres;
			mark_and_genres_Element.innerHTML = `<i class="fa fa-star" aria-hidden="true" style="scale: 0.8; color: yellow;"></i> ` +
				`${strMark}`
			timeElement.textContent = formatTime(currentDescriptions.time);
			descriptionElement.textContent = currentDescriptions.description;
		}
	});
	const shiftAmount = -currentIndex * imageWidth;
	gallary.style.transform = `translateX(${shiftAmount}px)`;
}
fetchMovies();

prevButton.addEventListener('click', () => {
	currentIndex = (currentIndex - 1 + imagesLength) % images.length;
	updateImages();
});
nextButton.addEventListener('click', () => {
	currentIndex = (currentIndex + 1) % imagesLength;
	updateImages();
});



let increment;
var button = document.getElementById('searchButton');
const mediaQuery1024 = window.matchMedia('(max-width: 1024px)');
const mediaQuery768 = window.matchMedia('(max-width: 768px)');
const mediaQuery430 = window.matchMedia('(max-width: 430px)');
function handleMedia(x1024, x768, x430) {
	ratioResolution = 1440 / 1024;
	if (x430.matches)
	{
		imageWidth = 195;

		let width = parseFloat(getComputedStyle(searchInput).width);
		searchInput.style.width = `${width * 0.9}px`;
		endWidth = endWidth * 0.9;
		ratioResolution = 3;
		increment = increment * 1140 / 654 * 0.5;
		return;
	}
	if (x768.matches)
	{
		let width = parseFloat(getComputedStyle(searchInput).width);
		searchInput.style.width = `${width * 0.9}px`;
		endWidth = endWidth * 0.9;
		increment = increment * 1140 / 824;
		return;
	}
	if (x1024.matches)
	{
		increment = increment * 1140 / 1024;
		return;
	}
	ratioResolution = 1;
	searchInput.style.width = '180px';
	endWidth = 250;
}
const handleMediaChanges = () => {
	handleMedia(mediaQuery1024, mediaQuery768, mediaQuery430);
};
mediaQuery1024.addEventListener('change', () => handleMediaChanges);
mediaQuery768.addEventListener('change', () => handleMediaChanges);
mediaQuery430.addEventListener('change', () => handleMediaChanges);
function setupClickEventsCategories(objects, activeClass)
{
	document.querySelectorAll(objects).forEach( item => {
	item.addEventListener('click', () => {
		document.querySelectorAll('.style-dot').forEach( dot => {
			dot.classList.remove(activeClass);
		});
		document.querySelectorAll('.gradient-text').forEach( grad => {
			grad.classList.remove(activeClass);
		});
		const dot = item.querySelector('.style-dot');
		dot.classList.add(activeClass);
		const grad = item.querySelector('.gradient-text');
		grad.classList.add(activeClass);
		});
});
}
setupClickEventsCategories('.categories_1 li', 'visible');
setupClickEventsCategories('.categories_2 li', 'visible-categories');