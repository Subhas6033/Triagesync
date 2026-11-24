import BreakdownChart from "./BreakdownChart";
export default function PriorityChart({ values }) {
  return (
    <BreakdownChart
      title="Ticket priorities"
      description="Tickets grouped by priority"
      values={values}
    />
  );
}
