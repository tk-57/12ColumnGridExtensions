const els = {
    enabled: document.getElementById('enabled'),
    columnWidth: document.getElementById('columnWidth'),
    gutterWidth: document.getElementById('gutterWidth'),
    columns: document.getElementById('columns'),
    color: document.getElementById('color'),
    alpha: document.getElementById('alpha'),
};

// 現在値を表示
chrome.storage.sync.get(null, (data) => {
    Object.entries(els).forEach(([k, el]) => {
        if (el.type === 'checkbox') el.checked = !!data[k];
        else el.value = data[k];
    });
});

// 変更イベント
function save() {
    const payload = {
        enabled: els.enabled.checked,
        columnWidth: +els.columnWidth.value,
        gutterWidth: +els.gutterWidth.value,
        columns: +els.columns.value,
        color: els.color.value,
        alpha: +els.alpha.value
    };
    chrome.storage.sync.set(payload, () => {
        chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS', payload });
    });
}
Object.values(els).forEach((el) =>
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', save)
);
