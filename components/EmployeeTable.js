"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Notification from "./Notification";

const EmployeeTable = ({ searchQuery }) => {
  const [employees, setEmployees] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, get their UID (user ID)
        setCurrentUserUid(user.uid);
      } else {
        // User is signed out, you can handle this case as needed
        setCurrentUserUid(null);
        setEmployees([]); // Clear data when the user is signed out
      }
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    const fetchUserEmployees = async () => {
      const db = getFirestore();
      const employeesCollectionRef = collection(db, "employees");

      try {
        // console.log("UserID", currentUserUid);
        const q = query(
          employeesCollectionRef,
          where("userId", "==", currentUserUid)
        ); // Filter by userId
        const querySnapshot = await getDocs(q);

        const employeeData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          employeeData.push({
            id: doc.id,
            name: data.name,
            role: data.role,
            amount: data.amount,
            walletAddress: data.walletAddress,
            payout: data.payout,
          });
        });

        // Log the fetched data to the console for debugging
       // console.log( "Fetched employee data for the logged-in user:", employeeData);

        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchUserEmployees();
  }, [currentUserUid]);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEdit = (employee) => {
    setEmployeeToEdit(employee);
    setEditFormData({
      name: employee.name,
      role: employee.role,
      amount: employee.amount,
      walletAddress: employee.walletAddress,
      payout: employee.payout,
    });
    openEditModal();
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const db = getFirestore();
    const employeeDocRef = doc(db, "employees", employeeToEdit.id);

    try {
      await updateDoc(employeeDocRef, {
        name: editFormData.name,
        role: editFormData.role,
        amount: editFormData.amount,
        walletAddress: editFormData.walletAddress,
        payout: editFormData.payout,
      });

      const updatedEmployees = employees.map((employee) =>
        employee.id === employeeToEdit.id
          ? {
              ...employee,
              name: editFormData.name,
              role: editFormData.role,
              amount: editFormData.amount,
              walletAddress: editFormData.walletAddress,
              payout: editFormData.payout,
            }
          : employee
      );

      setEmployees(updatedEmployees);

      setNotificationMessage("Employee Updated Successfully");
      setNotificationType("success");
      setShowNotification(true);
      setIsLoading(false);
      closeEditModal();
    } catch (error) {
      setNotificationMessage("Error updating employee data");
      setNotificationType("error");
      setShowNotification(true);
      setIsLoading(false);
      console.error("Error updating employee data:", error);
    }
  };

  const openDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEmployeeToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    if (employeeToDelete) {
      const db = getFirestore();
      const employeeDocRef = doc(db, "employees", employeeToDelete.id);

      try {
        await deleteDoc(employeeDocRef);

        const updatedEmployeees = employees.filter(
          (emp) => emp.id !== employeeToDelete.id
        );

        setEmployees(updatedEmployeees);
        setNotificationMessage("Employee Deleted Successfully");
        setNotificationType("success");
        setShowNotification(true);
        setIsLoading(false);
        closeDeleteModal();
      } catch (error) {
        setNotificationMessage("Error deleting employee");
        setNotificationType("error");
        setShowNotification(true);
        console.log("Error deleting employee: ", error);
        setIsLoading(false);
        closeDeleteModal();
      }
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const { name, role } = employee;
    const query = searchQuery.toLowerCase();

    return (
      name.toLowerCase().includes(query) || role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-x-auto mt-4">
      {filteredEmployees.length > 0 ? (
        <div className="table-container">
          <table className="w-full border-gray-400 border-collapse">
            <thead className="bg-gray-600">
              <tr>
                <th className="px-4 py-2 sm:py-3 border border-gray-400 text-gray-200 font-semibold text-center">
                  Name
                </th>
                <th className="px-4 py-2 sm:py-3 border border-gray-400 text-gray-200 font-semibold text-center">
                  Role
                </th>
                <th className="px-4 py-2 sm:py-3 border border-gray-400 text-gray-200 font-semibold text-center">
                  Amount
                </th>
                <th className="px-4 py-2 sm:py-3 border border-gray-400 text-gray-200 font-semibold text-center">
                  Wallet Address
                </th>
                <th className="px-4 py-2 sm:py-3 border border-gray-400 text-gray-200 font-semibold text-center">
                  Payout
                </th>
                <th className="px-4 py-2 sm:py-3 border border-gray-400 text-gray-200 font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={index} className="border-t border-gray-400">
                  <td className="border border-gray-400 p-3 sm:p-4 text-center">
                    {employee.name}
                  </td>
                  <td className="border border-gray-400 p-3 sm:p-4 text-center">
                    {employee.role}
                  </td>
                  <td className="border border-gray-400 p-3 sm:p-4 text-center">
                    {employee.amount} (usd)
                  </td>
                  <td className="border border-gray-400 p-3 sm:p-4 text-center">
                    {employee.walletAddress}
                  </td>
                  <td className="border border-gray-400 p-3 sm:p-4 text-center">
                    {employee.payout}
                  </td>
                  <td className="border border-gray-400 p-3 sm:p-4 text-center">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="mr-6"
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: "blue" }}
                      />
                    </button>
                    <button onClick={() => openDeleteModal(employee)}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "red" }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isEditModalOpen && (
            <div className="edit-modal">
              <div className="edit-modalContent">
                <span onClick={closeEditModal} className="close-button">
                  &times;
                </span>
                <h2 className="text-center">Edit Employee</h2>
                <div className="input-label">
                  <label>Name:</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div className="input-label">
                  <label>Role:</label>
                  <input
                    type="text"
                    placeholder="Role"
                    value={editFormData.role}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, role: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div className="input-label">
                  <label>Amount:</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={editFormData.amount}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        amount: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div className="input-label">
                  <label>Wallet Address:</label>
                  <input
                    type="text"
                    placeholder="Wallet Address"
                    value={editFormData.walletAddress}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        walletAddress: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div className="input-label">
                  <label htmlFor="payout">Payout:</label>
                  <select
                    id="payout"
                    value={editFormData.payout}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        payout: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option value="" disabled>
                      Select Payout Frequency
                    </option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <button
                  onClick={handleUpdate}
                  className="save-button"
                  style={{ display: "block", margin: "0 auto" }}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <p>Are you sure you want to delete {employeeToDelete.name}?</p>
                {isLoading ? (
                  <p className="mt-4">deleting...</p>
                ) : (
                  <div>
                    <button
                      onClick={confirmDelete}
                      className="confirm-button mr-2 mt-6"
                    >
                      Yes
                    </button>
                    <button
                      onClick={closeDeleteModal}
                      className="cancel-button"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {showNotification && (
            <Notification
              message={notificationMessage}
              onClose={() => setShowNotification(false)}
              type={notificationType}
            />
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Add employee as (.csv) first
        </p>
      )}
    </div>
  );
};

export default EmployeeTable;
