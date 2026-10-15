// --- DATA STATE ---
let articlesData = [];
let savedArticleIds = JSON.parse(localStorage.getItem('tickr_saved') ?? localStorage.getItem('finpulse_saved')) || [];
let activeCategory = 'ALL';
let currentModalArticle = null;
let marketChartInstance = null;

// Ticker Items Initial Configuration
let marketTickers = [
    { symbol: 'S&P 500', price: 5117.09, change: +0.65, type: 'index' },
    { symbol: 'NASDAQ', price: 16273.38, change: +0.92, type: 'index' },
    { symbol: 'BTC/USD', price: 67450.00, change: +2.84, type: 'crypto' },
    { symbol: 'ETH/USD', price: 3580.20, change: -0.45, type: 'crypto' },
    { symbol: 'GOLD (oz)', price: 2155.40, change: +0.18, type: 'commodity' },
    { symbol: 'USD/IDR', price: 15850.00, change: -0.12, type: 'forex' },
    { symbol: 'TSLA', price: 175.34, change: +1.85, type: 'stock' },
    { symbol: 'NVDA', price: 875.28, change: +3.12, type: 'stock' }
];

// Realistic Finance Mock Dataset
const fallbackNews = [
    {
        id: 'news-1',
        title: 'Federal Reserve Signals Potential Interest Rate Cut as Inflation Moderates',
        category: 'Macroeconomy',
        source: 'Financial Times',
        timeAgo: '12m ago',
        readTime: '4 min read',
        sentiment: 'BULLISH',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
        summary: 'Federal Reserve officials hinted at a dovish shift in upcoming monetary policy meetings, citing steady declines in core inflation metrics. Equity markets responded positively across major indices.',
        takeaway: 'Rate cuts generally reduce borrowing costs, providing tailwinds for technology growth stocks and mortgage markets.',
        url: 'https://ft.com'
    },
    {
        id: 'news-2',
        title: 'Bitcoin Surges Past Key Resistance Level Following ETF Inflow Surge',
        category: 'Crypto',
        source: 'Bloomberg',
        timeAgo: '35m ago',
        readTime: '3 min read',
        sentiment: 'BULLISH',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        summary: 'Institutional capital inflows into spot Bitcoin ETFs hit a record daily high of $680 million. Analysts attribute the momentum to increased sovereign fund allocations and retail participation.',
        takeaway: 'Sustained institutional buying offers higher price floors for major digital assets.',
        url: 'https://bloomberg.com'
    },
    {
        id: 'news-3',
        title: 'Semiconductor Giant Exceeds Q3 Earnings Estimates Driven by AI Demand',
        category: 'Stocks',
        source: 'CNBC',
        timeAgo: '1h ago',
        readTime: '5 min read',
        sentiment: 'BULLISH',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        summary: 'Chipmakers reported a 42% year-over-year revenue growth in data center hardware. Strong demand for generative AI training chips continues to outpace global manufacturing supply.',
        takeaway: 'Enterprise AI infrastructure spending remains robust despite broader macro uncertainties.',
        url: 'https://cnbc.com'
    },
    {
        id: 'news-4',
        title: 'Global Oil Prices Dip Amid Rising Supply Inventory Reports',
        category: 'Macroeconomy',
        source: 'Reuters',
        timeAgo: '2h ago',
        readTime: '3 min read',
        sentiment: 'BEARISH',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        summary: 'Crude oil benchmark futures dropped 2.1% after US crude inventories expanded unexpectedly by 4.2 million barrels, easing immediate supply shortage worries.',
        takeaway: 'Lower energy costs may help curb global headline CPI inflation in coming quarters.',
        url: 'https://reuters.com'
    },
    {
        id: 'news-5',
        title: 'High-Yield Savings Accounts Offer 5%+ APY: How to Maximize Liquidity',
        category: 'Personal Finance',
        source: 'Wall Street Journal',
        timeAgo: '3h ago',
        readTime: '6 min read',
        sentiment: 'NEUTRAL',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
        summary: 'With interest rates remaining elevated, financial advisors recommend laddering certificates of deposit (CDs) and utilizing high-yield cash accounts for emergency funds.',
        takeaway: 'Guaranteed cash yields allow risk-averse investors to outpace baseline inflation rates without equity risk.',
        url: 'https://wsj.com'
    },
    {
        id: 'news-6',
        title: 'Regulatory Scrutiny Increases for Decentralized Finance Protocols',
        category: 'Crypto',
        source: 'CoinDesk',
        timeAgo: '4h ago',
        readTime: '4 min read',
        sentiment: 'BEARISH',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
        summary: 'Financial regulators issued new compliance guidelines targeting automated market makers and cross-chain liquidity bridges to enforce anti-money laundering controls.',
        takeaway: 'Compliance friction could temporarily compress DeFi trading volumes.',
        url: 'https://coindesk.com'
    },
    {
        id: 'news-7', title: 'Tech Heavyweights Lead Wall Street Higher as Earnings Season Opens',
        category: 'Stocks', source: 'Reuters', timeAgo: '5h ago', readTime: '4 min read', sentiment: 'BULLISH',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
        summary: 'Large-cap technology shares pushed major indices to fresh highs as early earnings reports beat analyst expectations on cloud and AI revenue.',
        takeaway: 'Earnings momentum in mega-cap tech continues to drive index-level gains.',
        url: 'https://reuters.com'
    },
    {
        id: 'news-8', title: 'Index Funds vs. Active ETFs: What Long-Term Investors Should Weigh',
        category: 'Personal Finance', source: 'Morningstar', timeAgo: '6h ago', readTime: '7 min read', sentiment: 'NEUTRAL',
        image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80',
        summary: 'Fee levels, tax efficiency and tracking error remain the key trade-offs when choosing between passive index funds and actively managed ETFs.',
        takeaway: 'Low costs and diversification still matter more than short-term outperformance.',
        url: 'https://morningstar.com'
    },
    {
        id: 'news-9', title: 'Rupiah Steadies as Bank Indonesia Holds Benchmark Rate',
        category: 'Macroeconomy', source: 'Bloomberg', timeAgo: '7h ago', readTime: '3 min read', sentiment: 'NEUTRAL',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
        summary: 'Bank Indonesia kept its policy rate unchanged, saying currency stability remains a priority amid global rate uncertainty.',
        takeaway: 'A stable rupiah supports import costs and foreign portfolio flows.',
        url: 'https://bloomberg.com'
    }
];

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#1e293b"/><text x="300" y="210" font-family="sans-serif" font-size="32" fill="#22c55e" text-anchor="middle">Tickr</text></svg>');
function imgFallback(img) { img.onerror = null; img.src = FALLBACK_IMG; }

