import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import ErrorState from "../../../components/common/ErrorState";
import { useTicketMutations } from "../hooks/useTickets";
import { parseTicketImport } from "../../../utils/validation";
export default function TicketImport() {
  const fileInput = useRef(null);
  const [error, setError] = useState(null);
  const [reading, setReading] = useState(false);
  const { importBatch } = useTicketMutations();
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    setReading(true);
    setError(null);
    try {
      const tickets = parseTicketImport(await file.text());
      await importBatch.mutateAsync(tickets);
    } catch (error) {
      setError(error);
    } finally {
      setReading(false);
    }
  }
  return (
    <>
      <Button
        variant="secondary"
        loading={reading || importBatch.isPending}
        onClick={() => fileInput.current.click()}
      >
        <Upload size={17} />
        Re-Import Feed
      </Button>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        onChange={upload}
        hidden
        aria-label="Import tickets JSON file"
      />
      <Modal
        open={Boolean(error)}
        onClose={() => setError(null)}
        title="Tickets could not be imported"
      >
        <ErrorState error={error} />
        <p>
          Choose a JSON array of tickets or an object containing a tickets
          array.
        </p>
      </Modal>
    </>
  );
}
