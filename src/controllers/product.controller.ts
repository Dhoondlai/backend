import { type Request, type Response } from "express";
import { collections } from "../config/db";
import { logger } from "../libs/logger";

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const products = await collections.products
      ?.find({ standard_name: name }, { projection: { _id: 0 } })
      .toArray();

    return res.status(200).send({
      status: 200,
      success: true,
      message: "Product Fetched successfully.",
      length: products?.length,
      data: products,
    });
  } catch (errRes) {
    logger.error(errRes);
    return res.status(errRes.response.statusCode ?? 500).send({
      status: errRes.response.statusCode ?? 500,
      success: false,
      message: errRes.body.message as string,
    });
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const searchQuery = typeof name === "string" ? name : "";
    const products = await collections.products
      ?.aggregate([
        { $match: { $text: { $search: searchQuery } } },
        { $addFields: { score: { $meta: "textScore" } } },
        {
          $group: {
            _id: "$standard_name",
            doc: { $first: "$$ROOT" },
          },
        },
        // Restructure to return just the document
        { $replaceRoot: { newRoot: "$doc" } },
        { $sort: { score: -1 } },
      ])
      .toArray();

    return res.status(200).send({
      status: 200,
      success: true,
      message: "Product Fetched successfully.",
      length: products?.length,
      data: products,
    });
  } catch (errRes) {
    logger.error(errRes);
    return res.status(errRes.response.statusCode ?? 500).send({
      status: errRes.response.statusCode ?? 500,
      success: false,
      message: errRes.body.message as string,
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters from query, default to page 1 with 10 items per page
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // First count unique standard_names for total count
    const uniqueProductsCount = await collections.products
      ?.distinct("standard_name")
      .then((arr) => arr.length);

    // Fetch products grouped by standard_name with vendor count and best price
    const products = await collections.products
      ?.aggregate([
        // Group by standard_name
        {
          $group: {
            _id: "$standard_name",
            vendors_count: { $sum: 1 }, // Count products with same standard_name
            // Find the minimum price and corresponding vendor
            min_price: { $min: "$price_low" },
            all_products: {
              $push: {
                vendor: "$vendor",
                price_low: "$price_low",
                category: "$category",
                available: "$available",
              },
            },
          },
        },
        // Add best price vendor field
        {
          $addFields: {
            best_price_vendor: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$all_products",
                    as: "product",
                    cond: { $eq: ["$$product.price_low", "$min_price"] },
                  },
                },
                0,
              ],
            },
          },
        },
        // Project final fields
        {
          $project: {
            _id: 0,
            standard_name: "$_id",
            vendors_count: 1,
            best_price: "$min_price",
            best_price_vendor: "$best_price_vendor.vendor",
            category: { $arrayElemAt: ["$all_products.category", 0] },
            available: { $in: [true, "$all_products.available"] }, // Available if any vendor has it
          },
        },
        { $sort: { standard_name: 1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();

    return res.status(200).send({
      status: 200,
      success: true,
      message: "Products fetched successfully.",
      pagination: {
        total: uniqueProductsCount || 0,
        page,
        limit,
        pages: Math.ceil((uniqueProductsCount || 0) / limit),
      },
      length: products?.length,
      data: products,
    });
  } catch (errRes) {
    logger.error(errRes);
    return res.status(errRes.response?.statusCode ?? 500).send({
      status: errRes.response?.statusCode ?? 500,
      success: false,
      message: errRes.message || "Internal server error",
    });
  }
};
