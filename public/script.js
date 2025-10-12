document.addEventListener('DOMContentLoaded', () => {
  const decryptBtn = document.getElementById('decrypt-btn');
  const inputCode = document.getElementById('input-code');
  const outputCode = document.getElementById('output-code');
  const decryptType = document.getElementById('decrypt-type');
  const statusEl = document.getElementById('status');

  decryptBtn.addEventListener('click', async () => {
    const code = inputCode.value;
    const type = decryptType.value;

    if (!code.trim()) {
      alert('Please paste some code to decrypt.');
      return;
    }

    // Set loading state
    decryptBtn.disabled = true;
    decryptBtn.textContent = 'Decrypting...';
    statusEl.textContent = 'Processing, this may take a moment...';
    outputCode.value = '';

    try {
      const response = await fetch('/api/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred.');
      }

      outputCode.value = data.decryptedCode;
      statusEl.textContent = 'Decryption successful!';
    } catch (error) {
      console.error('Decryption failed:', error);
      outputCode.value = `Error: ${error.message}`;
      statusEl.textContent = 'Decryption failed.';
    } finally {
      // Reset button state
      decryptBtn.disabled = false;
      decryptBtn.textContent = 'Decrypt';
    }
  });
});
