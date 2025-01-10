const services = [
  {
    label: "Laravel Development Services",
    value: "Laravel Development Services",
  },
  {
    label: "Microsoft Power Platform",
    value: "Microsoft Power Platform",
  },
  {
    label: "Microsoft Azure Development Services",
    value: "Microsoft Azure Development Services",
  },
  {
    label: "PowerApps Development Services",
    value: "PowerApps Development Services",
  },
  {
    label: "React Native App Development Services",
    value: "React Native App Development Services",
  },
  {
    label: "Flutter App Development Services",
    value: "Flutter App Development Services",
  },
  {
    label: "Microsoft Dynamic 365 Business Central",
    value: "Microsoft Dynamic 365 Business Central",
  },
  {
    label: "SharePoint Development Services",
    value: "SharePoint Development Services",
  },
  {
    label: "UI/UX Design and Development Services",
    value: "UI/UX Design and Development Services",
  },
  {
    label: "AI ML App Development Services",
    value: "AI ML App Development Services",
  },
];

const scrollToBottom = () => {
  const chatBot = $("#chat-bot");
  const bottomPadding = 20; // Add 20px padding at the bottom
  chatBot.animate({ scrollTop: chatBot[0].scrollHeight + bottomPadding }, 500);
};

function loading() {
  $("#search-input-div").remove();
  scrollToBottom();

  // Append loader
  const loader = `
        <div class='loader-div'>
            <div class="loader">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
            <div class="spacer" style="min-height: 10px;"></div>
        </div>
        `;
  $(".chat-bot").append(loader);

  setTimeout(() => {
    $(".loader-div").remove();
  }, 1500);
}

function timeStamp(align = "") {
  const timestamp = new Date().toLocaleTimeString();
  $(".chat-bot").append(`<div class="timestamp ${align}">${timestamp}</div>`);
}

const spacer = (marginX) => {
  return `<div class="spacer" style="min-height: ${marginX};"></div>`;
};

// const addBotMessage = (msg)=>{
//     $(".chat-bot").append(`<p class="bot-message">${msg}</p>
//     <div class="spacer" style="min-height: 5px;"></div>`);
//     scrollToBottom();
// }

const addBotMessage = (msg) => {
  timeStamp();
  // Create a container for the message
  const messageContainer = $('<p class="bot-message"></p>');
  $(".chat-bot").append(messageContainer);
  const spacer = '<div class="spacer" style="min-height: 5px;"></div>';
  $(".chat-bot").append(spacer);
  scrollToBottom();

  // Add cursor span
  const cursor = $('<span class="typing-cursor">.</span>');
  messageContainer.append(cursor);

  // Typewriter effect logic
  let index = 0;
  const speed = 30; // Speed of typing in milliseconds
  const typewriter = () => {
    if (index < msg.length) {
      cursor.before(msg[index]); // Add the next character before the cursor
      index++; // Ensure it scrolls as the text appears
      setTimeout(typewriter, speed);
    } else {
      cursor.remove(); // Remove the cursor when typing is done
    }
  };

  typewriter();
  scrollToBottom(); // Start the typewriter effect
};

const addBotTextInput = (id = "normal") => {
  $(".textarea-div").remove();
  const textareaHTML = `
    <div id=${id} class='textarea-div'>
        <div class="textarea-container">
            <textarea class="sr-btn form-control" rows="2" placeholder="Type your message here..."></textarea>
            <button class="send-btn" id="search-addon" onclick="handleUserInput()"> 
                <i class="fas fa-paper-plane"></i>
            </button>
            </div>
        <div class="spacer" style="min-height: 10px;"></div>
    </div>
    `;

  $(".chat-bot").append(textareaHTML);
  scrollToBottom();
};

const clickedOnProjectHelpButton = () => {
  addBotMessage("That's great! Could you tell me more about your project?");
  // Add textarea with a send button
  addBotTextInput("projectHelp");
};
const clickedOnOtherQueriesButton = () => {
  addBotMessage(
    "Please let me know your question or the information you're looking for."
  );
  // Add textarea with a send button
  addBotTextInput();
};

