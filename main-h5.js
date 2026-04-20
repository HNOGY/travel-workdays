// 潮汕旅行路书 H5版 - 主交互脚本

(function() {
    'use strict';

    // ========== 页面导航系统 ==========
    const pageHistory = ['page-home'];
    let isAnimating = false;

    function navigateTo(targetId, direction) {
        if (isAnimating) return;
        const currentPage = document.querySelector('.h5-page.active');
        const targetPage = document.getElementById(targetId);
        if (!currentPage || !targetPage || currentPage === targetPage) return;

        isAnimating = true;

        if (direction === 'forward') {
            targetPage.style.display = '';
            targetPage.classList.remove('active');
            targetPage.classList.add('slide-in-right');
            currentPage.classList.add('slide-out-left');

            setTimeout(() => {
                currentPage.classList.remove('active', 'slide-out-left');
                targetPage.classList.remove('slide-in-right');
                targetPage.classList.add('active');
                targetPage.scrollTop = 0;
                isAnimating = false;
            }, 350);

            pageHistory.push(targetId);
        } else {
            currentPage.classList.add('slide-out-right');
            targetPage.style.display = '';
            targetPage.classList.add('slide-in-left');

            setTimeout(() => {
                currentPage.classList.remove('active', 'slide-out-right');
                targetPage.classList.remove('slide-in-left');
                targetPage.classList.add('active');
                isAnimating = false;
            }, 350);

            pageHistory.pop();
        }

        // 更新底部导航栏状态
        updateTabbar(targetId);
        // 显示/隐藏底部导航栏
        toggleTabbar(targetId);
    }

    function goBack() {
        if (pageHistory.length <= 1) return;
        const prevPageId = pageHistory[pageHistory.length - 2];
        navigateTo(prevPageId, 'back');
    }

    // ========== 底部导航栏 ==========
    const tabbarPages = ['page-overview', 'page-food', 'page-tips', 'page-share'];

    function toggleTabbar(pageId) {
        const tabbar = document.getElementById('h5-tabbar');
        const footerSig = document.getElementById('h5-footer-sig');
        if (pageId === 'page-home') {
            tabbar.classList.add('hidden');
            footerSig.style.display = 'none';
        } else {
            tabbar.classList.remove('hidden');
            footerSig.style.display = 'block';
        }
    }

    function updateTabbar(pageId) {
        document.querySelectorAll('.h5-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.page === pageId);
        });
    }

    // ========== 模态框系统 ==========
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // ========== Toast提示 ==========
    function showToast(message, duration) {
        duration = duration || 2000;
        const toast = document.getElementById('h5-toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // ========== 地图导航 ==========
    function openNavigation(lat, lng, name) {
        // 优先尝试高德地图
        var url = 'https://uri.amap.com/marker?position=' + lng + ',' + lat + '&name=' + encodeURIComponent(name) + '&coordinate=gaode&callnative=1';
        window.open(url, '_blank');
    }

    // ========== 分享功能 ==========
    function copyLink() {
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function() {
                showToast('链接已复制到剪贴板 ✓');
            }).catch(function() {
                fallbackCopy(url);
            });
        } else {
            fallbackCopy(url);
        }
    }

    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('链接已复制到剪贴板 ✓');
        } catch (e) {
            showToast('复制失败，请手动复制链接');
        }
        document.body.removeChild(textarea);
    }

    function shareNative() {
        if (navigator.share) {
            navigator.share({
                title: '潮汕五一旅行路书',
                text: '三天两夜潮汕深度游攻略，包含行程、美食、摄影全攻略！',
                url: window.location.href
            }).catch(function() {
                // 用户取消分享
            });
        } else {
            showToast('请使用浏览器的分享功能');
        }
    }

    function shareWechat() {
        showToast('请点击右上角 ··· 分享到微信');
    }

    // ========== 加载动画 ==========
    function initLoading() {
        var bar = document.getElementById('loading-bar');
        var screen = document.getElementById('loading-screen');
        var progress = 0;

        var timer = setInterval(function() {
            progress += Math.random() * 30 + 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(timer);
                bar.style.width = '100%';
                setTimeout(function() {
                    screen.classList.add('fade-out');
                    setTimeout(function() {
                        screen.style.display = 'none';
                    }, 500);
                }, 300);
            } else {
                bar.style.width = progress + '%';
            }
        }, 150);
    }

    // ========== 触摸手势 - 右滑返回 ==========
    function initSwipeBack() {
        var startX = 0;
        var startY = 0;
        var isDragging = false;

        document.addEventListener('touchstart', function(e) {
            var touch = e.touches[0];
            // 只在左边缘20px内开始
            if (touch.clientX < 20 && pageHistory.length > 1) {
                startX = touch.clientX;
                startY = touch.clientY;
                isDragging = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            var touch = e.touches[0];
            var deltaX = touch.clientX - startX;
            var deltaY = Math.abs(touch.clientY - startY);

            // 如果垂直滑动大于水平滑动，取消手势
            if (deltaY > Math.abs(deltaX)) {
                isDragging = false;
                return;
            }
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            var touch = e.changedTouches[0];
            var deltaX = touch.clientX - startX;

            if (deltaX > 80) {
                goBack();
            }
        }, { passive: true });
    }

    // ========== 初始化事件绑定 ==========
    function initEvents() {
        // 开始按钮
        var btnStart = document.getElementById('btn-start');
        if (btnStart) {
            btnStart.addEventListener('click', function() {
                navigateTo('page-overview', 'forward');
            });
        }

        // 返回按钮
        document.querySelectorAll('.h5-back-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var target = btn.dataset.target;
                if (target) {
                    // 找到目标在历史中的位置
                    var idx = pageHistory.indexOf(target);
                    if (idx >= 0) {
                        // 回退到目标页面
                        navigateTo(target, 'back');
                    } else {
                        goBack();
                    }
                } else {
                    goBack();
                }
            });
        });

        // Day卡片点击
        document.querySelectorAll('.h5-day-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var target = card.dataset.target;
                if (target) navigateTo(target, 'forward');
            });
        });

        // 底部导航栏
        document.querySelectorAll('.h5-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                var targetPage = tab.dataset.page;
                var currentPage = document.querySelector('.h5-page.active');
                if (currentPage && currentPage.id === targetPage) return;

                // 判断方向
                var currentIdx = tabbarPages.indexOf(currentPage ? currentPage.id : '');
                var targetIdx = tabbarPages.indexOf(targetPage);

                // 重置历史到概览页
                while (pageHistory.length > 2) pageHistory.pop();
                if (pageHistory[pageHistory.length - 1] !== 'page-overview') {
                    pageHistory.push('page-overview');
                }

                if (targetPage !== 'page-overview') {
                    navigateTo(targetPage, 'forward');
                } else {
                    navigateTo(targetPage, 'back');
                }
            });
        });

        // 攻略卡片 -> 模态框
        document.querySelectorAll('.h5-tips-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var modalId = card.dataset.modal;
                if (modalId) openModal(modalId);
            });
        });

        // 模态框关闭
        document.querySelectorAll('.h5-modal-close').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var modal = btn.closest('.h5-modal');
                if (modal) closeModal(modal);
            });
        });

        // 点击模态框背景关闭
        document.querySelectorAll('.h5-modal').forEach(function(modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeModal(modal);
            });
        });

        // 导航按钮
        document.querySelectorAll('.h5-nav-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var lat = btn.dataset.lat;
                var lng = btn.dataset.lng;
                var name = btn.dataset.name;
                if (lat && lng) openNavigation(lat, lng, name || '目的地');
            });
        });

        // 分享按钮
        var btnCopy = document.getElementById('btn-copy-link');
        if (btnCopy) btnCopy.addEventListener('click', copyLink);

        var btnWechat = document.getElementById('btn-share-wechat');
        if (btnWechat) btnWechat.addEventListener('click', shareWechat);

        var btnNative = document.getElementById('btn-share-native');
        if (btnNative) btnNative.addEventListener('click', shareNative);

        // 物理返回键
        window.addEventListener('popstate', function() {
            if (pageHistory.length > 1) {
                goBack();
            }
        });

        // 首页向上滑动进入概览
        var homePage = document.getElementById('page-home');
        if (homePage) {
            var homeStartY = 0;
            homePage.addEventListener('touchstart', function(e) {
                homeStartY = e.touches[0].clientY;
            }, { passive: true });

            homePage.addEventListener('touchend', function(e) {
                var deltaY = homeStartY - e.changedTouches[0].clientY;
                if (deltaY > 60) {
                    navigateTo('page-overview', 'forward');
                }
            }, { passive: true });
        }
    }

    // ========== 入口 ==========
    function init() {
        initLoading();
        initEvents();
        initSwipeBack();

        // 确保首页显示
        var homePage = document.getElementById('page-home');
        if (homePage) {
            homePage.classList.add('active');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
