import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchEmployeeById, 
  clearCurrentEmployee, 
  deleteEmployee, 
  updateEmployee,
  resetDeleteSuccess,
  resetUpdateSuccess 
} from "../store/employeeSlice";

const EmployeeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    currentEmployee, 
    loading, 
    error, 
    deleteLoading, 
    deleteSuccess, 
    updateLoading, 
    updateSuccess 
  } = useSelector((state) => state.employees);

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    salary: ""
  });

  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
    
    // Clear employee data when component unmounts
    return () => {
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch, id]);

  // Redirect to home page after successful delete
  useEffect(() => {
    if (deleteSuccess) {
      dispatch(resetDeleteSuccess());
      navigate("/");
    }
  }, [deleteSuccess, navigate, dispatch]);

  // Close modal after successful update
  useEffect(() => {
    if (updateSuccess) {
      setIsEditModalOpen(false);
      dispatch(resetUpdateSuccess());
    }
  }, [updateSuccess, dispatch]);

  // Populate form data when employee data is loaded
  useEffect(() => {
    if (currentEmployee) {
      setEditFormData({
        name: currentEmployee.name,
        email: currentEmployee.email,
        position: currentEmployee.position,
        department: currentEmployee.department,
        salary: currentEmployee.salary
      });
    }
  }, [currentEmployee]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "salary" ? Number(value) : value
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEmployee({
      id,
      employeeData: editFormData
    }));
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteEmployee(id));
  };

  if (loading) {
    return <div className="loading">Loading employee details...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!currentEmployee) {
    return <div className="error-message">Employee not found</div>;
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="employee-detail">
      <h2>Employee Details</h2>
      <div className="detail-card">
        <h3>{currentEmployee.name}</h3>
        <p><strong>Email:</strong> {currentEmployee.email}</p>
        <p><strong>Position:</strong> {currentEmployee.position}</p>
        <p><strong>Department:</strong> {currentEmployee.department}</p>
        <p><strong>Salary:</strong> {currentEmployee.salary.toLocaleString()} RWF</p>
        <p><strong>Status:</strong> {currentEmployee.isActive ? "Active" : "Inactive"}</p>
        <p><strong>Hire Date:</strong> {formatDate(currentEmployee.hireDate)}</p>
        
        <div className="action-buttons">
          <button 
            className="btn-edit" 
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </button>
          <button 
            className="btn-delete" 
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Employee</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={editFormData.position}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={editFormData.department}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={editFormData.salary}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <button type="submit" className="btn-submit" disabled={updateLoading}>
                {updateLoading ? 'Updating...' : 'Update Employee'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete {currentEmployee.name}?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-delete" 
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Link to="/" className="back-button">Back to Directory</Link>
    </div>
  );
};

export default EmployeeDetail;
