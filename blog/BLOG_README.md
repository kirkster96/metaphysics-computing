# Writing Blog Posts

A quick reference for authoring and publishing blog posts on the Metaphysics Computing site.

## Creating a New Post

1. **Copy the template:**

   ```bash
   cp blog/posts/_template.md blog/posts/YYYY-MM-DD-your-post-slug.md
   ```

   Use the date and a short slug, e.g. `2026-03-24-on-device-ml.md`.

2. **Edit the front matter** at the top of the file:

   ```yaml
   ---
   title: Your Post Title Here
   date: Mar 24, 2026
   category: Engineering
   ---
   ```

   - `title` — displayed as the post heading
   - `date` — any human-readable date string (e.g. `Mar 24, 2026`)
   - `category` — a short label (e.g. `Engineering`, `Design`, `Announcement`)

3. **Write your content** below the front matter using standard Markdown. You can use headings, bold/italic text, links, images, code blocks, blockquotes, and lists.

4. **Register the post** by adding an entry to `blog/posts/posts.json`:

   ```json
   {
     "slug": "2026-03-24-on-device-ml",
     "title": "Your Post Title Here",
     "date": "Mar 24, 2026",
     "category": "Engineering",
     "excerpt": "A brief summary of what this post is about…"
   }
   ```

   Add new entries **at the top** of the JSON array so the newest post appears first.

5. **Commit and push:**

   ```bash
   git add blog/posts/
   git commit -m "New post: Your Post Title Here"
   git push
   ```

   The post will be live on your site once GitHub Pages deploys (usually under a minute).

## File Structure

```
blog/
├── post.html              ← Post viewer (don't edit)
├── BLOG_README.md          ← This file
└── posts/
    ├── posts.json          ← Post registry (edit to add new posts)
    ├── _template.md        ← Copy this for new posts
    └── YYYY-MM-DD-slug.md  ← Your posts
```

## Tips

- **Images:** Place images in `assets/blog/` and reference them with `![alt text](../assets/blog/your-image.png)`.
- **Code blocks:** Use fenced code blocks with a language identifier for syntax highlighting (` ```swift `, ` ```python `, etc.).
- **Drafts:** Simply don't add the post to `posts.json` until you're ready to publish. The Markdown file can exist without being listed.
