export const getCaretPosition = (parent: Node, node: Node, offset: number, stat: { pos: number; done: boolean }) => {
  if (stat.done) return stat;

  const { childNodes } = parent;

  const parentChildNodesLength = childNodes.length;

  for (let i = 0; i < parentChildNodesLength && !stat.done; i++) {
    const currentNode = parent.childNodes[i];

    if (currentNode === node) {
      stat.pos += offset;
      stat.done = true;

      return stat;
    }

    getCaretPosition(currentNode, node, offset, stat);
  }

  return stat;
}

export const setCaretPosition = (parent: Node, range: Range, stat: { pos: number; done: boolean }) => {
  const { done, pos } = stat;

  if (done) return range;

  const { textContent, childNodes, COMMENT_NODE } = parent;

  const parentContextLength = textContent?.length ?? 0;
  const parentChildNodesLength = childNodes.length;

  if (!parentChildNodesLength) {
    range.setStart(parent, Math.min(parentContextLength, pos));
    stat.done = true;

    return range;
  }

  for (let i = 0; i < parentChildNodesLength && !stat.done; i++) {
    const currentNode = parent.childNodes[i];

    if (currentNode.nodeType === COMMENT_NODE) break;

    setCaretPosition(currentNode, range, stat);
  }

  return range;
}