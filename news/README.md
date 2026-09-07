# News articles

Each article lives in `news/<slug>/index.html`, giving it a shareable URL such as
`/news/ellis-at-eccv-2026/`. Articles are static HTML and require no build step.

To add a post:

1. Copy `ellis-at-eccv-2026/index.html` into a new slug directory.
2. Update the page title, description, publication date, and article content.
3. Add a teaser to `config/news.json`, linking to `news/<slug>/`.

Site typography and colors come from `styles.css`; shared article styling lives
in `news/article.css`. Internal news links open in the same tab.

The article body is flexible: use sections with headings and paragraphs for
reports, `paper-list` lists for contributions, and figures with images and
captions for photos. Omit sections that do not apply. Preserve full author names
and publication order. Store article photos alongside the HTML and use relative
image paths and descriptive alt text.

When adding a retrospective, retain the article URL and original publication
date and add a visible updated date. Conference highlights and captioned photos
can precede the original paper list.

The ECCV article uses the custom header image `ellis-at-eccv-2026/eccv_header.png`.
It spans the article column and retains its original aspect ratio.
