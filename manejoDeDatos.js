document.getElementById('convertBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(event.target.result, 'application/xml');
        const rows = xml.getElementsByTagName('Row');
        const data = [];

        for (let i = 1; i < rows.length; i++) {  // Empezar desde 1 para saltar el primer elemento
            const cells = rows[i].getElementsByTagName('Cell');
            if (cells.length === 5) {
                const id = cells[1].textContent.trim();
                if (id !== '' && !id.includes('User')) {  // Omitir elementos vacíos en el campo ID
                    const entry = {
                        "SN": cells[0].textContent,
                        "ID": id,
                        "Name": cells[2].textContent,
                        "Open_Time": cells[3].textContent,
                        "Verify": cells[4].textContent
                    };
                    data.push(entry);
                }
            }
        }

        // Crear el archivo JSON y descargarlo
        const jsonString = JSON.stringify(data, null, 4);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'datos.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    reader.readAsText(file);
});
