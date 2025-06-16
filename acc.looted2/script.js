// Portfolio Gallery Data
const portfolioData = {
  cyber: {
    title: "Cyber Sigilism",
    images: [
      "image/cyber/cyber1.jpg",
      "image/cyber/cyber2.jpg",
      "image/cyber/cyber3.jpg",
    ],
  },
  blackwork: {
    title: "BlackWork",
    images: [
      "image/black/black1.jpg",
      "image/black/black2.jpg",     
        "image/black/black3.jpg",
        "image/black/black4.jpg",
        "image/black/black5.jpg",
        "image/black/black6.jpg",
        "image/black/black7.jpg",
    ],
  },
  typography: {
    title: "Typography",
    images: [
      "image/typo/typo1.jpg",
      "image/typo/typo2.jpg",
      "image/typo/typo3.jpg",
    ],
  },
  whatever: {
    title: "Whatever is this",
    images: [
      "image/what/what1.jpg",
      "image/what/what2.jpg",
        "image/what/what3.jpg",
        "image/what/what4.jpg",
        "image/what/what5.jpg",
        "image/what/what6.jpg",

    ],
  },
}

// DOM Elements
const portfolioItems = document.querySelectorAll(".portfolio-item")
const modalOverlay = document.getElementById("modalOverlay")
const modalTitle = document.getElementById("modalTitle")
const modalClose = document.getElementById("modalClose")
const galleryMainImage = document.getElementById("galleryMainImage")
const galleryThumbnails = document.getElementById("galleryThumbnails")
const galleryPrev = document.getElementById("galleryPrev")
const galleryNext = document.getElementById("galleryNext")
const currentImageSpan = document.getElementById("currentImage")
const totalImagesSpan = document.getElementById("totalImages")

// State
let currentCategory = ""
let currentImageIndex = 0
let currentImages = []

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializePortfolio()
  initializeNavbar()
})

function initializePortfolio() {
  // Add click event listeners to portfolio items
  portfolioItems.forEach((item) => {
    item.addEventListener("click", function () {
      const category = this.dataset.category
      openGallery(category)
    })
  })

  // Modal close events
  modalClose.addEventListener("click", closeGallery)
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeGallery()
    }
  })

  // Gallery navigation
  galleryPrev.addEventListener("click", () => navigateGallery(-1))
  galleryNext.addEventListener("click", () => navigateGallery(1))

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modalOverlay.classList.contains("active")) return

    switch (e.key) {
      case "Escape":
        closeGallery()
        break
      case "ArrowLeft":
        navigateGallery(-1)
        break
      case "ArrowRight":
        navigateGallery(1)
        break
    }
  })
}

function openGallery(category) {
  if (!portfolioData[category]) return

  currentCategory = category
  currentImages = portfolioData[category].images
  currentImageIndex = 0

  // Set modal title
  modalTitle.textContent = portfolioData[category].title

  // Update total images count
  totalImagesSpan.textContent = currentImages.length

  // Generate thumbnails
  generateThumbnails()

  // Show first image
  updateMainImage()

  // Show modal
  modalOverlay.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeGallery() {
  modalOverlay.classList.remove("active")
  document.body.style.overflow = ""

  // Reset state
  currentCategory = ""
  currentImages = []
  currentImageIndex = 0
}

function generateThumbnails() {
  galleryThumbnails.innerHTML = ""

  currentImages.forEach((image, index) => {
    const thumbnail = document.createElement("img")
    thumbnail.src = image
    thumbnail.alt = `${currentCategory} ${index + 1}`
    thumbnail.className = "gallery-thumbnail"
    thumbnail.dataset.index = index

    if (index === 0) {
      thumbnail.classList.add("active")
    }

    thumbnail.addEventListener("click", function () {
      currentImageIndex = Number.parseInt(this.dataset.index)
      updateMainImage()
      updateThumbnails()
    })

    galleryThumbnails.appendChild(thumbnail)
  })
}

function updateMainImage() {
  if (currentImages.length === 0) return

  galleryMainImage.src = currentImages[currentImageIndex]
  galleryMainImage.alt = `${currentCategory} ${currentImageIndex + 1}`

  // Update counter
  currentImageSpan.textContent = currentImageIndex + 1

  // Update navigation buttons
  galleryPrev.disabled = currentImageIndex === 0
  galleryNext.disabled = currentImageIndex === currentImages.length - 1

  // Update thumbnails
  updateThumbnails()
}

function updateThumbnails() {
  const thumbnails = galleryThumbnails.querySelectorAll(".gallery-thumbnail")
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.classList.toggle("active", index === currentImageIndex)
  })
}

function navigateGallery(direction) {
  const newIndex = currentImageIndex + direction

  if (newIndex >= 0 && newIndex < currentImages.length) {
    currentImageIndex = newIndex
    updateMainImage()
  }
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

// Touch/Swipe support for mobile
let touchStartX = 0
let touchEndX = 0

galleryMainImage.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX
})

galleryMainImage.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
})

function handleSwipe() {
  const swipeThreshold = 50
  const swipeDistance = touchEndX - touchStartX

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      // Swipe right - previous image
      navigateGallery(-1)
    } else {
      // Swipe left - next image
      navigateGallery(1)
    }
  }
}

// Lazy loading for images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading if supported
if ("IntersectionObserver" in window) {
  lazyLoadImages()
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

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(() => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
}, 10)

window.addEventListener("scroll", debouncedScrollHandler)
