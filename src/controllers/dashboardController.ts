import { Response } from "express";
import ExtendedRequest from "../types/extendedRequest";
import { errorResponse, successResponse } from "../utils/response";
import { getDashboardSummaryService } from "../services/dashboardService";

export const getDashboardSummary = async (req: ExtendedRequest, res: Response) => {
  const  { year } = req.query
  try {
    const result = await getDashboardSummaryService(year)
    return successResponse(res, result)
  } catch (error: any) {
    return errorResponse(res, error.message, error)
  }
}