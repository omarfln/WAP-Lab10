document.addEventListener("DOMContentLoaded", function () {

    let patients = [];
    let elderlyPatientsCheckbox;
    let outPatientsCheckbox;

    // Load patient data from local storage if available
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
        patients = JSON.parse(storedPatients);
    }

    const registerButton = document.getElementById("btnRegisterPatient");
    registerButton.addEventListener("click", function (event) {
        event.preventDefault();

        // Get values from the input form
        const patientIdNumber = document.getElementById("patientIdNumber").value;
        const firstName = document.getElementById("firstName").value;
        const middleInitials = document.getElementById("middleInitials").value;
        const lastName = document.getElementById("lastName").value;
        const dateOfBirth = document.getElementById("dateOfBirth").value;
        const department = document.getElementById("ddlDepartment").value;
        const isOutPatient = document.querySelector('input[name="radioIsOutPatient"]:checked').value;

        // Build the patient object
        const patient = {
            patientIdNumber,
            firstName,
            middleInitials,
            lastName,
            dateOfBirth,
            department,
            isOutPatient,
        };

        // Add the patient to the array
        patients.push(patient);

        // Add patients to local storage, thus when reloading the page again, data won't be lost
        localStorage.setItem("patients", JSON.stringify(patients));

        // Update the patient list
        updatePatientList();
        document.querySelector("form").reset();
    });

    elderlyPatientsCheckbox = document.getElementById("chkElderlyPatients");
    outPatientsCheckbox = document.getElementById("chkShowOutPatients");

    elderlyPatientsCheckbox.addEventListener("change", function () {
        updatePatientList();
    });

    outPatientsCheckbox.addEventListener("change", function () {
        updatePatientList();
    });

    // Update the patient list based on the filter conditions, only data that agrees with the conditions will be displayed. If no conditions, all data will be displayed 
    function updatePatientList() {
        if (elderlyPatientsCheckbox && outPatientsCheckbox) {
            const showElderly = elderlyPatientsCheckbox.checked;
            const showOutPatients = outPatientsCheckbox.checked;

            const filteredPatients = patients.filter((patient) => {
                const isElderly = calculateAge(patient.dateOfBirth) >= 65;
                return (showElderly ? isElderly : true) && (showOutPatients ? patient.isOutPatient === "Yes" : true);
            });

            const tbody = document.getElementById("tbodyPatientsList");
            tbody.innerHTML = "";

            filteredPatients.forEach((patient) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${patient.patientIdNumber}</td>
                    <td>${patient.firstName}</td>
                    <td>${patient.middleInitials}</td>
                    <td>${patient.lastName}</td>
                    <td>${patient.dateOfBirth}</td>
                    <td>${patient.department}</td>
                    <td>${patient.isOutPatient}</td>
                `;

                tbody.appendChild(row);
            });
        }
    }

    // Age calculation for filtering purposes 
    function calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 && today.getDate() < birthDate.getDate()) {
            age--;
        }

        return age;
    }

    // Display all patients when the page loads, get them from the local storage
    updatePatientList();
});
