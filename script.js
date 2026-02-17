// Mood data
const moods = ['happy', 'sad', 'angry', 'tired', 'calm'];

// Load data from localStorage or initialize empty array
let moodEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];

// Initialize the app
function init() {
    displayTimeline();
    updateStats();
}

// Add new mood entry
function addMood(mood, color) {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have an entry for today
    const existingIndex = moodEntries.findIndex(entry => entry.date === today);
    
    if (existingIndex !== -1) {
        // Update existing entry
        moodEntries[existingIndex] = { date: today, mood, color };
    } else {
        // Add new entry
        moodEntries.push({ date: today, mood, color });
        
        // Keep only last 30 days
        if (moodEntries.length > 30) {
            moodEntries = moodEntries.slice(-30);
        }
    }
    
    // Sort by date
    moodEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Save to localStorage
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    
    // Update UI
    displayTimeline();
    updateStats();
    
    // Animation feedback
    alert('Mood logged for today! 🎉');
}

// Display timeline
function displayTimeline() {
    const timeline = document.getElementById('timeline');
    const last7Days = getLast7Days();
    
    timeline.innerHTML = '';
    
    last7Days.forEach(date => {
        const entry = moodEntries.find(e => e.date === date);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'timeline-day';
        
        const dot = document.createElement('div');
        dot.className = 'timeline-dot';
        dot.style.backgroundColor = entry ? entry.color : '#e0e0e0';
        
        // Add tooltip with mood info
        if (entry) {
            dot.title = `${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)} - ${formatDate(date)}`;
        } else {
            dot.title = `No mood logged - ${formatDate(date)}`;
        }
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'timeline-date';
        dateSpan.textContent = formatDateShort(date);
        
        dayDiv.appendChild(dot);
        dayDiv.appendChild(dateSpan);
        timeline.appendChild(dayDiv);
    });
}

// Get last 7 days in YYYY-MM-DD format
function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
}

// Format date for display
function formatDate(dateString) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format date short (MM/DD)
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

// Update statistics
function updateStats() {
    const counts = {
        happy: 0,
        sad: 0,
        angry: 0,
        tired: 0,
        calm: 0
    };
    
    // Count moods from last 7 days
    const last7Days = getLast7Days();
    moodEntries.forEach(entry => {
        if (last7Days.includes(entry.date)) {
            counts[entry.mood]++;
        }
    });
    
    // Update display and i don't know
    moods.forEach(mood => {
        document.getElementById(`${mood}-count`).textContent = counts[mood];
    });
}

// Reset all data
function resetData() {
    if (confirm('Are you sure you want to reset all mood data?')) {
        moodEntries = [];
        localStorage.removeItem('moodEntries');
        displayTimeline();
        updateStats();
    }
}

// Event listeners
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        const color = btn.dataset.color;
        addMood(mood, color);
    });
});

document.getElementById('resetBtn').addEventListener('click', resetData);

// Initialize app
init();