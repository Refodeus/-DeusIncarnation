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

///////////////////////////////////////////////////

const genresContainer = document.getElementById("genres2");
const AllGenres = ["драма", "фэнтези", "фантастика", "приключения", "триллер", "детектив", "комедия", "ужасы", "романтика", "мюзикл", "биография", "криминал", "мистика"];
const selectedGenres = new Set();
const AllCategories = ["Фильмы и сериалы", "Фильм", "Сериал"];
const AllCategoriesWithBigChar = ["Фильмы и сериалы", "Фильмы", "Сериалы"];
let SelectedCategory = AllCategories[0];
function handleGenreClick(genre) {
	const lowerCasedGenre = genre;
	if (selectedGenres.has(lowerCasedGenre)) {
		selectedGenres.delete(lowerCasedGenre);
	} else {
		selectedGenres.add(lowerCasedGenre);
	}
	updateFilteredFilms();
}
function FilterMoviesByGenres(filteredbyCategory) {
	if (selectedGenres.size === 0) {
		return filteredbyCategory;
	}
	return filteredbyCategory.filter(movie => {
		const genresArray = movie.genres.split(',').map(genre => genre.trim().toLowerCase());
		return genresArray.some(genre => selectedGenres.has(genre));
	});
}
function FilterMoviesByCategories() {
	if (SelectedCategory === AllCategories[0]) {
		return sortedDesc;
	}
	return sortedDesc.filter(movie => { return movie.type_video === SelectedCategory; });
}
function updateFilteredFilms() {
	const filteredbyCategory = FilterMoviesByCategories();
	const filteredMovies = FilterMoviesByGenres(filteredbyCategory);
	let sortedAndFilteredMovies = applySorting(filteredMovies);
	updateFilmsList(sortedAndFilteredMovies, 0, sortedAndFilteredMovies.length, 0);
}

function arrangementGenres() {
	AllGenres.forEach((item, index) => {
		const li = document.createElement("li");
		li.classList.add("genres-list");

		const button = document.createElement("button");
		button.classList.add("option-element", "genres-element");
		button.innerHTML = `${item}`;

		button.addEventListener('click', () => {
			button.classList.toggle('option-active');
			handleGenreClick(item); 
		});

		li.appendChild(button);
		genresContainer.appendChild(li);
	});
}
function handleCategoriesClick(category) {
	SelectedCategory = category;
	updateFilteredFilms();
}
function arrangementCategories() {
	const categories = document.getElementById('categories_2');
	AllCategories.forEach((item, index) => {
		let li = document.createElement("li");
		let button = document.createElement("button");
		let p = document.createElement("p");
		button.classList.add("gradient-text", "style-button-categories");
		p.classList.add("p-limit", "style-dot");
		if (index === 0) {
			button.classList.add("visible");
			p.classList.add("visible");
		}
		p.innerHTML = `<i class="fa fa-circle" aria-hidden="true"></i>`;
		button.innerHTML = `<i class="fa fa-film" aria-hidden="true"></i>
						${AllCategoriesWithBigChar[index]}`;
		li.addEventListener('click', () => {
			document.querySelectorAll('.style-dot').forEach(dot => {
				dot.classList.remove('visible');
			});
			document.querySelectorAll('.gradient-text').forEach(grad => {
				grad.classList.remove('visible');
			});
			const dot = li.querySelector('.style-dot');
			dot.classList.add('visible');
			const grad = li.querySelector('.gradient-text');
			grad.classList.add('visible');
			handleCategoriesClick(item);
		});
		li.appendChild(button);
		li.appendChild(p);
		categories.appendChild(li);
	});
}
///////////////////////////////////////////////////

function applySorting(movies) {
	if (sortLastCountTimes === 0) {
		return movies.slice().sort((first, second) => second.id - first.id);
	}
	if (sortLastCountTimes === 1) {
		sortLastCountTimes = -1;
		return movies.slice().sort((first, second) => first.id - second.id);
	}
	if (sortYearCountTimes === 1) {
		return movies.slice().sort((first, second) => first.year - second.year);
	}
	if (sortYearCountTimes === 2) {
		return movies.slice().sort((first, second) => second.year - first.year);
	}
	if (sortYearCountTimes === 3) {
		sortYearCountTimes = -1;
	}
	if (sortCharCountTimes === 1) {
		return movies.slice().sort((first, second) => first.title.localeCompare(second.title, 'ru', { sensitivity: 'base' }));
	}
	if (sortCharCountTimes === 2) {
		return movies.slice().sort((first, second) => second.title.localeCompare(first.title, 'ru', { sensitivity: 'base' }));
	}
	if (sortCharCountTimes === 3) {
		sortCharCountTimes = -1;
	}
	if (sortSliderCountTimes > 0) {
		return movies.filter(item => Math.round(item.averagemark) == slider.value).sort((first, second) => Math.round(first.averagemark) - Math.round(second.averagemark));
	}
	return movies;
}
function sort(descriptions) {
	sortedDesc = descriptions.slice().sort((first, second) => first.id - second.id);
}

