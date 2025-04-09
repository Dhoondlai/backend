import { type Request, type Response } from "express";
import { collections } from "../config/db";

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
    console.log(errRes);
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
    console.log(errRes);
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

    // Get total count for pagination metadata
    const totalCount = await collections.products?.countDocuments({});

    // Fetch products with pagination
    const products = await collections.products
      ?.find({}, { projection: { _id: 0 } })
      .skip(skip)
      .limit(limit)
      .toArray();

    return res.status(200).send({
      status: 200,
      success: true,
      message: "Products fetched successfully.",
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil((totalCount || 0) / limit),
      },
      length: products?.length,
      data: products,
    });
  } catch (errRes) {
    console.log(errRes);
    return res.status(errRes.response.statusCode ?? 500).send({
      status: errRes.response.statusCode ?? 500,
      success: false,
      message: errRes.body.message as string,
    });
  }
};
