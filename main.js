$(document).ready(function () {
  // Search functionality
  // Search functionality
  $("#searchInp").on("keyup", function () {
    let searchText = $(this).val();
    search(searchText);
  });

  // Function to perform search
  function search(searchText) {
    $.ajax({
      url: "https://coding.itcareerswitch.co.uk/companydirectory/libs/php/searchAll.php",
      type: "GET",
      dataType: "json",
      data: {
        txt: searchText,
      },
      success: function (result) {
        // Handle search results
        // Update table or display search results as per your requirement
        console.log("Search result:", result);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error searching:", errorThrown);
      },
    });
  }

  // Refresh button click handler
  $("#refreshBtn").click(function () {
    if ($("#personnelBtn").hasClass("active")) {
      refreshTable("personnel");
    } else if ($("#departmentsBtn").hasClass("active")) {
      refreshTable("departments");
    } else {
      refreshTable("locations");
    }
  });

  // Filter button click handler
  $("#filterBtn").click(function () {
    // Open filter modal
    // Implement filter modal opening logic
  });

  // Add button click handler
  $("#addBtn").click(function () {
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    if ($("#personnelBtn").hasClass("active")) {
      openAddModal("personnel");
    } else if ($("#departmentsBtn").hasClass("active")) {
      openAddModal("departments");
    } else {
      openAddModal("locations");
    }
  });

  // Tab click handlers
  $("#personnelBtn").click(function () {
    refreshTable("personnel");
  });

  $("#departmentsBtn").click(function () {
    refreshTable("departments");
  });

  $("#locationsBtn").click(function () {
    refreshTable("locations");
  });

  // Edit personnel modal show event handler
  $(document).on("click", ".editPersonnelBtn", function () {
    let personnelId = $(this).data("id");
    fetchPersonnelData(personnelId);
  });

  // Edit personnel form submission handler
  $("#editPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    // Handle form submission
    // Implement form submission logic
  });

  // Function to refresh table data
  function refreshTable(tableName) {
    // Refresh table logic based on tableName
    // Implement table refresh logic
  }

  // Function to open add modal
  function openAddModal(tableName) {
    // Open add modal logic based on tableName
    // Implement add modal opening logic
  }

  $("#addDepartmentForm").on("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form data
    var formData = {
      name: $("#departmentNameInput").val(),
      locationID: $("#locationIDInput").val(),
    };

    // Send AJAX POST request to insertDepartment.php
    $.ajax({
      url: "insertDepartment.php",
      type: "POST",
      data: formData,
      dataType: "json",
      success: function (response) {
        // Handle success response
        if (response.status.code === "200") {
          // Department inserted successfully
          alert("Department added successfully!");
          // You can add more actions here if needed, like refreshing the department table
        } else {
          // Handle other status codes if needed
          alert("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        // Handle error response
        alert("Error: " + error);
      },
    });
  });

  // Function to fetch personnel data for editing
  function fetchPersonnelData(personnelId) {
    console.log("Fetching personnel data for ID:", personnelId);
    $.ajax({
      url: "https://coding.itcareerswitch.co.uk/companydirectory/libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: personnelId,
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

          $("#editPersonnelDepartment").html("");

          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name,
              })
            );
          });

          $("#editPersonnelDepartment").val(
            result.data.personnel[0].departmentID
          );
        } else {
          $("#editPersonnelModal .modal-title").text("Error retrieving data");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error retrieving data:", errorThrown);
        $("#editPersonnelModal .modal-title").text("Error retrieving data");
      },
    });
  }

  function fetchData() {
    $.ajax({
      url: "libs/php/getAll.php", // Assuming the PHP script is named getAll.php
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          // Data retrieval successful
          displayData(response.data); // Call function to display data
          fetchDepartments(); // Call function to fetch departments
        } else {
          // Handle other status codes if needed
          console.error("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        // Handle error response
        console.error("Error: " + error);
      },
    });
  }

  function fetchDepartments() {
    $.ajax({
      url: "libs/php/getAllDepartments.php", // URL to fetch departments
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          // Department data retrieval successful
          // You can handle department data here as per your requirement
          console.log("Department data:", response.data);
        } else {
          // Handle other status codes if needed
          console.error("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        // Handle error response
        console.error("Error: " + error);
      },
    });
  }

  // Function to display data in UI
  function displayData(data) {
    // Assuming you have a table with id "personnelTableBody" to display the personnel data
    var tableBody = $("#personnelTableBody");

    // Clear existing data from the table
    tableBody.empty();

    // Iterate through the data and create table rows
    data.forEach(function (person) {
      var row = $("<tr>");
      row.append($("<td>").text(person.lastName + ", " + person.firstName));
      row.append($("<td>").text(person.jobTitle));
      row.append($("<td>").text(person.location));
      row.append($("<td>").text(person.email));

      // Create buttons column
      var buttonsCell = $("<td>").addClass("text-end text-nowrap");
      var editButton = $("<button>")
        .addClass("btn btn-primary btn-sm")
        .attr({
          type: "button",
          "data-bs-toggle": "modal",
          "data-bs-target": "#editPersonnelModal",
          "data-id": person.id, // Assuming person.id represents the unique identifier of each personnel
        })
        .html('<i class="fa-solid fa-pencil fa-fw"></i>');
      var deleteButton = $("<button>")
        .addClass("btn btn-primary btn-sm deletePersonnelBtn")
        .attr("type", "button")
        .attr("data-id", person.id) // Assuming person.id represents the unique identifier of each personnel
        .html('<i class="fa-solid fa-trash fa-fw"></i>');

      // Append buttons to buttonsCell
      buttonsCell.append(editButton).append(deleteButton);

      // Append the buttonsCell to the row
      row.append(buttonsCell);

      // Append the row to the table body
      tableBody.append(row);
    });
  }

  // Call the fetchData function to fetch and display data when the page loads
  fetchData();
});
