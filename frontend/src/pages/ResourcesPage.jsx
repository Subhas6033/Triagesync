import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import Select from "../components/common/Select";
import ResourceList from "../features/resources/components/ResourceList";
import { useResourceList } from "../features/resources/hooks/useResources";
export default function ResourcesPage() {
  const { query, search, setSearch, type, setType, types, filtered, setPage } =
    useResourceList();
  return (
    <main className="workspace-page">
      <PageHeader
        eyebrow="SHARED WORKSPACE"
        title="Resources"
        description="Find a space or piece of equipment for your team."
      />
      <section className="panel resource-controls">
        <SearchInput
          label="Search resources"
          value={search}
          onChange={setSearch}
          placeholder="Search by name, location…"
        />
        <Select
          aria-label="Filter by resource type"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="">All resource types</option>
          {types.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>
        <span className="result-count">{query.total} resources</span>
      </section>
      <ResourceList resources={filtered} query={query} />
      <Pagination
        page={query.page}
        total={query.total}
        pageSize={query.pageSize}
        onChange={setPage}
      />
    </main>
  );
}
