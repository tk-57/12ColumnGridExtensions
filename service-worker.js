// 初期値
const DEFAULTS = {
    enabled: false,
    columnWidth: 72,
    gutterWidth: 24,
    columns: 12,
    color: '#00FFff',
    opacity: 0.15,
};

// インストール時にストレージへ書き込み
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(DEFAULTS, (data) => {
        chrome.storage.sync.set({ ...DEFAULTS, ...data });
    });
});

// ポップアップから来た更新を全タブへブロードキャスト
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'UPDATE_SETTINGS') {
        chrome.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                if (!tab.id) continue;

                // content-script がいないタブではエラーになるので握りつぶす
                chrome.tabs.sendMessage(
                    tab.id,
                    { type: 'APPLY_SETTINGS', payload: msg.payload },
                    () => void chrome.runtime.lastError      // ← ここ
                );
            }
        });
    }
});
