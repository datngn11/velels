interface SizeRow {
  size: string;
  bust: string;
  waist: string;
  hips: string;
}

export const swimwearSizeChart: SizeRow[] = [
  { size: "XXS", bust: "74–78", waist: "54–58", hips: "79–83" },
  { size: "XS", bust: "78–82", waist: "58–62", hips: "83–87" },
  { size: "S", bust: "82–86", waist: "62–66", hips: "87–91" },
  { size: "M", bust: "86–90", waist: "66–70", hips: "91–95" },
  { size: "L", bust: "90–94", waist: "70–74", hips: "95–100" },
];

export const dressesSizeChart: SizeRow[] = [
  { size: "XS", bust: "82–84", waist: "62–64", hips: "88–90" },
  { size: "S", bust: "86–88", waist: "66–68", hips: "92–94" },
  { size: "M", bust: "90–92", waist: "70–72", hips: "96–98" },
  { size: "L", bust: "94–98", waist: "74–76", hips: "100–102" },
];

interface SizeChartTableProps {
  rows: SizeRow[];
  labels: SizeRow;
}

/** No hooks, so it renders in the size guide dialog and on the FAQ page alike. */
export function SizeChartTable({ rows, labels }: SizeChartTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead>
          <tr className="border-b border-primary/20 text-primary">
            <th className="py-3.5 px-3 font-semibold uppercase tracking-wider text-xs">
              {labels.size}
            </th>
            <th className="py-3.5 px-3 font-semibold uppercase tracking-wider text-xs text-center">
              {labels.bust}
            </th>
            <th className="py-3.5 px-3 font-semibold uppercase tracking-wider text-xs text-center">
              {labels.waist}
            </th>
            <th className="py-3.5 px-3 font-semibold uppercase tracking-wider text-xs text-center">
              {labels.hips}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/15 text-secondary">
          {rows.map((row) => (
            <tr
              key={row.size}
              className="hover:bg-surface-container-low/50 transition-colors"
            >
              <td className="py-3.5 px-3 font-medium text-primary">
                {row.size}
              </td>
              <td className="py-3.5 px-3 text-center tabular-nums">
                {row.bust}
              </td>
              <td className="py-3.5 px-3 text-center tabular-nums">
                {row.waist}
              </td>
              <td className="py-3.5 px-3 text-center tabular-nums">
                {row.hips}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
