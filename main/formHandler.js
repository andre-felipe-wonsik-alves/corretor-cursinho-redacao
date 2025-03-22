document.addEventListener("DOMContentLoaded", function () {
  let correctionStatus = false;

  const formComp = document.getElementById("formComp");
  const toggleCorrectionButton = document.getElementById("toggleCorrection");
  const studentCountDisplay = document.getElementById("studentCountDisplay");
  const compInputs = document.querySelectorAll('input[name^="comp"]');

  formComp.style.display = "none";
  updateStudentCountDisplay();
  updateCorrectionStatus();

  toggleCorrectionButton.addEventListener("click", handleToggleCorrection);
  formComp.addEventListener("submit", handleFormSubmit);
  compInputs.forEach((input) =>
    input.addEventListener("change", updateStudentGrade)
  );

  function handleToggleCorrection() {
    correctionStatus = !correctionStatus;
    updateCorrectionStatus();
    toggleFormVisibility();

    if (!correctionStatus && handleFormSubmission()) {
      incrementStudentCount();
      updateStudentCountDisplay();
      resetForm();
    } else {
      document.getElementById("name").focus();
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (handleFormSubmission()) {
      incrementStudentCount();
      updateStudentCountDisplay();
      resetForm();
    }
  }

  function updateStudentCountDisplay() {
    const counter = localStorage.getItem("studentCount") || 0;
    studentCountDisplay.innerText = `Quantidade de alunos corrigidos: ${counter}`;
  }

  function incrementStudentCount() {
    let counter = localStorage.getItem("studentCount") || 0;
    counter++;
    localStorage.setItem("studentCount", counter);
  }

  function handleFormSubmission() {
    const name = document.getElementById("name").value;

    if (!name) {
      alert("Por favor, preencha o nome do aluno.");
      return false;
    }

    const competencies = [];
    compInputs.forEach((input) => {
      if (input.checked) {
        competencies.push(input.value);
      }
    });

    if (competencies.length !== 5) {
      alert("Por favor, selecione uma opção para cada competência.");
      return false;
    }

    saveFormData(name, ...competencies); // * spread operator: ele, resumidamente, vai pegar TUDO que está dentro de competencies e usar na funcao (andrezao (recomendo usar mt bom hehe))
    downloadCSV();

    return true;
  }

  function saveFormData(name, comp1, comp2, comp3, comp4, comp5) {
    let csvContent =
      localStorage.getItem("formData") ||
      "Nome,Competência 1,Competência 2,Competência 3,Competência 4,Competência 5\n";
    csvContent += `${name},${comp1},${comp2},${comp3},${comp4},${comp5}\n`;
    localStorage.setItem("formData", csvContent);
  }

  function downloadCSV() {
    const csvContent = localStorage.getItem("formData");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "form_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function resetForm() {
    formComp.reset();
  }

  function updateCorrectionStatus() {
    toggleCorrectionButton.innerText = correctionStatus
      ? "Finalizar correção"
      : "Iniciar correção";
  }

  function toggleFormVisibility() {
    formComp.style.display = correctionStatus ? "block" : "none";
  }

  function updateStudentGrade() {
    let grade = 0;

    compInputs.forEach((input) => {
      if (input.checked) {
        grade += parseInt(input.value);
      }
    });

    document.getElementById("studentGrade").innerText = `${grade}`;
  }
});