const clickedOnJustBrowsingButton = () => {
  addBotMessage(
    "No problem! Feel free to explore our website. If you need any assistance, I'm always here to help."
  );
  // Add another message with radio buttons
  setTimeout(() => {
    addBotMessage(
      "Would you like to share your contact details for future assistance?"
    );
    radioButtonHTML = `<div class='radio-div'>
                <div class="chat-options">
                    <label><input type="radio" name="contact-option" value="Yes"><b> Yes</b></label>
                    <label><input type="radio" name="contact-option" value="No"><b> No</b></label>
                </div>
                <div class="spacer" style="min-height: 10px;"></div>
            </div>
            `;
    $(".chat-bot").append(radioButtonHTML);

    // Handle radio button clicks
    $("input[name='contact-option']").on("change", function () {
      const selectedOption = $(this).val();
      handleUserInput(selectedOption);
      if (selectedOption === "Yes") {
        loading();
        setTimeout(() => {
          addBotMessage(
            "Please provide your Email-Id or Contact Number so that we can reach out."
          );
          addBotTextInput("shareContact");
        }, 1300);
      } else if (selectedOption === "No") {
        loading();
        setTimeout(() => {
          addBotMessage("Alright, feel free to reach out anytime.");
          addBotTextInput();
        }, 1300);
      }
    });
  }, 2000);
};

const clickedOnYourServicesButton = () => {
  // Display bot message
  addBotMessage("Which service would you like to know more about?");

  // Create dropdown container
  const dropdownHTML = `
    <div class='dropdown-div'>
        <div class="dropdown-container">
        <label for="service-dropdown" class="dropdown-label">List of Available Services</label>
        <select id="service-dropdown" class="form-control">
        <option value="" disabled selected>Select Service from here...</option>
        ${services
          .map(
            (service, index) =>
              `<option value="${service.value}">${service.label}</option>`
          )
          .join("")}
        </select>
        <button id="service-submit-btn" class="btn btn-primary mt-2">Submit</button>
        </div>
        <div class="spacer" style="min-height: 10px;"></div>
    </div>
    `;

  // Append dropdown to chatbot
  $(".chat-bot").append(dropdownHTML);
  scrollToBottom();

  // Handle dropdown selection and API call
  $("#service-submit-btn").click(function () {
    const selectedOption = $("#service-dropdown").val();

    if (!selectedOption) {
      showToast("Please select a service.");
      return;
    }

    handleUserInput("dropdown");
  });
};

// Handle user input and send message
const handleUserInput = (type = "", id = "") => {
  let userInput = "";
  let userValue = "";
  let textAreaId = "";
  if (type == "dropdown") {
    userValue = $("#service-dropdown").val();
    userInput = `service selected by you: <span class='bold'>${userValue}<span>`;
  } else if (type == "Yes" || type == "No") {
    userInput = type;
    $(".radio-div").remove();
  } else if (type == "button") {
    userInput = $(`#${id}`).text();
  } else {
    userInput = $(".sr-btn").val().trim();
    textAreaId = $(".textarea-div").attr("id");
  }

  if (!userInput) {
    showToast("Please type a message.");
    return;
  }

  $(".textarea-div").remove();
  $(".dropdown-div").remove();
  $(".radio-div").remove();

  // Add user message (right-aligned)
  timeStamp("right");
  $(".chat-bot").append(`
        <p class="user-message">${userInput}</p>
        <div class="spacer" style="min-height: 5px;"></div>
    `);
  scrollToBottom();

  // Clear input field
  $(".sr-btn").val("");

  // Show loader while waiting for the API response
  if (type == "Yes" || type == "No" || type == "button") return;
  loading();

  //api url select based on id
  let URL = "/submit_inquiry";
  let payload = { query: userInput };
  if (textAreaId == "shareContact") {
    URL = "/contact_form";
    payload = userInput.includes("@")
      ? { email: userInput }
      : { phone: userInput };
  } else if (textAreaId == "projectHelp") {
    URL = "/submit_project";
    payload = { project_details: userInput };
  } else if (type == "dropdown") {
    URL = "/submit_service";
    payload = { service: userValue };
  }
  // Make the POST API call

  // $.post("/submit_inquiry", { inquiry: inquiryDetails })
  // $.post("https://jsonplaceholder.typicode.com/posts", payload)
  $.post(URL, payload)
    .done(function (data) {
      setTimeout(() => {
        addBotMessage(
          data.message || "I received your Response! please allow me sometime.."
        );

        // Show input again for the next message
        setTimeout(() => {
          addBotTextInput();
        }, 500);
      }, 1300); // Show the initial buttons again after the response
    })
    .fail(function () {
      showToast("Error processing your request. please try again later.");
      setTimeout(() => {
        addBotTextInput();
      }, 500);
    });
};

