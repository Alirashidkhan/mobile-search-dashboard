const SHEET_ID = '10QOMI2RRqXcjjW1sscAC245EY84HMusJcmw-lNaji70';
const API_KEY = 'AIzaSyC_s8UWIJDLLfFyWk9-VfR2N4v6L4VH0Gs';
let allData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
});

async function loadData() {
    try {
          const range = 'Overall data!A:G';
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
          const response = await fetch(url);
          const data = await response.json();

      if (data.values) {
              const headers = data.values[0];
              allData = data.values.slice(1).map(row => ({
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
          console.error('Error:', error);
          document.getElementById('resultsContainer').innerHTML = '<p class="no-results">Error loading data</p>';
    }
}

function setupEventListeners() {
    ['nameSearch', 'companySearch', 'locationSearch', 'emailSearch', 'phoneSearch', 'categorySearch', 'industrySearch'].forEach(id => {
          document.getElementById(id).addEventListener('input', handleSearch);
    });
    document.getElementById('clearBtn').addEventListener('click', clearAllFilters);
}

function handleSearch() {
    const filters = {
          name: document.getElementById('nameSearch').value.toLowerCase(),
          company: document.getElementById('companySearch').value.toLowerCase(),
          location: document.getElementById('locationSearch').value.toLowerCase(),
          email: document.getElementById('emailSearch').value.toLowerCase(),
          phone: document.getElementById('phoneSearch').value.toLowerCase(),
          category: document.getElementById('categorySearch').value.toLowerCase(),
          industry: document.getElementById('industrySearch').value.toLowerCase()
    };

  const filtered = allData.filter(item =>
        item.name.toLowerCase().includes(filters.name) &&
        item.company.toLowerCase().includes(filters.company) &&
        item.location.toLowerCase().includes(filters.location) &&
        item.email.toLowerCase().includes(filters.email) &&
        item.phone.toLowerCase().includes(filters.phone) &&
        item.category.toLowerCase().includes(filters.category) &&
        item.industry.toLowerCase().includes(filters.industry)
                                    );
    displayResults(filtered);
}

function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    document.getElementById('resultCount').textContent = results.length;

  if (results.length === 0) {
        container.innerHTML = '<p class="no-results">No results found</p>';
        return;
  }

  container.innerHTML = results.map(item => `
      <div class="result-card">
            <div class="card-name">${escapeHtml(item.name)}</div>
                  <div class="card-company">${escapeHtml(item.company)}</div>
                        <div class="card-details">
                                <div class="card-detail">
                                          <span class="detail-label">📍 Location</span>
                                                    <span class="detail-value">${escapeHtml(item.location)}</span>
                                                            </div>
                                                                    <div class="card-detail">
                                                                              <span class="detail-label">📧 Email</span>
                                                                                        <span class="detail-value">${escapeHtml(item.email)}</span>
                                                                                                </div>
                                                                                                        <div class="card-detail">
                                                                                                                  <span class="detail-label">📱 Phone</span>
                                                                                                                            <span class="detail-value">${escapeHtml(item.phone)}</span>
                                                                                                                                    </div>
                                                                                                                                            <div class="card-detail">
                                                                                                                                                      <span class="detail-label">🏭 Category</span>
                                                                                                                                                                <span class="detail-value">${escapeHtml(item.category)}</span>
                                                                                                                                                                        </div>
                                                                                                                                                                                <div class="card-detail">
                                                                                                                                                                                          <span class="detail-label">🏢 Industry</span>
                                                                                                                                                                                                    <span class="detail-value">${escapeHtml(item.industry)}</span>
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                        `).join('');
}

function clearAllFilters() {
    ['nameSearch', 'companySearch', 'locationSearch', 'emailSearch', 'phoneSearch', 'categorySearch', 'industrySearch'].forEach(id => {
          document.getElementById(id).value = '';
    });
    displayResults(allData);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
