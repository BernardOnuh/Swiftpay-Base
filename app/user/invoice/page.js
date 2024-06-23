"use client";
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../../components/Sidebar";
import Notification from "../../../components/Notification";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoice() {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    clientName: "",
    clientMail: "",
    walletAddress: "",
    paymentMethod: "",
  });

  const contentRef = useRef(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const [lineItems, setLineItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [showInvoice, setShowInvoice] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    calculateTotal(name, value);
  };

  const addLineItem = () => {
    if (
      formData.description.trim() !== "" &&
      formData.quantity > 0 &&
      formData.unitPrice > 0
    ) {
      const newItem = {
        description: formData.description,
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        total: formData.quantity * formData.unitPrice,
      };

      setLineItems([...lineItems, newItem]);
      setFormData({
        ...formData,
        description: "",
        quantity: 0,
        unitPrice: 0,
      });
      setNotificationMessage("Item added successfully.");
      setNotificationType("success");
      setShowNotification(true);
    } else {
      setNotificationMessage(
        "Please fill in Description, Quantity, and Unit Price."
      );
      setNotificationType("error");
      setShowNotification(true);
    }
  };

  const totalSum = lineItems.reduce((acc, item) => acc + item.total, 0);

  const calculateTotal = () => {
    const newTotal = lineItems.reduce((acc, item) => acc + item.total, 0);
    setTotal(newTotal);
  };

  const generateInvoice = () => {
    setShowInvoice(true);
    // Here, you would use the formData to generate the invoice
    // You can format and display the invoice data as needed
    console.log({ lineItems, formData });
  };

  const generatePDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const content = contentRef.current;

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);

      pdf.save("invoice.pdf");
    });
  };

  return (
    <div className="bg-gray-200">
      <Layout>
        <div className="container py-6 mt-6 sm:flex sm:flex-col justify-center sm:py-12">
          <div className="py-3 sm:max-w-xl sm:mx-auto">
            <div className="px-4 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
              <div className="max-w-md mx-auto">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold text-[#4318FF] py-4">
                    Invoice Generator
                  </h1>
                </div>
                <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-600 font-semibold">
                        Client Name
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        placeholder="Client Name"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    {/* Invoice Number and Invoice Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-600 font-semibold">
                          Invoice Number
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            #
                          </span>
                          <input
                            type="text"
                            name="invoiceNumber"
                            placeholder="Serial Number Of Invoice"
                            onChange={handleChange}
                            className="w-full pl-6 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-600 font-semibold">
                          Invoice Date
                        </label>
                        <input
                          type="date"
                          name="invoiceDate"
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    {/* Due Date and Client Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-600 font-semibold">
                          Client Email
                        </label>
                        <input
                          type="text"
                          name="clientMail"
                          placeholder="Client Email Address"
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 font-semibold">
                          Due Date
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-600 font-semibold">
                        Payment Method
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select Payment Method</option>
                        <option value="eth-Base">ETH (Base)</option>
                        <option value="usd-Base">USD (Base)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-600 font-semibold">
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        name="walletAddress"
                        value={formData.walletAddress}
                        placeholder="Wallet Address"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-600 font-semibold">
                          Description
                        </label>
                        <input
                          type="text"
                          name="description"
                          placeholder="Invoice Item Description"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      {/* Invoice Number and Invoice Date */}
                      {/* ... (existing form fields) */}
                      {/* Description, Quantity, and Unit Price */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-600 font-semibold">
                            Unit Price
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                              $
                            </span>
                            <input
                              type="number"
                              name="unitPrice"
                              value={formData.unitPrice}
                              onChange={handleChange}
                              className="w-full pl-8 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-gray-600 font-semibold">
                            Quantity
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={addLineItem}
                            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-[#4318FF] hover:text-gray-200 focus:outline-none focus:bg-blue-500 flex items-center"
                          >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Add Item
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Client Name */}
                  </div>
                  <div className="flex justify-center mt-6 py-4">
                    <button
                      onClick={generateInvoice}
                      className={`px-6 py-3 rounded-lg text-white focus:outline-none focus:bg-blue-500 ${
                        showInvoice
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-[#4318FF] hover:bg-blue-500"
                      }`}
                      disabled={showInvoice}
                    >
                      Generate Invoice
                    </button>
                  </div>

                  {showNotification && (
                    <Notification
                      message={notificationMessage}
                      onClose={() => setShowNotification(false)}
                      type={notificationType} // Pass the notification type
                    />
                  )}
                </form>
                {showInvoice && lineItems.length > 0 && (
                  <>
                    <div className="py-6" ref={contentRef}>
                      <div className="border border-gray-300 p-4 rounded-lg">
                        <div className="flex">
                          {/* Empty space on the left */}
                          <div className="w-1/2"></div>

                          {/* Receiver's Address on the right */}
                          <div className="w-1/2 text-ssm">
                            <div>
                              <p>
                                <span className="font-semibold">Invoice</span> #
                                {formData.invoiceNumber}
                              </p>
                              <p>
                                <span className="font-semibold">Issued on</span>{" "}
                                {formData.invoiceDate}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Payment due by
                                </span>{" "}
                                {formData.dueDate}
                              </p>
                              <p>
                                <span className="font-semibold">Mail:</span>{" "}
                                {formData.clientMail}
                              </p>
                              <button className="px-1 py-2 bg-orange-200 border border-orange-400 text-gray-600 text-sm rounded-lg mt-4">
                                Awaiting Payment
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex mt-4">
                          {/* Sender's Address on the left */}
                          <div className="w-1/2 text-ssm">
                            <div>
                              <p>
                                <span className="font-semibold">Billed To</span>
                              </p>
                              <p>
                                <span>{formData.clientName}</span>
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Payment Method:
                                </span>{" "}
                              </p>
                              <span>{formData.paymentMethod}</span>
                              <p>
                                <span className="font-semibold">
                                  Wallet Address:
                                </span>{" "}
                              </p>
                              {formData.walletAddress}
                            </div>
                          </div>

                          {/* Empty space on the right */}
                          <div className="w-1/2"></div>
                        </div>
                        <table className="w-full border-t border-gray-300 mt-4">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-2 px-4 border border-gray-300">
                                Description
                              </th>
                              <th className="py-2 px-4 border border-gray-300">
                                Quantity
                              </th>
                              <th className="py-2 px-4 border border-gray-300">
                                Unit Price
                              </th>
                              <th className="py-2 px-4 border border-gray-300">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {lineItems.map((item, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-300"
                              >
                                <td className="py-2 px-4 border border-gray-300">
                                  {item.description}
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                  {item.quantity}
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                  ${item.unitPrice}
                                </td>
                                <td className="py-2 px-4 border border-gray-300">
                                  ${item.total}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td
                                colSpan="3"
                                className="py-2 px-4 border border-gray-300 text-left"
                              >
                                Total Sum:
                              </td>
                              <td className="py-2 px-4 border border-gray-300 text-blue-500">
                                ${totalSum}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="flex justify-center mt-4">
                        <span className="text-xs font-sans text-center text-gray-600">
                          powered by swiftpay
                        </span>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={generatePDF}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                      >
                        Download PDF
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
