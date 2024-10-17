import ApiCommonParams from "@/utils/ApiCommonParams";
import { WorkspaceState } from "./workspace";

export interface RouteApiResponse {
  localeKey?: string;
  error?: string;
}

export interface BaseRouteApi<Request, Response> {
  request: Request;
  response: RouteApiResponse & Response;
}

/**
 * @api /api/save-workspace
 */
export interface RouteSaveWorkspace
  extends BaseRouteApi<
    WorkspaceState,
    { success: boolean; workspaceKey: string }
  > {}

/**
 * @api /api/recommended-titles
 */
export interface RouteRecommendTitles
  extends BaseRouteApi<ApiCommonParams, { titles: string[] }> {}

/**
 * @api /api/publish
 */
export interface RoutePublish
  extends BaseRouteApi<WorkspaceState, { previewId: string }> {}