const categories = ['ALL', 'Stocks', 'Crypto', 'Macroeconomy', 'Personal Finance'];

window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initTheme();
    renderTicker();
    renderCategories();
    initChart();
    applyChartTheme();
    updateChartTimeframe('1D', document.querySelector('.chart-tf-btn'));
    initConverter();
    fillFxSelects();
    calculateFx();
    loadFxRates();
    setInterval(loadFxRates, 3600000);
    renderMovers();
    initUX();
    fetchNewsData();

    // Search Listeners with Debounce
    document.getElementById('searchInput').addEventListener('input', debounce(filterNews, 300));
    document.getElementById('mobileSearchInput').addEventListener('input', debounce(filterNews, 300));

    // Interval to simulate live market price changes in ticker
    setInterval(simulateLiveTicker, 4000);
});

// Theme Setup
function initTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
    applyChartTheme();
}

// --- TICKER BANNER LOGIC ---
function renderTicker() {
    const tickerContainer = document.getElementById('tickerContent');
    // Duplicate array for seamless infinite looping
    const items = [...marketTickers, ...marketTickers];

    tickerContainer.innerHTML = items.map(item => {
        const isPositive = item.change >= 0;
        const colorClass = isPositive ? 'text-emerald-400' : 'text-rose-400';
        const icon = isPositive ? '▲' : '▼';

        return `
            <div class="inline-flex items-center space-x-2 font-mono">
                <span class="font-bold text-slate-300">${item.symbol}</span>
                <span class="text-slate-100">${formatNumber(item.price)}</span>
                <span class="${colorClass} text-[11px] font-semibold">${icon} ${Math.abs(item.change)}%</span>
            </div>
        `;
    }).join('');
}

