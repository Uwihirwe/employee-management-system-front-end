import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, createEmployee, resetCreateSuccess } from "../store/employeeSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { employeeList, loading, error, createSuccess, createLoading } = useSelector((state) => state.employees);
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    salary: ""
  });
  
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);
  
  // Close modal and reset form when employee is created successfully
  useEffect(() => {
    if (createSuccess) {
      setIsModalOpen(false);
      setNewEmployee({
        name: "",
        email: "",
        position: "",
        department: "",
        salary: ""
      });
      dispatch(resetCreateSuccess());
    }
  }, [createSuccess, dispatch]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: name === "salary" ? Number(value) : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createEmployee(newEmployee));
  };
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div>
      <div className="header-actions">
        <h2>Employee Directory</h2>
        <button onClick={openModal} className="btn-add">Add Employee</button>
      </div>
      
      {/* Employee Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button onClick={closeModal} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={newEmployee.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={newEmployee.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={newEmployee.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button type="submit" className="btn-submit" disabled={createLoading}>
                {createLoading ? 'Adding...' : 'Add Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {employeeList.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>{employee.salary.toLocaleString()} RWF</td>
                <td>
                  <Link to={`/employee/${employee._id}`} className="view-button">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;
