# Sukoon

Final Sukoon YouTube player build.

Default video:
https://www.youtube.com/watch?v=Eq7_v0VgUVA

The playlist cards use `data-playlist="Eq7_v0VgUVA"`.
The YouTube IFrame API reads that video ID and plays it inside the site.

For local testing, use:
`python -m http.server 8000`

Then open:
`http://localhost:8000`

Do not rely on double-clicking index.html because the YouTube IFrame API is more reliable from an HTTP/HTTPS origin.

If the YouTube uploader has disabled embedding, in-page playback cannot be forced.
