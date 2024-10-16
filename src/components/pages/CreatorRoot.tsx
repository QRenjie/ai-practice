"use client";
import { WorkspaceState } from "@/types/workspace";
import Workspace from "../workspace/Workspace";
import { ActiveLayerProvider } from "@/container/ActiveLayerContext";
import { LocalesValue } from "@/utils/Locales";
import LocalesProvider from "@/container/LocalesPovider";

export default function CreatorRoot({
  workspace,
  localesValue,
}: {
  workspace: WorkspaceState;
  localesValue: LocalesValue;
}) {
  return (
    <LocalesProvider
      namespace={localesValue.namespace}
      locale={localesValue.locale}
      source={localesValue.source}
    >
      <ActiveLayerProvider defaultActiveLayer={workspace.id}>
        <div className="relative w-full h-full overflow-hidden">
          <Workspace key={workspace.id} index={0} state={workspace} />
        </div>
      </ActiveLayerProvider>
    </LocalesProvider>
  );
}
