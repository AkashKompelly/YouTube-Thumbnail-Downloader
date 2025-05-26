// Get references to DOM elements
let url = document.querySelector("#url");
let downloadBtn = document.querySelector("#downloadBtn");
let thumbnailPreview = document.querySelector("#thumbnail");
let notValidURLText = document.querySelector(".notValidURLText");

// Function to fetch YouTube thumbnail using RapidAPI
async function getYoutubeThumbnail(ytUrl) {
  const apiUrl = `https://youtube-thumbnail-downloader8.p.rapidapi.com/rapidapi/youtubethumbnail/get_thumbnail.php?url=${ytUrl}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "3296f78ff9msh51fa4fe84f60d4cp1e1573jsna3fd0595c7af", // Replace with your own key in production
      "x-rapidapi-host": "youtube-thumbnail-downloader8.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(apiUrl, options);
    const result = await response.json();

    // Return result only if no error in response
    if (result.status != "error") {
      return result;
    }
  } catch (error) {
    console.error("API call failed:", error);
  }
}

// Function to download the YouTube thumbnail
async function downloadImage() {
  const ytUrl = url.value;
  const result = await getYoutubeThumbnail(ytUrl);

  if (result) {
    const thumbnailUrl = result.thumbnails.maximumQuality;

    // Show preview of thumbnail
    thumbnailPreview.setAttribute("src", thumbnailUrl);

    try {
      // Fetch the image as a blob
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();

      // Create a temporary URL for the blob and simulate a click to download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "youtube_thumbnail.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Remove error styles if previously applied
      url.classList.remove("notValidUrl");
      document.querySelector("h4").classList.remove("notValidURLText");

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to fetch and download image:", error);
    }
  } else {
    // Handle invalid URL or error from API
    url.classList.add("notValidUrl");
    document.querySelector("h4").classList.add("notValidURLText");
  }
}

// Attach click event listener to the download button
downloadBtn.addEventListener("click", downloadImage);
