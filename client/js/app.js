document.getElementById('chatForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('pdfFile');
    const queryInput = document.getElementById('query');

    const file = fileInput.files[0];
    const query = queryInput.value;

    const formData = new FormData();
    formData.append('pdfFile', file);
    formData.append('query', query);

    const response = await fetch('/chat', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    document.getElementById('response').innerText = data.response;

    // Do not reset the form to retain the PDF file input value
});
