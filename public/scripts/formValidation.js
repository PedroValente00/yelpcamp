const uploadedImages = document.querySelectorAll(".uploadedImages")
const checkboxes = document.querySelectorAll(".deleteCheckbox")

for (const checkbox of checkboxes) {
    checkbox.addEventListener("change", e => {
        const element = e.target;
        if (!element.checked) {
            element.parentNode.nextElementSibling.classList.toggle("marked4deletion")
        }
        else {
            element.parentNode.nextElementSibling.classList.toggle("marked4deletion")
        }
    })
}
for (const img of uploadedImages) {
    img.addEventListener("click", e => {
        const element = e.target;
        const checkbox = element.previousElementSibling.querySelector(".deleteCheckbox")
        if (!checkbox.checked) {
            checkbox.checked = true
            element.classList.toggle("marked4deletion")
        }
        else {
            checkbox.checked = false
            element.classList.toggle("marked4deletion")
        }
    })
}

const upload = document.querySelector("#images");
const info = document.querySelectorAll(".fileError");//the error messages
if (upload) upload.addEventListener("change", (e) => {
    const uploadLimit = 10; // 10 uploaded images allowed per campground
    const filesToUpload = e.target.files.length; // files in the input
    if ((filesToUpload + uploadedImages.length) > uploadLimit) {
        for (const msg of info) msg.style.display = "block"
    } else {
        for (const msg of info) msg.style.display = "none"
    }
})

const price = document.querySelector("#price");
if (price) {
    price.addEventListener("keyup", e => {
        const invalidChars = /[^\.|^0-9]*/g; // not a dot OR not a number
        price.value = price.value.replace(invalidChars, "") 
    })
}
