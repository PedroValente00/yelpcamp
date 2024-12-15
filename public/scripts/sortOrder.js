const campgroundDiv = document.querySelector(".campgrounds");
const campgrounds = document.querySelectorAll(".card");
const sorter = document.querySelector("#sort");

if (sorter) {
    sorter.addEventListener("change", (e) => {
        const selected = e.target.value;
        if (selected === "rating") {
            const arrSortedByRating = Array.from(campgrounds).sort((a, b) => {
                return b.querySelector(".rating").value
                    - a.querySelector(".rating").value
            })

            for (const campground of arrSortedByRating) {
                campgroundDiv.appendChild(campground)
            }
        }
        if (selected === "price") {
            const arrSortedByPrice = Array.from(campgrounds).sort((a, b) => {
                return a.querySelector(".price").textContent
                    - b.querySelector(".price").textContent
            })

            for (const campground of arrSortedByPrice) {
                campgroundDiv.appendChild(campground)
            }
        }

        if (selected === "newer") {
            const arrSortedByDate = Array.from(campgrounds).sort((a, b) => {
                return b.querySelector(".dateCreated").textContent
                    - a.querySelector(".dateCreated").textContent
            })

            for (const campground of arrSortedByDate) {
                campgroundDiv.appendChild(campground)
            }
        }

        if (selected === "older") {
            const arrSortedByDate = Array.from(campgrounds).sort((a, b) => {
                return a.querySelector(".dateCreated").textContent
                    - b.querySelector(".dateCreated").textContent
            })

            for (const campground of arrSortedByDate) {
                campgroundDiv.appendChild(campground)
            }
        }

    })
}