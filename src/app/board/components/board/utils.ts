type GetOrCreateCursorProps = {
  sender: string;
};

export function getOrCreateCursorFor({
  sender,
}: GetOrCreateCursorProps): SVGElement | undefined {
  const existing = document.querySelector(`[data-sender='${sender}']`);
  if (existing) {
    return existing as SVGElement;
  }

  const template = document.getElementById("cursor") as HTMLTemplateElement;

  if (!template?.firstElementChild) {
    return;
  }

  const cursor = template.firstElementChild.cloneNode(true) as SVGElement;

  if (!cursor) {
    return;
  }

  cursor.setAttribute("data-sender", sender);
  document.body.appendChild(cursor);

  return cursor;
}