function simulateLiveTicker() {
    marketTickers.forEach(t => {
        const delta = (Math.random() - 0.49) * 0.4;
        t.change = parseFloat((t.change + delta).toFixed(2));
        t.price = parseFloat((t.price * (1 + delta / 100)).toFixed(2));
    });
    renderTicker();
    renderMovers();
    calculateConversion();
}

function fetchNewsData(forceRefresh = false) {
    renderSkeletons();

    // Simulating realistic API network fetch with fallback
    setTimeout(() => {
        articlesData = fallbackNews;
        filterNews();
        if (forceRefresh) {
            showToast('News Feed Refreshed');
        }
    }, 600);
}

function renderCategories() {
    const container = document.getElementById('categoryTabs');
    container.innerHTML = categories.map(cat => `
        <button onclick="selectCategory('${cat}')" 
            class="category-tab px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat 
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }">
            ${cat}
        </button>
    `).join('');
}

function selectCategory(cat) {
    activeCategory = cat;
    renderCategories();
    filterNews();
}

function renderSkeletons() {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = Array(4).fill(0).map(() => `
        <div class="bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder p-4 animate-pulse space-y-3">
            <div class="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
            <div class="h-5 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            <div class="h-12 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        </div>
    `).join('');
}

// Filter and Search Engine
function filterNews() {
    const query = (document.getElementById('searchInput').value || document.getElementById('mobileSearchInput').value || '').toLowerCase();
    const sentiment = document.getElementById('sentimentFilter').value;
    const filterInfo = document.getElementById('filterInfo');
    const filterText = document.getElementById('filterText');

    let filtered = articlesData.filter(item => {
        const matchCategory = activeCategory === 'ALL' || item.category === activeCategory;
        const matchSentiment = sentiment === 'ALL' || item.sentiment === sentiment;
        const matchSearch = item.title.toLowerCase().includes(query) || item.summary.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
        return matchCategory && matchSentiment && matchSearch;
    });

    // Update filter state banner
    if (activeCategory !== 'ALL' || sentiment !== 'ALL' || query !== '') {
        filterInfo.classList.remove('hidden');
        filterText.innerText = `Active Filters: ${activeCategory !== 'ALL' ? activeCategory : ''} ${sentiment !== 'ALL' ? '• ' + sentiment : ''} ${query ? '• Keyword: "' + query + '"' : ''}`;
    } else {
        filterInfo.classList.add('hidden');
    }

    renderNewsGrid(filtered);
}

function resetFilters() {
    activeCategory = 'ALL';
    document.getElementById('searchInput').value = '';
    document.getElementById('mobileSearchInput').value = '';
    document.getElementById('sentimentFilter').value = 'ALL';
    renderCategories();
    filterNews();
}

