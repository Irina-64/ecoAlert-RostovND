const map = L.map('map').setView([47.2313, 39.7233], 11); // Ростов-на-Дону

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '© OpenStreetMap',
}).addTo(map);

let allMarkers = [];
// Загрузка данных
fetch('data.json')
	.then(res => res.json())
	.then(points => {
		renderMarkers(points);
	})
	.catch(err => console.error('Ошибка загрузки данных:', err));

// Форма добавления
document.getElementById('report-form').addEventListener('submit', function (e) {
	e.preventDefault();
	const type = document.getElementById('type').value;
	const description = document.getElementById('description').value;
	const lat = parseFloat(document.getElementById('lat').value);
	const lng = parseFloat(document.getElementById('lng').value);

	if (type && description && !isNaN(lat) && !isNaN(lng)) {
		const marker = L.marker([lat, lng])
			.addTo(map)
			.bindPopup(`<b>${type}</b><br>${description}`);
		allMarkers.push({ marker, type });

		document.getElementById('report-form').reset();
	}
});

// Рендер маркеров
function renderMarkers(points) {
	points.forEach(point => {
		const marker = L.marker([point.lat, point.lng])
			.addTo(map)
			.bindPopup(`<b>${point.type}</b><br>${point.description}`);
		allMarkers.push({ marker, type: point.type });
	});
}

// Фильтрация
document.getElementById('filter').addEventListener('change', function () {
	const selected = this.value;
	allMarkers.forEach(({ marker, type }) => {
		if (selected === 'Все' || selected === type) {
			marker.addTo(map);
		} else {
			map.removeLayer(marker);
		}
	});
});
