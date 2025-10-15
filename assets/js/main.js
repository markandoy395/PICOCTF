const challenges = [
            { id: 1, category: 'Forensics', name: 'Verify', description: 'People keep trying to trick my players with imitation flags. I want to make sure they get the real deal!', difficulty: 'easy', points: 100, solves: 234, hint: 'Check the file signature and metadata', file: 'verify.zip', solved: false },
            { id: 2, category: 'Forensics', name: 'Scan Surprise', description: 'I scanned a document, but something seems off. Can you find what is hidden?', difficulty: 'easy', points: 150, solves: 189, hint: 'Look for steganography techniques', file: 'scan.pdf', solved: false },
            { id: 3, category: 'Forensics', name: 'Binary Search', description: 'Use increasing/decreasing messages to guide your binary search for the flag.', difficulty: 'medium', points: 250, solves: 145, hint: 'Use binary search algorithm efficiently', file: 'search.py', solved: false },
            { id: 4, category: 'Cryptography', name: 'Hidden Message', description: 'A mysterious message was intercepted. Decode it using common cryptographic techniques.', difficulty: 'hard', points: 100, solves: 234, hint: 'Try analyzing character frequency and patterns', file: 'Secret.txt', solved: false },
            { id: 5, category: 'Web', name: 'SQL Injection Basic', description: 'Can you bypass the login page using SQL injection?', difficulty: 'easy', points: 150, solves: 312, hint: 'Try common SQL injection payloads', file: null, solved: false },
            { id: 6, category: 'Crypto', name: 'Caesar Cipher', description: 'The message has been encrypted with a simple Caesar cipher.', difficulty: 'easy', points: 100, solves: 421, hint: 'Try shifting by different amounts', file: 'message.txt', solved: false },
            { id: 7, category: 'Web', name: 'XSS Challenge', description: 'Find and exploit the XSS vulnerability to steal the admin cookie.', difficulty: 'medium', points: 300, solves: 98, hint: 'Check input fields for XSS vulnerabilities', file: null, solved: false },
            { id: 8, category: 'Reverse', name: 'Assembly Required', description: 'Reverse engineer this binary to find the hidden flag.', difficulty: 'hard', points: 500, solves: 45, hint: 'Use a disassembler like Ghidra or IDA', file: 'binary.exe', solved: false }
        ];

        let currentPage = 1;
        let filteredChallenges = [...challenges];
        const itemsPerPage = 8;

        function renderChallenges() {
            const grid = document.getElementById('challengeGrid');
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageChallenges = filteredChallenges.slice(start, end);

            grid.innerHTML = pageChallenges.map(challenge => `
                <div class="challenge-card" onclick="openChallenge(${challenge.id})">
                    <div class="challenge-card-header">
                        <div class="challenge-category">${challenge.category}</div>
                        <div class="difficulty-badge ${challenge.difficulty}">${challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}</div>
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
        }

        function submitFlag() {
            const flagInput = document.getElementById('flagInput').value.trim();

            if (!flagInput) {
                alert('Please enter a flag!');
                return;
            }

            // Simulate flag validation
            if (flagInput.startsWith('FLAG{') && flagInput.endsWith('}')) {
                alert('🎉 Correct! Challenge solved!');
                closeModal();
                // Update challenge as solved
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
            const showBookmarked = document.getElementById('showBookmarked').checked;
            const showAssigned = document.getElementById('showAssigned').checked;

            filteredChallenges = challenges.filter(c => {
                if (hideSolved && c.solved) return false;
                // Add more filter logic here for bookmarked and assigned
                return true;
            });

            currentPage = 1;
            renderChallenges();
        }

        function filterByCategory() {
            const category = document.getElementById('categorySelect').value;

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

        // Initialize
        renderChallenges();
        updateProgress();