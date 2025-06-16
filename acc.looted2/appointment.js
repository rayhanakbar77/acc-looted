// EmailJS Configuration
// IMPORTANT: Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = "service_a60p1gr" // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = "template_w4lm2j8" // Replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = "i4FfGn0mPhWRrJObM" // Replace with your EmailJS public key

// Initialize EmailJS
;(() => {
  emailjs.init(EMAILJS_PUBLIC_KEY)
})()

// DOM Elements
const appointmentForm = document.getElementById("appointmentForm")
const submitBtn = document.getElementById("submitBtn")
const btnText = document.querySelector(".btn-text")
const btnLoading = document.querySelector(".btn-loading")
const successModal = document.getElementById("successModal")
const errorModal = document.getElementById("errorModal")
const closeSuccessModal = document.getElementById("closeSuccessModal")
const closeErrorModal = document.getElementById("closeErrorModal")
const errorMessage = document.getElementById("errorMessage")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeForm()
  initializeNavbar()
  initializeModals()
})

function initializeForm() {
  appointmentForm.addEventListener("submit", handleFormSubmit)

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("preferredDate").setAttribute("min", today)

  // File upload handling
  const fileInput = document.getElementById("reference")
  fileInput.addEventListener("change", handleFileUpload)
}

function initializeNavbar() {
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })
}

function initializeModals() {
  closeSuccessModal.addEventListener("click", () => {
    successModal.classList.remove("active")
    document.body.style.overflow = ""
  })

  closeErrorModal.addEventListener("click", () => {
    errorModal.classList.remove("active")
    document.body.style.overflow = ""
  })

  // Close modal when clicking outside
  ;[successModal, errorModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  })
}

async function handleFormSubmit(e) {
  e.preventDefault()

  // Show loading state
  setLoadingState(true)

  try {
    // Get form data
    const formData = new FormData(appointmentForm)
    const appointmentData = Object.fromEntries(formData.entries())

    // Validate required fields
    if (!validateForm(appointmentData)) {
      throw new Error("Please fill in all required fields.")
    }

    // Prepare email data
    const emailData = prepareEmailData(appointmentData)

    // Send email using EmailJS
    const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailData)

    if (response.status === 200) {
      showSuccessModal()
      appointmentForm.reset()
    } else {
      throw new Error("Failed to send appointment request.")
    }
  } catch (error) {
    console.error("Error sending appointment request:", error)
    showErrorModal(error.message)
  } finally {
    setLoadingState(false)
  }
}

function validateForm(data) {
  const requiredFields = ["firstName", "lastName", "email", "tattooType", "description", "terms"]

  for (const field of requiredFields) {
    if (!data[field] || data[field].trim() === "") {
      return false
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return false
  }

  return true
}

function prepareEmailData(data) {
  return {
    to_email: "mhafidz1501@gmail.com",
    from_name: `${data.firstName} ${data.lastName}`,
    from_email: data.email,
    phone: data.phone || "Not provided",
    tattoo_type: data.tattooType,
    size: data.size || "Not specified",
    placement: data.placement || "Not specified",
    budget: data.budget || "Not specified",
    preferred_date: data.preferredDate || "Flexible",
    description: data.description,
    first_tattoo: data.firstTattoo ? "Yes" : "No",
    message: `
New Appointment Request

Client Information:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}

Tattoo Details:
- Style: ${data.tattooType}
- Size: ${data.size || "Not specified"}
- Placement: ${data.placement || "Not specified"}
- Budget: ${data.budget || "Not specified"}
- Preferred Date: ${data.preferredDate || "Flexible"}
- First Tattoo: ${data.firstTattoo ? "Yes" : "No"}

Description:
${data.description}

Please respond to this client within 24 hours.
        `.trim(),
  }
}

function setLoadingState(loading) {
  submitBtn.disabled = loading

  if (loading) {
    btnText.style.display = "none"
    btnLoading.style.display = "flex"
  } else {
    btnText.style.display = "block"
    btnLoading.style.display = "none"
  }
}

function showSuccessModal() {
  successModal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function showErrorModal(
  message = "There was an error sending your appointment request. Please try again or contact me directly via Instagram.",
) {
  errorMessage.textContent = message
  errorModal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function handleFileUpload(e) {
  const files = e.target.files
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]

  for (const file of files) {
    if (file.size > maxSize) {
      alert(`File ${file.name} is too large. Maximum size is 5MB.`)
      e.target.value = ""
      return
    }

    if (!allowedTypes.includes(file.type)) {
      alert(`File ${file.name} is not a supported image format.`)
      e.target.value = ""
      return
    }
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Form validation feedback
function addValidationFeedback() {
  const inputs = document.querySelectorAll(".form-input, .form-select, .form-textarea")

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.style.borderColor = "var(--error-color)"
      } else {
        this.style.borderColor = "var(--border-color)"
      }
    })

    input.addEventListener("input", function () {
      if (this.style.borderColor === "var(--error-color)" && this.value.trim()) {
        this.style.borderColor = "var(--border-color)"
      }
    })
  })
}

// Initialize validation feedback
document.addEventListener("DOMContentLoaded", addValidationFeedback)

// Auto-resize textarea
const textarea = document.getElementById("description")
if (textarea) {
  textarea.addEventListener("input", function () {
    this.style.height = "auto"
    this.style.height = this.scrollHeight + "px"
  })
}

// Phone number formatting (optional)
const phoneInput = document.getElementById("phone")
if (phoneInput) {
  phoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 0) {
      if (value.startsWith("62")) {
        // Indonesian format
        value = value.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, "+$1 $2-$3-$4")
      } else if (value.startsWith("0")) {
        // Local Indonesian format
        value = value.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3")
      }
    }
    e.target.value = value
  })
}
