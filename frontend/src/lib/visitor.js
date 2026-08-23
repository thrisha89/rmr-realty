// Shared anonymous visitor id, persisted in localStorage.
// Reused by the chatbot widget and by page-view / search tracking so that
// activity from the same browser can be correlated in the admin panel.
export function getVisitorId() {
  let id = localStorage.getItem("rmr_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("rmr_visitor_id", id);
  }
  return id;
}
