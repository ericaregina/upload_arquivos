let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");

// Função para salvar os dados dos arquivos no localStorage
function saveToLocalStorage(fileData) {
  let storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
  
  // Verifica se o arquivo já existe para evitar duplicatas
  const exists = storedFiles.some(file => file.name === fileData.name && file.size === fileData.size);
  if (!exists) {
    storedFiles.push(fileData);
    localStorage.setItem("uploadedFiles", JSON.stringify(storedFiles));
  }
}

// Função para carregar os arquivos do localStorage ao carregar a página
function loadFromLocalStorage() {
  let storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
  fileList.innerHTML = ""; // Limpa a lista antes de carregar
  storedFiles.forEach(file => {
    let listItem = document.createElement("li");
    listItem.innerHTML = `<p>${file.name}</p><p>${file.size}</p>`;
    fileList.appendChild(listItem);

    // Adiciona evento de clique para salvar o arquivo
    listItem.addEventListener("click", () => {
      saveFile(file);
    });
  });
  if (storedFiles.length > 0) {
    numOfFiles.textContent = `${storedFiles.length} Files Selected`;
  } else {
    numOfFiles.textContent = "No Files Chosen";
  }
}

// Função para salvar o arquivo (simulando o download ao clicar)
function saveFile(file) {
  const a = document.createElement("a");
  a.href = file.data;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

fileInput.addEventListener("change", () => {
  let files = fileInput.files;
  let storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];

  // Atualiza o contador de arquivos
  numOfFiles.textContent = `${files.length} Files Selected`;

  // Itera sobre os arquivos selecionados
  for (let i of files) {
    let reader = new FileReader();
    reader.onload = (event) => {
      let listItem = document.createElement("li");
      let fileName = i.name;
      let fileSize = (i.size / 1024).toFixed(1) + "KB";
      let fileData = event.target.result;
      
      if (i.size >= 1024 * 1024) {
        fileSize = (i.size / (1024 * 1024)).toFixed(1) + "MB";
      }

      listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}</p>`;
      fileList.appendChild(listItem);

      // Salva as informações do arquivo no localStorage
      let fileInfo = {
        name: fileName,
        size: fileSize,
        data: fileData,
      };
      saveToLocalStorage(fileInfo);

      // Adiciona evento de clique para salvar o arquivo
      listItem.addEventListener("click", () => {
        saveFile(fileInfo);
      });
    };
    reader.readAsDataURL(i);
  }
});

// Carrega os arquivos do localStorage quando a página é carregada
window.onload = loadFromLocalStorage;
