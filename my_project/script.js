console.log("hello");

    let currentHeadingLevel = 1;
    const maxHeadingLevel = 15;
    const headingList = document.getElementById("headingList");
    const headingDropdown = document.getElementById("headingDropdown");
    const subheadingDropdown = document.getElementById("subheadingDropdown");
    const subheadingInput = document.getElementById("subheadingInput");

    let draggedSubheading = null; // Track dragged element

    // Function to add a new heading
    function addHeading() {
      if (currentHeadingLevel <= maxHeadingLevel) {
        const heading = document.createElement('div');
        heading.classList.add('heading');
        heading.innerHTML = `Heading ${currentHeadingLevel}`;

        const subheadingContainer = document.createElement('ul');
        subheadingContainer.classList.add('subheading-container');
        heading.appendChild(subheadingContainer);

        // Event listener for dragover and drop
        heading.addEventListener('dragover', handleDragOver);
        heading.addEventListener('drop', handleDropOnHeading);

        headingList.appendChild(heading);

        // Add the new heading to the dropdown
        const option = document.createElement('option');
        option.value = currentHeadingLevel;
        option.textContent = `Heading ${currentHeadingLevel}`;
        headingDropdown.appendChild(option);

        currentHeadingLevel++;
      }
    }

    // Function to add a subheading or sub-subheading under the selected heading/subheadingDropdown
    function addSubheading() {
      const selectedHeadingLevel = headingDropdown.value; // Get the selected heading
      const selectedSubheadingText = subheadingDropdown.value; // Get the selected subheading
      const subheadingText = subheadingInput.value.trim(); // Get user input

      if (!subheadingText) {
        alert("Please enter a subheading or sub-subheading text.");
        return;
      }

      // Case 1: Adding a subheading under a selected heading
      if (selectedHeadingLevel && !selectedSubheadingText) {
        // Find the selected heading
        const selectedHeading = headingList.children[selectedHeadingLevel - 1];
        const subheadingContainer = selectedHeading.querySelector('.subheading-container');

        // Create new subheading element
        const subLi = document.createElement('li');
        subLi.classList.add('subheading');
        subLi.innerHTML = `${subheadingText}`;

        // Event listener for dragstart and dragend
        subLi.setAttribute('draggable', 'true'); // Make it draggable

        subLi.addEventListener('dragstart', handleDragStart);
        subLi.addEventListener('dragend', handleDragEnd);

        // Create container for sub-subheadings under this subheading
        const subSubheadingContainer = document.createElement('ul');
        subSubheadingContainer.classList.add('sub-subheading-container');
        subLi.appendChild(subSubheadingContainer);

        // Append the new subheading to the selected heading
        subheadingContainer.appendChild(subLi);

        // Repopulate the subheading dropdown with only subheadings of the current heading
        updateSubheadingDropdown(selectedHeadingLevel);

        // Clear input
        subheadingInput.value = '';

      } else if (selectedSubheadingText) {
        // Find the selected subheading
        const subheadings = document.querySelectorAll('.subheading');
        let selectedSubheading = null;

        // Match the selected subheading text
        subheadings.forEach(sub => {
          if (sub.firstChild.textContent === selectedSubheadingText) {
            selectedSubheading = sub;
          }
        });

        if (selectedSubheading) {
          // Find or create the sub-subheading container within the selected subheading
          let subSubheadingContainer = selectedSubheading.querySelector('.sub-subheading-container');

          // Create a new sub-subheading list item
          const subSubLi = document.createElement('li');
          subSubLi.classList.add('sub-subheading');
          subSubLi.innerHTML = `${subheadingText}`;

          // Append as list item under subheading (can append multiple times)
          subSubheadingContainer.appendChild(subSubLi);

          // Clear input after adding sub-subheading
          subheadingInput.value = '';
        }
      } else {
        alert("Please select a heading or subheading first.");
      }
    }

    // Function to update the subheading dropdown for the selected heading
    function updateSubheadingDropdown(selectedHeadingLevel) {
      // Clear the subheading dropdown
      subheadingDropdown.innerHTML = '<option value="" disabled selected>Select a Subheading</option>';

      // Get the selected heading
      const selectedHeading = headingList.children[selectedHeadingLevel - 1];
      const subheadingContainer = selectedHeading.querySelector('.subheading-container');

      // Get all the subheadings under the selected heading
      const subheadings = subheadingContainer.querySelectorAll('.subheading');

      // Add only the subheadings (not sub-subheadings) to the dropdown
      subheadings.forEach(subheading => {
        const option = document.createElement('option');
        option.value = subheading.textContent;
        option.textContent = subheading.firstChild.textContent; // Ensure it's the main subheading, not sub-subheading text
        subheadingDropdown.appendChild(option);
      });
    }

    // Drag and Drop Event Handlers
    function handleDragStart(e) {
      draggedSubheading = e.target;
      e.target.style.opacity = '0.5';
    }

    function handleDragEnd(e) {
      e.target.style.opacity = '1';
      draggedSubheading = null;
    }

    function handleDragOver(e) {
      e.preventDefault();
      e.currentTarget.classList.add('drag-over');
    }

    function handleDropOnHeading(e) {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over');

      if (draggedSubheading) {
        // Ensure that the heading has a subheading container (create one if it doesn't)
        let subheadingContainer = e.currentTarget.querySelector('.subheading-container');
        if (!subheadingContainer) {
          subheadingContainer = document.createElement('ul');
          subheadingContainer.classList.add('subheading-container');
          e.currentTarget.appendChild(subheadingContainer);
        }

        // Append the dragged subheading to the subheading container
        subheadingContainer.appendChild(draggedSubheading);
      }
    }

    // Event listener for heading dropdown change
    headingDropdown.addEventListener('change', function () {
      const selectedHeadingLevel = headingDropdown.value;
      if (selectedHeadingLevel) {
        updateSubheadingDropdown(selectedHeadingLevel);
      }
    });

    // Event listeners for buttons
    document.getElementById("addHeadingBtn").addEventListener("click", addHeading);
    document.getElementById("addSubheadingBtn").addEventListener("click", addSubheading);