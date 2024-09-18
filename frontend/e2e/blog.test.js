const { test, expect } = require("@playwright/test");
const { testAuthPath } = require("./setup/helper");

test.describe("Tests for blogs", () => {
  test.use({ storageState: testAuthPath }); // use the logged in user defined in global-setup

  test("Get blogs", async ({ page }) => {
    await page.goto("/blogs");
    await page.waitForResponse("http://server:8000/api/blog/");
    const blogList = await page.getByTestId("blogList").getByRole("link").all();
    expect(blogList.length).toBe(4);
    await expect(blogList[0]).toHaveText("some title");
    await expect(blogList[1]).toHaveText("another title");
    await expect(blogList[2]).toHaveText("something");
    await expect(blogList[3]).toHaveText("test title");
  });

  test("Create blog", async ({ page }) => {
    await page.goto("/blogs/create");
    await page.getByLabel("title:").fill("automatically created title");
    await page.getByLabel("content:").fill("automatically created content");
    await page.getByRole("button", { name: "Submit" }).click();

    // check it got created
    await page.goto("/blogs");
    await page.waitForResponse("http://server:8000/api/blog/");
    const blogList = await page.getByTestId("blogList").getByRole("link").all();
    expect(blogList.length).toBe(5);
    const newBlog = page
      .getByTestId("blogList")
      .getByRole("link")
      .getByText("automatically created title");

    await expect(newBlog).toBeVisible();

    // check the content detail
    await newBlog.click();
    await expect(page).toHaveURL(/.*\/blogs\/5$/, { timeout: 15000 });
    const blogDetail = page.getByTestId("blog-detail");
    await expect(blogDetail).toBeVisible();
    await expect(blogDetail).toContainText("automatically created content");
  });

  test("Update blog", async ({ page }) => {
    await page.goto("/blogs/5");
    const blogDetail = page.getByTestId("blog-detail");
    await expect(blogDetail).toBeVisible();
    const updateBtn = blogDetail.getByRole("link", { name: "Update" });
    await updateBtn.click();
    await expect(page).toHaveURL(/.*\/blogs\/5\/update$/, { timeout: 15000 });
    const updateForm = page.getByTestId("update-blog-form");

    await updateForm.getByLabel("title").fill("automatically created title - updated");
    await updateForm.getByLabel("content").fill("automatically created content - updated");
    await updateForm.getByRole("button", { name: "Submit" }).click();
    await expect(page).toHaveURL(/.*\/blogs$/);
    await page.waitForResponse("http://server:8000/api/blog/");
    const blogList = page.getByTestId("blogList");
    await expect(blogList).toContainText("automatically created title - updated");
    await page.goto("/blogs/5");
    await expect(blogDetail).toContainText("automatically created content - updated");
  });

  test("Delete blog", async ({ page }) => {
    await page.goto("/blogs/3");

    // check that it is the right blog
    const blogDetail = page.getByTestId("blog-detail");
    await expect(blogDetail).toBeVisible();
    await expect(blogDetail).toContainText("something");
    await expect(blogDetail).toContainText("other");

    // delete blog
    const deleteBtn = blogDetail.getByRole("button", { name: "Delete" });
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // check confirm modal ok
    const confirmModal = page.getByTestId("confirm-modal");
    await expect(page.getByRole("heading", { name: "Delete blog?" })).toBeVisible();
    const confirmBtn = confirmModal.getByRole("button", { name: "Confirm" });
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // wait routing and check the deleted blog is not among the list of blogs
    await expect(page).toHaveURL(/.*\/blogs$/);
    await page.waitForResponse("http://server:8000/api/blog/");
    const blogList = page.getByTestId("blogList");
    await expect(blogList).toBeVisible();
    await expect(blogList).not.toContainText("something");
    const blogLinks = await blogList.getByRole("link").all();
    expect(blogLinks.length).toBe(4);
  });
});
