import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
type FlatData = {
  id: number;
  name: string;
  depth: number;
  checked: boolean | "indeterminate";
  parentId: number | null;
  hasChildren: boolean;
  isExpanded: boolean;
  isVisible: boolean;
};
type Data = {
  id: number;
  name: string;
  children?: Data[];
};

type Props = {
  data: Data[];
  onNodeClick?: (node: FlatData) => void;
  selectable?: boolean;
};

const flattenData = (
  list: Data[],
  selectedIds: number[],
  expandedIds: number[],
  depth = 0,
  parentId: number | null | undefined = null
): { result: FlatData[]; childMap: Map<number, number[]> } => {
  const result = [];
  let nodeChildMap = new Map<number, number[]>();
  for (const listNode of list) {
    let checkedStatus: boolean | "indeterminate" = selectedIds.includes(
      listNode.id
    );
    const expandedStatus = expandedIds.includes(listNode.id);
    let flatChildData: FlatData[] = [];
    if (listNode.children?.length) {
      const { result: childResult, childMap } = flattenData(
        listNode.children,
        selectedIds,
        expandedIds,
        depth + 1,
        listNode.id
      );
      nodeChildMap.set(listNode.id, [...childResult.map((item) => item.id)]);
      nodeChildMap = new Map([...nodeChildMap, ...childMap]);
      const checked = childResult.filter((child) => child.checked)?.length;
      checkedStatus =
        checked === childResult.length
          ? true
          : checked === 0
          ? false
          : "indeterminate";
      flatChildData = childResult;
    }
    const node: FlatData = {
      id: listNode.id,
      name: listNode.name,
      depth: depth,
      parentId: parentId,
      checked: checkedStatus,
      hasChildren: flatChildData.length !== 0,
      isExpanded: expandedStatus,
      isVisible: parentId ? expandedIds.includes(parentId) : true,
    };
    result.push(node, ...flatChildData);
  }
  return { result, childMap: nodeChildMap };
};

export default function Tree({
  data,
  selectable = true,
  onNodeClick = () => {},
}: Props) {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [expandedIds, setExpandedIds] = React.useState<number[]>([]);

  const { result: transformedData, childMap } = React.useMemo(() => {
    return flattenData(data, selectedIds, expandedIds);
  }, [selectedIds, expandedIds, data]);

  const handleChange = (node: FlatData) => {
    const children = childMap.get(node.id) || [];
    let newSelectedIds: number[] = [];
    if (!node.checked) {
      const ids = new Set([...selectedIds, node.id, ...children]);
      newSelectedIds = [...ids];
    } else {
      newSelectedIds = selectedIds.filter(
        (id) => ![...children, node.id].includes(id)
      );
    }
    setSelectedIds(newSelectedIds);
    onNodeClick({ ...node, checked: !node.checked });
  };
  const handleExpandCollapse = (node: FlatData) => {
    if (!node.isExpanded) {
      setExpandedIds((prev) => [...prev, node.id]);
    } else {
      setExpandedIds(expandedIds.filter((id) => id !== node.id));
    }
  };
  const indeterminateHandler = (
    el: HTMLInputElement | null,
    item: FlatData
  ) => {
    if (el) {
      el.indeterminate = item.checked === "indeterminate";
    }
  };
  if (!data || data.length === 0) {
    return "No data found";
  }
  return (
    <div className="checkboxtree-container">
      {transformedData.map((item) => {
        if (!item.isVisible) return null;
        return (
          <div
            className="tree-node-container"
            style={{ marginLeft: `${35 * item.depth}px` }}
            key={item.id}
          >
            {item.hasChildren && (
              <span onClick={() => handleExpandCollapse(item)}>
                {!item.isExpanded && (
                  <ChevronRight size="18px" strokeWidth={1} />
                )}
                {item.isExpanded && <ChevronDown size="18px" strokeWidth={1} />}
              </span>
            )}
            {selectable && (
              <input
                id={`tree-checkbox-${item.id}`}
                type="checkbox"
                checked={
                  typeof item.checked === "boolean" ? item.checked : false
                }
                onChange={() => {
                  handleChange(item);
                }}
                ref={(el) => indeterminateHandler(el, item)}
              />
            )}
            <label htmlFor={`tree-checkbox-${item.id}`}>{item.name}</label>
          </div>
        );
      })}
    </div>
  );
}