function renderNewsGrid(articles) {
    const grid = document.getElementById('newsGrid');
    const emptyState = document.getElementById('emptyState');

    if (articles.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    grid.innerHTML = articles.map(art => {
        const isSaved = savedArticleIds.includes(art.id);
        const sentimentBadge = getSentimentBadge(art.sentiment);

        return `
            <article class="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-md group">
                <div>
                    <!-- Card Header info -->
                    <div class="flex items-center justify-between text-xs mb-3">
                        <span class="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">${art.category}</span>
                        <div class="flex items-center space-x-2">
                            ${sentimentBadge}
                            <button onclick="toggleSaveArticle('${art.id}', event)" class="text-slate-400 hover:text-emerald-500 transition-colors p-1">
                                <i data-lucide="bookmark" class="w-4 h-4 ${isSaved ? 'fill-emerald-500 text-emerald-500' : ''}"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Image Container -->
                    <div class="overflow-hidden rounded-xl h-40 mb-3 bg-slate-100 dark:bg-slate-800 cursor-pointer" onclick="openArticleModal('${art.id}')">
                        <img src="${art.image}" alt="${art.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onerror="imgFallback(this)">
                    </div>

                    <!-- Article Title -->
                    <h3 onclick="openArticleModal('${art.id}')" class="font-bold text-base text-slate-800 dark:text-slate-100 leading-snug cursor-pointer group-hover:text-emerald-500 transition-colors line-clamp-2 mb-2">
                        ${art.title}
                    </h3>

                    <!-- Snippet (Kontras Warna Ditingkatkan) -->
                    <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4 font-normal">
                        ${art.summary}
                    </p>
                </div>

                <!-- Card Footer (Kontras Warna Ditingkatkan) -->
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span class="font-medium text-slate-700 dark:text-slate-300">${art.source} • ${art.timeAgo}</span>
                    <span class="flex items-center text-slate-500 dark:text-slate-400"><i data-lucide="clock" class="w-3 h-3 mr-1"></i> ${art.readTime}</span>
                </div>
            </article>
        `;
    }).join('');

    lucide.createIcons();
    updateSavedBadgeCount();
}

function getSentimentBadge(sentiment) {
    if (sentiment === 'BULLISH') return `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Bullish 🟢</span>`;
    if (sentiment === 'BEARISH') return `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">Bearish 🔴</span>`;
    return `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">Neutral ⚪</span>`;
}

function openArticleModal(id) {
    const article = articlesData.find(a => a.id === id);
    if (!article) return;

    currentModalArticle = article;
    document.getElementById('modalCategory').innerText = article.category;
    document.getElementById('modalSource').innerText = article.source;
    document.getElementById('modalTitle').innerText = article.title;
    document.getElementById('modalDate').innerHTML = `<i data-lucide="clock" class="w-3.5 h-3.5 mr-1"></i> ${article.timeAgo}`;
    document.getElementById('modalReadTime').innerHTML = `<i data-lucide="book-open" class="w-3.5 h-3.5 mr-1"></i> ${article.readTime}`;
    document.getElementById('modalSentiment').innerHTML = getSentimentBadge(article.sentiment);
    document.getElementById('modalImage').src = article.image;
    document.getElementById('modalSummary').innerText = article.summary;
    document.getElementById('modalTakeaway').innerText = article.takeaway;
    document.getElementById('modalExternalLink').href = article.url;

    updateModalSaveButtonState();

    document.getElementById('articleModal').classList.remove('hidden');
    lucide.createIcons();
}

function closeArticleModal() {
    document.getElementById('articleModal').classList.add('hidden');
}

function updateModalSaveButtonState() {
    if (!currentModalArticle) return;
    const isSaved = savedArticleIds.includes(currentModalArticle.id);
    const btnText = document.getElementById('modalSaveBtnText');
    btnText.innerText = isSaved ? 'Bookmarked' : 'Bookmark Article';
}

function toggleSaveCurrentModalArticle() {
    if (currentModalArticle) {
        toggleSaveArticle(currentModalArticle.id);
        updateModalSaveButtonState();
    }
}

// Bookmark Logic
function toggleSaveArticle(id, event) {
    if (event) event.stopPropagation();

    if (savedArticleIds.includes(id)) {
        savedArticleIds = savedArticleIds.filter(i => i !== id);
        showToast('Removed from Bookmarks');
    } else {
        savedArticleIds.push(id);
        showToast('Article Saved to Bookmarks');
    }

    localStorage.setItem('tickr_saved', JSON.stringify(savedArticleIds));
    filterNews();
    renderSavedDrawerList();
}

function updateSavedBadgeCount() {
    const badge = document.getElementById('savedBadge');
    badge.innerText = savedArticleIds.length;
    if (savedArticleIds.length > 0) {
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function toggleSavedDrawer() {
    const drawer = document.getElementById('savedDrawer');
    const opening = drawer.classList.contains('translate-x-full');
    if (opening) renderSavedDrawerList();
    drawer.classList.toggle('translate-x-full', !opening);
    document.getElementById('drawerOverlay').classList.toggle('hidden', !opening);
}

function renderSavedDrawerList() {
    const container = document.getElementById('savedList');
    const savedArticles = articlesData.filter(a => savedArticleIds.includes(a.id));

    if (savedArticles.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-slate-400">
                <i data-lucide="bookmark" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
                <p class="text-xs">No saved articles yet.</p>
            </div>
        `;
    } else {
        container.innerHTML = savedArticles.map(art => `
            <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-start space-x-3">
                <div class="flex-1 cursor-pointer" onclick="openArticleModal('${art.id}'); toggleSavedDrawer();">
                    <span class="text-[10px] font-bold text-emerald-500">${art.category}</span>
                    <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 mt-0.5">${art.title}</h4>
                </div>
                <button onclick="toggleSaveArticle('${art.id}')" class="text-slate-400 hover:text-rose-500 p-1">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        `).join('');
    }
    lucide.createIcons();
}

function initChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    marketChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['9:30 AM', '11:00 AM', '1:00 PM', '3:00 PM', '4:00 PM'],
            datasets: [{
                label: 'S&P 500 Index',
                data: [5080, 5095, 5090, 5110, 5117],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { font: { size: 10 } } }
            }
        }
    });
}

const chartSets = {
    '1D': [['9:30', '11:00', '13:00', '15:00', '16:00'], [5080, 5095, 5090, 5110, 5117], 'Today'],
    '1W': [['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], [5020, 5045, 5030, 5080, 5117], 'This week'],
    '1M': [['W1', 'W2', 'W3', 'W4'], [4950, 4990, 5030, 5117], 'This month'],
    '1Y': [['Q1', 'Q2', 'Q3', 'Q4'], [4700, 4850, 4980, 5117], 'This year']
};
const TF_ON = ['bg-white', 'dark:bg-darkcard', 'shadow-sm', 'text-slate-800', 'dark:text-slate-100'];

function applyChartTheme() {
    if (!marketChartInstance) return;
    const dark = document.documentElement.classList.contains('dark');
    const sc = marketChartInstance.options.scales;
    sc.x.ticks.color = sc.y.ticks.color = dark ? '#94a3b8' : '#64748b';
    sc.y.grid.color = dark ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.18)';
    marketChartInstance.update();
}

function updateChartTimeframe(tf, btn) {
    document.querySelectorAll('.chart-tf-btn').forEach(b => { b.classList.remove(...TF_ON); b.classList.add('text-slate-500'); });
    if (btn) { btn.classList.remove('text-slate-500'); btn.classList.add(...TF_ON); }
    const [labels, data, label] = chartSets[tf];
    const pct = (data[data.length - 1] / data[0] - 1) * 100;
    const up = pct >= 0, color = up ? '#22c55e' : '#f43f5e';
    const badge = document.getElementById('chartChange');
    badge.textContent = `${up ? '+' : ''}${pct.toFixed(2)}% ${label}`;
    badge.className = 'text-xs font-semibold px-2 py-0.5 rounded-full border ' + (up
        ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
        : 'text-rose-500 bg-rose-500/10 border-rose-500/20');
    const ds = marketChartInstance.data.datasets[0];
    marketChartInstance.data.labels = labels;
    ds.data = data; ds.borderColor = color; ds.backgroundColor = color + '1a';
    marketChartInstance.update();
}

// Crypto converter: BTC / ETH -> USD or IDR (uses live ticker prices)
const CRYPTO_FROM = { BTC: 'BTC (₿)', ETH: 'ETH (Ξ)' };
const CRYPTO_TO = { USD: 'USD ($)', IDR: 'IDR (Rp)' };
const tickerPrice = sym => marketTickers.find(t => t.symbol === sym).price;
const optionsOf = obj => Object.entries(obj).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');

function initConverter() {
    document.getElementById('convertFrom').innerHTML = optionsOf(CRYPTO_FROM);
    document.getElementById('convertTo').innerHTML = optionsOf(CRYPTO_TO);
    calculateConversion();
}

function calculateConversion() {
    const amount = Math.max(0, parseFloat(document.getElementById('convertAmount').value) || 0);
    const from = document.getElementById('convertFrom').value, to = document.getElementById('convertTo').value;
    let value = amount * tickerPrice(from + '/USD');
    if (to === 'IDR') value *= tickerPrice('USD/IDR');
    document.getElementById('convertResult').value = formatNumber(value);
}

// World currency converter: live rates from open.er-api.com, offline sample rates as fallback
const FX_FALLBACK = { USD: 1, IDR: 15850, EUR: 0.92, GBP: 0.79, JPY: 151.5, SGD: 1.35, MYR: 4.72, AUD: 1.53, CNY: 7.24, KRW: 1340, INR: 83.3, THB: 36.5, SAR: 3.75, CHF: 0.9, CAD: 1.36 };
let fxRates = { ...FX_FALLBACK };
let fxStatus = 'Offline sample rates';
let currencyNames = null;
try { currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' }); } catch (e) {}

function fxLabel(code) {
    let name = '';
    try { name = currencyNames.of(code); } catch (e) {}
    return name && name !== code ? `${code} – ${name}` : code;
}

function fillFxSelects() {
    const from = document.getElementById('fxFrom'), to = document.getElementById('fxTo');
    const keep = [from.value || 'USD', to.value || 'IDR'];
    const opts = Object.keys(fxRates).sort().map(c => `<option value="${c}">${fxLabel(c)}</option>`).join('');
    from.innerHTML = opts; to.innerHTML = opts;
    from.value = keep[0] in fxRates ? keep[0] : 'USD';
    to.value = keep[1] in fxRates ? keep[1] : 'USD';
}

async function loadFxRates() {
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.result === 'success') {
            fxRates = data.rates;
            fxStatus = 'Live rates • ' + new Date(data.time_last_update_utc).toLocaleString();
        }
    } catch (e) { /* keep current rates */ }
    fillFxSelects();
    calculateFx();
}

function calculateFx() {
    const amount = Math.max(0, parseFloat(document.getElementById('fxAmount').value) || 0);
    const from = document.getElementById('fxFrom').value, to = document.getElementById('fxTo').value;
    const rate = fxRates[to] / fxRates[from];
    document.getElementById('fxResult').value = formatNumber(amount * rate);
    document.getElementById('fxRate').textContent = `1 ${from} = ${rate.toLocaleString('en-US', { maximumSignificantDigits: 6 })} ${to}`;
    document.getElementById('fxStatus').textContent = fxStatus;
}

function swapFx() {
    const from = document.getElementById('fxFrom'), to = document.getElementById('fxTo');
    [from.value, to.value] = [to.value, from.value];
    calculateFx();
}

function renderMovers() {
    const el = document.getElementById('moversList');
    if (!el) return;
    const sorted = [...marketTickers].sort((a, b) => b.change - a.change);
    const row = t => `<div class="flex items-center justify-between text-xs py-2">
        <span class="font-semibold text-slate-700 dark:text-slate-200">${t.symbol}</span>
        <span class="font-mono text-slate-500 dark:text-slate-400">${formatNumber(t.price)}</span>
        <span class="font-mono font-semibold ${t.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}">${t.change >= 0 ? '+' : ''}${t.change.toFixed(2)}%</span></div>`;
    el.innerHTML = [...sorted.slice(0, 3), ...sorted.slice(-2)].map(row).join('');
}

// UX: synced search boxes, Esc / backdrop to close, "/" to focus search
function initUX() {
    const desk = document.getElementById('searchInput'), mob = document.getElementById('mobileSearchInput');
    desk.addEventListener('input', () => mob.value = desk.value);
    mob.addEventListener('input', () => desk.value = mob.value);
    document.getElementById('modalImage').onerror = e => imgFallback(e.target);
    const modal = document.getElementById('articleModal');
    modal.addEventListener('click', e => { if (e.target === modal) closeArticleModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeArticleModal();
            if (!document.getElementById('savedDrawer').classList.contains('translate-x-full')) toggleSavedDrawer();
        } else if (e.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) {
            e.preventDefault();
            (window.innerWidth >= 768 ? desk : mob).focus();
        }
    });
}

// Helpers
function formatNumber(num) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: Math.abs(num) < 1 ? 8 : 2 }).format(num);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 border border-slate-700';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}
