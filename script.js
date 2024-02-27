function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const outputDiv = document.getElementById('output');
  
    const file = fileInput.files[0];
    if (!file) {
      outputDiv.innerHTML = 'Nenhum arquivo selecionado.';
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function(event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      const sheetName = workbook.SheetNames[0]; // Assumindo que a primeira planilha seja a desejada
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      const tableName = 'minha_tabela';
      const columns = jsonData[0];
      const insertSQL = jsonData.slice(1).map(row => {
        const values = row.map(value => typeof value === 'string' ? `'${value}'` : value).join(', ');
        return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});`;
      }).join('\n');
  
      outputDiv.innerHTML = '<h2>Script SQL:</h2><textarea cols="80" rows="10">' + insertSQL + '</textarea>';
  
      // Criar link para download
      const downloadLink = document.createElement('a');
      downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(insertSQL);
      downloadLink.download = 'script_insert.sql';
      downloadLink.textContent = 'Download Script SQL';
      outputDiv.appendChild(downloadLink);
    };
  
    reader.readAsArrayBuffer(file);
  }
  