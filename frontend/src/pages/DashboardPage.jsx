import { MotionConfig } from "motion/react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";
import useDashboardStats from "../features/dashboard/hooks/useDashboardStats";
import StatCard from "../features/dashboard/components/StatCard";
import TicketOverview from "../features/dashboard/components/TicketOverview";
import ResourceOverview from "../features/dashboard/components/ResourceOverview";
import WorkspaceSnapshot from "../features/dashboard/components/WorkspaceSnapshot";
import PageHeader from "../components/common/PageHeader";
import ErrorState from "../components/common/ErrorState";
import Skeleton from "../components/common/Skeleton";
import { formatDate } from "../utils/date";
export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const data = useDashboardStats();
  return (
    <MotionConfig reducedMotion="user"><main className="workspace-page">
      <PageHeader
        eyebrow="YOUR WORKSPACE"
        title={`Good to see you, ${user?.name?.split(" ")[0] || "there"}`}
        description="Here’s what’s happening across your support operations."
      >
        <div className="heading-date">
          <CalendarDays size={18} />
          {formatDate(new Date(), {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </div>
      </PageHeader>
      {data.errors.map(({ name, error, retry }) => (
        <ErrorState
          key={name}
          title={`${name} could not be loaded`}
          error={error}
          onRetry={retry}
        />
      ))}
      {data.isPending ? (
        <Skeleton count={4} className="stat-skeleton" />
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              label="Active resources"
              value={data.activeResources}
              icon={Package}
              note="Available to your team"
            />
            <StatCard
              label="Reviewed tickets"
              value={data.stats.reviewedCount}
              icon={CheckCircle2}
              color="green"
              note="Human-reviewed cases"
            />
            <StatCard
              label="Model agreement"
              value={
                data.stats.modelAgreementRate == null
                  ? null
                  : `${data.stats.modelAgreementRate}%`
              }
              icon={TrendingUp}
              color="blue"
              note="Triage consistency"
            />
            <StatCard
              label="Pending bookings"
              value={data.pendingBookings}
              icon={Clock3}
              color="amber"
              note="Awaiting a decision"
            />
          </div>
          <ResourceOverview data={data} admin={isAdmin} />
          <WorkspaceSnapshot data={data} admin={isAdmin} />
          <TicketOverview data={data} admin={isAdmin} />
        </>
      )}
    </main></MotionConfig>
  );
}
