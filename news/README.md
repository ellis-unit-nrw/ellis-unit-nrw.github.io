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

## Modular event articles

The kick-off page at `ellis-unit-nrw-kick-off-2026/index.html` keeps essential
registration and venue information in HTML. Edit its `content.json` for optional
sections, rendered by `news/event-modules.js`. No build tools are needed.

Sections appear in array order. Move, add, or remove sections as needed, or set
`"enabled": false` to hide one. Sections without items or a description are hidden.
The kick-off page lists all participants together in one Speakers section with
consistent cards. Add further confirmed speakers to that section’s `items` array,
before the “More to be announced” placeholder.

Supported section types:

- `speakers`: prominent cards; each item has `name` and optional `affiliation`,
  `image`, `website`, `talk`, and `description`.
- `directors`: the same fields in smaller cards. Copy the presenting directors'
  details from `config/members.json`; use `../../images/members/<file>` for photos.
- `programme`: items contain `title`, optional `time`, and optional `description`.
  Keep `status` set to `Tentative` while the agenda is provisional. Times can be
  omitted, so session topics can be announced before timings are available.
- `text`: items are paragraph strings, useful for a report or highlights.
- `gallery`: items contain `src`, `alt`, and optional `caption`.

Every section has `type`, `title`, optional `description`, optional `status`, and
an `items` array. Text is plain text, not HTML. Image paths are relative to the
article page. Example speaker section (replace example content before publishing):

```json
{
  "type": "speakers",
  "title": "Confirmed speakers",
  "items": [
    {
      "name": "Full name",
      "affiliation": "Institution",
      "image": "speaker.jpg",
      "talk": "Talk title"
    }
  ]
}
```

Event information source: https://events.lamarr-institute.org/event/498/
Publication date: 24 September 2026. Participants were supplied by the event
organiser; programme details remain tentative. Samuel Kaski’s affiliation and
research summary are sourced from https://kaski-lab.com/.
