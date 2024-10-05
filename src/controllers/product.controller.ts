import { type Request, type Response } from "express";

export const getProduct = async (req: Request, res: Response) => {
  try {
    return res.status(200).send({
      status: 200,
      success: true,
      message: "Product Fetched successfully.", // dummy message
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
