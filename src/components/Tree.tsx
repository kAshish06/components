import React from "react";

type FlatData = {
  id: number;
  name: string;
  depth: number;
  checked: boolean | "indeterminate";
  parentId: number | null;
};
type Data = {
  id: number;
  name: string;
  children?: Data[];
};

type Props = {
  data: Data[];
};

const flattenData = (
  list: Data[],
  depth = 0,
  parentId: number | null | undefined = null
): Omit<FlatData, "checked">[] => {
  const result = [];
  for (let i = 0; i < list.length; i++) {
    const listNode = list[i];
    const node: Omit<FlatData, "checked"> = {
      id: listNode.id,
      name: listNode.name,
      depth: depth,
      parentId: parentId,
    };
    result.push(node);
    if (listNode.children?.length) {
      result.push(...flattenData(listNode.children, depth + 1, listNode.id));
    }
  }
  return result;
};
const transformData = (list: Data[], selectedIds: number[]): FlatData[] => {
  return flattenData(list).map((item) => {
    return {
      ...item,
      checked: selectedIds.includes(item.id),
    };
  });
};
const findChildren = (list: FlatData[], node: FlatData): number[] => {
  const children = [];
  const queue = [node.id];
  while (queue.length) {
    const current = queue.shift();
    const desc = list
      .filter((item) => item.parentId === current)
      .map((item) => item.id);
    children.push(...desc);
    queue.push(...desc);
  }
  return children;
};
const getAncestors = (
  list: FlatData[],
  node: FlatData | undefined
): number[] | [] => {
  const ancestors = [];
  while (node) {
    if (node.parentId) {
      ancestors.push(node.parentId);
    }
    node = list.find((item) => item.id === node?.parentId);
  }
  return ancestors;
};

// const getParentsStatus = () => {};

export default function Tree({ data }: Props) {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const transformedData = React.useMemo<FlatData[]>((): FlatData[] => {
    return transformData(data, selectedIds);
  }, [selectedIds, data]);

  const handleChange = (node: FlatData) => {
    const children = findChildren(transformedData, node);
    if (!node.checked) {
      const newSelectedIds = new Set([...selectedIds, node.id, ...children]);
      setSelectedIds([...newSelectedIds]);
    } else {
      const newSelectedIds = selectedIds.filter(
        (id) => ![...children, node.id].includes(id)
      );
      setSelectedIds(newSelectedIds);
    }
  };
  if (!data || data.length === 0) {
    return "No data found";
  }
  return (
    <div className="checkboxtree-container">
      {transformedData.map((item) => {
        return (
          <div style={{ marginLeft: `${10 * item.depth}px` }} key={item.id}>
            <input
              type="checkbox"
              checked={typeof item.checked === "boolean" ? item.checked : false}
              onChange={() => {
                handleChange(item);
              }}
            />
            <span>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}
