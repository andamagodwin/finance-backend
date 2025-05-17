import { Request, Response } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getUserOrders,
  getOrders,
  changeOrderStatus,
  OrderItem,
  OrderStatus,
  isValidOrderStatus,
  getOrdersByUserId,
} from "../Entities/Order";
import { customPayloadResponse } from "../Helpers/Helpers";

export const handleCreateOrder = async (req: Request, res: Response) => {
  try {
    console.log("Called");

    const {
      userId,
      amount,
      memberId,
      fromCurrency,
      receiverPlace,
      receiverCurrency,
      senderName,
      senderPhone,
      senderAddress,
      relationship,
      receiverName,
      receiverPhone,
      receiverAddress,
      bank,
    } = req.body;

    console.log(receiverCurrency);
    console.log("fromCurrency: ", fromCurrency);

    if (!userId) {
      return res
        .status(400) // Bad request for missing input
        .json(customPayloadResponse(false, "User Id is required"));
    }

    const newOrder = await createOrder(
      userId,
      amount,
      memberId,
      fromCurrency,
      receiverPlace,
      receiverCurrency,
      senderName,
      senderPhone,
      senderAddress,
      relationship,
      receiverName,
      receiverPhone,
      receiverAddress,
      bank
    );

    return res.status(200).json(customPayloadResponse(true, newOrder));
  } catch (error) {
    console.error(error);
    return res
      .status(500) // Internal server error
      .json(customPayloadResponse(false, error));
  }
};

export const handleChangeOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res
        .status(200)
        .json(customPayloadResponse(false, "Order ID and status are required"))
        .end();
    }

    if (!isValidOrderStatus(status)) {
      return res
        .status(200) // Bad request for missing input
        .json(customPayloadResponse(false, "invalid status"));
    }

    const order = await getOrderById(id);
    if (!order) {
      return res
        .status(200)
        .json(customPayloadResponse(false, "Order not found"))
        .end();
    }

    if (order.status === "completed") {
      return res
        .status(200)
        .json(customPayloadResponse(false, "Order already completed"))
        .end();
    }

    await changeOrderStatus(order, status);
    await order.save();

    return res.status(200).json(customPayloadResponse(true, order)).end();
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Internal server error"))
      .end();
  }
};

const handleResponse = (
  res: Response,
  success: boolean,
  data: any,
  status = 200
) => {
  return res.status(status).json(customPayloadResponse(success, data)).end();
};

export const handleGetOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getOrders();
    return handleResponse(res, true, orders);
  } catch (error) {
    console.error(error);
    return handleResponse(res, false, "An error occurred", 500);
  }
};


export const handleGetUserOrders = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.body;
    if (!id) {
      return handleResponse(res, false, "User ID is required", 400);
    }
    if (!type) {
      return handleResponse(res, false, "User Type is required", 400);
    }
    const orders = await getOrdersByUserId(id);

    return handleResponse(res, true, orders);
  } catch (error) {
    console.error(error);
    return handleResponse(res, false, "An error occurred", 500);
  }
};

export const handleGetOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .json(customPayloadResponse(false, "Id Required"))
        .status(200)
        .end();
    }

    const order = await getOrderById(parseInt(id));

    if (!order) {
      return res
        .json(customPayloadResponse(false, "Orders Not Found"))
        .status(200)
        .end();
    }

    return res.json(customPayloadResponse(true, order)).status(200).end();
  } catch (error) {
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};

export const handleDeleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .json(customPayloadResponse(false, "Product Id Required"))
        .status(200)
        .end();
    }
    await deleteOrder(parseInt(id));
    return res
      .json(customPayloadResponse(true, "Store Product Deleted Successfully"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};


//handle assigin order to mmeber
export const handleAssignOrderToMember = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId, memberId } = req.body;

    if (!orderId || !memberId) {
      return res
        .json(customPayloadResponse(false, "Order ID and Member ID Required"))
        .status(200)
        .end();
    }

    const order = await getOrderById(parseInt(orderId));

    if (!order) {
      return res
        .json(customPayloadResponse(false, "Order Not Found"))
        .status(200)
        .end();
    }

    order.memberId = memberId;

    order.status = "approved"; // Set status to pending when assigned to a member
    await order.save();

    return res
      .json(customPayloadResponse(true, "Order Assigned Successfully"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
}


//handle get order by member id
export const handleGetOrdersByMemberId = async (
  req: Request,
  res: Response
) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res
        .json(customPayloadResponse(false, "Member ID Required"))
        .status(200)
        .end();
    }

    const orders = await getOrdersByUserId(parseInt(memberId));

    if (!orders) {
      return res
        .json(customPayloadResponse(false, "Orders Not Found"))
        .status(200)
        .end();
    }

    return res.json(customPayloadResponse(true, orders)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};
