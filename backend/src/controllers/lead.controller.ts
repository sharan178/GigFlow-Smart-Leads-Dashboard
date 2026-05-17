import { FilterQuery } from "mongoose";
import { Lead, ILead } from "../models/Lead";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const buildLeadQuery = (query: Record<string, unknown>): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.search) {
    const search = String(query.search).trim();
    filter.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
  }
  return filter;
};

export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({ ...req.body, owner: req.user?.id });
  res.status(201).json({ success: true, data: lead });
});

export const getLeads = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = 10;
  const skip = (page - 1) * limit;
  const sortOrder = req.query.sort === "oldest" ? 1 : -1;
  const filter = buildLeadQuery(req.query);

  const [items, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new ApiError(404, "Lead not found");
  res.status(200).json({ success: true, data: lead });
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!lead) throw new ApiError(404, "Lead not found");
  res.status(200).json({ success: true, data: lead });
});

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new ApiError(404, "Lead not found");
  res.status(200).json({ success: true, message: "Lead deleted" });
});
