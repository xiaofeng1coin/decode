document.addEventListener('DOMContentLoaded', () => {
    // --- 元素获取 ---
    const decryptBtn = document.getElementById('decrypt-btn');
    const inputCode = document.getElementById('input-code');
    const outputCode = document.getElementById('output-code');
    const decryptType = document.getElementById('decrypt-type');
    const statusEl = document.getElementById('status');
    const copyOutputBtn = document.getElementById('copy-output-btn');
    const clearInputBtn = document.getElementById('clear-input-btn');
    const btnText = decryptBtn.querySelector('.btn-text');

    // 主解密按钮事件
    decryptBtn.addEventListener('click', async () => {
        const code = inputCode.value;
        const type = decryptType.value;

        if (!code.trim()) {
            alert('请粘贴需要解密的代码。');
            return;
        }

        // --- 设置加载状态 ---
        decryptBtn.disabled = true;
        decryptBtn.classList.add('loading');
        btnText.textContent = '解密中...';
        statusEl.textContent = '正在处理，请稍候...';
        statusEl.className = '';
        outputCode.value = '';

        try {
            const response = await fetch('/api/decrypt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, type }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '发生未知错误。');
            }
            
            // --- 直接显示结果，不再使用打字机效果 ---
            outputCode.value = data.decryptedCode;
            
            statusEl.textContent = '解密成功！';
            statusEl.classList.add('success');

        } catch (error) {
            console.error('解密失败:', error);
            outputCode.value = `错误: ${error.message}`;
            statusEl.textContent = '解密失败。';
            statusEl.classList.add('error');
        } finally {
            // --- 重置按钮状态 ---
            decryptBtn.disabled = false;
            decryptBtn.classList.remove('loading');
            btnText.textContent = '开始解密';
        }
    });

    // --- 复制按钮事件 ---
    copyOutputBtn.addEventListener('click', () => {
        if (!outputCode.value) return;
        navigator.clipboard.writeText(outputCode.value).then(() => {
            copyOutputBtn.textContent = '已复制!';
            setTimeout(() => {
                copyOutputBtn.textContent = '复制';
            }, 2000);
        }).catch(err => {
            alert('复制失败: ' + err);
        });
    });

    // --- 清空按钮事件 ---
    clearInputBtn.addEventListener('click', () => {
        inputCode.value = '';
        inputCode.focus(); // 清空后自动聚焦，方便粘贴
    });
});
