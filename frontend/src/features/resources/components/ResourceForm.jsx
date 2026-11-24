import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import ErrorState from "../../../components/common/ErrorState";
import { RESOURCE_TYPES } from "../../../utils/constants";
import { useResourceMutations } from "../hooks/useResources";
export default function ResourceForm({ resource, onSaved, onCancel }) {
  const { save } = useResourceMutations();
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      await save.mutateAsync({
        ...data,
        capacity: Number(data.capacity),
        ...(resource ? { id: resource.id } : {}),
      });
      form.reset();
      onSaved();
    } catch {
      /* The mutation error is rendered below. */
    }
  }
  return (
    <Card
      title={resource ? "Edit resource" : "Add a resource"}
      description="Keep shared resource details current."
      className="admin-form-panel"
    >
      <form className="admin-resource-form" onSubmit={submit}>
        <Input
          label="Resource name"
          name="name"
          required
          minLength={3}
          maxLength={60}
          defaultValue={resource?.name || ""}
          placeholder="e.g. Conference room A"
        />
        <Select
          label="Type"
          name="type"
          defaultValue={resource?.type || "ROOM"}
        >
          {RESOURCE_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>
        <Input
          label="Capacity"
          name="capacity"
          type="number"
          min={1}
          max={500}
          required
          defaultValue={resource?.capacity || 1}
        />
        <Input
          label="Location"
          name="location"
          required
          maxLength={191}
          defaultValue={resource?.location || ""}
          placeholder="Building or floor"
        />
        <Input
          multiline
          label="Description"
          name="description"
          rows={3}
          maxLength={300}
          defaultValue={resource?.description || ""}
          fieldClassName="form-wide"
        />
        {save.isError && (
          <div className="form-wide">
            <ErrorState error={save.error} />
          </div>
        )}
        <div className="admin-form-actions">
          <Button type="submit" loading={save.isPending}>
            {save.isPending
              ? "Saving…"
              : resource
                ? "Save resource"
                : "Create resource"}
          </Button>
          {resource && (
            <Button
              variant="secondary"
              disabled={save.isPending}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
