import React from 'react';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import About from './pages/About';
import NoPage from './pages/NoPage';
import AOS from "aos";
import "aos/dist/aos.css";
import Cart from './pages/Cart';
import { AddProducts } from './pages/AddProduct';
import Signup from './pages/SignUp';
import AdminPay from './pages/AdminPay';
import Secure from './pages/Secure';


const App = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 900,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <>
      <Router>
      <Routes>
      <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart/>  } />
          <Route path="/adminpay" element={<AdminPay/>  } />
          <Route path="/admin" element={<AddProducts/>  } />
          <Route path="/secure" element={<Secure/>  } />
          <Route path="/signup" element={<Signup/>  } />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>

      </Router>
    </>
  )
}

export default App;

