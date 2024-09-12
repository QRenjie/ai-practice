const apiKey = 'fe8c607bfec94a2884573254241209';
const weatherInfo = document.getElementById('current-weather');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const historyList = document.getElementById('history-list');
const locationBtn = document.getElementById('location-btn');

let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

searchBtn.addEventListener('click', () => getWeather(cityInput.value));
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather(cityInput.value);
    }
});
locationBtn.addEventListener('click', getLocationWeather);

function updateHistoryList() {
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => getWeather(city));
        historyList.appendChild(li);
    });
}

function addToHistory(city) {
    if (!city || typeof city !== 'string' || city.includes(',') || /^\d+(\.\d+)?$/.test(city)) {
        console.log('Invalid city name, not adding to history:', city);
        return;
    }

    const formattedCity = city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== formattedCity.toLowerCase());
    searchHistory.unshift(formattedCity);
    
    if (searchHistory.length > 5) {
        searchHistory.pop();
    }
    
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    updateHistoryList();
}

function updateStatusMessage(message) {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
        statusMessage.textContent = message;
    } else {
        console.log(message); // 如果状态消息元素不存在，则在控制台输出
    }
}

async function getWeather(query) {
    if (!query) {
        updateStatusMessage('请输入城市名称');
        return;
    }

    updateStatusMessage('正在获取天气数据...');

    // 对于中国城市，我们可以尝试添加 "中国" 来提高准确性
    const searchQuery = query.toLowerCase().includes('beijing') || query.includes('北京') 
        ? 'Beijing,China' 
        : query;

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&days=5&lang=zh`);
        const data = await response.json();

        if (response.ok) {
            if (data.error) {
                updateStatusMessage(`错误: ${data.error.message}`);
            } else {
                displayWeather(data);
                const cityName = data.location.name || data.location.region || data.location.country;
                if (cityName && typeof cityName === 'string') {
                    addToHistory(cityName);
                }
                updateStatusMessage('');
            }
        } else {
            updateStatusMessage(`HTTP错误: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('获取天气数据时出错:', error);
        updateStatusMessage(`获取天气数据时出错: ${error.message}`);
    }
}

