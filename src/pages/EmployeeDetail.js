import { useParams, Link } from "react-router-dom";
import employees from "../data/employees";

const EmployeeDetail = () => {
  const { id } = useParams();
  const employee = employees.find((e) => e.id === parseInt(id));

  if (!employee) {
    return <h2>Employee not found.</h2>;
  }

  return (
    <div className="employee-detail">
      <h2>Employee Details</h2>
      <div className="detail-card">
        <h3>{employee.name}</h3>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Salary:</strong> {employee.salary.toLocaleString()} RWF</p>
      </div>
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
};

export default EmployeeDetail;