//this will disable button after clicked for prevent multiple clicking.
const disableButton = () => {
  $(".cs-btn")
    .addClass("disabled")
    .click((e) => e.preventDefault());
  setTimeout(() => $(".cs-btn").removeClass("disabled"), 5000);
};

// Function to show toast messages
function showToast(message) {
  const $toastContainer = $("#toast-container");

  // Create toast element
  const toastHTML = `<div class="toast-message">${message}</div>`;
  const $toast = $(toastHTML);

  // Append to container
  $toastContainer.append($toast);

  // Show toast
  setTimeout(() => $toast.addClass("show"), 100);

  // Remove toast after 2 seconds
  setTimeout(() => {
    $toast.removeClass("show");
    setTimeout(() => $toast.remove(), 300); // Allow time for animation
  }, 2000);
}

// Update button click handling to include the new button
$(document).ready(function () {
  $(".cs-btn").on("click", function (e) {
    e.preventDefault();

    // if disable class added so return function without
    if ($(".cs-btn").hasClass("disabled")) {
      return;
    }

    //for preventing multiple api calling.
    disableButton();

    const clickedButtonId = $(this).attr("id");
    handleUserInput("button", clickedButtonId);

    loading();

    setTimeout(() => {
      if (clickedButtonId === "services-btn") {
        clickedOnYourServicesButton();
        return;
      }
      if (clickedButtonId === "projectHelp-btn") {
        clickedOnProjectHelpButton();
        return;
      }
      if (clickedButtonId === "justBrowsing-btn") {
        clickedOnJustBrowsingButton();
        return;
      }
      if (clickedButtonId === "otherInquires-btn") {
        clickedOnOtherQueriesButton();
        return;
      }
    }, 2000);
  });

  $(".send-btn").on("click", function (e) {
    e.preventDefault();
    handleUserInput();
  });

  // Allow Enter key to send the message
  $(".sr-btn").on("keypress", function (e) {
    if (e.which === 13) {
      // Enter key
      e.preventDefault();
      handleUserInput();
    }
  });
});

//adding scroll to bottom functionality
$(document).ready(function () {
  const $scrollToBottomBtn = $("#scroll-to-bottom");
  const $chatBotContainer = $("#chat-bot");

  // Show/hide button based on scroll position
  $chatBotContainer.on("scroll", function () {
    if (
      $chatBotContainer[0].scrollHeight - $chatBotContainer.scrollTop() >
      $chatBotContainer.outerHeight() + 100
    ) {
      $scrollToBottomBtn.addClass("active");
    } else {
      $scrollToBottomBtn.removeClass("active");
    }
  });

  // Scroll to bottom when button is clicked
  $scrollToBottomBtn.on("click", function () {
    $chatBotContainer.animate(
      { scrollTop: $chatBotContainer[0].scrollHeight },
      500
    );
  });

  // Ensure scroll button is hidden initially
  $scrollToBottomBtn.removeClass("active");
});
