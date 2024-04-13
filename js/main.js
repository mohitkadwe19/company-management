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
        console.log("Search results:", result);
        displayData(result.data, tableName);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error searching:", errorThrown);
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
        console.log("Search results:", result);
        displayData(result.data, tableName);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error searching:", errorThrown);
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
        console.log("Search results:", result);
        displayData(result.data, tableName);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error searching:", errorThrown);
      },
    });
  }

  // Refresh button click handler
  $("#refreshBtn").click(function () {
    refreshTable(activeTab);
  });

  // Filter button click handler
  $("#filterBtn").click(function () {
    // Open filter modal
    // Implement filter modal opening logic
    if (activeTab == "personnel") {
      $("#filterPersonnelModal").modal("show");
      // fetch department data and add in the select options
      $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        success: function (response) {
          if (response.status.code === "200") {
            let departmentData = response.data;
            $("#filterPersonnelDepartment").empty();
            departmentData.forEach(function (department) {
              $("#filterPersonnelDepartment").append(
                `<option value="${department.id}">${department.departmentName}</option>`
              );
            });
          } else {
            console.error("Error: " + response.status.description);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error: " + error);
        },
      });
    } else if (activeTab == "departments") {
      $("#filterDepartmentsModal").modal("show");
      // fetch locations data and add in the select options
      $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        dataType: "json",
        success: function (response) {
          if (response.status.code === "200") {
            let locationData = response.data;
            $("#filterDepartmentLocation").empty();
            locationData.forEach(function (location) {
              $("#filterDepartmentLocation").append(
                `<option value="${location.id}">${location.locationName}</option>`
              );
            });
          } else {
            console.error("Error: " + response.status.description);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error: " + error);
        },
      });
    } else if (activeTab == "locations") {
      $("#filterLocationsModal").modal("show");
    }
  });

  // Add button click handler
  $("#addBtn").click(function () {
    openAddModal(activeTab);
  });

  // Tab click handlers
  $("#personnelBtn, #departmentsBtn, #locationsBtn").click(function () {
    activeTab = $(this).attr("id").replace("Btn", "");
    refreshTable(activeTab);
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

  // Function to open add modal
  function openAddModal(tableName) {
    if (tableName === "personnel") {
      $("#addPersonnelModal").modal("show");
      // fetch department data and add in the select options
      $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        success: function (response) {
          if (response.status.code === "200") {
            let departmentData = response.data;
            $("#addPersonnelDepartment").empty();
            departmentData.forEach(function (department) {
              $("#addPersonnelDepartment").append(
                `<option value="${department.id}">${department.departmentName}</option>`
              );
            });
          } else {
            console.error("Error: " + response.status.description);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error: " + error);
        },
      });
    } else if (tableName === "departments") {
      $("#addDepartmentModal").modal("show");
      // fetch location data and add in the select options
      $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        dataType: "json",
        success: function (response) {
          if (response.status.code === "200") {
            let locationData = response.data;
            $("#addDepartmentLocation").empty();
            locationData.forEach(function (location) {
              $("#addDepartmentLocation").append(
                `<option value="${location.id}">${location.locationName}</option>`
              );
            });
          } else {
            console.error("Error: " + response.status.description);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error: " + error);
        },
      });
    } else if (tableName === "locations") {
      $("#addLocationModal").modal("show");
    }
  }

  // Edit personnel modal show event handler
  $(document).on("click", ".editPersonnelBtn", function () {
    let personnelId = $(this).data("id");
    fetchPersonnelData(personnelId);
  });

  // Edit department modal show event handler
  $(document).on("click", ".editDepartmentBtn", function () {
    let departmentId = $(this).data("id");
    fetchDepartmentData(departmentId);
  });

  // Edit location modal show event handler
  $(document).on("click", ".editLocationBtn", function () {
    let locationId = $(this).data("id");
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
          console.log("Personnel data updated successfully");
          // Close the modal or handle success message
          $("#editPersonnelModal").modal("hide");
          refreshTable("personnel");
        } else {
          console.error(
            "Error updating personnel data: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        console.error("Error updating personnel data: " + error);
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
          console.log("Department data updated successfully");
          // Close the modal or handle success message
          $("#editDepartmentModal").modal("hide");
          refreshTable("departments");
        } else {
          console.error(
            "Error updating department data: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        console.error("Error updating department data: " + error);
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
          console.log("Location data updated successfully");
          // Close the modal or handle success message
          $("#editLocationModal").modal("hide");
          refreshTable("locations");
        } else {
          console.error(
            "Error updating location data: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        console.error("Error updating location data: " + error);
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
          console.error("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error: " + error);
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
          console.error("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error: " + error);
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
          console.error("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error: " + error);
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
          let departmentData = response.data.department;

          console.log("Personnel data:", personnelData);

          // Populate the edit personnel form with the fetched data
          $("#editPersonnelEmployeeID").val(personnelData.id);
          $("#editPersonnelFirstName").val(personnelData.firstName);
          $("#editPersonnelLastName").val(personnelData.lastName);
          $("#editPersonnelJobTitle").val(personnelData.jobTitle);
          $("#editPersonnelEmailAddress").val(personnelData.email);

          // Populate department select options
          $("#editPersonnelDepartment").empty();
          departmentData.forEach(function (department) {
            $("#editPersonnelDepartment").append(
              `<option value="${department.id}">${department.name}</option>`
            );
          });
          $("#editPersonnelDepartment").val(personnelData.departmentID);
        } else {
          console.error("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error: " + error);
      },
    });
  }

  // Function to fetch department data for editing
  function fetchDepartmentData(departmentId) {
    // Fetch department data for editing
    $.ajax({
      url: `libs/php/getDepartmentByID.php?id=${departmentId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let departmentData = response.data;
          let locationData = response.data.locations;

          $("#editDepartmentID").val(departmentData.id);
          $("#editDepartmentName").val(departmentData.name);

          // Populate location select options

          $("#editDepartmentLocation").empty();
          locationData.forEach(function (location) {
            $("#editDepartmentLocation").append(
              `<option value="${location.id}">${location.name}</option>`
            );
          });
          $("#editDepartmentLocation").val(departmentData.locationId);
        } else {
          console.error("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error: " + error);
      },
    });
  }

  // Function to fetch location data for editing
  function fetchLocationData(locationId) {
    // Fetch location data for editing
    $.ajax({
      url: `libs/php/getLocationByID.php?id=${locationId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          let locationData = response.data;

          $("#editLocationID").val(locationData.id);
          $("#editLocationName").val(locationData.name);
        } else {
          console.error("Error: " + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error: " + error);
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
        console.error("Invalid table name:", tableName);
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
          row += "<td>" + (item?.firstName + " " + item?.lastName) + "</td>";
        } else {
          row += "<td>-</td>";
        }
        row += "<td>" + (item.jobTitle ? item.jobTitle : "-") + "</td>";
        row += "<td>" + (item.email ? item.email : "-") + "</td>";
        row +=
          "<td>" + (item.departmentName ? item.departmentName : "-") + "</td>";
        row += "<td>" + (item.locationName ? item.locationName : "-") + "</td>";
        row += `
                <td>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-primary btn-sm me-1 editPersonnelBtn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${item.id}">
                            <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm me-1 deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${item.id}">
                            <i class="fa-solid fa-trash fa-fw"></i>
                        </button>
                    </div>
                </td>
            `;
      } else if (tableName === "departments") {
        row +=
          "<td>" + (item.departmentName ? item.departmentName : "-") + "</td>";
        row += "<td>" + (item.locationName ? item.locationName : "-") + "</td>";
        row += `
                <td>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-primary btn-sm me-1 editDepartmentBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${item.id}">
                            <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm me-1 deleteDepartmentBtn" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${item.id}">
                            <i class="fa-solid fa-trash fa-fw"></i>
                        </button>
                    </div>
                </td>
            `;
      } else if (tableName === "locations") {
        row += "<td>" + (item.locationName ? item.locationName : "-") + "</td>";
        row += `
                <td>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-primary btn-sm me-1 editLocationBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${item.id}">
                            <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm me-1 deleteLocationBtn" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${item.id}">
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
  $(document).on("click", ".deleteDepartmentBtn", function () {
    let departmentId = $(this).data("id");
    // when we click on the delete open modal dialog
    // change remove_modal_title
    // change remove_modal_confirm_button event handler
    $("#areYouSureDeleteModal")
      .find("#remove_modal_title")
      .text("Delete Department");
    $("#areYouSureDeleteModal")
      .find("#remove_modal_confirm_button")
      .off("click")
      .on("click", function () {
        deleteDepartment(departmentId);
      });
    $("#areYouSureDeleteModal").modal("show");
  });

  function deleteDepartment(departmentId) {
    $.ajax({
      url: `libs/php/deleteDepartmentByID.php?id=${departmentId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          console.log("Department deleted successfully");
          $("#deleteDepartmentModal").modal("hide");
          refreshTable("departments");
        } else {
          console.error(
            "Error deleting department: " + response.status.description
          );
          // show error message errorMessageModal dialog
          $("#errorMessageModal")
            .find("#error_message")
            .text(response.status.description);
          $("#errorMessageModal").modal("show");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error deleting department: " + error);
      },
    });
  }

  // delete location by id
  $(document).on("click", ".deleteLocationBtn", function () {
    let locationId = $(this).data("id");
    // when we click on the delete open modal dialog
    // change remove_modal_title
    // change remove_modal_confirm_button event handler
    $("#areYouSureDeleteModal")
      .find("#remove_modal_title")
      .text("Delete Location");
    $("#areYouSureDeleteModal")
      .find("#remove_modal_confirm_button")
      .off("click")
      .on("click", function () {
        deleteLocation(locationId);
      });
    $("#areYouSureDeleteModal").modal("show");
  });

  function deleteLocation(locationId) {
    $.ajax({
      url: `libs/php/deleteLocationByID.php?id=${locationId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          console.log("Location deleted successfully");
          $("#deleteLocationModal").modal("hide");
          refreshTable("locations");
        } else {
          console.error(
            "Error deleting location: " + response.status.description
          );
          // show error message errorMessageModal dialog
          $("#errorMessageModal")
            .find("#error_message")
            .text(response.status.description);
          $("#errorMessageModal").modal("show");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error deleting location: " + error);
      },
    });
  }

  // delete personnel by id
  $(document).on("click", ".deletePersonnelBtn", function () {
    let personnelId = $(this).data("id");
    // when we click on the delete open modal dialog
    // change remove_modal_title
    // change remove_modal_confirm_button event handler
    $("#areYouSureDeleteModal")
      .find("#remove_modal_title")
      .text("Delete Personnel");
    $("#areYouSureDeleteModal")
      .find("#remove_modal_confirm_button")
      .off("click")
      .on("click", function () {
        deletePersonnel(personnelId);
      });
    $("#areYouSureDeleteModal").modal("show");
  });

  function deletePersonnel(personnelId) {
    $.ajax({
      url: `libs/php/deletePersonnelByID.php?id=${personnelId}`,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status.code === "200") {
          console.log("Personnel deleted successfully");
          $("#deletePersonnelModal").modal("hide");
          refreshTable("personnel");
        } else {
          console.error(
            "Error deleting personnel: " + response.status.description
          );
        }
      },
      error: function (xhr, status, error) {
        console.error("Error deleting personnel: " + error);
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
          console.log("Department added successfully");
          // Close the modal or handle success message
          $("#addDepartmentModal").modal("hide");
          refreshTable("departments");
        } else {
          console.error(
            "Error adding department: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        console.error("Error adding department: " + error);
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
          console.log("Location added successfully");
          // Close the modal or handle success message
          $("#addLocationModal").modal("hide");
          refreshTable("locations");
        } else {
          console.error(
            "Error adding location: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        console.error("Error adding location: " + error);
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
          console.log("Personnel added successfully");
          // Close the modal or handle success message
          $("#addPersonnelModal").modal("hide");
          refreshTable("personnel");
        } else {
          console.error(
            "Error adding personnel: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        console.error("Error adding personnel: " + error);
        // Handle error message display or other actions
      },
    });
  });

  $("#filterPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    // Gather form data
    var formData = {
      filterName: $("#filterPersonnelName").val(),
      filterJobTitle: $("#filterPersonnelJobTitle").val(),
      filterDepartment: $("#filterPersonnelDepartment").val(),
    };

    // Make API call to filter personnel data
    $.ajax({
      url: "libs/php/filteredPersonnel.php",
      type: "GET",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response.status.code === "200") {
          console.log("Personnel filtered successfully");
          // Close the modal or handle success message
          $("#filterPersonnelModal").modal("hide");
          displayData(response.data.personnel, "personnel");
        } else {
          console.error(
            "Error filtering personnel: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        console.error("Error filtering personnel: " + error);
        // Handle error message display or other actions
      },
    });
  });

  $("#filterDepartmentsForm").on("submit", function (e) {
    e.preventDefault();

    // Gather form data
    var filterName = $("#filterDepartmentName").val().trim();
    var filterLocation = $("#filterDepartmentLocation").val().trim();

    // Basic validation: At least one field should be filled out
    if (!filterName && !filterLocation) {
      console.error("Please fill out at least one field.");
      return;
    }

    var formData = {
      filterName: filterName,
      filterLocation: filterLocation,
    };

    // Make API call to filter department data
    $.ajax({
      url: "libs/php/filterDepartment.php",
      type: "GET",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response.status.code === "200") {
          console.log("Departments filtered successfully");
          // Close the modal or handle success message
          $("#filterDepartmentsModal").modal("hide");
          displayData(response.data.departments, "departments");
        } else {
          console.error(
            "Error filtering departments: " + response.status.description
          );
          // Handle error message display or other actions
        }
      },
      error: function (xhr, status, error) {
        console.error("Error filtering departments: " + error);
        // Handle error message display or other actions
      },
    });
  });

  $("#filterLocationsForm").on("submit", function (e) {
    e.preventDefault();

    // Gather form data
    var filterName = $("#filterLocationName").val().trim();

    // Validation: Ensure filterName is not empty
    if (!filterName) {
      alert("Please enter a filter name.");
      return;
    }

    var formData = {
      filterName: filterName,
    };

    // Make API call to filter location data
    $.ajax({
      url: "libs/php/filterLocation.php",
      type: "GET",
      dataType: "json",
      data: formData,
      success: function (response) {
        if (response && response.status && response.status.code === "200") {
          console.log("Locations filtered successfully");
          // Close the modal or handle success message
          $("#filterLocationsModal").modal("hide");
          displayData(response.data.locations, "locations");
        } else {
          var errorMessage =
            response && response.status
              ? response.status.description
              : "Unknown error";
          console.error("Error filtering locations: " + errorMessage);
          // Handle error message display or other actions
          alert("Error filtering locations: " + errorMessage);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error filtering locations: " + error);
        // Handle error message display or other actions
        alert("Error filtering locations: " + error);
      },
    });
  });
});
