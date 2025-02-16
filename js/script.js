const input = document.getElementById('input');
const autoList = document.getElementById('auto-list');
const repList = document.getElementById('rep-list');
const selectedRepos = [];

//дебаунс
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// репозитории
async function fetchRepos(query) {
    if (!query) return [];
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
    const data = await response.json();
    return data.items || [];
}

// автокомплит
function showAuto(repos) {
    autoList.innerHTML = '';
    repos.forEach(repo => {
        const item = document.createElement('div');
        item.className = 'auto-list-item';
        item.textContent = repo.name;
        item.onclick = () => selectRepo(repo);
        autoList.appendChild(item);
    });
}

// выбор репозитория
function selectRepo(repo) {
    selectedRepos.push(repo);
    updateRepoList();
    input.value = '';
    autoList.innerHTML = '';
}

// обновление списка
function updateRepoList() {
    repList.innerHTML = '';
    selectedRepos.forEach((repo, index) => {
        const item = document.createElement('div');
        item.className = 'repo-item';
        item.innerHTML = `
            <div class="repo-details">
                <span class="repo-name">Name: ${repo.name}</span>
                <span class="repo-owner">Owner: ${repo.owner.login}</span>
                <span class="repo-stars">Stars: ${repo.stargazers_count}</span>
                
            </div>
           <div>
    <span class="remove-btn" onclick="removeRepo(${index})">
        <svg width="48" height="48" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path class="svg-icon" fill-rule="evenodd" clip-rule="evenodd" d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z"></path>
        </svg>
    </span>
</div>
        `;
        repList.appendChild(item);
    });
}

// удаление
function removeRepo(index) {
    selectedRepos.splice(index, 1);
    updateRepoList();
}

// обработчик ввода
input.addEventListener('input', debounce(async () => {
    const repos = await fetchRepos(input.value);
    showAuto(repos);
},0));