import { getCaretPosition, setCaretPosition } from './editor.utils';
import { EMPTY_STRING, paragraphNode } from './editor.constants';
import { EditorNode, InputType } from './editor.interface';
import { Component } from '@angular/core';
import { List, Map } from 'immutable';

@Component({
  selector: 'app-noteable-editor',
  templateUrl: './noteable-editor.component.html',
  styleUrls: ['./noteable-editor.component.sass']
})
export class NoteableEditorComponent {
  private mockData: EditorNode;

  get editorData(): List<EditorNode> {
    return this.mockData.get('children') as List<EditorNode>;
  }

  constructor() {
    this.mockData = Map<string, string | List<EditorNode>>()
      .set('type', 'editor')
      .set('children', List<EditorNode>([paragraphNode]));
  }

  onEditorKeyPressed(event: KeyboardEvent) {
    const { key, target } = event;

    if (key === 'Enter') {
      event.preventDefault();
      this.addNode(target as Node);
    }
  }

  onEditorBeforeInput(event: InputEvent) {
    event.preventDefault();

    const { data, target, inputType } = event;

    if (inputType === InputType.INSERT) {
      this.insertText(data!, target as Node, 'after');
    }

    if (inputType === InputType.BACKSPACE_DELETE || inputType === InputType.DELETE_DELETE) {
      this.deleteText(target as Node, inputType);
    }
  }

  private getLeafPath({ focusNode }: Selection): List<string> {
    const leafEl = focusNode!.parentElement!;
    const nodeEl = leafEl.parentElement!;

    const nodeId = nodeEl.getAttribute('data-id')!;
    const leafId = leafEl.getAttribute('data-id')!;

    return List<string>(['children', nodeId, 'children', leafId, 'text']);
  }

  private async addNode(editorNode: Node): Promise<void> {
    const selection = document.getSelection()!;
    const leafPath = this.getLeafPath(selection);

    const nodeId = Number(leafPath.get(1));
    const newNodeId = nodeId + 1;

    let breakText = ''

    this.mockData = this.mockData.updateIn(leafPath, (originalText: any) => {
      const originalTextWithType = originalText as string;

      /**
       * This is clamped between 1 and the max of the text length due to the fact that
       * every node starts with a zero-width space character and we want to leave
       * that character alone when breaking lines.
       */
      const newOffset = !selection.focusOffset ? 1 : selection.focusOffset;

      breakText += originalTextWithType.slice(newOffset, originalTextWithType.length);

      return originalTextWithType.slice(0, newOffset);
    })

    this.mockData = this.mockData.update('children', (children: any) => {
      const childrenWithType = children as List<EditorNode>;
      const newParagraphNode = paragraphNode.updateIn(['children', 0, 'text'], (zeroWidthSpace) => zeroWidthSpace + breakText);

      return childrenWithType.insert(newNodeId, newParagraphNode);
    });

    selection.removeAllRanges();

    return new Promise(resolve => setTimeout(() => {
      const newNode = (editorNode as HTMLElement).querySelector(`[data-id="${newNodeId}"]`) as Node;
      const range = setCaretPosition(newNode, document.createRange(), { pos: 0, done: false });

      range.collapse(true);
      selection.addRange(range);

      resolve();
    }));
  }

  private async removeNode(editorNode: Node, nodeId: number): Promise<void | string> {
    const { COMMENT_NODE } = editorNode;
    const nodesListSize = (this.mockData.get('children') as List<EditorNode>).size;

    if (nodesListSize > 1) {
      const selection = document.getSelection()!;
      const nodeText = (editorNode as HTMLElement).querySelector(`[data-id="${nodeId}"]`)?.textContent!;
      const sanitizedNodeText = nodeText.slice(1, nodeText.length);

      this.mockData = this.mockData.update('children', children => {
        const childrenWithType = children as List<EditorNode>;

        return childrenWithType.delete(nodeId)
      });

      selection.removeAllRanges();

      return new Promise(resolve => setTimeout(() => {
        const newNodeId = nodeId ? nodeId - 1 : nodeId;
        const preNode = (editorNode as HTMLElement).querySelector(`[data-id="${newNodeId}"]`);
        const lastLeaf = List<Node>(preNode?.childNodes).filter(node => node.nodeType !== COMMENT_NODE).last()!;

        const range = setCaretPosition(lastLeaf, document.createRange(), { pos: lastLeaf.textContent!.length, done: false });

        range.collapse(true);
        selection.addRange(range);

        resolve (sanitizedNodeText);
      }));
    }

    return new Promise(resolve => resolve());
  }

