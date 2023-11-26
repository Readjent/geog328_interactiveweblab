mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 7, // starting zoom
        center: [-121, 47.25] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/wa-covid-data-102521.geojson');
    let countyData = await response.json();
    map.on('load', function loadingData() {
        map.addSource('countyData', {
            type: 'geojson',
            data: countyData
        });
        
        map.addLayer({
            'id': 'countyData-layer',
            'type': 'fill',
            'source': 'countyData',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'fullyVaxPer10k'],
                    '#A0EDFF',   // stop_output_0
                    3000,          // stop_input_0
                    '#76D9FE',   // stop_output_1
                    4000,          // stop_input_1
                    '#4CB2FE',   // stop_output_2
                    5000,          // stop_input_2
                    '#3C8DFD',   // stop_output_3
                    6000,         // stop_input_3
                    '#2A4EFC',   // stop_output_4
                    7000,         // stop_input_4
                    '#1C1AE3',   // stop_output_5
                    8000,         // stop_input_5
                    '#2600BD',   // stop_output_6
                    9000,        // stop_input_6
                    "#260080"    // stop_output_7
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });

        const layers = [
            '0-2999',
            '3000-3999',
            '4000-4999',
            '5000-5999',
            '6000-6999',
            '7000-7999',
            '8000-8999',
            '9000-9999'
        ];
        const colors = [
            '#A0EDFF70',
            '#76D9FE70',
            '#4CB2FE70',
            '#3C8DFD70',
            '#2A4EFC70',
            '#1C1AE370',
            '#2600BD70',
            '#26008070'
        ];

        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Vaccinations per 10K People<br>(people/sq.mi.)</b><br><br>";

        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });

        map.on('mousemove', ({point}) => {
            const county = map.queryRenderedFeatures(point, {
                layers: ['countyData-layer']
            });
            document.getElementById('text-description').innerHTML = county.length ?
                `<h3>${county[0].properties.name}</h3><p><strong><em>${county[0].properties.fullyVaxPer10k}</strong> vaccinations per 10K people</em></p>` :
                `<p>Hover over a county!</p>`;
        });

        
    });
}

geojsonFetch();