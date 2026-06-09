const fileInput = document.getElementById("image-file");
const fileName = document.getElementById("file-name");
const form = document.getElementById("image-form");
const uploadButton = document.getElementById("upload-button");
const statusText = document.getElementById("image-status");
const imageList = document.getElementById("image-list");

function formatBytes(size) {
  if (!Number.isFinite(size)) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function setStatus(message) {
  statusText.textContent = message || "";
}

function renderImages(images) {
  imageList.innerHTML = "";

  if (!images.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No images uploaded yet.";
    imageList.append(empty);
    return;
  }

  for (const image of images) {
    const item = document.createElement("article");
    item.className = "image-item";

    const preview = document.createElement("img");
    preview.src = image.url;
    preview.alt = image.name;
    preview.loading = "lazy";

    const meta = document.createElement("div");
    meta.className = "image-meta";

    const link = document.createElement("a");
    link.href = "/latest.png";
    link.download = "latest.png";
    link.textContent = "latest.png";

    const detail = document.createElement("span");
    detail.textContent = `${image.uploadedAt || "Uploaded"} - ${formatBytes(image.size)}`;

    meta.append(link, detail);
    item.append(preview, meta);
    imageList.append(item);
  }
}

async function loadImages() {
  try {
    const response = await fetch("/api/device-images", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not load images.");
    renderImages(data.images || []);
  } catch (error) {
    setStatus(error.message);
  }
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileName.textContent = file ? file.name : "No image selected";
  uploadButton.disabled = !file;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  if (!file) return;

  uploadButton.disabled = true;
  setStatus("Uploading...");

  const body = new FormData();
  body.append("image", file);

  try {
    const response = await fetch("/api/device-images", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Upload failed.");
    fileInput.value = "";
    fileName.textContent = "No image selected";
    setStatus("Uploaded as latest.png.");
    await loadImages();
  } catch (error) {
    setStatus(error.message);
  } finally {
    uploadButton.disabled = !fileInput.files[0];
  }
});

loadImages();
