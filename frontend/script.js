const API_URL = "/api/products";

// GET HTML ELEMENTS
const productsTableBody = document.getElementById("productsTableBody");
const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const categoryInput = document.getElementById("category");
const brandInput = document.getElementById("brand");
const priceInput = document.getElementById("price");
const stockQuantityInput = document.getElementById("stockQuantity");
const descriptionInput = document.getElementById("description");

const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const addProductButton = document.getElementById("addProductButton");
const searchInput = document.getElementById("searchInput");
const messageElement = document.getElementById("message");

// STORE PRODUCTS
let products = [];

// SHOW MESSAGE
function showMessage(message, type = "success") {
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;

    setTimeout(() => {
        messageElement.textContent = "";
        messageElement.className = "message";
    }, 4000);
}

// FORMAT PRICE
function formatPrice(price) {
    return `K${Number(price).toLocaleString("en-ZM", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// LOAD PRODUCTS FROM THE DATABASE
async function loadProducts() {
    productsTableBody.innerHTML = `
        <tr>
            <td colspan="7">Loading products...</td>
        </tr>
    `;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load products.");
        }

        products = await response.json();

        // Always arrange products by their actual database IDs
        products.sort((a, b) => Number(a.id) - Number(b.id));

        displayProducts(products);
        updateStatistics();
    } catch (error) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load products. Make sure the backend server is running.
                </td>
            </tr>
        `;

        showMessage(error.message, "error");
    }
}

// DISPLAY PRODUCTS IN THE TABLE
function displayProducts(productList) {
    productsTableBody.innerHTML = "";

    if (productList.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="7">No products found.</td>
            </tr>
        `;
        return;
    }

    productList.forEach((product, index) => {
        const row = document.createElement("tr");

        // Display consecutive numbers instead of database IDs
        const values = [
            index + 1,
            product.product_name,
            product.category,
            product.brand,
            formatPrice(product.price),
            product.stock_quantity
        ];

        values.forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // ACTIONS COLUMN
        const actionsCell = document.createElement("td");
        const actionButtons = document.createElement("div");

        actionButtons.className = "action-buttons";

        // EDIT BUTTON
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.type = "button";

        editButton.addEventListener("click", () => {
            editProduct(product.id);
        });

        // DELETE BUTTON
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            deleteProduct(product.id);
        });

        actionButtons.append(editButton, deleteButton);
        actionsCell.appendChild(actionButtons);
        row.appendChild(actionsCell);

        productsTableBody.appendChild(row);
    });
}

// UPDATE DASHBOARD STATISTICS
function updateStatistics() {
    const totalProducts = products.length;

    const totalStock = products.reduce((total, product) => {
        return total + Number(product.stock_quantity);
    }, 0);

    const categories = new Set(
        products.map((product) => product.category.toLowerCase())
    );

    const stockValue = products.reduce((total, product) => {
        return total +
            Number(product.price) * Number(product.stock_quantity);
    }, 0);

    document.getElementById("totalProducts").textContent = totalProducts;

    document.getElementById("totalStock").textContent =
        totalStock.toLocaleString();

    document.getElementById("totalCategories").textContent =
        categories.size;

    document.getElementById("stockValue").textContent =
        formatPrice(stockValue);
}

// RESET THE FORM
function resetForm() {
    productForm.reset();

    productIdInput.value = "";
    formTitle.textContent = "Add New Product";
    saveButton.textContent = "Save Product";
}

// ADD OR UPDATE A PRODUCT
productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const productData = {
        product_name: productNameInput.value.trim(),
        category: categoryInput.value.trim(),
        brand: brandInput.value.trim(),
        price: Number(priceInput.value),
        stock_quantity: Number(stockQuantityInput.value),
        description: descriptionInput.value.trim()
    };

    if (
        !productData.product_name ||
        !productData.category ||
        !productData.brand ||
        priceInput.value === "" ||
        stockQuantityInput.value === "" ||
        !Number.isFinite(productData.price) ||
        productData.price < 0 ||
        !Number.isInteger(productData.stock_quantity) ||
        productData.stock_quantity < 0
    ) {
        showMessage("Please enter valid product information.", "error");
        return;
    }

    const id = productIdInput.value;

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    saveButton.disabled = true;
    saveButton.textContent = id ? "Updating..." : "Saving...";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to save product.");
        }

        showMessage(
            id
                ? "Product updated successfully!"
                : "Product added successfully!"
        );

        resetForm();

        await loadProducts();

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = productIdInput.value
            ? "Update Product"
            : "Save Product";
    }
});

// EDIT A PRODUCT
function editProduct(id) {
    const product = products.find((item) => item.id === id);

    if (!product) {
        showMessage("Product not found.", "error");
        return;
    }

    productIdInput.value = product.id;
    productNameInput.value = product.product_name;
    categoryInput.value = product.category;
    brandInput.value = product.brand;
    priceInput.value = product.price;
    stockQuantityInput.value = product.stock_quantity;
    descriptionInput.value = product.description || "";

    formTitle.textContent = "Edit Product";
    saveButton.textContent = "Update Product";

    document.getElementById("add-product").scrollIntoView({
        behavior: "smooth"
    });
}

// DELETE A PRODUCT
async function deleteProduct(id) {
    const product = products.find((item) => item.id === id);

    if (!product) {
        showMessage("Product not found.", "error");
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${product.product_name}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to delete product.");
        }

        showMessage("Product deleted successfully!");

        await loadProducts();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

// SEARCH PRODUCTS
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter((product) => {
        return (
            String(product.id).includes(searchTerm) ||
            product.product_name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
    });

    displayProducts(filteredProducts);
});

// ADD PRODUCT BUTTON
addProductButton.addEventListener("click", () => {
    resetForm();

    document.getElementById("add-product").scrollIntoView({
        behavior: "smooth"
    });

    productNameInput.focus();
});

// CANCEL BUTTON
cancelButton.addEventListener("click", () => {
    resetForm();
});

// LOAD PRODUCTS WHEN THE PAGE OPENS
loadProducts();