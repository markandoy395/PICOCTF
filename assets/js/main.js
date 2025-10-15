// main.js (type="module")
import { challenges } from '../../data/challenge.js';

let currentPage = 1;
let filteredChallenges = [...challenges];
const itemsPerPage = 8;

function renderChallenges() {
  const grid = document.getElementById('challengeGrid');
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageChallenges = filteredChallenges.slice(start, end);
grid.innerHTML = pageChallenges.map(challenge => `
    <div class="challenge-card ${challenge.solved ? 'solved' : ''}" onclick="openChallenge(${challenge.id})">

      <div class="challenge-card-header">
        <div class="challenge-category">${challenge.category}</div>
        <div class="difficulty-badge ${challenge.difficulty}">
          ${challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
        </div>
      </div>
      <div class="challenge-name">${challenge.name}</div>
      <div class="challenge-footer">
        <div class="challenge-points">${challenge.points} points</div>
        <div class="challenge-solves">${challenge.solves} solves</div>
      </div>
    </div>
  `).join('');

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage);
  const pagination = document.getElementById('pagination');

  let html = `
    <button class="page-btn" onclick="goToPage(1)" ${currentPage === 1 ? 'disabled' : ''}>«</button>
    <button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>
  `;

  for (let i = 1; i <= Math.min(3, totalPages); i++) {
    html += `<button class="page-btn ${currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  if (totalPages > 5) {
    html += `<button class="page-btn dots">...</button>`;
    html += `<button class="page-btn ${currentPage === totalPages ? 'active' : ''}" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }

  html += `
    <button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>
    <button class="page-btn" onclick="goToPage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>»</button>
  `;

  pagination.innerHTML = html;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderChallenges();
  }
}

function openChallenge(id) {
  const challenge = challenges.find(c => c.id === id);
  if (!challenge) return;
  document.getElementById('modalTitle').textContent = challenge.name; // ✅ Add this
  document.body.classList.add('no-scroll');
  document.getElementById('modalDescription').textContent = challenge.description;
  document.getElementById('modalHint').textContent = challenge.hint;

  if (challenge.file) {
    document.getElementById('modalFile').textContent = challenge.file;
    document.getElementById('modalFile').href = '#';
  } else {
    document.getElementById('modalFile').parentElement.parentElement.style.display = 'none';
  }

  document.getElementById('flagInput').value = '';
  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
    document.body.classList.remove('no-scroll');

}

function submitFlag() {
  const flagInput = document.getElementById('flagInput').value.trim();

  if (!flagInput) {
    alert('Please enter a flag!');
    return;
  }

  if (flagInput.startsWith('FLAG{') && flagInput.endsWith('}')) {
Swal.fire({
  iconHtml: '<i class="fa-solid fa-trophy" style="color:gold;"></i>',
  title: 'Correct!',
  text: 'Challenge solved!',
  confirmButtonText: 'OK',
  customClass: {
    icon: 'no-border'
  }
});    closeModal();
    const modalTitle = document.getElementById('modalTitle').textContent;
    const challenge = challenges.find(c => c.name === modalTitle);
    if (challenge) {
      challenge.solved = true;
      updateProgress();
      renderChallenges();
    }
  } else {
    alert('❌ Incorrect flag. Try again!');
  }
}

function updateProgress() {
  const stats = {
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 }
  };

  challenges.forEach(c => {
    stats[c.difficulty].total++;
    if (c.solved) stats[c.difficulty].solved++;
  });

  let totalScore = 0;
  challenges.forEach(c => {
    if (c.solved) totalScore += c.points;
  });

  document.getElementById('easySolved').textContent = stats.easy.solved;
  document.getElementById('mediumSolved').textContent = stats.medium.solved;
  document.getElementById('hardSolved').textContent = stats.hard.solved;

  document.getElementById('easyBar').style.width = `${(stats.easy.solved / stats.easy.total) * 100}%`;
  document.getElementById('mediumBar').style.width = `${(stats.medium.solved / stats.medium.total) * 100}%`;
  document.getElementById('hardBar').style.width = `${(stats.hard.solved / stats.hard.total) * 100}%`;

  document.getElementById('totalScore').textContent = totalScore;
}

function applyFilters() {
  const hideSolved = document.getElementById('hideSolved').checked;
  const category = document.getElementById('categorySelect').value;

  filteredChallenges = challenges.filter(c => {
    // Filter by category
    const categoryMatch =
      category === 'overall' ||
      c.category.toLowerCase().includes(category.toLowerCase());

    // Filter by solved status
    const solvedMatch = !hideSolved || !c.solved;

    return categoryMatch && solvedMatch;
  });

  currentPage = 1;
  renderChallenges();
}


function filterByCategory() {
  const category = document.getElementById('categorySelect').value;
  applyFilters(); // <-- Just call the unified filter

  if (category === 'overall') {
    filteredChallenges = [...challenges];
  } else {
    filteredChallenges = challenges.filter(c =>
      c.category.toLowerCase().includes(category)
    );
  }

  currentPage = 1;
  renderChallenges();
}

// ⬇️ Expose to global scope for HTML event handlers
window.openChallenge = openChallenge;
window.goToPage = goToPage;

// Event Listeners
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target.id === 'modalOverlay') closeModal();
});
document.getElementById('submitFlag').addEventListener('click', submitFlag);
document.getElementById('flagInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') submitFlag();
});
document.getElementById('hideSolved').addEventListener('change', applyFilters);
document.getElementById('showBookmarked').addEventListener('change', applyFilters);
document.getElementById('showAssigned').addEventListener('change', applyFilters);
document.getElementById('categorySelect').addEventListener('change', filterByCategory);
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Initialize
renderChallenges();
updateProgress();
