import { Check, CircleOff, Clock3 } from "lucide-react";

const demoSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

export default function LandingBookingDemo() {
  return (
    <section className="booking-demo section-shell" id="booking" aria-labelledby="booking-demo-title">
      <div className="container-app demo-layout">
        <div>
          <p className="eyebrow">Shared resources, clearly booked</p>
          <h2 id="booking-demo-title" className="section-heading">Make availability easy to read.</h2>
          <p className="muted-text">See 30-minute windows at a glance. A slot can only be confirmed for one request at a time.</p>
        </div>
        <div className="demo-card booking-preview">
          <div className="demo-label"><span>Preview</span><span>Room A · Tuesday</span></div>
          <div className="booking-slot-list">
            {demoSlots.map((slot, index) => <div key={slot} className={index === 2 ? "booking-slot-taken" : ""}><span><Clock3 size={15} /> {slot}</span><span>{index === 2 ? "Booked" : "Available"}</span></div>)}
          </div>
          <div className="booking-attempts"><span><Check size={15} /> Request accepted</span><span><CircleOff size={15} /> Concurrent request declined</span></div>
          <p className="demo-disclaimer">Illustrative preview · not live availability</p>
        </div>
      </div>
    </section>
  );
}
