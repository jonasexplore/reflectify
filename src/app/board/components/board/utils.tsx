type GetOrCreateCursorProps = {
  sender: string;
};

export function getOrCreateCursorFor({
  sender,
}: GetOrCreateCursorProps): HTMLDivElement | undefined {
  const existing = document.querySelector(`[data-sender='${sender}']`);

  if (existing) {
    return existing as HTMLDivElement;
  }

  const template = document.getElementById("cursor") as HTMLTemplateElement;

  if (!template?.firstElementChild) {
    return;
  }

  const cursor = template.firstElementChild.cloneNode(true) as HTMLDivElement;

  if (!cursor) {
    return;
  }

  cursor.setAttribute("data-sender", sender);
  if (cursor.lastElementChild) {
    cursor.lastElementChild.innerHTML = sender;
  }

  const board = document.getElementById("board");

  board?.appendChild(cursor);

  return cursor;
}
