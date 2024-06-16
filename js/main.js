$(document).ready(function () {
  // Search functionality

  let activeTab = "personnel";

  $("#searchInp").on("keyup", function () {
    let searchText = $(this).val();
    if (activeTab === "departments") {
      searchDepartment(searchText, activeTab);
    } else if (activeTab === "locations") {
      searchLocation(searchText, activeTab);
    } else {
      search(searchText, activeTab);
    }
  });

  // Function to perform search
  function search(searchText, tableName) {
    $.ajax({
      url: "libs/php/searchAll.php",
      type: "GET",
      dataType: "json",
      data: {
        query: searchText,
      },
      success: function (result) {
        // Handle search results
        // Update table or display search results as per your requirement
        displayData(result.data, tableName);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error searching:", errorThrown);
      },
    });
  }

  // Function to perform search
  function searchDepartment(searchText, tableName) {
    $.ajax({
      url: "libs/php/searchDepartment.php",
      type: "GET",
      dataType: "json",
      data: {
        name: searchText,
      },
      success: function (result) {
        // Handle search results
        // Update table or display search results as per your requirement
        displayData(result.data, tableName);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error searching:", errorThrown);
      },
    });
  }

  // Function to perform search
  function searchLocation(searchText, tableName) {
    $.ajax({
      url: "libs/php/searchLocation.php",
      type: "GET",
      dataType: "json",
      data: {
        name: searchText,
      },
      success: function (result) {
        // Handle search results
        // Update table or display search results as per your requirement
        displayData(result.data, tableName);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error searching:", errorThrown);
      },
    });
  }

  // Refresh button click handler
  $("#refreshBtn").click(function () {
    refreshTable(activeTab);
    // clear the search input and filter too
    $("#searchInp").val("");
    $("#filterPersonnelDepartment").val("");
    $("#filterPersonnelLocation").val("");
  });

  var currentfilterDepartmentSelect = "";
  var currentfilterLocationSelect = "";

  // Function to fetch and populate department options
  function fetchDepartmentsForFilter() {
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          console.log(response);
          let departmentData = response.data;
          let html = '<option value="">All</option>';
          departmentData.forEach(function (department) {
            html += `<option value="${department.id}">${department.departmentName}</option>`;
          });
          $("#filterPersonnelDepartment").html(html);
          $("#filterPersonnelDepartment").val(currentfilterDepartmentSelect); // Restore the stored value
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  }

  // Function to fetch and populate location options
  function fetchLocations() {
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let locationData = response.data;
          let html = '<option value="">All</option>';
          locationData.forEach(function (location) {
            html += `<option value="${location.id}">${location.locationName}</option>`;
          });
          $("#filterPersonnelLocation").html(html);
          $("#filterPersonnelLocation").val(currentfilterLocationSelect); // Restore the stored value
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  }

  // Fetch data and restore select values when the modal is shown
  $("#filterPersonnelModal").on("show.bs.modal", function (e) {
    currentfilterDepartmentSelect = $("#filterPersonnelDepartment").val();
    currentfilterLocationSelect = $("#filterPersonnelLocation").val();

    $.when(fetchDepartmentsForFilter(), fetchLocations()).done(function () {
      $("#filterPersonnelDepartment").val(currentfilterDepartmentSelect);
      $("#filterPersonnelLocation").val(currentfilterLocationSelect);
    });
  });

  // Apply filter function
  function applyFilter() {
    let formData = {
      filterDepartment: $("#filterPersonnelDepartment").val(),
      filterLocation: $("#filterPersonnelLocation").val(),
    };

    // Make API call to filter personnel data
    $.ajax({
      url: "libs/php/filteredPersonnel.php",
      type: "GET",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response.status.code === "200") {
          // Close the modal or handle success message
          displayData(response.data.personnel, "personnel");
        } else {
          console.log(
            "Error filtering personnel: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error filtering personnel: " + error);
        // Handle error message display or other actions
      },
    });
  }

  // Apply filter immediately on selection change
  $("#filterPersonnelDepartment, #filterPersonnelLocation").change(function () {
    if (
      $(this).attr("id") === "filterPersonnelDepartment" &&
      $(this).val() !== ""
    ) {
      $("#filterPersonnelLocation").val("");
    } else if (
      $(this).attr("id") === "filterPersonnelLocation" &&
      $(this).val() !== ""
    ) {
      $("#filterPersonnelDepartment").val("");
    }
    applyFilter();
  });

  $("#addDepartmentModal").on("show.bs.modal", function (e) {
    // fetch location data and add in the select options
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let locationData = response.data;
          $("#addDepartmentLocation").empty();
          // store the option in variable and append at once
          let option = "";
          locationData.forEach(function (location) {
            option += `<option value="${location.id}">${location.locationName}</option>`;
          });
          $("#addDepartmentLocation").html(option);
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  });

  $("#addPersonnelModal").on("show.bs.modal", function (e) {
    // fetch department data and add in the select options
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let departmentData = response.data;
          $("#addPersonnelDepartment").empty();
          // store the option into variable and append at once
          let option = "";
          departmentData.forEach(function (department) {
            option += `<option value="${department.id}">${department.departmentName}</option>`;
          });
          $("#addPersonnelDepartment").html(option);
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  });

  // Tab click handlers
  $("#personnelBtn, #departmentsBtn, #locationsBtn").click(function () {
    activeTab = $(this).attr("id").replace("Btn", "");
    refreshTable(activeTab);
    if (activeTab == "departments") {
      // disable filterBtn when activeTab is departments
      $("#filterBtn").prop("disabled", true);
      // need to add data attribute to addBtn when activeTab is departments
      $("#addBtn").attr("data-bs-toggle", "modal");
      $("#addBtn").attr("data-bs-target", "#addDepartmentModal");
      $("#addBtn").attr("data-id", "addDepartment");
    } else if (activeTab == "locations") {
      // disable filterBtn when activeTab is locations
      $("#filterBtn").prop("disabled", true);
      $("#addBtn").attr("data-bs-toggle", "modal");
      $("#addBtn").attr("data-bs-target", "#addLocationModal");
      $("#addBtn").attr("data-id", "addLocation");
    } else {
      $("#filterBtn").prop("disabled", false);
      $("#addBtn").attr("data-bs-toggle", "modal");
      $("#addBtn").attr("data-bs-target", "#addPersonnelModal");
      $("#addBtn").attr("data-id", "addPersonnel");
    }
  });

  // Function to refresh table data
  function refreshTable(tableName) {
    if (tableName === "personnel") {
      fetchData();
    } else if (tableName === "departments") {
      fetchDepartments();
    } else if (tableName === "locations") {
      fetchLocation();
    }
  }

  // Edit personnel modal show event handler
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    let personnelId = $(e.relatedTarget).attr("data-id");
    fetchPersonnelData(personnelId);
  });

  // Edit department modal show event handler
  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    let departmentId = $(e.relatedTarget).attr("data-id");
    fetchDepartmentData(departmentId);
  });

  // Edit location modal show event handler
  $("#editLocationModal").on("show.bs.modal", function (e) {
    let locationId = $(e.relatedTarget).attr("data-id");
    fetchLocationData(locationId);
  });

  // Edit personnel form submission handler
  $("#editPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    // Gather form data
    var formData = {
      id: $("#editPersonnelEmployeeID").val(),
      firstName: $("#editPersonnelFirstName").val(),
      lastName: $("#editPersonnelLastName").val(),
      jobTitle: $("#editPersonnelJobTitle").val(),
      email: $("#editPersonnelEmailAddress").val(),
      departmentID: $("#editPersonnelDepartment").val(),
    };

    // Make API call to update personnel data
    $.ajax({
      url: "libs/php/updatePersonnel.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response.status.code === "200") {
          // Close the modal or handle success message
          $("#editPersonnelModal").modal("hide");
          refreshTable("personnel");
        } else {
          console.log(
            "Error updating personnel data: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error updating personnel data: " + error);
        // Handle error message display or other actions
      },
    });
  });

  // Edit department form submission handler
  $("#editDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    // Gather form data
    var formData = {
      id: $("#editDepartmentID").val(),
      name: $("#editDepartmentName").val(),
      locationID: $("#editDepartmentLocation").val(),
    };

    // Make API call to update department data
    $.ajax({
      url: "libs/php/updateDepartment.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response.status.code === "200") {
          // Close the modal or handle success message
          $("#editDepartmentModal").modal("hide");
          refreshTable("departments");
        } else {
          console.log(
            "Error updating department data: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error updating department data: " + error);
        // Handle error message display or other actions
      },
    });
  });

  // Edit location form submission handler
  $("#editLocationForm").on("submit", function (e) {
    e.preventDefault();
    // Gather form data
    var formData = {
      id: $("#editLocationID").val(),
      name: $("#editLocationName").val(),
    };

    // Make API call to update location data
    $.ajax({
      url: "libs/php/updateLocation.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response.status.code === "200") {
          // Close the modal or handle success message
          $("#editLocationModal").modal("hide");
          refreshTable("locations");
        } else {
          console.log(
            "Error updating location data: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error updating location data: " + error);
        // Handle error message display or other actions
      },
    });
  });

  function fetchData() {
    $.ajax({
      url: "libs/php/getAll.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          displayData(response.data, "personnel");
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  }

  function fetchDepartments() {
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          displayData(response.data, "departments");
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  }

  function fetchLocation() {
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          displayData(response.data, "locations");
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  }

  // Function to fetch personnel data for editing
  function fetchPersonnelData(personnelId) {
    // Fetch personnel data for editing
    $.ajax({
      url: `libs/php/getPersonnelById.php?id=${personnelId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let personnelData = response.data.personnel[0];
          let departmentData = [];

          $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "GET",
            dataType: "json",
            success: async function (response) {
              if (response.status.code === "200") {
                departmentData = await response.data;
                // Populate the edit personnel form with the fetched data
                $("#editPersonnelEmployeeID").val(personnelData.id);
                $("#editPersonnelFirstName").val(personnelData.firstName);
                $("#editPersonnelLastName").val(personnelData.lastName);
                $("#editPersonnelJobTitle").val(personnelData.jobTitle);
                $("#editPersonnelEmailAddress").val(personnelData.email);

                // Populate department select options
                $("#editPersonnelDepartment").empty();
                // store the department options in variable and append at once
                let option = "";
                departmentData.forEach(function (department) {
                  option += `<option value="${department.id}">${department.departmentName}</option>`;
                });
                $("#editPersonnelDepartment").html(option);
                $("#editPersonnelDepartment").val(personnelData.departmentID);
              } else {
                console.log("Error: " + response.status.description);
              }
            },
          });
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  }

  // Function to fetch department data for editing
  function fetchDepartmentData(departmentId) {
    // Fetch department data for editing
    $.ajax({
      url: `libs/php/getDepartmentById.php?id=${departmentId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let departmentData = response.data;
          let locationData = [];

          $.ajax({
            url: "libs/php/getAllLocations.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
              if (response.status.code === "200") {
                locationData = response.data;
                $("#editDepartmentID").val(departmentData.id);
                $("#editDepartmentName").val(departmentData.name);

                // Populate location select options

                $("#editDepartmentLocation").empty();
                // store location options in variable and append at once
                let locationOption = "";
                locationData.forEach(function (location) {
                  locationOption += `<option value="${location.id}">${location.locationName}</option>`;
                });
                $("#editDepartmentLocation").html(locationOption);
                $("#editDepartmentLocation").val(departmentData.locationId);
              } else {
                console.log("Error: " + response.status.description);
              }
            },
          });
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  }

  // Function to fetch location data for editing
  function fetchLocationData(locationId) {
    // Fetch location data for editing
    $.ajax({
      url: `libs/php/getLocationById.php?id=${locationId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let locationData = response.data;

          $("#editLocationID").val(locationData.id);
          $("#editLocationName").val(locationData.name);
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error: " + error);
      },
    });
  }

  function displayData(data, tableName) {
    var tableBody;

    // Determine the table body based on the tableName
    switch (tableName) {
      case "personnel":
        tableBody = $("#personnelTableBody");
        break;
      case "departments":
        tableBody = $("#departmentTableBody");
        break;
      case "locations":
        tableBody = $("#locationTableBody");
        break;
      default:
        console.log("Invalid table name:", tableName);
        return;
    }

    // Clear existing data from the table
    tableBody.empty();

    // Build the HTML for all rows
    var html = "";

    // Iterate through the data and create table rows
    data.forEach(function (item) {
      var row = "<tr>";
      // Customize the data display based on your table structure
      // For example, if your data object has properties like item.firstName, item.lastName, item.jobTitle, item.email, etc.
      // You can display them in appropriate table cells here
      if (tableName === "personnel") {
        // check if item.firstName and item.lastName are not null
        if (item.firstName != null || item.lastName != null) {
          row += "<td>" + (item?.lastName + ", " + item?.firstName) + "</td>";
        } else {
          row += "<td >-</td>";
        }
        row +=
          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" +
          (item.departmentName ? item.departmentName : "-") +
          "</td>";
        row +=
          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" +
          (item.locationName ? item.locationName : "-") +
          "</td>";
        row +=
          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" +
          (item.email ? item.email : "-") +
          "</td>";
        row +=
          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" +
          (item.jobTitle ? item.jobTitle : "-") +
          "</td>";
        row += `
                <td>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-primary btn-sm me-1 editPersonnelBtn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${item.id}">
                            <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn btn-primary btn-sm me-1 deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${item.id}">
                            <i class="fa-solid fa-trash fa-fw"></i>
                        </button>
                    </div>
                </td>
            `;
      } else if (tableName === "departments") {
        row +=
          "<td>" + (item.departmentName ? item.departmentName : "-") + "</td>";
        row +=
          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" +
          (item.locationName ? item.locationName : "-") +
          "</td>";
        row += `
                <td class="text-end text-nowrap">
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-primary btn-sm me-1 editDepartmentBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${item.id}">
                            <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn btn-primary btn-sm me-1 deleteDepartmentBtn" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${item.id}">
                            <i class="fa-solid fa-trash fa-fw"></i>
                        </button>
                    </div>
                </td>
            `;
      } else if (tableName === "locations") {
        row += "<td>" + (item.locationName ? item.locationName : "-") + "</td>";
        row += `
                <td class="text-end text-nowrap">
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-primary btn-sm me-1 editLocationBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${item.id}">
                            <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn btn-primary btn-sm me-1 deleteLocationBtn" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${item.id}">
                            <i class="fa-solid fa-trash fa-fw"></i>
                        </button>
                    </div>
                </td>
            `;
      }
      row += "</tr>";

      // Append the row to the HTML
      html += row;
    });

    // Append all rows to the table body
    tableBody.append(html);
  }

  // Fetch initial data
  fetchData();

  // delete department by id
  // delete department by id
  $(document).on("click", ".deleteDepartmentBtn", function () {
    let departmentId = $(this).data("id");
    // Call API to get information about the department
    $.ajax({
      url: `libs/php/getDepartmentInfo.php?id=${departmentId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let departmentInfo = response.data;
          if (departmentInfo.employeeCount > 0) {
            // If department is associated with employees, show error modal
            $("#error_title").text("Cannot remove department ...");
            $("#errorMessageModal")
              .find("#error_message")
              .text(
                `You cannot remove the entry for ${departmentInfo.departmentName} because it has ${departmentInfo.employeeCount} employees assigned to it.`
              );
            $("#errorMessageModal").modal("show");
          } else {
            // If department is not associated, show confirmation modal
            $("#areYouSureDeptName").text(departmentInfo.departmentName);

            $("#areYouSureDeleteModal").modal("show");

            // Handling the click event for YES button
            $("#areYouSureDeleteModal #remove_modal_confirm_button")
              .off("click")
              .on("click", function () {
                deleteDepartment(departmentId);
              });
          }
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error fetching department info: " + error);
      },
    });
  });

  function deleteDepartment(departmentId) {
    $.ajax({
      url: `libs/php/deleteDepartmentById.php?id=${departmentId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          $("#areYouSureDeleteModal").modal("hide");
          refreshTable("departments");
        } else {
          // show error message errorMessageModal dialog
          $("#errorMessageModal")
            .find("#error_message")
            .text(response.status.description);
          $("#errorMessageModal").modal("show");
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error deleting department: " + error);
      },
    });
  }

  // delete location by id
  // delete location by id
  $(document).on("click", ".deleteLocationBtn", function () {
    let locationId = $(this).data("id");
    // Call API to get information about the location
    $.ajax({
      url: `libs/php/getLocationInfo.php?id=${locationId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let locationInfo = response.data;
          if (locationInfo.departmentCount > 0) {
            // If location is associated with departments, show error modal
            $("#error_title").text("Cannot remove location...");
            $("#errorMessageModal")
              .find("#error_message")
              .text(
                `You cannot remove the entry for ${locationInfo.locationName} because it has ${locationInfo.departmentCount} departments associated with it.`
              );
            $("#errorMessageModal").modal("show");
          } else {
            // If location is not associated, show confirmation modal
            $("#areYouSureDeptName").text(locationInfo.locationName);
            $("#areYouSureDeleteModal").modal("show");

            // Handling the click event for YES button
            $("#areYouSureDeleteModal #remove_modal_confirm_button")
              .off("click")
              .on("click", function () {
                deleteLocation(locationId);
              });
          }
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error fetching location info: " + error);
      },
    });
  });

  function deleteLocation(locationId) {
    $.ajax({
      url: `libs/php/deleteLocationById.php?id=${locationId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          $("#areYouSureDeleteModal").modal("hide");
          refreshTable("locations");
        } else {
          // show error message errorMessageModal dialog
          $("#errorMessageModal")
            .find("#error_message")
            .text(response.status.description);
          $("#errorMessageModal").modal("show");
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error deleting location: " + error);
      },
    });
  }

  // delete personnel by id
  $(document).on("click", ".deletePersonnelBtn", function () {
    let personnelId = $(this).data("id");
    // when we click on the delete open modal dialog
    // change remove_modal_title
    // change remove_modal_confirm_button event handler
    $.ajax({
      url: `libs/php/getPersonnelById.php?id=${personnelId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let personnelData = response.data.personnel[0];

          $("#areYouSureDeleteModal")
            .find("#remove_modal_title")
            .text("Delete Personnel");
          $("#areYouSureDeleteModal")
            .find("#remove_modal_confirm_button")
            .off("click")
            .on("click", function () {
              deletePersonnel(personnelId);
            });
          $("#areYouSureDeptName").text(
            `${personnelData?.lastName}, ${personnelData?.firstName}`
          );
          $("#areYouSureDeleteModal").modal("show");
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error fetching location info: " + error);
      },
    });
  });

  function deletePersonnel(personnelId) {
    $.ajax({
      url: `libs/php/deletePersonnelById.php?id=${personnelId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          $("#deletePersonnelModal").modal("hide");
          refreshTable("personnel");
        } else {
          console.log(
            "Error deleting personnel: " + response.status.description
          );
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error deleting personnel: " + error);
      },
    });
  }

  // Add department form submission handler
  $("#addDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    // Gather form data
    var formData = {
      name: $("#addDepartmentName").val(),
      locationID: $("#addDepartmentLocation").val(),
    };

    // Make API call to add department data
    $.ajax({
      url: "libs/php/insertDepartment.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response.status.code === "200") {
          // Close the modal or handle success message
          $("#addDepartmentModal").modal("hide");
          $("#addDepartmentName").val("");
          refreshTable("departments");
        } else {
          $("#errorMessageModal")
            .find("#error_message")
            .text(`${response.status.description}`);
          $("#errorMessageModal").modal("show");
          $("#addDepartmentName").val("");
          $("#addDepartmentModal").modal("hide");
          refreshTable("departments");
          console.log(
            "Error adding department: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error adding department: " + error);
        // Handle error message display or other actions
      },
    });
  });

  // Add location form submission handler
  $("#addLocationForm").on("submit", function (e) {
    e.preventDefault();
    // Gather form data
    var formData = {
      name: $("#addLocationName").val(),
    };

    // Make API call to add location data
    $.ajax({
      url: "libs/php/insertLocation.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response.status.code === "200") {
          // Close the modal or handle success message
          $("#addLocationName").val("");
          $("#addLocationModal").modal("hide");
          refreshTable("locations");
        } else {
          console.log("Error adding location: " + response.status.description);
          $("#errorMessageModal")
            .find("#error_message")
            .text(`${response.status.description}`);
          $("#errorMessageModal").modal("show");

          $("#addLocationName").val("");
          $("#addLocationModal").modal("hide");
          refreshTable("locations");
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error adding location: " + error);
        // Handle error message display or other actions
      },
    });
  });

  // Add personnel form submission handler
  $("#addPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    // Gather form data
    var formData = {
      firstName: $("#addPersonnelFirstName").val(),
      lastName: $("#addPersonnelLastName").val(),
      jobTitle: $("#addPersonnelJobTitle").val(),
      email: $("#addPersonnelEmailAddress").val(),
      departmentID: $("#addPersonnelDepartment").val(),
    };

    // Make API call to add personnel data
    $.ajax({
      url: "libs/php/insertPersonnel.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response.status.code === "200") {
          // Close the modal or handle success message
          $("#addPersonnelModal").modal("hide");
          $("#addPersonnelFirstName").val("");
          $("#addPersonnelLastName").val("");
          $("#addPersonnelJobTitle").val("");
          $("#addPersonnelEmailAddress").val("");
          $("#addPersonnelDepartment").val("");
          refreshTable("personnel");
        } else {
          $("#errorMessageModal")
            .find("#error_message")
            .text(`${response.status.description}`);
          $("#errorMessageModal").modal("show");

          $("#addPersonnelModal").modal("hide");
          $("#addPersonnelFirstName").val("");
          $("#addPersonnelLastName").val("");
          $("#addPersonnelJobTitle").val("");
          $("#addPersonnelEmailAddress").val("");
          $("#addPersonnelDepartment").val("");
          refreshTable("personnel");

          console.log("Error adding personnel: " + response.status.description);
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        $("#errorMessageModal")
          .find("#error_message")
          .text(`Something went wrong !`);
        $("#errorMessageModal").modal("show");
        console.log("Error adding personnel: " + error);
        // Handle error message display or other actions
      },
    });
  });
});
