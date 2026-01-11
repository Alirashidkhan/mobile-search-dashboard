const SHEET_ID = '10QOMI2RRqXcjjW1sscAC245EY84HMusJcmw-lNaji70';
const API_KEY = 'AIzaSyC_s8UWIJDLLfFyWk9-VfR2N4v6L4VH0Gs';
const RANGE = 'Overall data!A2:G1000';

let allData = [];

// Fetch data from Google Sheets
async function fetchData() {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;

    try {
                const response = await fetch(url);
                const data = await response.json();

            if (data.values) {
                            allData = data.values.map(row => ({
                                                name: row[0] || '',
                                                company: row[1] || '',
                                                location: row[2] || '',
                                                email: row[3] || '',
                                                phone: row[4] || '',
                                                category: row[5] || '',
                                                industry: row[6] || ''
                            }));

                    displayResults(allData);
            }
    } catch (error) {
                console.error('Error fetching data:', error);
                document.getElementById('resultsContainer').innerHTML = '<div class="empty-state"><p>Error loading data. Please try again.</p></div>';
    }
}

// Filter and search function
function filterData() {
        const nameSearch = document.getElementById('nameSearch').value.toLowerCase();
        const companySearch = document.getElementById('companySearch').value.toLowerCase();
        const locationSearch = document.getElementById('locationSearch').value.toLowerCase();
        const emailSearch = document.getElementById('emailSearch').value.toLowerCase();
        const phoneSearch = document.getElementById('phoneSearch').value.toLowerCase();
        const categorySearch = document.getElementById('categorySearch').value.toLowerCase();
        const industrySearch = document.getElementById('industrySearch').value.toLowerCase();

    const filtered = allData.filter(item => {
                return (
                                item.name.toLowerCase().includes(nameSearch) &&
                                item.company.toLowerCase().includes(companySearch) &&
                                item.location.toLowerCase().includes(locationSearch) &&
                                item.email.toLowerCase().includes(emailSearch) &&
                                item.phone.toLowerCase().includes(phoneSearch) &&
                                item.category.toLowerCase().includes(categorySearch) &&
                                item.industry.toLowerCase().includes(industrySearch)
                            );
    });

    displayResults(filtered);
}

// Display results as cards
function displayResults(results) {
        const container = document.getElementById('resultsContainer');
        const countEl = document.getElementById('resultCount');

    countEl.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;

    if (results.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No results found. Try adjusting your search filters.</p></div>';
                return;
    }

    container.innerHTML = results.map(item => `
            <div class="result-card">
                        <h3>${escapeHtml(item.name)}</h3>
                                    <p><strong>Company:</strong> ${escapeHtml(item.company)}</p>
                                                <p><strong>Location:</strong> ${escapeHtml(item.location)}</p>
                                                            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a></p>
                                                                        <p><strong>Phone:</strong> ${escapeHtml(item.phone)}</p>
                                                                                    <p><strong>Category:</strong> ${escapeHtml(item.category)}</p>
                                                                                                <p><strong>Industry:</strong> ${escapeHtml(item.industry)}</p>
                                                                                                        </div>
                                                                                                            `).join('');
}

// HTML escape function for security
function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
}

// Clear all filters
document.getElementById('clearBtn').addEventListener('click', function() {
        document.getElementById('nameSearch').value = '';
        document.getElementById('companySearch').value = '';
        document.getElementById('locationSearch').value = '';
        document.getElementById('emailSearch').value = '';
        document.getElementById('phoneSearch').value = '';
        document.getElementById('categorySearch').value = '';
        document.getElementById('industrySearch').value = '';
        displayResults(allData);
});

// Add event listeners to all search inputs
['nameSearch', 'companySearch', 'locationSearch', 'emailSearch', 'phoneSearch', 'categorySearch', 'industrySearch'].forEach(id => {
        document.getElementById(id).addEventListener('input', filterData);
});

// Fetch data on page load
document.addEventListener('DOMContentLoaded', fetchData);
