// 潮汕旅行路书 - 主交互脚本

// 模块：移动端菜单
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // 点击菜单项后关闭
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// 模块：导航高亮
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
    
    sections.forEach(section => observer.observe(section));
}

// 模块：导航栏滚动效果
function initNavScroll() {
    const nav = document.getElementById('main-nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('shadow-md');
        } else {
            nav.classList.remove('shadow-md');
        }
        
        lastScroll = currentScroll;
    });
}

// 模块：回到顶部按钮
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    
    if (btn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                btn.classList.remove('opacity-0', 'pointer-events-none');
                btn.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                btn.classList.add('opacity-0', 'pointer-events-none');
                btn.classList.remove('opacity-100', 'pointer-events-auto');
            }
        });
        
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// 模块：标签页切换
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // 更新按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新面板显示
            tabPanels.forEach(panel => {
                panel.classList.add('hidden');
                panel.classList.remove('active');
            });
            
            const targetPanel = document.getElementById(`panel-${targetTab}`);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
                targetPanel.classList.add('active');
            }
        });
    });
}

// 模块：时间轴滚动动画
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    timelineItems.forEach(item => observer.observe(item));
}

// 模块：离线检测
function initOfflineDetection() {
    const banner = document.createElement('div');
    banner.className = 'offline-banner';
    banner.innerHTML = '📡 当前处于离线状态，部分功能可能受限，但路书内容可正常查阅';
    document.body.prepend(banner);
    
    function updateOnlineStatus() {
        if (!navigator.onLine) {
            banner.classList.add('show');
        } else {
            banner.classList.remove('show');
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// 模块：一键导航（调用地图应用）
function initNavigation() {
    // 为所有包含GPS坐标的元素添加点击导航功能
    const gpsElements = document.querySelectorAll('[class*="bg-amber-50"], [class*="bg-teal-50"], [class*="bg-indigo-50"]');
    
    gpsElements.forEach(el => {
        const text = el.textContent;
        const coordMatch = text.match(/(\d+\.\d+)°N,\s*(\d+\.\d+)°E/);
        
        if (coordMatch) {
            const lat = coordMatch[1];
            const lng = coordMatch[2];
            
            el.style.cursor = 'pointer';
            el.title = '点击打开地图导航';
            
            el.addEventListener('click', () => {
                // 尝试打开地图应用
                const mapUrl = `https://uri.amap.com/marker?position=${lng},${lat}&name=目的地&coordinate=gaode&callnative=1`;
                window.open(mapUrl, '_blank');
            });
        }
    });
}

// 模块：快速检索功能
function initSearch() {
    // 创建搜索功能（Ctrl+K 触发）
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showSearchModal();
        }
    });
}

function showSearchModal() {
    // 检查是否已存在搜索模态框
    let modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
            modal.querySelector('input').focus();
        }
        return;
    }
    
    // 创建搜索模态框
    modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div class="p-4 border-b border-stone-100">
                <div class="flex items-center gap-3">
                    <i class="fas fa-search text-stone-400"></i>
                    <input type="text" id="search-input" placeholder="搜索行程内容..." class="flex-1 outline-none text-stone-800 placeholder-stone-400">
                    <kbd class="px-2 py-1 bg-stone-100 text-stone-500 rounded text-xs">ESC</kbd>
                </div>
            </div>
            <div id="search-results" class="max-h-80 overflow-y-auto p-2">
                <div class="p-4 text-center text-stone-400 text-sm">输入关键词搜索行程内容</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const input = modal.querySelector('#search-input');
    const results = modal.querySelector('#search-results');
    
    input.focus();
    
    // 关闭搜索
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
    
    // 搜索逻辑
    const searchData = [
        { title: '文光塔', section: '#day1', desc: '千年古塔，八面七层，全国重点文物保护单位' },
        { title: '棉城古邑街区', section: '#day1', desc: '龙头厝、铜门闾等潮汕传统民居' },
        { title: '工夫茶体验', section: '#day1', desc: '国家级非遗，三步七法冲泡技艺' },
        { title: '潮汕牛肉火锅', section: '#day1', desc: '现宰黄牛，按部位细分涮制' },
        { title: '生腌夜宵', section: '#day1', desc: '虾姑、血蚶、蟹等生腌海鲜' },
        { title: '小公园历史文化街区', section: '#day2', desc: '中国最大骑楼建筑群，728座历史建筑' },
        { title: '潮汕工艺展示馆', section: '#day2', desc: '泥塑、木雕、嵌瓷、抽纱等非遗' },
        { title: '西堤公园', section: '#day2', desc: '海湾落日，开埠文化陈列馆' },
        { title: '礐石风景区', section: '#day3', desc: '国家4A级景区，汕头八景之首' },
        { title: '北回归线标志塔', section: '#day3', desc: '科普教育基地，天文奇观' },
        { title: '自驾路线', section: '#tips', desc: '城际交通、停车位、路况信息' },
        { title: '住宿推荐', section: '#tips', desc: '民宿、星级酒店、连锁品牌对比' },
        { title: '摄影攻略', section: '#tips', desc: '黄金拍摄点位、光影分析、构图建议' },
        { title: '应急信息', section: '#tips', desc: '医疗、警务、道路救援联系方式' },
        { title: '文化禁忌', section: '#tips', desc: '宗教礼仪、工夫茶礼仪、饮食注意' },
        { title: '预算模板', section: '#tips', desc: '经济型/舒适型/品质型三档预算' },
    ];
    
    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        
        if (!query) {
            results.innerHTML = '<div class="p-4 text-center text-stone-400 text-sm">输入关键词搜索行程内容</div>';
            return;
        }
        
        const filtered = searchData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.desc.toLowerCase().includes(query)
        );
        
        if (filtered.length === 0) {
            results.innerHTML = '<div class="p-4 text-center text-stone-400 text-sm">未找到相关内容</div>';
            return;
        }
        
        results.innerHTML = filtered.map(item => `
            <a href="${item.section}" class="block p-3 rounded-lg hover:bg-stone-50 transition" onclick="document.getElementById('search-modal').classList.add('hidden')">
                <div class="font-medium text-stone-800 text-sm">${item.title}</div>
                <div class="text-xs text-stone-500 mt-1">${item.desc}</div>
            </a>
        `).join('');
    });
}

// 初始化所有模块
function init() {
    initMobileMenu();
    initNavHighlight();
    initNavScroll();
    initBackToTop();
    initTabs();
    initTimelineAnimation();
    initOfflineDetection();
    initNavigation();
    initSearch();
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