function displayWeather(data) {
    const currentWeather = document.getElementById('current-weather');
    const dailyForecast = document.getElementById('daily-forecast');
    
    const iconBaseUrl = 'https:';
    
    currentWeather.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <img src="${iconBaseUrl}${data.current.condition.icon}" alt="天气图标" class="weather-icon">
        <div class="current-temp">${data.current.temp_c}°C</div>
        <div class="current-condition">${data.current.condition.text}</div>
        <div class="details">
            <p><i class="fas fa-thermometer-half"></i> 体感温度: ${data.current.feelslike_c}°C</p>
            <p><i class="fas fa-tint"></i> 湿度: ${data.current.humidity}%</p>
            <p><i class="fas fa-wind"></i> 风速: ${data.current.wind_kph} km/h</p>
        </div>
    `;

    dailyForecast.innerHTML = '<h2>5天预报</h2>';
    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        dailyForecast.innerHTML += `
            <div class="forecast-item">
                <span>${date.toLocaleDateString('zh-CN', { weekday: 'short' })}</span>
                <img src="${iconBaseUrl}${day.day.condition.icon}" alt="天气图标" class="forecast-icon">
                <span>${day.day.avgtemp_c}°C</span>
                <span>${day.day.condition.text}</span>
            </div>
        `;
    });

    // 更新背景
    updateBackground(data.current.condition.text.toLowerCase(), data.current.is_day);
}

function getLocationWeather() {
    updateStatusMessage('正在获取您的位置，请稍候...');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                updateStatusMessage('位置获取成功，正在查询天气...');
                getWeather(`${latitude},${longitude}`);
            },
            error => {
                console.error('获取位置信息失败:', error);
                updateStatusMessage('无法获取您的位置。请手动输入城市名称。');
            },
            { timeout: 10000 }
        );
    } else {
        updateStatusMessage('您的浏览器不支持地理定位，请手动输入城市。');
    }
}

function cleanSearchHistory() {
    let storedHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    storedHistory = storedHistory.filter(city => 
        typeof city === 'string' && 
        !city.includes(',') && 
        !/^\d+(\.\d+)?$/.test(city)
    );
    searchHistory = storedHistory;
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    updateHistoryList();
}

function initWeatherApp() {
    cleanSearchHistory();
    updateStatusMessage('正在尝试获取您的位置，请稍候...');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeather(`${latitude},${longitude}`);
            },
            error => {
                console.error('获取位置信息失败:', error);
                updateStatusMessage('无法获取您的位置。您可以手动输入城市名称来查询天气。');
            },
            { timeout: 10000 }
        );
    } else {
        updateStatusMessage('您的浏览器不支持地理定位。请手动输入城市名称来查询天气。');
    }
}

document.addEventListener('DOMContentLoaded', initWeatherApp);

// 添加清除历史按钮的功能
document.getElementById('clear-history-btn').addEventListener('click', () => {
    searchHistory = [];
    localStorage.removeItem('weatherSearchHistory');
    updateHistoryList();
    alert('搜索历史已清除');
});

const weatherBackgrounds = {
    sunny: 'https://images.unsplash.com/photo-1622278647429-71bc97e904e8?auto=format&fit=crop&w=1920&q=80',
    cloudy: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80',
    rainy: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920&q=80',
    snowy: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&w=1920&q=80',
    night: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=1920&q=80',
    default: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920&q=80'
};

function updateBackground(weatherCondition, isDay) {
    const body = document.body;
    let backgroundImage = weatherBackgrounds.default;

    if (!isDay) {
        backgroundImage = weatherBackgrounds.night;
    } else if (weatherCondition.includes('sunny') || weatherCondition.includes('clear')) {
        backgroundImage = weatherBackgrounds.sunny;
    } else if (weatherCondition.includes('cloud')) {
        backgroundImage = weatherBackgrounds.cloudy;
    } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
        backgroundImage = weatherBackgrounds.rainy;
    } else if (weatherCondition.includes('snow')) {
        backgroundImage = weatherBackgrounds.snowy;
    }

    body.style.backgroundImage = `url('${backgroundImage}')`;
}

// 在 displayWeather 函数中调用 updateBackground
function displayWeather(data) {
    const currentWeather = document.getElementById('current-weather');
    const dailyForecast = document.getElementById('daily-forecast');
    
    const iconBaseUrl = 'https:';
    
    currentWeather.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <img src="${iconBaseUrl}${data.current.condition.icon}" alt="天气图标" class="weather-icon">
        <div class="current-temp">${data.current.temp_c}°C</div>
        <div class="current-condition">${data.current.condition.text}</div>
        <div class="details">
            <p><i class="fas fa-thermometer-half"></i> 体感温度: ${data.current.feelslike_c}°C</p>
            <p><i class="fas fa-tint"></i> 湿度: ${data.current.humidity}%</p>
            <p><i class="fas fa-wind"></i> 风速: ${data.current.wind_kph} km/h</p>
        </div>
    `;

    dailyForecast.innerHTML = '<h2>5天预报</h2>';
    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        dailyForecast.innerHTML += `
            <div class="forecast-item">
                <span>${date.toLocaleDateString('zh-CN', { weekday: 'short' })}</span>
                <img src="${iconBaseUrl}${day.day.condition.icon}" alt="天气图标" class="forecast-icon">
                <span>${day.day.avgtemp_c}°C</span>
                <span>${day.day.condition.text}</span>
            </div>
        `;
    });

    // 更新背景
    updateBackground(data.current.condition.text.toLowerCase(), data.current.is_day);
}

// 预加载图片以提高性能
function preloadImages() {
    Object.values(weatherBackgrounds).forEach((imageUrl) => {
        new Image().src = imageUrl;
    });
}

// 在页面加载时预加载图片
window.addEventListener('load', preloadImages);
