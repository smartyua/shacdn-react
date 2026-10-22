import type { ReactNode } from 'react';

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface VisibleRow {
  node: TreeNode;
  level: number;
  parentId: string | null;
}

/** Depth-first rows a keyboard user can reach: children only of expanded nodes. */
export const flattenVisible = (nodes: TreeNode[], open: Set<string>, level = 1, parentId: string | null = null): VisibleRow[] =>
  nodes.flatMap(node => [
    { node, level, parentId },
    ...(node.children?.length && open.has(node.id) ? flattenVisible(node.children, open, level + 1, node.id) : []),
  ]);
