import { cookies } from "next/headers";

import { FlowDashboard } from "./components/flow-dashboard";
import { AI } from "./actions";

export default function FlowPage() {
  const layout = cookies().get("react-resizable-panels:layout:mail");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <AI>
      <div className="sm:hidden">
        {/* TODO: Mobile view */}
        <h1>Mobile view</h1>
        <p>This is the mobile view</p>
        <p>
          No point in showing this on mobile, but will build out a view later
        </p>
      </div>
      <div className="hidden flex-col sm:flex">
        <FlowDashboard defaultLayout={defaultLayout} />
      </div>
    </AI>
  );
}
