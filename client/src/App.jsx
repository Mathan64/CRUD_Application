import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterList(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Search user function
  const filterSearchValue = (e) => {
    const inputValue = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(inputValue) || user.city.toLowerCase().includes(inputValue)
    );
    setFilterList(filteredUsers);
  }

  // Delete user function
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      try {
        const res = await axios.delete(`http://localhost:8000/users/${id}`);
        if (res.status === 200) {
          setUsers(res.data);
          setFilterList(res.data);
        } else {
          console.error('Error deleting user:', res);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  // Add record function
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle change in form inputs
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  // Handle form submission to add or update a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      try {
        const res = await axios.patch(`http://localhost:8000/users/${userData.id}`, userData);
        if (res.status === 200) {
          setUsers(res.data);
          setFilterList(res.data);
          closeModal();
        } else {
          console.error('Error updating user:', res);
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      try {
        const res = await axios.post("http://localhost:8000/users", userData);
        if (res.status === 200) {
          setUsers(res.data);
          setFilterList(res.data);
          closeModal();
        } else {
          console.error('Error adding user:', res);
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
    closeModal();
    setUserData({ name: "", age: "", city: "" });
  }

  // Update user record
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
      <div className='container'>
        <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>
        <form className='input-search' onSubmit={(e) => e.preventDefault()}>
          <input type='text' id='search' placeholder='Search Item' onChange={filterSearchValue} />
          <button className='btn green' type='button' onClick={handleAddRecord}>Add record</button>
        </form>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterList.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td><button className='btn green' onClick={() => handleUpdateRecord(user)}>Edit</button></td>
                <td><button className='btn red' onClick={() => handleDelete(user.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <div className='modal'>
            <div className='modal-content'>
              <span className='close' onClick={closeModal}>&times;</span>
              <h2>User Record</h2>
              <form className='inputgroup' onSubmit={handleSubmit}>
                <label htmlFor='name'>Name</label>
                <input type='text' name='name' id='name' value={userData.name} onChange={handleChange} /><br />
                <label htmlFor='age'>Age</label>
                <input type='text' name='age' id='age' value={userData.age} onChange={handleChange} /><br />
                <label htmlFor='city'>City</label>
                <input type='text' name='city' id='city' value={userData.city} onChange={handleChange} /><br />
                <button className='btn green' type='submit'>Add user</button>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}

export default App;
