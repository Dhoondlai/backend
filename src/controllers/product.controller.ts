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
