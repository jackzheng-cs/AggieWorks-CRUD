document.addEventListener("DOMContentLoaded", () => {
  const createPostBtn = document.getElementById("createPostBtn");
  const formModal = document.getElementById("formModal");
  const closeModal = document.getElementById("closeModal");
  const blogForm = document.getElementById("blogForm");
  const deleteBtn = document.getElementById("deleteBtn");
  const submitBtn = blogForm.querySelector("button");

  // Open modal for creating a new blog
  createPostBtn.addEventListener("click", () => {
    formModal.style.display = "flex";
    blogForm.reset();
    blogForm.action = "/blogs";
    deleteBtn.style.display = "none";
    submitBtn.textContent = "Post";
  });

  // Make each blog item clickable for editing
  document.querySelectorAll(".blog").forEach((blogItem) => {
    blogItem.addEventListener("click", async (e) => {
      const blogId = blogItem.getAttribute("data-id");

      formModal.style.display = "flex";
      blogForm.action = `/blogs/${blogId}`;
      deleteBtn.style.display = "inline";
      submitBtn.textContent = "Update Blog";

      //   blogForm.title.value = "Loading...";
      //   blogForm.content.value = "Loading...";

      try {
        const response = await fetch(`/blogs/${blogId}`);
        const blog = await response.json();

        blogForm.title.value = blog.title;
        blogForm.content.value = blog.content;
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    });
  });

  // Close the modal
  closeModal.addEventListener("click", () => {
    formModal.style.display = "none";
  });

  // Hide the modal when clicking outside the modal content
  window.addEventListener("click", (e) => {
    if (e.target === formModal) {
      formModal.style.display = "none";
    }
  });

  // Handle blog deletion
  deleteBtn.addEventListener("click", () => {
    const blogId = new URL(blogForm.action).pathname.split("/")[2];

    fetch(`/blogs/${blogId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          formModal.style.display = "none";
          location.replace("/blogs");
        } else {
          alert("Failed to delete the blog");
        }
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
      });
  });
});
