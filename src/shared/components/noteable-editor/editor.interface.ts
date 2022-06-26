import { List, Map } from "immutable";

interface TextStyle extends Map<string, boolean> {};

export interface Text extends Map<string, string | TextStyle> {}

export interface EditorNode extends Map<string, string | List<EditorNode> | List<Text>> {}

export enum InputType {
  INSERT = 'insertText',
  DELETE_DELETE = 'deleteContentForward',
  BACKSPACE_DELETE = 'deleteContentBackward'
}