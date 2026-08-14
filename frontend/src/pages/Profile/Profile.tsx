/*
Profile-ADMIN
admin-analysis-role
logout
orders
Need help
Notifications
Switch acc
wishlist

Profile-USER
Logout
Switch acc
orders
Need help
Notifications
wishlist

import { useNavigate } from 'react-router-dom'

const navigate = useNavigate();
const { logout } = useContext(AuthContext);

const handleLogout = () => {
    logout();
    navigate("/login");
  }


<li><button onClick={handleLogout} className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
      Logout
    </button>
</li>
 */


const Profile = () => {
    return (
        <div>

        </div>
    )
}

export default Profile
