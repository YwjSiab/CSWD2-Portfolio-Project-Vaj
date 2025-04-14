// --- Part 1: Sanitize Input ---
function sanitizeInput(input) {
    const tagRemoved = input.replace(/<\/?[^>]+(>|$)/g, ""); // remove HTML tags
    return tagRemoved
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function generateCSRFToken() {
    const token = crypto.randomUUID();
    sessionStorage.setItem("csrfToken", token);
  
    const tokenInput = document.createElement("input");
    tokenInput.type = "hidden";
    tokenInput.name = "csrfToken";
    tokenInput.value = token;
  
    const form = document.querySelector("form");
    if (form) {
      form.appendChild(tokenInput);
    }
  }
  export { sanitizeInput, generateCSRFToken };
