(function () {
  var currentScript = document.currentScript;
  var projectId = currentScript && currentScript.getAttribute("data-project-id");

  if (!projectId) {
    console.warn("[Docket] Missing data-project-id on the widget script tag.");
    return;
  }

  var origin = new URL(currentScript.src).origin;
  var open = false;

  var bubble = document.createElement("button");
  bubble.setAttribute("aria-label", "Open chat");
  bubble.style.cssText = [
    "position:fixed",
    "bottom:20px",
    "right:20px",
    "width:56px",
    "height:56px",
    "border-radius:9999px",
    "background:#24503F",
    "border:none",
    "box-shadow:0 8px 24px rgba(0,0,0,0.2)",
    "cursor:pointer",
    "z-index:2147483000",
    "display:flex",
    "align-items:center",
    "justify-content:center",
  ].join(";");
  bubble.innerHTML =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">' +
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  var iframe = document.createElement("iframe");
  iframe.src = origin + "/embed/" + encodeURIComponent(projectId);
  iframe.title = "Chat";
  iframe.style.cssText = [
    "position:fixed",
    "bottom:88px",
    "right:20px",
    "width:340px",
    "height:520px",
    "max-height:calc(100vh - 110px)",
    "border:none",
    "border-radius:12px",
    "box-shadow:0 16px 48px rgba(0,0,0,0.25)",
    "z-index:2147483000",
    "display:none",
  ].join(";");

  bubble.addEventListener("click", function () {
    open = !open;
    iframe.style.display = open ? "block" : "none";
  });

  document.body.appendChild(iframe);
  document.body.appendChild(bubble);
})();
