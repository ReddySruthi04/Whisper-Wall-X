
// pages/EmployeeListPage.jsx - Employee list page component
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function EmployeeListPage() {
  const { fetchAllEmployees, loading, currentUser } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const loadEmployees = async () => {
      const result = await fetchAllEmployees();
      if (result.success) {
        setEmployees(result.data || []);
      } else {
        setMessage({
          text: result.message,
          isError: true
        });
      }
    };

    loadEmployees();
  }, [fetchAllEmployees]);

  // If no API yet, let's simulate some employee data
  useEffect(() => {
    if (employees.length === 0 && !loading) {
      // Mock data for demonstration
      const mockEmployees = [
        {
          id: 1,
          name: "John Doe",
          employeeId: "EMP001",
          department: "Engineering",
          position: "Senior Developer",
          salary: "95000",
          hireDate: "2020-03-15",
          performance: "Excellent"
        },
        {
          id: 2,
          name: "Jane Smith",
          employeeId: "EMP002",
          department: "Marketing",
          position: "Marketing Manager",
          salary: "85000",
          hireDate: "2019-07-22",
          performance: "Good"
        },
        {
          id: 3,
          name: "Alex Johnson",
          employeeId: "EMP003",
          department: "Finance",
          position: "Financial Analyst",
          salary: "78000",
          hireDate: "2021-01-10",
          performance: "Satisfactory"
        },
        {
          id: 4,
          name: "Sarah Williams",
          employeeId: "EMP004",
          department: "Human Resources",
          position: "HR Specialist",
          salary: "72000",
          hireDate: "2022-05-18",
          performance: "Good"
        },
        {
          id: 5,
          name: "Michael Brown",
          employeeId: "EMP005",
          department: "Engineering",
          position: "Junior Developer",
          salary: "65000",
          hireDate: "2023-02-01",
          performance: "Satisfactory"
        },
        // Add current user with their employee data
        ...(currentUser?.employeeData ? [{
          id: 6,
          name: currentUser.name,
          employeeId: currentUser.employeeData.employeeId,
          department: currentUser.employeeData.department,
          position: currentUser.employeeData.position,
          salary: currentUser.employeeData.salary,
          hireDate: currentUser.employeeData.hireDate,
          performance: currentUser.employeeData.performance
        }] : [])
      ];
      setEmployees(mockEmployees);
    }
  }, [currentUser, employees.length, loading]);

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedEmployees = () => {
    // First filter by search term
    const filteredEmployees = employees.filter(employee => {
      return Object.values(employee).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Then sort if needed
    if (sortConfig.key) {
      return [...filteredEmployees].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredEmployees;
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Employee Directory</h2>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            }`}>
              {message.text}
            </div>
          )}
          
          {loading ? (
            <div className="text-center p-8">Loading employee data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('name')}
                    >
                      Name {getSortIndicator('name')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('employeeId')}
                    >
                      Employee ID {getSortIndicator('employeeId')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('department')}
                    >
                      Department {getSortIndicator('department')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('position')}
                    >
                      Position {getSortIndicator('position')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('salary')}
                    >
                      Salary {getSortIndicator('salary')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('hireDate')}
                    >
                      Hire Date {getSortIndicator('hireDate')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('performance')}
                    >
                      Performance {getSortIndicator('performance')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getSortedEmployees().length > 0 ? (
                    getSortedEmployees().map((employee) => (
                      <tr key={employee.id} className={employee.name === currentUser?.name ? "bg-blue-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {employee.name}
                            {employee.name === currentUser?.name && <span className="ml-2 text-xs text-blue-500">(You)</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.employeeId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${employee.salary}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.hireDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.performance}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No employees found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeListPage;

