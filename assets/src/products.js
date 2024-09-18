const category = document.getElementById("category")
const categories = getObjectFromLocalStorage("categories");

if (categories) {
    categories.forEach(el => {
        const option = document.createElement("option");
        option.value = el.code;
        option.textContent = el.categoryName;

        category.append(option);
    });
}