let sortedDesc = [];
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
			genres: movie.genres,
			year: movie.year
		}));
		arrangementGenres();
		arrangementCategories();
		sort(descriptions);
		updateFilmsGallery();
		updateFilteredFilms();
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
const AllSeries = document.getElementById('allSeries');
const prevButton = document.querySelectorAll('.arrow-transition')[0];
const nextButton = document.querySelectorAll('.arrow-transition')[1];
let imageWidth = 240;
function updateFilmsGallery() {
	gallary.innerHTML = '';
	for (let index = 0; index < descriptions.length; index++) {
		if (index + 1 > 11)
			break;
		const img = document.createElement('img');
		img.src = `films/film${index + 1}.jfif`;
		img.classList.add('image');
		img.alt = `img${index + 1}`;
		gallary.appendChild(img);
	}
}
let ArrayOfSort = [];
let interArray = [];
let allCountList = 39;
let StartCountList = 11;
function updateFilmsList(sortedList, start, amount, offset) {
	AllSeries.innerHTML = '';
	let mult = 1;
	for (let i = 1; i < sortedList.length; i++)
		if (i % 6 === 0)
			mult++;
	AllSeries.style.height = `${400 * mult}px`;
	for (let index = start; index < amount; index++) {
		const div1 = document.createElement('div');
		div1.classList.add('serie');
		const img = document.createElement('img');
		img.src = `films/film${sortedList[index - offset].id}.jfif`;
		img.classList.add('serie-position');
		img.alt = `img${index + 1}`;
		div1.appendChild(img);
		const div2 = document.createElement('div');
		div2.innerHTML = `<p class="style-text-info-description-name film-text">${sortedList[index - offset].title}</p>
					<div class="film-description style-text" style="font-size: 14px;">
						<span>${sortedList[index - offset].year}</span>
						<div style="display: flex;">
							<i class="fa fa-heart style-heart" aria-hidden="true"></i>
							<i class="fa fa-eye style-eye" aria-hidden="true"></i>
							<div class="style-mark">
								<i class="fa fa-star" aria-hidden="true" style="scale: 0.6;"></i>
								${sortedList[index - offset].averagemark}
							</div>
						</div>
					</div>`;
		div1.appendChild(div2);
		AllSeries.appendChild(div1);
	}
}
function resetOtherButtons(exceptButton, start, end) {
	const buttons = [sortLast, sortYear, sortChar];
	buttons.forEach(button => {
		if (button !== exceptButton) {
			button.classList.remove('option-active');
		}
	});
	switch (exceptButton) {
		case sortLast:
			sortYearCountTimes = 0;
			sortCharCountTimes = 0;
			break;
		case sortYear:
			sortLastCountTimes = -1;
			sortCharCountTimes = 0;
			break;
		case sortChar:
			sortLastCountTimes = -1;
			sortYearCountTimes = 0;
			break;
	}
	for (let index = start; index < end; index++) {
		ArrayOfSort[index - start] = sortedDesc[index];
	}
}
function checkSlider() {
	if (resetSlider.style.visibility === 'visible')
		return true;
}
const sortLast = document.getElementById('sort-last');
const sortYear = document.getElementById('sort-year');
const sortChar = document.getElementById('sort-char');

let sortLastCountTimes = -1;
let sortYearCountTimes = 0;
let sortCharCountTimes = 0;
let sortSliderCountTimes = 0;
sortLast.addEventListener('click', () => {
	if (checkSlider())
		return;
	resetOtherButtons(sortLast, 0, allCountList);
	interArray = [];
	sortLast.classList.toggle('option-active');
	sortLastCountTimes++;
	updateFilteredFilms();
});
sortYear.addEventListener('click', () => {
	if (checkSlider())
		return;
	resetOtherButtons(sortYear, 0, allCountList);
	switch (sortYearCountTimes) {
		case 0:
			sortYear.classList.toggle('option-active');
			break;
		case 2:
			sortYear.classList.toggle('option-active');
			break;
	}
	sortYearCountTimes++;
	updateFilteredFilms();
});
sortChar.addEventListener('click', () => {
	if (checkSlider())
		return;
	resetOtherButtons(sortChar, 0, allCountList);
	switch (sortCharCountTimes) {
		case 0:
			sortChar.classList.toggle('option-active');
			break;
		case 2:
			sortChar.classList.toggle('option-active');
			break;
	}
	sortCharCountTimes++;
	updateFilteredFilms();
});
function resetAllButtons(start, end) {
	const buttons = [sortLast, sortYear, sortChar];
	buttons.forEach(button => {
		button.classList.remove('option-active');
	});
	sortLastCountTimes = -1;
	sortYearCountTimes = 0;
	sortCharCountTimes = 0;
}
const slider = document.getElementById("slider_rating");
const resetSlider = document.getElementById("reset_Slider");
const output = document.getElementById("text-rating");
function updateSlider() {
	resetAllButtons(0, allCountList);
	resetSlider.style.visibility = 'visible';
	output.textContent = slider.value;
	sortSliderCountTimes++;
	updateFilteredFilms();
}
slider.addEventListener('input', updateSlider);
resetSlider.addEventListener('click', () => {
	resetSlider.style.visibility = 'hidden';
	output.textContent = 5;
	slider.value = 5;
	sortSliderCountTimes = 0;
	updateFilteredFilms();
});
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
		if (sortedDesc[index].id === currentIndex + 1) {
			const currentDescriptions = sortedDesc[index];
			titleElement.textContent = currentDescriptions.title;
			const strMark = currentDescriptions.averagemark + " " + currentDescriptions.type_video + ", " + currentDescriptions.genres + ", " + currentDescriptions.year;
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

