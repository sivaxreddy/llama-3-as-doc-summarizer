document.getElementById('chatForm').addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();

    const fileInput = document.getElementById('pdfFile');
    const queryInput = document.getElementById('query');
    const responseDiv = document.getElementById('response');

    if (fileInput.files.length === 0) {
        alert("Please select a PDF file.");
        return;
    }

    const file = fileInput.files[0];
    const query = queryInput.value;

    const formData = new FormData();
    formData.append('pdfFile', file);

    // Upload PDF and get text content
    let text;
    try {
        const uploadResponse = await fetch('https://api.groq.com/text', {
            method: 'POST',
            body: formData
        });
        const uploadData = await uploadResponse.json();
        text = uploadData.text;
    } catch (error) {
        console.error('Error uploading file:', error);
        responseDiv.textContent = 'Error uploading file';
        return;
    }

    // Ask question to LLM API
    try {
        const askResponse = await fetch('https://api.groq.com/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, question: query })
        });
        const askData = await askResponse.json();
        responseDiv.textContent = askData.answer;
    } catch (error) {
        console.error('Error asking question:', error);
        responseDiv.textContent = 'Error asking question';
    }
}
