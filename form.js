const form = document.getElementById("applicationForm");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const motivation = document.getElementById("motivation");
const charCount = document.getElementById("charCount");
const resume = document.getElementById("resume");
const skillsError = document.getElementById("skillsError");
const formMessage = document.getElementById("formMessage");

const requiredFields = [
  "fullName",
  "email",
  "phone",
  "location",
  "education",
  "college",
  "experience",
  "resume",
  "motivation",
  "availability",
  "consent"
];

function updateProgress() {
  let completed = 0;
  const total = requiredFields.length + 1;

  requiredFields.forEach((id) => {
    const field = document.getElementById(id);

    if (field.type === "checkbox") {
      if (field.checked) completed++;
    } else if (field.type === "file") {
      if (field.files.length > 0) completed++;
    } else if (field.value.trim() !== "") {
      completed++;
    }
  });

  // The extra item is the required design-tool selection.
  if (document.querySelector('input[name="skills"]:checked')) {
    completed++;
  }

  const percent = Math.round((completed / total) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "% completed";
}

form.addEventListener("input", updateProgress);
form.addEventListener("change", updateProgress);

document.querySelectorAll('input[name="skills"]').forEach((skill) => {
  skill.addEventListener("change", () => {
    skillsError.textContent = "";
  });
});

motivation.addEventListener("input", () => {
  charCount.textContent = motivation.value.length;
});

resume.addEventListener("change", () => {
  const file = resume.files[0];

  if (!file) return;

  const isPDF =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPDF) {
    resume.setCustomValidity("Please upload a PDF file.");
  } else if (file.size > 5 * 1024 * 1024) {
    resume.setCustomValidity("The resume must be 5 MB or smaller.");
  } else {
    resume.setCustomValidity("");
  }

  resume.reportValidity();
  updateProgress();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  formMessage.hidden = true;
  skillsError.textContent = "";

  const selectedSkills = document.querySelectorAll(
    'input[name="skills"]:checked'
  );

  if (selectedSkills.length === 0) {
    skillsError.textContent =
      "Please select at least one design tool.";
    document.querySelector(".skills").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const file = resume.files[0];

  if (!file ||
      file.type !== "application/pdf" ||
      file.size > 5 * 1024 * 1024) {
    resume.setCustomValidity(
      "Choose a valid PDF resume of 5 MB or less."
    );
    resume.reportValidity();
    resume.setCustomValidity("");
    return;
  }

  const skills = Array.from(selectedSkills)
    .map((item) => item.value);

  // Demo only: no application is sent to a server.
  const application = {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    location: document.getElementById("location").value.trim(),
    education: document.getElementById("education").value,
    college: document.getElementById("college").value.trim(),
    experience: document.getElementById("experience").value,
    skills,
    portfolio: document.getElementById("portfolio").value.trim(),
    linkedin: document.getElementById("linkedin").value.trim(),
    motivation: motivation.value.trim(),
    availability: document.getElementById("availability").value,
    resumeFileName: file.name
  };

  console.log("Demo application data:", application);

  formMessage.className = "form-message success";
  formMessage.textContent =
    "Your form passed validation! This is a demo submission. " +
    "Your application has not been sent to an employer because " +
    "a backend or form submission service is not connected.";

// Show the success popup
const successPopup = document.getElementById("successPopup");
const doneBtn = document.getElementById("doneBtn");
const closePopup = document.getElementById("closePopup");

successPopup.hidden = false;
document.body.style.overflow = "hidden";
doneBtn.focus();

function closeSuccessPopup() {
  successPopup.hidden = true;
  document.body.style.overflow = "";
  document.getElementById("fullName").focus();
}

doneBtn.onclick = closeSuccessPopup;
closePopup.onclick = closeSuccessPopup;

// Close when clicking outside the popup
successPopup.onclick = function (event) {
  if (event.target === successPopup) {
    closeSuccessPopup();
  }
};

// Close with the Escape key
successPopup.onkeydown = function (event) {
  if (event.key === "Escape") {
    closeSuccessPopup();
  }
};
});
updateProgress();