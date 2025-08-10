(function(){
  // Helpers
  const $ = (sel) => document.querySelector(sel);
  const escapeHtml = (s) => (s || "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const isValidUrl = (v) => { try { new URL(v); return true; } catch { return false; } };

  // Elements
  const descEl = $("#desc");
  const mediaEl = $("#media");
  const urlEl   = $("#url");
  const altEl   = $("#alt");
  const btnGen  = $("#generate");
  const btnPrefill = $("#prefill");
  const btnClear = $("#clear");
  const btnCopyLink = $("#copyLink");
  const btnCopyHtml = $("#copyHtml");
  const outLink = $("#outLink");
  const outHtml = $("#outHtml");
  const preview = $("#preview");
  const errorEl = $("#error");
  const likeCount = $("#likeCount");
  const likeBtn = $("#likeBtn");

  const VAL_TOWN_URL = "https://Jamesllllllllll--019894a514b47659ac14319f8b619533.web.val.run";
  const LIKE_ID = document.body?.dataset?.likeId || "pinit-app";

  // Like counter functionality using ID-based val.town API
  async function fetchLikeCount() {
    try {
      const response = await fetch(`${VAL_TOWN_URL}/api/likes/${encodeURIComponent(LIKE_ID)}`);
      
      if (response.ok) {
        const data = await response.json();
        const likes = data.likeCount || 0;
        likeCount.textContent = likes;
      } else {
        likeCount.textContent = "0";
      }
    } catch (error) {
      console.error("Error fetching like count:", error);
      likeCount.textContent = "0";
    }
  }

  async function incrementLikeCount() {
    try {
      // Show loading state on the number
      likeCount.style.opacity = '0.5';
      likeCount.style.transform = 'scale(0.9)';
      
      // Record a like for this ID using the val.town API
      const response = await fetch(`${VAL_TOWN_URL}/api/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: LIKE_ID })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newCount = data.likeCount || 0;
        likeCount.textContent = newCount;
        
        // Animate the number update
        likeCount.style.opacity = '1';
        likeCount.style.transform = 'scale(1.1)';
        setTimeout(() => {
          likeCount.style.transform = 'scale(1)';
        }, 150);
      } else {
        throw new Error(`Failed to record like: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating like count:", error);
      // Reset loading state on error
      likeCount.style.opacity = '1';
      likeCount.style.transform = 'scale(1)';
    }
  }

  // Logic
  const buildPinterestHref = (desc, media, url) =>
    "https://www.pinterest.com/pin/create/button/?" +
    "url=" + encodeURIComponent(url) +
    "&media=" + encodeURIComponent(media) +
    "&description=" + encodeURIComponent(desc);

  const buildEmbeddableBlock = (href, imgSrc, alt) => [
    '<style>',
    '.pinit-link{position:relative;display:inline-block;text-decoration:none;}',
    '.pinit-link img{display:block;max-width:100%;height:auto;border-radius:12px;}',
    '.pinit-link::before{content:"Pin it";position:absolute;top:10px;left:10px;display:inline-flex;align-items:center;justify-content:center;height:32px;min-width:32px;padding:0 10px;background-color:#bb2729;color:#fff;font:600 12px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.25);opacity:.92;transition:opacity .2s ease-in-out,transform .2s ease-in-out;pointer-events:none;z-index:1;transform:translateY(0);}',
    '.pinit-link:hover::before{opacity:1;transform:translateY(-1px);}',
    '</style>',
    '<a class="pinit-link" href="', href, '" target="_blank" rel="noopener">',
    '  <img src="', escapeHtml(imgSrc), '" alt="', escapeHtml(alt || ""), '">',
    '</a>'
  ].join("");

  function updateButtonStates() {
    const hasMedia = (mediaEl.value || "").trim();
    const hasUrl = (urlEl.value || "").trim();
    const hasRequired = hasMedia && hasUrl;
    
    btnGen.disabled = !hasRequired;
    
    const hasGeneratedContent = outLink.textContent.trim() && outHtml.textContent.trim();
    btnCopyLink.disabled = !hasGeneratedContent;
    btnCopyHtml.disabled = !hasGeneratedContent;
  }

  function generate() {
    const desc  = (descEl.value || "").trim();
    const media = (mediaEl.value || "").trim();
    const url   = (urlEl.value || "").trim();
    const alt   = (altEl.value || "").trim();

    errorEl.textContent = "";

    if (!media || !url) {
      errorEl.textContent = "Please fill in media (image URL) and destination URL.";
      return;
    }
    if (!isValidUrl(media)) {
      errorEl.textContent = "Media must be a valid absolute URL (https).";
      return;
    }
    if (!isValidUrl(url)) {
      errorEl.textContent = "Destination URL must be a valid absolute URL (https).";
      return;
    }

    const href = buildPinterestHref(desc, media, url);
    outLink.textContent = href;

    const htmlBlock = buildEmbeddableBlock(href, media, alt);
    outHtml.textContent = htmlBlock;

    preview.innerHTML =
      '<a class="pinit-link" href="'+ href +'" target="_blank" rel="noopener">' +
      '  <img src="'+ escapeHtml(media) +'" alt="'+ escapeHtml(alt) +'">' +
      '</a>';
     
     updateButtonStates();
   }

  function copyToClipboard(text, btn){
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const t = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(()=> btn.textContent = t, 1200);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    });
  }

  // Events
  btnGen.addEventListener("click", generate);
  btnClear.addEventListener("click", () => {
    descEl.value = "";
    mediaEl.value = "";
    urlEl.value = "";
    altEl.value = "";
    outLink.textContent = "";
    outHtml.textContent = "";
    preview.innerHTML = "";
    errorEl.textContent = "";
    updateButtonStates();
  });
  btnPrefill.addEventListener("click", () => {
    mediaEl.value = "https://meaganwilliamson.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2018/07/MW-Blog-Post-Covers20.png.webp";
    urlEl.value   = "https://meaganwilliamson.com/drive-traffic-to-your-shopify-store-with-pinterests/";
    descEl.value  = "How to use Pinterest to promote your Shopify store";
    altEl.value   = "How to use Pinterest to promote your Shopify store";
    generate();
  });
  btnCopyLink.addEventListener("click", () => copyToClipboard(outLink.textContent.trim(), btnCopyLink));
  btnCopyHtml.addEventListener("click", () => copyToClipboard(outHtml.textContent.trim(), btnCopyHtml));
  likeBtn.addEventListener("click", incrementLikeCount);

  // Initial update
  updateButtonStates();
  fetchLikeCount(); // Fetch initial like count
  // Update button states on input changes
  descEl.addEventListener("input", updateButtonStates);
  mediaEl.addEventListener("input", updateButtonStates);
  urlEl.addEventListener("input", updateButtonStates);
  
})();