  private async deleteText(editorNode: Node, deleteType: InputType.BACKSPACE_DELETE | InputType.DELETE_DELETE): Promise<void> {
    const selection = document.getSelection()!;
    const leafPath = this.getLeafPath(selection);

    const { focusNode, focusOffset, isCollapsed } = selection;
    const { pos } = getCaretPosition(focusNode!.parentNode!, focusNode!, focusOffset, { pos: 0, done: false });

    if (deleteType === InputType.BACKSPACE_DELETE && (focusNode?.textContent === EMPTY_STRING || pos <= 1) && isCollapsed) {
      const sanitizedText = await this.removeNode(editorNode, Number(leafPath.get(1)));

      if (sanitizedText) {
        return this.insertText(sanitizedText, editorNode, 'before');
      }

      return new Promise(resolve => resolve());
    }

    if (deleteType === InputType.DELETE_DELETE && pos === focusNode?.textContent?.length && isCollapsed) return new Promise(resolve => resolve());

    let deletedText = '';

    this.mockData = this.mockData.updateIn(leafPath, (originalText: string | any) => {
      if (isCollapsed && deleteType === InputType.BACKSPACE_DELETE) {
        const returningString = `${originalText.slice(0, pos - 1)}${originalText.slice(pos)}`;

        return returningString.length ? returningString : EMPTY_STRING;
      }

      if (isCollapsed && deleteType === InputType.DELETE_DELETE) {
        const returningString = `${originalText.slice(0, pos)}${originalText.slice(pos + 1)}`;

        return returningString.length ? returningString : EMPTY_STRING;
      }

      deletedText = selection.toString();

      const returningString = originalText.replace(selection.toString(), '');

      return returningString.length ? returningString : EMPTY_STRING;
    });

    selection.removeAllRanges();

    return new Promise((resolve) => setTimeout(() => {
      let newPos = pos;

      if (isCollapsed && deleteType === InputType.BACKSPACE_DELETE) newPos -= 1;
      if (!isCollapsed && deleteType === InputType.BACKSPACE_DELETE) newPos -= deletedText.length;

      const nodeId = leafPath.get(1);
      const leafId = leafPath.get(3);

      const containerNode =  (editorNode as HTMLElement).querySelector(`[data-id="${nodeId}"]`)!
      const leafNode = containerNode.querySelector(`[data-id="${leafId}"]`) as Node;

      const range = setCaretPosition(leafNode, document.createRange(), { pos: newPos, done: false });

      range.collapse(true);
      selection.addRange(range);

      resolve();
    }));
  }

  private async insertText(text: string, editorNode: Node, caretPosition: 'before' | 'after'): Promise<void> {
    const { isCollapsed } = document.getSelection()!;

    if (!isCollapsed) {
      await this.deleteText(editorNode, InputType.BACKSPACE_DELETE)
      await this.insertText(text, editorNode, 'after');

      return;
    }

    const selection = document.getSelection()!;
    const leafPath = this.getLeafPath(selection);

    const { focusNode, focusOffset } = selection;
    const { pos } = getCaretPosition(focusNode!.parentNode!, focusNode!, focusOffset, { pos: 0, done: false });

    this.mockData = this.mockData.updateIn(leafPath, (originalText: string | any) => `${originalText.slice(0, pos)}${text}${originalText.slice(pos)}`);

    selection.removeAllRanges();

    // Restore the caret position after the text is removed in the next event cycle;
    return new Promise((resolve) => setTimeout(() => {
      const emptyRange = document.createRange();
      const newPos = pos + ( caretPosition === 'before' ? 0 : text.length);

      const nodeId = leafPath.get(1);
      const leafId = leafPath.get(3);

      const containerNode =  (editorNode as HTMLElement).querySelector(`[data-id="${nodeId}"]`)!
      const leafNode = containerNode.querySelector(`[data-id="${leafId}"]`) as Node;

      const range = setCaretPosition(leafNode, emptyRange, { pos: newPos, done: false });

      range.collapse(true);
      selection.addRange(range);

      resolve();
    }))
  }
}
