import BreakdownChart from "./BreakdownChart";
export default function CategoryChart({ values }) {
  return (
    <BreakdownChart
      title="Ticket categories"
      description="Tickets grouped by category"
      values={values}
    />
  );
}
