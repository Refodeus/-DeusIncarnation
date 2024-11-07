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
setupClickEventsCategories('.categories_2 li', 'visible');