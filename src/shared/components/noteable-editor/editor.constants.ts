import { EditorNode, Text } from './editor.interface';
import { List, Map } from 'immutable';

export const EMPTY_STRING = '​';

export const textNode: Text = Map<string, string>().set('text', EMPTY_STRING);

export const paragraphNode: EditorNode = Map<string, string | List<Text>>()
  .set('type', 'paragraph')
  .set('children', List<Text>([textNode]));
